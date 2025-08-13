import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./create-product.component').then(c => c.CreateProductComponent),
    title: 'Create Product'
  }
];
