import { ChangeDetectionStrategy, Component, signal, inject, ViewChild } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../../core/services/auth.service';
import { EnvironmentIndicatorComponent } from '../../components/environment-indicator.component';
import { EnvironmentService } from '../../../core/services/environment.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    MatBadgeModule,
    EnvironmentIndicatorComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  protected readonly authService = inject(AuthService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);

  protected readonly isHandset = signal(false);
  protected readonly environmentService = inject(EnvironmentService);
  protected readonly isSidenavCollapsed = signal(false);
  protected readonly sidenavMode = signal<'side' | 'over'>('side');

  // Menu items with enhanced structure
  protected readonly menuItems = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      badge: null,
      tooltip: 'Main Dashboard'
    },
    {
      icon: 'analytics',
      label: 'Analytics',
      route: '/analytics',
      badge: 'new',
      tooltip: 'View Analytics'
    },
    {
      icon: 'inventory_2',
      label: 'Products',
      route: '/products',
      badge: null,
      tooltip: 'Manage Products'
    },
    {
      icon: 'people',
      label: 'Users',
      route: '/users',
      badge: 5,
      tooltip: 'User Management'
    },
    {
      icon: 'receipt_long',
      label: 'Orders',
      route: '/orders',
      badge: 12,
      tooltip: 'Order Management'
    },
    {
      icon: 'bar_chart',
      label: 'Reports',
      route: '/reports',
      badge: null,
      tooltip: 'Generate Reports'
    }
  ];

  protected readonly userMenuItems = [
    {
      icon: 'person',
      label: 'Profile',
      route: '/profile'
    },
    {
      icon: 'settings',
      label: 'Settings',
      route: '/settings'
    }
  ];

  constructor() {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).subscribe(result => {
      const isHandset = result.matches;
      this.isHandset.set(isHandset);
      this.sidenavMode.set(isHandset ? 'over' : 'side');
      
      // Auto-collapse on smaller screens
      if (isHandset) {
        this.isSidenavCollapsed.set(false);
      }
    });
  }

  protected toggleSidenav(): void {
    if (this.isHandset()) {
      this.sidenav.toggle();
    } else {
      this.isSidenavCollapsed.update(collapsed => !collapsed);
    }
  }

  protected closeSidenav(): void {
    if (this.isHandset()) {
      this.sidenav.close();
    }
  }

  protected logout(): void {
    this.authService.logout();
  }
}
