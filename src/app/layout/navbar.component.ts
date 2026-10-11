import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav
      class="pointer-events-none absolute left-0 right-0 top-0 z-20 flex justify-center pt-5"
    >
      <div
        class="pointer-events-auto flex gap-1 rounded-full border border-black/8 bg-white/70 px-1.5 py-1.5 shadow-sm backdrop-blur-xl"
      >
        <a
          routerLink="/globe-light"
          routerLinkActive="bg-black/8 text-neutral-900"
          class="rounded-full px-4 py-1.5 text-sm font-medium text-neutral-500 no-underline transition-colors"
          >Globe Light</a
        >
        <a
          routerLink="/globe-dark"
          routerLinkActive="bg-black/8 text-neutral-900"
          class="rounded-full px-4 py-1.5 text-sm font-medium text-neutral-500 no-underline transition-colors"
          >Globe Dark</a
        >
      </div>
    </nav>
  `,
})
export class NavbarComponent {}
