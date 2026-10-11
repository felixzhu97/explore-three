import { Routes } from '@angular/router';

export const GLOBE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./globe-light.page').then((m) => m.GlobeLightPageComponent),
  },
  {
    path: 'globe-light',
    loadComponent: () =>
      import('./globe-light.page').then((m) => m.GlobeLightPageComponent),
  },
  {
    path: 'globe-dark',
    loadComponent: () =>
      import('./globe-dark.page').then((m) => m.GlobeDarkPageComponent),
  },
];
