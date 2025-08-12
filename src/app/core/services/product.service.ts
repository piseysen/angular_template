import { Injectable, inject, resource } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Product } from '../models/product/product';
import { ProductsResponse } from '../models/product/products-response';
import { ProductCategory } from '../models/product/product-category';
import { ProductSearchParams } from '../models/product/product-search-params';
import { CACHEABLE, CACHE_TTL } from '../interceptors/caching.interceptor';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  // Resource for all products with pagination and search
  createProductsResource(params: () => ProductSearchParams) {
    return resource({
      params,
      loader: async ({ params, abortSignal }): Promise<ProductsResponse> => {
        const url = this.buildUrl(params);
        return await this.httpGetWithAbortSignal<ProductsResponse>(url, abortSignal, true); // Enable caching for product lists
      }
    });
  }

  // Resource for single product
  createProductResource(productId: () => number | undefined) {
    return resource({
      params: productId,
      loader: async ({ params, abortSignal }): Promise<Product> => {
        if (!params) {
          throw new Error('Product ID is required');
        }
        return await this.httpGetWithAbortSignal<Product>(`${this.baseUrl}/${params}`, abortSignal, true); // Enable caching for product details
      }
    });
  }

  // Resource for product categories
  createCategoriesResource() {
    return resource({
      params: () => ({}),
      loader: async ({ abortSignal }): Promise<ProductCategory[]> => {
        return await this.httpGetWithAbortSignal<ProductCategory[]>(`${this.baseUrl}/categories`, abortSignal);
      }
    });
  }

  // Resource for products by category
  createCategoryProductsResource(category: () => string | undefined) {
    return resource({
      params: category,
      loader: async ({ params, abortSignal }): Promise<ProductsResponse> => {
        if (!params) {
          throw new Error('Category is required');
        }
        return await this.httpGetWithAbortSignal<ProductsResponse>(`${this.baseUrl}/category/${params}`, abortSignal, true); // Enable caching for category products
      }
    });
  }

  private async httpGetWithAbortSignal<T>(url: string, abortSignal: AbortSignal, useCache = false): Promise<T> {
    // Create HttpContext for interceptor communication
    const context = new HttpContext();
    
    // Set caching context if specified
    if (useCache) {
      context.set(CACHEABLE, true);
      context.set(CACHE_TTL, 5 * 60 * 1000); // 5 minutes
    }
    
    // Create request with abort signal and context
    const request$ = this.http.get<T>(url, { 
      context,
      // Note: HttpClient doesn't directly support AbortSignal, but our timeout interceptor handles this
    });
    
    // Convert Observable to Promise and handle abort
    const timeoutPromise = new Promise<never>((_, reject) => {
      abortSignal.addEventListener('abort', () => {
        reject(new Error('Request aborted'));
      });
    });
    
    return Promise.race([
      lastValueFrom(request$),
      timeoutPromise
    ]);
  }

  private buildUrl(params: ProductSearchParams): string {
    let url = this.baseUrl;
    const queryParams = new URLSearchParams();

    if (params.q) {
      url += '/search';
      queryParams.set('q', params.q);
    }

    if (params.limit !== undefined) {
      queryParams.set('limit', params.limit.toString());
    }

    if (params.skip !== undefined) {
      queryParams.set('skip', params.skip.toString());
    }

    if (params.select) {
      queryParams.set('select', params.select);
    }

    if (params.sortBy) {
      queryParams.set('sortBy', params.sortBy);
    }

    if (params.order) {
      queryParams.set('order', params.order);
    }

    const queryString = queryParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }
}
