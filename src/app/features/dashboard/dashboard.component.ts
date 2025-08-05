import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { DashboardCard } from '../../core/models/dashboard-card';
import { RecentActivity } from '../../core/models/recent-activity';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatProgressSpinnerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  protected readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly isLoading = signal({
    createProject: false,
    viewReports: false,
    manageTeam: false,
    preferences: false
  });

  protected readonly dashboardCards = signal<DashboardCard[]>([
    {
      title: 'Total Users',
      value: '1,234',
      icon: 'people',
      color: 'bg-blue-500',
      description: '+12% from last month'
    },
    {
      title: 'Active Sessions',
      value: '856',
      icon: 'online_prediction',
      color: 'bg-green-500',
      description: 'Currently online'
    },
    {
      title: 'Revenue',
      value: '$45,678',
      icon: 'attach_money',
      color: 'bg-purple-500',
      description: '+8% from last month'
    },
    {
      title: 'Growth',
      value: '23.5%',
      icon: 'trending_up',
      color: 'bg-orange-500',
      description: 'Monthly increase'
    }
  ]);

  protected readonly recentActivities = signal<RecentActivity[]>([
    {
      id: '1',
      action: 'User logged in',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      icon: 'login'
    },
    {
      id: '2',
      action: 'Profile updated',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      icon: 'edit'
    },
    {
      id: '3',
      action: 'New message received',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: 'message'
    },
    {
      id: '4',
      action: 'System backup completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      icon: 'backup'
    }
  ]);

  protected formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  protected getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }

  // Quick Actions handlers
  protected createProject(): void {
    this.isLoading.update(state => ({ ...state, createProject: true }));
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading.update(state => ({ ...state, createProject: false }));
      this.snackBar.open('Project creation started!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      console.log('Creating new project...');
    }, 1500);
  }

  protected viewReports(): void {
    this.isLoading.update(state => ({ ...state, viewReports: true }));
    
    setTimeout(() => {
      this.isLoading.update(state => ({ ...state, viewReports: false }));
      this.snackBar.open('Opening reports dashboard...', 'Close', {
        duration: 3000,
        panelClass: ['info-snackbar']
      });
      console.log('Opening reports...');
    }, 1000);
  }

  protected manageTeam(): void {
    this.isLoading.update(state => ({ ...state, manageTeam: true }));
    
    setTimeout(() => {
      this.isLoading.update(state => ({ ...state, manageTeam: false }));
      this.snackBar.open('Team management opened!', 'Close', {
        duration: 3000,
        panelClass: ['info-snackbar']
      });
      console.log('Opening team management...');
    }, 800);
  }

  protected openPreferences(): void {
    this.isLoading.update(state => ({ ...state, preferences: true }));
    
    setTimeout(() => {
      this.isLoading.update(state => ({ ...state, preferences: false }));
      this.snackBar.open('Preferences opened!', 'Close', {
        duration: 3000,
        panelClass: ['info-snackbar']
      });
      console.log('Opening preferences...');
    }, 600);
  }

  protected openHelpCenter(): void {
    this.snackBar.open('Opening help center...', 'Close', {
      duration: 2000,
      panelClass: ['info-snackbar']
    });
    console.log('Opening help center...');
  }

  protected contactSupport(): void {
    this.snackBar.open('Contacting support team...', 'Close', {
      duration: 2000,
      panelClass: ['info-snackbar']
    });
    console.log('Contacting support...');
  }

  protected learnMore(): void {
    this.snackBar.open('Opening learning resources...', 'Close', {
      duration: 2000,
      panelClass: ['info-snackbar']
    });
    console.log('Opening learning resources...');
  }
}
