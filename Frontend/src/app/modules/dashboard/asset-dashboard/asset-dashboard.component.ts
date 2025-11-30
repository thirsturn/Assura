import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardStats, RecentAsset, CategoryCount } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-asset-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asset-dashboard.component.html',
  styleUrls: ['./asset-dashboard.component.css']
})
export class AssetDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalAssets: 0,
    activeAssets: 0,
    availableAssets: 0,
    underMaintenance: 0
  };

  recentAssets: RecentAsset[] = [];
  categories: CategoryCount[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        this.stats = response.data.stats;
        this.recentAssets = response.data.recentAssets;
        this.categories = response.data.categories;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      }
    });
  }

  goToAssets(): void {
    this.router.navigate(['/assets']);
  }

  goToCreateAsset(): void {
    this.router.navigate(['/assets/create']);
  }

  goToAssetDetail(assetId: string): void {
    this.router.navigate(['/assets', assetId]);
  }

  goToQRScanner(): void {
    this.router.navigate(['/qr/scan']);
  }

  refresh(): void {
    this.loadDashboard();
  }

  getPercentage(value: number): number {
    if (this.stats.totalAssets === 0) return 0;
    return (value / this.stats.totalAssets) * 100;
  }
}