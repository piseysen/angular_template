import { ChangeDetectionStrategy, Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';


@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  private readonly productService = inject(ProductService);
  
  // Signals for state management
  protected readonly searchQuery = signal('');
  protected readonly selectedCategory = signal('');
  protected readonly currentPage = signal(1);
  protected readonly pageSize = signal(12);

  // Computed search parameters
  private readonly searchParams = computed(() => ({
    q: this.searchQuery() || undefined,
    category: this.selectedCategory() || undefined,
    limit: this.pageSize(),
    skip: (this.currentPage() - 1) * this.pageSize()
  }));

  // Resources
  protected readonly productsResource = this.productService.createProductsResource(() => this.searchParams());
  protected readonly categoriesResource = this.productService.createCategoriesResource();

  // Computed values for pagination
  protected readonly totalPages = computed(() => {
    const total = this.productsResource.value()?.total ?? 0;
    return Math.ceil(total / this.pageSize());
  });

  protected readonly visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];
    
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  });

  protected readonly displayEnd = computed(() => {
    const total = this.productsResource.value()?.total ?? 0;
    return Math.min(this.currentPage() * this.pageSize(), total);
  });

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.currentPage.set(1); // Reset to first page on search
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory.set(target.value);
    this.currentPage.set(1); // Reset to first page on category change
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/300x200?text=No+Image';
  }
}
