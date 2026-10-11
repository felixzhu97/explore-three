import { Component } from '@angular/core';
import { Vector3 } from 'three';

import { GlobeHostComponent } from './globe-host.component';

@Component({
  selector: 'app-globe-dark-page',
  imports: [GlobeHostComponent],
  template: `<app-globe-host themeId="tech" [lightPos]="lightPos" />`,
  host: {
    class: 'block h-full w-full',
    style:
      'background: radial-gradient(ellipse at 30% 20%, rgba(0, 100, 150, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0, 50, 100, 0.1) 0%, transparent 50%), linear-gradient(180deg, #0a0e17 0%, #0d1520 40%, #0a1018 100%);',
  },
})
export class GlobeDarkPageComponent {
  protected readonly lightPos = new Vector3(-50, 0, 60);
}
