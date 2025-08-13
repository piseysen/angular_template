import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LanguageService } from '../../core/services/language.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  template: `
    <div class="settings-container">
      <div class="settings-header">
        <h1>Settings</h1>
        <p class="settings-description">Customize your application preferences</p>
      </div>

      <div class="settings-content">
        <!-- Language Settings -->
        <mat-card class="setting-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>language</mat-icon>
            <mat-card-title>Language</mat-card-title>
            <mat-card-subtitle>Choose your preferred language</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Select Language</mat-label>
              <mat-select 
                [value]="languageService.currentLanguage().code"
                (selectionChange)="onLanguageChange($event.value)">
                @for (language of languageService.availableLanguages; track language.code) {
                  <mat-option [value]="language.code">
                    <span class="language-option">
                      <span class="flag">{{ language.flag }}</span>
                      <span class="name">{{ language.name }}</span>
                    </span>
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>
            
            <div class="current-selection">
              <strong>Current:</strong> 
              <span class="selection-value">
                {{ languageService.currentLanguage().flag }} {{ languageService.currentLanguage().name }}
              </span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-divider></mat-divider>

        <!-- Theme Settings -->
        <mat-card class="setting-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>palette</mat-icon>
            <mat-card-title>Theme</mat-card-title>
            <mat-card-subtitle>Choose your visual preference</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Select Theme</mat-label>
              <mat-select 
                [value]="themeService.currentTheme().id"
                (selectionChange)="onThemeChange($event.value)">
                @for (theme of themeService.availableThemes; track theme.id) {
                  <mat-option [value]="theme.id">
                    <span class="theme-option">
                      <mat-icon class="theme-icon">{{ theme.icon }}</mat-icon>
                      <span class="theme-details">
                        <span class="theme-name">{{ theme.name }}</span>
                      </span>
                    </span>
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>
            
            <div class="current-selection">
              <strong>Current:</strong> 
              <span class="selection-value">
                <mat-icon class="selection-icon">{{ themeService.currentTheme().icon }}</mat-icon>
                {{ themeService.currentTheme().name }} Theme
              </span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styleUrl: './settings.component.scss',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  protected readonly languageService = inject(LanguageService);
  protected readonly themeService = inject(ThemeService);
  private readonly snackBar = inject(MatSnackBar);

  protected onLanguageChange(languageCode: string): void {
    const previousLanguage = this.languageService.currentLanguage().name;
    this.languageService.changeLanguage(languageCode);
    
    const newLanguage = this.languageService.currentLanguage().name;
    this.snackBar.open(`Language changed from ${previousLanguage} to ${newLanguage}`, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  protected onThemeChange(themeId: string): void {
    const previousTheme = this.themeService.currentTheme().name;
    this.themeService.changeTheme(themeId);
    
    const newTheme = this.themeService.currentTheme().name;
    this.snackBar.open(`Theme changed from ${previousTheme} to ${newTheme}`, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}