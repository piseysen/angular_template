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
    loadComponent: () => import('./shared/layouts/auth-layout.component').then(c => c.AuthLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login.component').then(c => c.LoginComponent),
        title: 'Login - Template App'
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register.component').then(c => c.RegisterComponent),
        title: 'Register - Template App'
      }
    ]
  },

  // Protected routes (accessible when authenticated)
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/layouts/main-layout.component').then(c => c.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent),
        title: 'Dashboard - Template App'
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(c => c.ProfileComponent),
        title: 'Profile - Template App'
      }
    ]
  },

  // Wildcard route - 404 page
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
