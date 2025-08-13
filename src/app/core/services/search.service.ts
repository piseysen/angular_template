import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  category: 'page' | 'user' | 'product' | 'order' | 'setting';
  keywords: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly searchQuery = signal('');
  private readonly isSearchOpen = signal(false);

  constructor(private router: Router) {}

  // All searchable items
  private readonly searchableItems: SearchResult[] = [
    // Pages
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Main dashboard with overview and analytics',
      route: '/dashboard',
      icon: 'dashboard',
      category: 'page',
      keywords: ['dashboard', 'overview', 'main', 'home', 'stats', 'analytics']
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'View detailed analytics and reports',
      route: '/analytics',
      icon: 'analytics',
      category: 'page',
      keywords: ['analytics', 'reports', 'charts', 'data', 'metrics', 'insights']
    },
    {
      id: 'products',
      title: 'Products',
      description: 'Manage your product catalog',
      route: '/products',
      icon: 'inventory_2',
      category: 'page',
      keywords: ['products', 'catalog', 'inventory', 'items', 'goods', 'merchandise']
    },
    {
      id: 'users',
      title: 'Users',
      description: 'User management and administration',
      route: '/users',
      icon: 'people',
      category: 'page',
      keywords: ['users', 'people', 'customers', 'accounts', 'management', 'admin']
    },
    {
      id: 'orders',
      title: 'Orders',
      description: 'Order management and tracking',
      route: '/orders',
      icon: 'receipt_long',
      category: 'page',
      keywords: ['orders', 'purchases', 'sales', 'transactions', 'billing', 'invoices']
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'Generate and view business reports',
      route: '/reports',
      icon: 'bar_chart',
      category: 'page',
      keywords: ['reports', 'statistics', 'summary', 'analysis', 'insights', 'data']
    },
    {
      id: 'profile',
      title: 'My Profile',
      description: 'View and edit your profile information',
      route: '/profile',
      icon: 'person',
      category: 'setting',
      keywords: ['profile', 'account', 'personal', 'information', 'details', 'settings']
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Application settings and preferences',
      route: '/settings',
      icon: 'settings',
      category: 'setting',
      keywords: ['settings', 'preferences', 'configuration', 'options', 'setup']
    },
    // Quick Actions
    {
      id: 'add-product',
      title: 'Add New Product',
      description: 'Create a new product in your catalog',
      route: '/products/new',
      icon: 'add_box',
      category: 'product',
      keywords: ['add', 'new', 'create', 'product', 'item', 'catalog']
    },
    {
      id: 'add-user',
      title: 'Add New User',
      description: 'Create a new user account',
      route: '/users/new',
      icon: 'person_add',
      category: 'user',
      keywords: ['add', 'new', 'create', 'user', 'account', 'register']
    },
    {
      id: 'view-orders',
      title: 'Recent Orders',
      description: 'View latest orders and transactions',
      route: '/orders?filter=recent',
      icon: 'schedule',
      category: 'order',
      keywords: ['recent', 'latest', 'new', 'orders', 'transactions']
    }
  ];

  // Computed search results
  readonly searchResults = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    
    if (!query) {
      return [];
    }

    if (query.length < 2) {
      return [];
    }

    return this.searchableItems
      .filter(item => {
        // Search in title, description, and keywords
        const searchText = [
          item.title,
          item.description,
          ...item.keywords
        ].join(' ').toLowerCase();
        
        return searchText.includes(query);
      })
      .sort((a, b) => {
        // Prioritize exact title matches
        const aExactTitle = a.title.toLowerCase().includes(query);
        const bExactTitle = b.title.toLowerCase().includes(query);
        
        if (aExactTitle && !bExactTitle) return -1;
        if (!aExactTitle && bExactTitle) return 1;
        
        // Then prioritize by category (pages first)
        const categoryOrder = { page: 0, setting: 1, product: 2, user: 3, order: 4 };
        return categoryOrder[a.category] - categoryOrder[b.category];
      })
      .slice(0, 8); // Limit to 8 results
  });

  // Getters for signals
  getSearchQuery = () => this.searchQuery();
  getIsSearchOpen = () => this.isSearchOpen();

  // Methods
  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  openSearch(): void {
    this.isSearchOpen.set(true);
  }

  closeSearch(): void {
    this.isSearchOpen.set(false);
    this.searchQuery.set('');
  }

  navigateToResult(result: SearchResult): void {
    this.router.navigate([result.route]);
    this.closeSearch();
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  // Get category icon
  getCategoryIcon(category: SearchResult['category']): string {
    const icons = {
      page: 'web',
      user: 'people',
      product: 'inventory_2',
      order: 'receipt',
      setting: 'settings'
    };
    return icons[category] || 'search';
  }

  // Get category color
  getCategoryColor(category: SearchResult['category']): string {
    const colors = {
      page: 'primary',
      user: 'accent',
      product: 'warn',
      order: 'primary',
      setting: 'accent'
    };
    return colors[category] || 'primary';
  }
}
