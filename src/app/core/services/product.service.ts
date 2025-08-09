import { Injectable, inject, resource } from '@angular/core';
import { Product } from '../models/product/product';
import { ProductSearchParams } from '../models/product/product-search-params';
import { ProductsResponse } from '../models/product/products-response';
import { ProductCategory } from '../models/product/product-category';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = environment.apiUrl;

  // Resource for all products with pagination and search
  createProductsResource(params: () => ProductSearchParams) {
    return resource({
      params,
      loader: async ({ params, abortSignal }): Promise<ProductsResponse> => {
        const url = this.buildUrl(params);
        return await this.fetchWithAbortSignal<ProductsResponse>(url, abortSignal);
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
        return await this.fetchWithAbortSignal<Product>(`${this.baseUrl}/${params}`, abortSignal);
      }
    });
  }

  // Resource for product categories
  createCategoriesResource() {
    return resource({
      params: () => ({}),
      loader: async ({ abortSignal }): Promise<ProductCategory[]> => {
        return await this.fetchWithAbortSignal<ProductCategory[]>(`${this.baseUrl}/categories`, abortSignal);
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
        return await this.fetchWithAbortSignal<ProductsResponse>(`${this.baseUrl}/category/${params}`, abortSignal);
      }
    });
  }

  private async fetchWithAbortSignal<T>(url: string, abortSignal: AbortSignal): Promise<T> {
    const response = await fetch(url, { signal: abortSignal });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
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
