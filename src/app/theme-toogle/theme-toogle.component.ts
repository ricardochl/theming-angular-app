import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle'
import { MatIconModule } from '@angular/material/icon'
import { Theme } from './theme'

@Component({
  selector: 'app-theme-toogle',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule, MatIconModule],
  templateUrl: './theme-toogle.component.html',
  styleUrl: './theme-toogle.component.scss',
})
export class ThemeToogleComponent {
  theme = Theme
  selectedTheme = Theme.AUTO;

  toggleTheme(event: MatButtonToggleChange) {}
}
