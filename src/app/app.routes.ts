import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Redirect root to dashboard
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Auth routes (accessible when not authenticated)
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('./shared/layouts/auth-layout/auth-layout.component').then(c => c.AuthLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadChildren: () => import('./features/auth/login/login.route').then(m => m.routes),
        title: 'Login'
      },
      {
        path: 'register',
        loadChildren: () => import('./features/auth/register/register.route').then(m => m.routes),
        title: 'Register'
      }
    ]
  },

  // Protected routes (accessible when authenticated)
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/layouts/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.route').then(m => m.routes),
        title: 'Dashboard'
      },
      {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.route').then(m => m.routes),
        title: 'Profile'
      },
      {
        path: 'products',
        loadChildren: () => import('./features/products/product.routes').then(m => m.routes),
        title: 'Products'
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.route').then(m => m.routes),
        title: 'Settings'
      }
    ]
  },

  // Wildcard route - 404 page
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
