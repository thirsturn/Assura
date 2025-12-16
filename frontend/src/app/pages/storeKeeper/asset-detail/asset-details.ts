import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AssetService } from '../../../services/asset.service';
import { Asset } from '../../../models/asset';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-asset-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'asset-detail.html',
  styleUrls: ['asset-details.css']
})
export class AssetDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private assetService = inject(AssetService);
  private cdr = inject(ChangeDetectorRef);

  asset: Asset | null = null;
  isLoading = true;
  errorMessage = '';
  uploadsUrl = environment.uploadsUrl;
  private subscription?: Subscription;
  private isDeleting = false;

  ngOnInit() {
    console.log('=== Asset Detail Component Initialized ===');

    // Subscribe to route params changes
    this.subscription = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        console.log('Loading asset with ID:', id);

        if (!id) {
          throw new Error('No asset ID provided');
        }

        this.isLoading = true;
        this.asset = null;
        this.errorMessage = '';
        this.cdr.detectChanges();

        return this.assetService.getAssetById(parseInt(id));
      })
    ).subscribe({
      next: (response: any) => {
        console.log('=== Asset Loaded Successfully ===');

        if (response.success && response.data) {
          this.asset = response.data;
          console.log('✓ Asset:', this.asset?.asset_id);
          console.log('✓ QR Path:', (this.asset as any)?.qr_code_path);
        } else {
          this.errorMessage = 'Asset not found';
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('=== Error Loading Asset ===', error);
        this.errorMessage = 'Failed to load asset. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();

        // Navigate back to list after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/assets']);
        }, 2000);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
    }
    return `${this.uploadsUrl}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
  }

  getQRCodeUrl(qrPath: string | undefined): string {
    if (!qrPath) return '';
    return `${this.uploadsUrl}${qrPath.startsWith('/') ? qrPath : '/' + qrPath}`;
  }

  getStatusClass(statusName: string | undefined): string {
    const statusMap: { [key: string]: string } = {
      'Ready to Deploy': 'status-ready',
      'Deployed': 'status-deployed',
      'Broken': 'status-broken',
      'In Repair': 'status-repair',
      'Retired': 'status-retired'
    };
    return statusMap[statusName || ''] || 'status-default';
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  printQRCode() {
    if (!this.asset?.qr_code_path) {
      this.showMessage('No QR code available to print');
      return;
    }
    window.print();
  }

  deleteAsset() {
    if (!this.asset?.id || this.isDeleting) return;

    // Use custom confirmation instead of browser alert
    const assetId = this.asset.asset_id;
    const confirmed = confirm(`Are you sure you want to delete asset ${assetId}?`);

    if (!confirmed) return;

    this.isDeleting = true;
    this.isLoading = true;
    this.cdr.detectChanges();

    console.log('Deleting asset:', this.asset.id);

    this.assetService.deleteAsset(this.asset.id).subscribe({
      next: () => {
        console.log('✓ Asset deleted successfully');
        this.isDeleting = false;

        // Navigate immediately, don't show alert
        this.router.navigate(['/assets']).then(() => {
          console.log('✓ Navigated to assets list');
        });
      },
      error: (error: any) => {
        console.error('✗ Error deleting asset:', error);
        this.isDeleting = false;
        this.isLoading = false;
        this.errorMessage = 'Failed to delete asset. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  cloneAsset() {
    if (!this.asset) return;
    this.router.navigate(['/assets/new'], {
      state: { cloneData: this.asset }
    });
  }

  private showMessage(message: string) {
    // Simple non-blocking message - you can enhance this with a toast library later
    console.log(message);
  }
}