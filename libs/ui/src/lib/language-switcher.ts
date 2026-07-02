import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatPseudoCheckbox } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'ui-language-switcher',
  imports: [MatIcon, MatIconButton, MatMenu, MatMenuItem, MatPseudoCheckbox, MatMenuTrigger, TranslocoPipe],
  template: `
    <button matIconButton [matMenuTriggerFor]="languageMenu" [attr.aria-label]="'language.switch' | transloco">
      <mat-icon svgIcon="languages" />
    </button>
    <mat-menu #languageMenu>
      @for (language of languages; track language.value) {
        <button mat-menu-item (click)="setLanguage(language.value)">
          <span class="flex items-center gap-x-1">
            <span class="flex-auto">{{ language.labelKey | transloco }}</span>
            <mat-pseudo-checkbox
              appearance="minimal"
              [state]="transloco.activeLang() === language.value ? 'checked' : 'unchecked'" />
          </span>
        </button>
      }
    </mat-menu>
  `
})
export class LanguageSwitcher {
  protected readonly transloco = inject(TranslocoService);
  protected readonly languages = [
    { labelKey: 'language.fr', value: 'fr' },
    { labelKey: 'language.en', value: 'en' }
  ];

  protected setLanguage(language: string): void {
    this.transloco.setActiveLang(language);
  }
}
