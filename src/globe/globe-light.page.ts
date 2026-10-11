import { Component } from '@angular/core';

import { GlobeHostComponent } from './globe-host.component';

@Component({
  selector: 'app-globe-light-page',
  imports: [GlobeHostComponent],
  template: `<app-globe-host themeId="bright" />`,
  host: {
    class: 'block h-full w-full',
    style:
      'background: radial-gradient(ellipse at 20% 50%, rgba(142, 197, 252, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(224, 195, 252, 0.15) 0%, transparent 50%), linear-gradient(180deg, #f8fbff 0%, #eef5fb 40%, #e8f0f8 100%);',
  },
})
export class GlobeLightPageComponent {}
