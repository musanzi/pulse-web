import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { DashboardNavigation, User } from '@libs/ui';
import { AuthStore } from '@website/app/auth/data-access';
import { NAVIGATION } from '../data/navigation.data';
import { getProfileAvatarUrl } from '../../utils';

@Component({
  selector: 'dashboard-sidebar',
  imports: [DashboardNavigation, RouterLink, User, TranslocoPipe],
  host: {
    class: 'flex w-full flex-auto flex-col'
  },
  template: `
    <div class="relative flex items-center gap-x-2.5 pt-5 pr-4 pb-0 pl-6">
      <a class="flex flex-col" routerLink="/">
        <div class="text-on-surface text-lg leading-none font-bold tracking-wider">
          {{ 'common.dashboard' | transloco }}
        </div>
      </a>
    </div>

    <ui-dashboard-navigation class="mt-8 mb-4 flex-auto" [navItems]="navItems()" />

    <ui-user
      class="mx-4 mb-4"
      [user]="authStore.user()"
      [avatarUrl]="avatarUrl()"
      [appearanceLabel]="'common.appearance' | transloco"
      [signOutLabel]="'common.signOut' | transloco"
      [schemeLabels]="{
        light: ('theme.light' | transloco),
        dark: ('theme.dark' | transloco),
        system: ('theme.system' | transloco)
      }"
      (signOut)="authStore.signOut()" />
  `
})
export class DashboardSidebar {
  authStore = inject(AuthStore);
  private readonly transloco = inject(TranslocoService);
  protected readonly avatarUrl = computed(() => getProfileAvatarUrl(this.authStore.user()?.avatar ?? null));

  protected readonly navItems = computed(() => {
    this.transloco.activeLang();

    return NAVIGATION.map((section) => ({
      ...section,
      description: section.description ? this.transloco.translate(section.description) : undefined,
      label: this.transloco.translate(section.label),
      children: section.children?.map((child) => ({
        ...child,
        description: child.description ? this.transloco.translate(child.description) : undefined,
        label: this.transloco.translate(child.label)
      }))
    }));
  });
}
