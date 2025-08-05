import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnvironmentService } from '../../core/services/environment.service';

@Component({
  selector: 'app-environment-indicator',
  imports: [CommonModule],
  template: `
    @if (!envService.isProduction) {
      <div class="environment-indicator" [class]="getEnvironmentClass()">
        <div class="environment-badge">
          <span class="environment-icon">🌍</span>
          <span class="environment-text">{{ envService.environmentName.toUpperCase() }}</span>
          <span class="environment-version">v{{ envService.appVersion }}</span>
        </div>
      </div>
    }
  `,
  styles: [`
    .environment-indicator {
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 9999;
      pointer-events: none;
    }

    .environment-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
    }

    .development {
      background: rgba(34, 197, 94, 0.9);
      color: white;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }

    .uat {
      background: rgba(251, 191, 36, 0.9);
      color: white;
      border: 1px solid rgba(251, 191, 36, 0.3);
    }

    .environment-icon {
      font-size: 12px;
    }

    .environment-text {
      font-weight: 700;
    }

    .environment-version {
      opacity: 0.8;
      font-size: 10px;
    }

    @media (max-width: 640px) {
      .environment-indicator {
        top: 5px;
        right: 5px;
      }
      
      .environment-badge {
        padding: 3px 6px;
        font-size: 10px;
      }
    }
  `]
})
export class EnvironmentIndicatorComponent {
  protected readonly envService = inject(EnvironmentService);

  getEnvironmentClass(): string {
    return this.envService.environmentName;
  }
}
