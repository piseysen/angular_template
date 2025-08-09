import { ChangeDetectionStrategy, Component, computed, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  // Signals
  protected readonly selectedImage = signal('');

  // Get product ID from route
  private readonly productId = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? parseInt(id, 10) : undefined;
  });

  // Resource for product details
  protected readonly productResource = this.productService.createProductResource(() => this.productId());

  constructor() {
    // Set the first image as selected when product loads
    effect(() => {
      const product = this.productResource.value();
      if (product && this.selectedImage() === '') {
        this.selectedImage.set(product.thumbnail || product.images[0] || '');
      }
    });
  }

  getStarArray(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('filled');
      } else {
        stars.push('empty');
      }
    }
    
    return stars;
  }

  getOriginalPrice(): string {
    if (!this.productResource.hasValue()) return '0.00';
    const product = this.productResource.value();
    const originalPrice = product.price / (1 - product.discountPercentage / 100);
    return originalPrice.toFixed(2);
  }

  getStockClass(): string {
    if (!this.productResource.hasValue()) return '';
    return this.productResource.value().stock > 0 ? 'in-stock' : 'out-of-stock';
  }

  getStockText(): string {
    if (!this.productResource.hasValue()) return 'Unknown';
    const stock = this.productResource.value().stock;
    return stock > 0 ? `${stock} in stock` : 'Out of stock';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/400x400?text=No+Image';
  }
}
