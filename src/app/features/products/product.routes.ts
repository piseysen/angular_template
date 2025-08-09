import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./product-list/product-list.component').then(c => c.ProductListComponent),
    title: 'Products'
  },
  {
    path: ':id',
    loadComponent: () => import('./product-detail/product-detail.component').then(c => c.ProductDetailComponent),
    title: 'Product Details'
  }
];
