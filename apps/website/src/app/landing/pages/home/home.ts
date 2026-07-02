import { Component, inject } from '@angular/core';
import { AuthStore } from '@website/app/auth/data-access';
import { LandingCta } from '../../ui/cta/cta';
import { LandingFeatures } from '../../ui/features/features';
import { LandingFooter } from '../../ui/footer/footer';
import { LandingHeader } from '../../ui/header/header';
import { LandingHero } from '../../ui/hero/hero';

@Component({
  selector: 'landing-page',
  imports: [LandingHeader, LandingHero, LandingFeatures, LandingCta, LandingFooter],
  templateUrl: './home.html'
})
export default class Home {
  protected authStore = inject(AuthStore);

  protected signOut(): void {
    this.authStore.signOut();
  }
}
