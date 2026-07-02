import { Component, computed, inject, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatPseudoCheckbox } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Scheme, Theming } from '@libs/core';

@Component({
  selector: 'ui-scheme-switcher',
  imports: [MatIcon, MatIconButton, MatMenu, MatMenuItem, MatPseudoCheckbox, MatMenuTrigger],
  template: `
    <button matIconButton [matMenuTriggerFor]="schemeMenu">
      <mat-icon svgIcon="sun-moon" />
    </button>
    <mat-menu #schemeMenu>
      @for (item of schemes(); track item.value) {
        <button mat-menu-item (click)="updateScheme(item.value)">
          <span class="flex items-center gap-x-1">
            <span class="flex-auto">{{ item.label }}</span>
            <mat-pseudo-checkbox appearance="minimal" [state]="scheme() === item.value ? 'checked' : 'unchecked'" />
          </span>
        </button>
      }
    </mat-menu>
  `
})
export class SchemeSwitcher {
  // Dependencies
  private theming = inject(Theming);

  // State
  labels = input({
    dark: 'Dark',
    light: 'Light',
    system: 'System'
  });
  protected scheme = computed(() => this.theming.scheme());
  protected schemes = computed<{ label: string; value: Scheme }[]>(() => [
    { label: this.labels().light, value: 'light' },
    { label: this.labels().dark, value: 'dark' },
    { label: this.labels().system, value: 'system' }
  ]);

  updateScheme(scheme: Scheme) {
    this.theming.scheme.set(scheme);
  }
}
