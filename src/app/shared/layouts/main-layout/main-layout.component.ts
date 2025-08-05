import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../../core/services/auth.service';
import { EnvironmentIndicatorComponent } from '../../components/environment-indicator.component';
import { EnvironmentService } from '../../../core/services/environment.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    EnvironmentIndicatorComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  protected readonly authService = inject(AuthService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);

  protected readonly isHandset = signal(false);
  protected readonly environmentService = inject(EnvironmentService);

  constructor() {
    this.breakpointObserver.observe(Breakpoints.Handset).subscribe(result => {
      this.isHandset.set(result.matches);
    });
  }

  protected logout(): void {
    this.authService.logout();
  }
}
