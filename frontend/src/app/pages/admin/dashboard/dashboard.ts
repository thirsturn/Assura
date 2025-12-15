import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { AssetService } from '../../../services/asset.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private assetService = inject(AssetService);

  userRole = this.authService.userRole;
  stats = signal<any>({
    totalAssets: 0,
    totalUsers: 0,
    totalValue: 0
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.assetService.getStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }
}
