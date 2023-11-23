import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StylesManagerService {
  constructor(@Inject(DOCUMENT) private doc: Document) {}

  // Set the stylesheet with the specified id.
  setStyle(linkId: string, href: string): void {
    this.getOrCreateLinkElement(linkId).setAttribute('href', href);
  }

  // Remove the stylesheet with the specified id.
  removeStyle(linkId: string): void {
    this.getExistingLinkElement(linkId)?.remove();
  }

  private getOrCreateLinkElement(linkId: string): HTMLLinkElement {
    return this.getExistingLinkElement(linkId) || this.createLinkElement(linkId);
  }

  private getExistingLinkElement(linkId: string): HTMLLinkElement | null {
    return this.doc.head.querySelector(`link[rel="stylesheet"]#${linkId}`);
  }

  private createLinkElement(linkId: string): HTMLLinkElement {
    const linkEl = this.doc.createElement('link');
    linkEl.setAttribute('rel', 'stylesheet');
    linkEl.setAttribute('id', linkId);
    this.doc.head.appendChild(linkEl);
    return linkEl;
  }
}
