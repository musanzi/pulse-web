import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthStore } from './auth/data-access';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslocoPipe],
  host: {
    class: 'flex min-h-full w-full flex-auto flex-col'
  },
  templateUrl: './app.html'
})
export class App {
  protected authStore = inject(AuthStore);
}
