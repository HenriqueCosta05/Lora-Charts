import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Theme } from '../types/theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private http = inject(HttpClient);
  theme?: Theme = undefined;

  setCSSVariables(theme: Theme) {
    const root = document.documentElement;

    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssValue = Array.isArray(value) ? value.join(', ') : value;
      root.style.setProperty(`--color-${key}`, cssValue);
    });

    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, `${value}px`);
    });

    root.style.setProperty(`--font-family`, theme.fonts.family);
    Object.entries(theme.fonts.size).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, `${value}px`);
    });

    root.style.setProperty(`--border-radius`, theme.borders.radius);
    root.style.setProperty(`--border-width`, theme.borders.width);
    root.style.setProperty(`--border-style`, theme.borders.style);

    root.style.setProperty(`--animation-duration`, `${theme.animations.duration}ms`);
    root.style.setProperty(`--animation-easing`, theme.animations.easing);

    if (theme.effects) {
      Object.entries(theme.effects).forEach(([key, value]) => {
        root.style.setProperty(`--effect-${key}`, value);
      });
    }
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    this.setCSSVariables(theme);
  }

  getTheme(): Theme | undefined {
    return this.theme;
  }

  loadTheme(path: string): Observable<Theme> {
    return this.http.get<Theme>(path);
  }

  loadAndSetTheme(path: string): void {
    this.loadTheme(path).subscribe((theme) => {
      this.setTheme(theme);
    });
  }

}
