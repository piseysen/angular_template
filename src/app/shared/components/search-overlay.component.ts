import { Component, inject, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { SearchService, SearchResult } from '../../core/services/search.service';

@Component({
  selector: 'app-search-overlay',
  template: `
    <div class="search-overlay-container">
      <!-- Search Header -->
      <div class="search-header">
        <div class="search-input-container">
          <mat-icon class="search-icon">search</mat-icon>
          <input
            #searchInput
            matInput
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchQueryChange($event)"
            placeholder="Search pages, users, products..."
            class="search-input"
            autocomplete="off"
          />
          @if (searchQuery) {
            <button 
              mat-icon-button 
              (click)="clearSearch()" 
              class="clear-btn"
              matTooltip="Clear search"
            >
              <mat-icon>clear</mat-icon>
            </button>
          }
        </div>
        <button 
          mat-button 
          (click)="closeSearch()" 
          class="close-btn"
        >
          <span>ESC</span>
        </button>
      </div>

      <!-- Search Content -->
      <div class="search-content">
        @if (searchService.searchResults().length > 0) {
          <!-- Search Results -->
          <div class="search-results">
            <div class="results-header">
              <mat-icon>search</mat-icon>
              <span>Search Results</span>
              <span class="results-count">({{ searchService.searchResults().length }})</span>
            </div>
            
            <mat-list class="results-list">
              @for (result of searchService.searchResults(); track result.id) {
                <mat-list-item 
                  class="result-item"
                  (click)="selectResult(result)"
                  [class]="'category-' + result.category"
                >
                  <div class="result-content">
                    <div class="result-main">
                      <div class="result-icon-title">
                        <mat-icon [color]="searchService.getCategoryColor(result.category)">
                          {{ result.icon }}
                        </mat-icon>
                        <div class="result-title">{{ result.title }}</div>
                      </div>
                      <mat-chip 
                        class="category-chip"
                        [color]="searchService.getCategoryColor(result.category)"
                      >
                        <mat-icon>{{ searchService.getCategoryIcon(result.category) }}</mat-icon>
                        {{ result.category | titlecase }}
                      </mat-chip>
                    </div>
                    <div class="result-description">{{ result.description }}</div>
                  </div>
                </mat-list-item>
                @if (!$last) {
                  <mat-divider></mat-divider>
                }
              }
            </mat-list>
          </div>
        } @else if (searchQuery && searchQuery.length >= 2) {
          <!-- No Results -->
          <div class="no-results">
            <div class="no-results-icon">
              <mat-icon>search_off</mat-icon>
            </div>
            <h3>No results found</h3>
            <p>Try searching for something else or check your spelling.</p>
            <button 
              mat-button 
              color="primary" 
              (click)="clearSearch()"
            >
              Clear Search
            </button>
          </div>
        } @else {
          <!-- Search Suggestions -->
          <div class="search-suggestions">
            <div class="suggestions-header">
              <mat-icon>lightbulb</mat-icon>
              <span>Quick Access</span>
            </div>
            
            <div class="suggestion-categories">
              <div class="suggestion-category">
                <h4><mat-icon>dashboard</mat-icon> Navigation</h4>
                <div class="suggestion-items">
                  <button mat-button (click)="quickSearch('dashboard')" class="suggestion-btn">
                    <mat-icon>dashboard</mat-icon>
                    Dashboard
                  </button>
                  <button mat-button (click)="quickSearch('users')" class="suggestion-btn">
                    <mat-icon>people</mat-icon>
                    Users
                  </button>
                  <button mat-button (click)="quickSearch('products')" class="suggestion-btn">
                    <mat-icon>inventory_2</mat-icon>
                    Products
                  </button>
                  <button mat-button (click)="quickSearch('orders')" class="suggestion-btn">
                    <mat-icon>receipt_long</mat-icon>
                    Orders
                  </button>
                </div>
              </div>

              <div class="suggestion-category">
                <h4><mat-icon>flash_on</mat-icon> Quick Actions</h4>
                <div class="suggestion-items">
                  <button mat-button (click)="quickSearch('add product')" class="suggestion-btn">
                    <mat-icon>add_box</mat-icon>
                    Add Product
                  </button>
                  <button mat-button (click)="quickSearch('add user')" class="suggestion-btn">
                    <mat-icon>person_add</mat-icon>
                    Add User
                  </button>
                  <button mat-button (click)="quickSearch('recent orders')" class="suggestion-btn">
                    <mat-icon>schedule</mat-icon>
                    Recent Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Search Footer -->
      <div class="search-footer">
        <div class="search-tips">
          <span class="tip">
            <kbd>↑</kbd><kbd>↓</kbd> to navigate
          </span>
          <span class="tip">
            <kbd>↵</kbd> to select
          </span>
          <span class="tip">
            <kbd>ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-overlay-container {
      width: 100%;
      max-width: 600px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      overflow: hidden;
    }

    .search-header {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #e0e0e0;
      background: #fafafa;
    }

    .search-input-container {
      flex: 1;
      display: flex;
      align-items: center;
      position: relative;
    }

    .search-icon {
      margin-right: 12px;
      color: #666;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 16px;
      padding: 8px 0;
      background: transparent;
    }

    .clear-btn {
      width: 32px;
      height: 32px;
      margin-left: 8px;
    }

    .close-btn {
      margin-left: 16px;
      font-size: 12px;
      color: #666;
      min-width: auto;
      padding: 4px 8px;
      height: 28px;
      border: 1px solid #ddd;
      border-radius: 6px;
    }

    .search-content {
      flex: 1;
      overflow-y: auto;
      min-height: 200px;
      max-height: 500px;
    }

    .search-results {
      padding: 8px 0;
    }

    .results-header {
      display: flex;
      align-items: center;
      padding: 12px 20px 8px;
      font-weight: 500;
      color: #666;
      font-size: 14px;
    }

    .results-header mat-icon {
      margin-right: 8px;
      font-size: 18px;
    }

    .results-count {
      margin-left: auto;
      color: #999;
    }

    .results-list {
      padding: 0;
    }

    .result-item {
      padding: 12px 20px !important;
      cursor: pointer;
      transition: background-color 0.2s;
      height: auto !important;
      min-height: 64px;
    }

    .result-item:hover {
      background: #f5f5f5;
    }

    .result-content {
      width: 100%;
    }

    .result-main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .result-icon-title {
      display: flex;
      align-items: center;
    }

    .result-icon-title mat-icon {
      margin-right: 12px;
      font-size: 20px;
    }

    .result-title {
      font-weight: 500;
      font-size: 16px;
    }

    .result-description {
      color: #666;
      font-size: 14px;
      margin-left: 32px;
    }

    .category-chip {
      font-size: 11px !important;
      height: 20px !important;
      padding: 0 8px !important;
    }

    .category-chip mat-icon {
      font-size: 14px !important;
      margin-right: 4px;
    }

    .no-results {
      text-align: center;
      padding: 40px 20px;
    }

    .no-results-icon mat-icon {
      font-size: 48px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .no-results h3 {
      margin: 0 0 8px;
      color: #666;
    }

    .no-results p {
      margin: 0 0 20px;
      color: #999;
    }

    .search-suggestions {
      padding: 20px;
    }

    .suggestions-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      font-weight: 500;
      color: #666;
    }

    .suggestions-header mat-icon {
      margin-right: 8px;
      color: #ffa726;
    }

    .suggestion-categories {
      display: grid;
      gap: 24px;
    }

    .suggestion-category h4 {
      display: flex;
      align-items: center;
      margin: 0 0 12px;
      font-size: 14px;
      color: #666;
    }

    .suggestion-category h4 mat-icon {
      margin-right: 8px;
      font-size: 18px;
    }

    .suggestion-items {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 8px;
    }

    .suggestion-btn {
      justify-content: flex-start;
      text-align: left;
      padding: 8px 12px;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .suggestion-btn:hover {
      background: #e3f2fd;
    }

    .suggestion-btn mat-icon {
      margin-right: 8px;
      font-size: 18px;
    }

    .search-footer {
      border-top: 1px solid #e0e0e0;
      padding: 12px 20px;
      background: #fafafa;
    }

    .search-tips {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #666;
    }

    .tip {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    kbd {
      background: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 3px;
      padding: 2px 6px;
      font-size: 11px;
      color: #333;
    }

    @media (max-width: 600px) {
      .search-overlay-container {
        max-width: 100%;
        max-height: 90vh;
        margin: 0;
        border-radius: 0;
      }

      .suggestion-items {
        grid-template-columns: 1fr;
      }
    }
  `],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule
  ]
})
export class SearchOverlayComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  protected readonly searchService = inject(SearchService);
  private readonly dialogRef = inject(MatDialogRef<SearchOverlayComponent>);

  searchQuery = '';

  ngAfterViewInit() {
    // Auto-focus the search input
    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    });
  }

  onSearchQueryChange(query: string): void {
    this.searchQuery = query;
    this.searchService.setSearchQuery(query);
  }

  selectResult(result: SearchResult): void {
    this.searchService.navigateToResult(result);
    this.closeSearch();
  }

  quickSearch(query: string): void {
    this.searchQuery = query;
    this.searchService.setSearchQuery(query);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchService.clearSearch();
  }

  closeSearch(): void {
    this.dialogRef.close();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeSearch();
    }
  }
}
