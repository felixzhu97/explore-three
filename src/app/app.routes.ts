import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../globe/globe.routes').then((m) => m.GLOBE_ROUTES),
  },
];
