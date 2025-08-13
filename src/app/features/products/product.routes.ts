import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./product-list/product-list.component').then(c => c.ProductListComponent),
    title: 'Products'
  },
  {
    path: 'new',
    loadChildren: () => import('./create-product/create-product.route').then(m => m.routes),
    title: 'Create Product'
  },
  {
    path: ':id',
    loadComponent: () => import('./product-detail/product-detail.component').then(c => c.ProductDetailComponent),
    title: 'Product Details'
  }
];
