import { ChangeDetectionStrategy, Component, signal, computed, inject, ViewChild, HostListener } from '@angular/core';
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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../../core/services/auth.service';
import { SearchService } from '../../../core/services/search.service';
import { SearchOverlayComponent } from '../../components/search-overlay.component';
import { EnvironmentIndicatorComponent } from '../../components/environment-indicator.component';
import { EnvironmentService } from '../../../core/services/environment.service';
import { filter } from 'rxjs';

// Menu item types
interface BaseMenuItem {
  icon: string;
  label: string;
  route: string;
  badge?: string | number | null;
  tooltip: string;
  type: 'page' | 'action';
}

interface MenuItemWithChildren extends BaseMenuItem {
  children?: BaseMenuItem[];
}

type MenuItem = BaseMenuItem | MenuItemWithChildren;

interface MenuGroup {
  id: string;
  title: string;
  icon: string;
  collapsed: boolean;
  items: MenuItem[];
}

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
    MatDialogModule,
    EnvironmentIndicatorComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
  protected readonly authService = inject(AuthService);
  protected readonly searchService = inject(SearchService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  protected readonly isHandset = signal(false);
  protected readonly environmentService = inject(EnvironmentService);
  protected readonly isSidenavCollapsed = signal(false);
  protected readonly sidenavMode = signal<'side' | 'over'>('side');
  protected readonly currentRoute = signal('');
  
  // Collapsible menu state
  protected readonly collapsedMenuGroups = signal<Set<string>>(new Set());

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
    
    // Find main menu item in all groups
    let mainMenuItem: BaseMenuItem | undefined;
    for (const group of this.menuGroups) {
      const found = group.items.find((item: MenuItem) => {
        // Check if item has children
        if ('children' in item && item.children) {
          // Check parent route
          if (current === item.route || current.startsWith(item.route + '/')) {
            return true;
          }
          // Check children routes
          return item.children.some((child: BaseMenuItem) =>
            current === child.route || current.startsWith(child.route + '/')
          );
        } else {
          return current === item.route || current.startsWith(item.route + '/');
        }
      });
      if (found) {
        mainMenuItem = found as BaseMenuItem;
        break;
      }
    }

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

  // Menu items configuration with groups
  menuGroups = [
    {
      id: 'main',
      title: 'Main Navigation',
      icon: 'dashboard',
      collapsed: false,
      items: [
        {
          icon: 'dashboard',
          label: 'Dashboard',
          route: '/dashboard',
          badge: null,
          tooltip: 'Main Dashboard',
          type: 'page' as const
        },
        {
          icon: 'analytics',
          label: 'Analytics',
          route: '/analytics',
          badge: 'new',
          tooltip: 'View Analytics',
          type: 'page' as const
        }
      ]
    },
    {
      id: 'management',
      title: 'Management',
      icon: 'business_center',
      collapsed: false,
      items: [
        {
          icon: 'inventory_2',
          label: 'Products',
          route: '/products',
          badge: null,
          tooltip: 'Manage Products',
          type: 'page' as const,
          children: [
            {
              icon: 'add_box',
              label: 'Add Product',
              route: '/products/new',
              tooltip: 'Add New Product',
              type: 'action' as const
            },
            {
              icon: 'list',
              label: 'Product List',
              route: '/products/list',
              tooltip: 'View All Products',
              type: 'page' as const
            }
          ]
        },
        {
          icon: 'people',
          label: 'Users',
          route: '/users',
          badge: 5,
          tooltip: 'User Management',
          type: 'page' as const,
          children: [
            {
              icon: 'person_add',
              label: 'Add User',
              route: '/users/new',
              tooltip: 'Add New User',
              type: 'action' as const
            },
            {
              icon: 'group',
              label: 'User Groups',
              route: '/users/groups',
              tooltip: 'Manage User Groups',
              type: 'page' as const
            }
          ]
        },
        {
          icon: 'receipt_long',
          label: 'Orders',
          route: '/orders',
          badge: 12,
          tooltip: 'Order Management',
          type: 'page' as const
        }
      ]
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      icon: 'assessment',
      collapsed: true, // Start collapsed
      items: [
        {
          icon: 'bar_chart',
          label: 'Reports',
          route: '/reports',
          badge: null,
          tooltip: 'Generate Reports',
          type: 'page' as const
        },
        {
          icon: 'trending_up',
          label: 'Insights',
          route: '/insights',
          badge: null,
          tooltip: 'Business Insights',
          type: 'page' as const
        },
        {
          icon: 'pie_chart',
          label: 'Statistics',
          route: '/statistics',
          badge: null,
          tooltip: 'View Statistics',
          type: 'page' as const
        }
      ]
    }
  ];

  // Legacy flat menuItems for backward compatibility
  get menuItems(): BaseMenuItem[] {
    const flatItems: BaseMenuItem[] = [];
    for (const group of this.menuGroups) {
      for (const item of group.items) {
        if ('children' in item && item.children) {
          flatItems.push(item as BaseMenuItem);
          flatItems.push(...item.children);
        } else {
          flatItems.push(item as BaseMenuItem);
        }
      }
    }
    return flatItems;
  }

  // Expanded menu items (for collapsible sub-items)
  protected readonly expandedMenuItems = signal<Set<string>>(new Set());

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

  protected openSearch(): void {
    this.dialog.open(SearchOverlayComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '80vh',
      panelClass: 'search-dialog',
      backdropClass: 'search-backdrop',
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true
    });
  }

  // Menu group collapse/expand methods
  protected toggleMenuGroup(groupId: string): void {
    const group = this.menuGroups.find(g => g.id === groupId);
    if (group) {
      group.collapsed = !group.collapsed;
    }
  }

  protected isMenuGroupCollapsed(groupId: string): boolean {
    const group = this.menuGroups.find(g => g.id === groupId);
    return group ? group.collapsed : false;
  }

  // Menu item expand/collapse methods (for sub-items)
  protected toggleMenuItem(route: string): void {
    this.expandedMenuItems.update(expanded => {
      const newSet = new Set(expanded);
      if (newSet.has(route)) {
        newSet.delete(route);
      } else {
        newSet.add(route);
      }
      return newSet;
    });
  }

  protected isMenuItemExpanded(route: string): boolean {
    return this.expandedMenuItems().has(route);
  }

  protected hasChildren(item: MenuItem): boolean {
    return 'children' in item && !!item.children && item.children.length > 0;
  }

  protected getChildrenItems(item: MenuItem): BaseMenuItem[] {
    if ('children' in item && item.children) {
      return item.children;
    }
    return [];
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Ctrl+K or Cmd+K to open search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.openSearch();
    }
  }
}
