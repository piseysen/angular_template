import { ChangeDetectionStrategy, Component, signal, computed, inject, ViewChild } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
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
import { filter } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
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
  protected readonly currentRoute = signal('');

  // Dynamic content margin based on sidebar state
  contentMargin = computed(() => {
    if (this.isHandset()) {
      return '0px'; // No margin on mobile
    }
    return this.isSidenavCollapsed() ? '72px' : '280px';
  });

  // Check if a menu item is active
  isMenuItemActive = computed(() => {
    return (route: string) => {
      const current = this.currentRoute();
      return current === route || current.startsWith(route + '/');
    };
  });

  // Get current page title with breadcrumb support
  currentPageTitle = computed(() => {
    const current = this.currentRoute();
    const segments = current.split('/').filter(s => s);
    
    // Find main menu item
    const mainMenuItem = this.menuItems.find(item => 
      current === item.route || current.startsWith(item.route + '/')
    );
    const userMenuItem = this.userMenuItems.find(item => 
      current === item.route || current.startsWith(item.route + '/')
    );
    
    if (mainMenuItem) {
      // If we have sub-routes, show both main and sub
      if (segments.length > 1 && current !== mainMenuItem.route) {
        const subRoute = segments[segments.length - 1];
        const subRouteTitle = subRoute.charAt(0).toUpperCase() + subRoute.slice(1);
        return `${mainMenuItem.label} - ${subRouteTitle}`;
      }
      return mainMenuItem.label;
    }
    
    if (userMenuItem) return userMenuItem.label;
    
    // Fallback to route-based title
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    }
    
    return 'Dashboard';
  });

  // Menu items configuration
  menuItems = [
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
    // Listen for breakpoint changes
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).subscribe(result => {
      const isHandset = result.matches;
      this.isHandset.set(isHandset);
      this.sidenavMode.set(isHandset ? 'over' : 'side');
      
      // Auto-collapse on smaller screens
      if (isHandset) {
        this.isSidenavCollapsed.set(false);
      }
    });

    // Listen for route changes to update current route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.url);
      });

    // Set initial route
    this.currentRoute.set(this.router.url);
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
