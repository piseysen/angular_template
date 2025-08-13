import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';

export interface Product {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  stockQuantity: number;
  isActive: boolean;
  tags: string[];
  imageUrl?: string;
}

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDividerModule
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly isLoading = signal(false);
  
  protected readonly categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports & Outdoors',
    'Toys & Games',
    'Health & Beauty',
    'Automotive',
    'Food & Beverages',
    'Other'
  ];

  protected readonly productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    price: [null, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required],
    sku: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    isActive: [true],
    tags: [[]],
    imageUrl: ['', Validators.pattern(/^https?:\/\/.+/)]
  });

  protected readonly tags = signal<string[]>([]);

  protected onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading.set(true);

      const formData = this.productForm.value;
      const product: Product = {
        ...formData,
        tags: this.tags()
      };

      // Simulate API call
      setTimeout(() => {
        console.log('Creating product:', product);
        
        this.snackBar.open('Product created successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        this.isLoading.set(false);
        this.router.navigate(['/products/list']);
      }, 1500);
    } else {
      this.markFormGroupTouched();
      this.snackBar.open('Please fix the form errors', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  protected onCancel(): void {
    this.router.navigate(['/products/list']);
  }

  protected addTag(event: any): void {
    const input = event.input;
    const value = (event.value || '').trim();

    if (value && !this.tags().includes(value)) {
      this.tags.update(tags => [...tags, value]);
    }

    if (input) {
      input.value = '';
    }
  }

  protected removeTag(tag: string): void {
    this.tags.update(tags => tags.filter(t => t !== tag));
  }

  protected generateSKU(): void {
    const name = this.productForm.get('name')?.value || '';
    const category = this.productForm.get('category')?.value || '';
    
    if (name && category) {
      const namePart = name.substring(0, 3).toUpperCase();
      const categoryPart = category.substring(0, 3).toUpperCase();
      const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      const sku = `${namePart}-${categoryPart}-${randomPart}`;
      this.productForm.patchValue({ sku });
    }
  }

  protected getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    
    if (field?.hasError('minlength')) {
      const requiredLength = field.errors?.['minlength']?.requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${requiredLength} characters`;
    }
    
    if (field?.hasError('maxlength')) {
      const requiredLength = field.errors?.['maxlength']?.requiredLength;
      return `${this.getFieldLabel(fieldName)} must be no more than ${requiredLength} characters`;
    }
    
    if (field?.hasError('min')) {
      return `${this.getFieldLabel(fieldName)} must be greater than or equal to 0`;
    }
    
    if (field?.hasError('pattern')) {
      if (fieldName === 'sku') {
        return 'SKU must contain only uppercase letters, numbers, and hyphens';
      }
      if (fieldName === 'imageUrl') {
        return 'Please enter a valid URL starting with http:// or https://';
      }
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'name': 'Product Name',
      'description': 'Description',
      'price': 'Price',
      'category': 'Category',
      'sku': 'SKU',
      'stockQuantity': 'Stock Quantity',
      'imageUrl': 'Image URL'
    };
    
    return labels[fieldName] || fieldName;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }
}
