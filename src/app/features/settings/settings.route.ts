import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./settings.component').then(c => c.SettingsComponent)
  }
];