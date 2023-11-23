import { Inject, Injectable } from '@angular/core'
import { MediaMatcher } from '@angular/cdk/layout'
import { Theme } from '../theme-toogle/theme'
import { StorageService } from './storage.service'
import { BehaviorSubject } from 'rxjs'
import { StylesManagerService } from './styles-manager.service'
import { DOCUMENT } from '@angular/common'

export const THEME_STORAGE_KEY = 'theme'

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly prefersDarkThemeQuery = this.mediaMatcher.matchMedia(
    '(prefers-color-scheme: dark)',
  )
  private readonly themeLinkId = 'themeStylesCustom'
  private readonly stylesFileNames: { dark: string; light: string } = {
    dark: 'styles-dark.css',
    light: 'styles-light.css',
  }
  private isAutoTheme: boolean = false
  private currentThemeSubject = new BehaviorSubject<Exclude<
    Theme,
    Theme.AUTO
  > | null>(null)
  public currentTheme = this.currentThemeSubject.asObservable()

  constructor(
    private readonly storageService: StorageService,
    private readonly styleManager: StylesManagerService,
    private readonly mediaMatcher: MediaMatcher,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    this.detectStyleFileNames();

    // Load the theme if exists in the local storage
    this.loadTheme();

    // Watch for changes of the prefers color
    this.prefersDarkThemeQuery.addEventListener('change', ({ matches }) => {
      if (this.isAutoTheme) {
        this.setCurrentTheme(matches ? Theme.DARK : Theme.LIGHT);
      }
    });
  }

  private loadTheme() {
    this.setTheme(this.storageService.getItem(THEME_STORAGE_KEY) ?? Theme.AUTO);
  }

  setTheme(theme: Theme) {
    if (theme === Theme.AUTO) {
      this.isAutoTheme = true
      this.setAutoTheme()
      // Remove the custom style and initialize based on the prefers-color-scheme
      this.styleManager.removeStyle(this.themeLinkId)
    } else {
      this.isAutoTheme = false
      this.setCurrentTheme(theme)
      this.styleManager.setStyle(
        this.themeLinkId,
        `${
          theme === Theme.DARK
            ? this.stylesFileNames.dark
            : this.stylesFileNames.light
        }`,
      )
      this.storageService.setItem(THEME_STORAGE_KEY, theme)
    }
  }

  getStoredTheme(): Theme | null {
    return this.storageService.getItem(THEME_STORAGE_KEY)
  }

  private setAutoTheme() {
    this.setCurrentTheme(
      this.prefersDarkThemeQuery.matches ? Theme.DARK : Theme.LIGHT,
    )
    // The theme auto shouldn't be stored in the local storage
    this.storageService.removeItem(THEME_STORAGE_KEY)
  }

  private setCurrentTheme(theme: Exclude<Theme, Theme.AUTO>) {
    this.currentThemeSubject.next(theme)
  }

  private detectStyleFileNames() {
    const prefersSchemeRe = /\bprefers-color-scheme: ?(\w+)/;

    const themeStyleElement = this.document.getElementById('initial-theme') as HTMLStyleElement | null;
    const themeImportRules = Array.from(themeStyleElement?.sheet?.cssRules ?? [])
      .filter((rule): rule is CSSImportRule => rule instanceof CSSImportRule)
      .filter(rule => prefersSchemeRe.test(rule.media.mediaText));

    const fileNamePerTheme = Object.fromEntries(
      themeImportRules.map(rule => [(prefersSchemeRe.exec(rule.media.mediaText) ?? [])[1], rule.href]),
    );

    fileNamePerTheme['dark'] ? (this.stylesFileNames.dark = fileNamePerTheme['dark']) : console.error('The dark theme file has not been found');
    fileNamePerTheme['light']
      ? (this.stylesFileNames.light = fileNamePerTheme['light'])
      : console.error('The light theme file has not been found');
  }
}
