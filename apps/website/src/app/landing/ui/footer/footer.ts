import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'landing-footer',
  imports: [RouterLink, MatIconModule, TranslocoPipe],
  templateUrl: './footer.html'
})
export class LandingFooter {
  protected readonly currentYear = new Date().getFullYear();
}
