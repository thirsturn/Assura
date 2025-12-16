import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssetService } from '../../../services/asset.service';
import { LookupService } from '../../../services/lookup.service';
import { Asset } from '../../../models/asset';
import { LookupItem } from '../../../models/lookup';
import { environment } from '../../../../environments/environment';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './asset-list.html',
  styleUrls: ['./asset-list.css']
})
export class AssetListComponent implements OnInit {
  private assetService = inject(AssetService);
  private lookupService = inject(LookupService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  assets: Asset[] = [];
  filteredAssets: Asset[] = [];
  statuses: LookupItem[] = [];
  locations: LookupItem[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  selectedStatus = '';
  selectedLocation = '';
  uploadsUrl = environment.uploadsUrl;

  availableCount = 0;
  deployedCount = 0;

  ngOnInit() {
    console.log('=== Asset List Component Initialized ===');
    this.loadLookupData();
    this.loadAssets();

    // Reload assets when navigating back to this route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url === '/assets' || event.url.startsWith('/assets?')) {
        console.log('Returned to assets list, reloading...');
        this.loadAssets();
      }
    });
  }

  loadLookupData() {
    this.lookupService.getStatuses().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.statuses = response.data;
          this.cdr.detectChanges();
        }
      },
      error: (error: any) => {
        console.error('Error loading statuses:', error);
      }
    });

    this.lookupService.getLocations().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.locations = response.data;
          this.cdr.detectChanges();
        }
      },
      error: (error: any) => {
        console.error('Error loading locations:', error);
      }
    });
  }

  loadAssets() {
    console.log('Loading assets...');
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const filters = {
      status_id: this.selectedStatus,
      location_id: this.selectedLocation,
      search: this.searchTerm
    };

    this.assetService.getAssets(filters).subscribe({
      next: (response: any) => {
        console.log('Assets response:', response);
        if (response.success && response.data) {
          this.assets = response.data;
          this.filteredAssets = this.assets;
          this.calculateStats();
          console.log(`✓ Loaded ${this.assets.length} assets`);
        } else {
          this.errorMessage = 'No assets found';
          this.assets = [];
          this.filteredAssets = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading assets:', error);
        this.errorMessage = this.getErrorMessage(error);
        this.isLoading = false;
        this.assets = [];
        this.filteredAssets = [];
        this.cdr.detectChanges();
      }
    });
  }

  getErrorMessage(error: any): string {
    if (error.status === 0) {
      return 'Cannot connect to server. Please make sure the backend is running.';
    } else if (error.status === 404) {
      return 'API endpoint not found.';
    } else if (error.status === 500) {
      return 'Server error. Please check the backend logs.';
    } else {
      return `Error: ${error.message || 'Unknown error occurred'}`;
    }
  }

  calculateStats() {
    this.availableCount = this.assets.filter(a => a.status_name === 'Ready to Deploy').length;
    this.deployedCount = this.assets.filter(a => a.status_name === 'Deployed').length;
  }

  onSearch() {
    this.loadAssets();
  }

  onFilterChange() {
    this.loadAssets();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedLocation = '';
    this.loadAssets();
  }

  getStatusClass(statusName: string): string {
    const statusMap: { [key: string]: string } = {
      'Ready to Deploy': 'status-ready',
      'Deployed': 'status-deployed',
      'Broken': 'status-broken',
      'In Repair': 'status-repair',
      'Retired': 'status-retired'
    };
    return statusMap[statusName] || 'status-default';
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect width="60" height="60" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
    }
    return `${this.uploadsUrl}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  calculateWarrantyStatus(warrantyDate: string | undefined): string {
    if (!warrantyDate) return '-';

    const today = new Date();
    const warranty = new Date(warrantyDate);
    const diffTime = warranty.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const monthsAgo = Math.abs(Math.floor(diffDays / 30));
      return `Expired ${monthsAgo} month${monthsAgo !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
    } else {
      const monthsLeft = Math.floor(diffDays / 30);
      return `${monthsLeft} month${monthsLeft !== 1 ? 's' : ''} left`;
    }
  }

  calculateEndOfLife(eolDate: string | undefined): string {
    if (!eolDate) return '-';

    const today = new Date();
    const eol = new Date(eolDate);
    const diffTime = eol.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Expired';
    } else if (diffDays < 30) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
    } else {
      const monthsLeft = Math.floor(diffDays / 30);
      return `About ${monthsLeft} year${monthsLeft > 12 ? 's' : ''} left`;
    }
  }

  deleteAsset(id: number | undefined, event: Event) {
    event.stopPropagation();

    if (!id) return;

    if (confirm('Are you sure you want to delete this asset?')) {
      this.assetService.deleteAsset(id).subscribe({
        next: () => {
          console.log('✓ Asset deleted from list');
          // Reload the assets immediately
          this.loadAssets();
        },
        error: (error: any) => {
          console.error('✗ Error deleting asset:', error);
          alert('Failed to delete asset. Please try again.');
        }
      });
    }
  }
}