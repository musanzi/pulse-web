import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'landing-features',
  imports: [MatIconModule, TranslocoPipe],
  templateUrl: './features.html'
})
export class LandingFeatures {
  protected readonly features = [
    {
      icon: 'route',
      titleKey: 'landing.features.appFlow.title',
      descriptionKey: 'landing.features.appFlow.description'
    },
    {
      icon: 'palette',
      titleKey: 'landing.features.theming.title',
      descriptionKey: 'landing.features.theming.description'
    },
    {
      icon: 'layers',
      titleKey: 'landing.features.architecture.title',
      descriptionKey: 'landing.features.architecture.description'
    }
  ];
}
