import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './layout/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="relative flex h-full w-full flex-col">
      <app-navbar />
      <main class="min-h-0 flex-1">
        <router-outlet />
      </main>
    </div>
  `,
  host: { class: 'block h-full w-full' },
})
export class AppComponent {}
