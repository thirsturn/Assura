import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetService } from '../../services/asset.service';
import { LookupService } from '../../services/lookup.service';
import { LookupItem } from '../../models/lookup';

@Component({
  selector: 'app-asset-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './asset-form.component.html',
  styleUrls: ['./asset-form.component.css']
})
export class AssetFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private assetService = inject(AssetService);
  private lookupService = inject(LookupService);
  private router = inject(Router);

  assetForm!: FormGroup;
  products: LookupItem[] = [];
  statuses: LookupItem[] = [];
  locations: LookupItem[] = [];
  departments: LookupItem[] = [];
  suppliers: LookupItem[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isSubmitting = false;
  showSuccessMessage = false;

  ngOnInit() {
    this.initForm();
    this.loadLookupData();
  }

  initForm() {
    this.assetForm = this.fb.group({
      asset_id: ['', Validators.required],
      product_id: ['', Validators.required],
      status_id: ['', Validators.required],
      supplier_id: [''],
      location_id: [''],
      department_id: [''],
      asset_name: [''],
      serial_number: [''],
      warranty_expiration_date: [''],
      order_number: [''],
      purchase_date: [''],
      purchase_cost: [''],
      currency: ['USD'],
      schedule_audit: [''],
      notes: ['']
    });
  }

  loadLookupData() {
    this.lookupService.getProducts().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.products = response.data;
        }
      },
      error: (error) => console.error('Error loading products:', error)
    });

    this.lookupService.getStatuses().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.statuses = response.data;
        }
      },
      error: (error) => console.error('Error loading statuses:', error)
    });

    this.lookupService.getLocations().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.locations = response.data;
        }
      },
      error: (error) => console.error('Error loading locations:', error)
    });

    this.lookupService.getDepartments().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.departments = response.data;
        }
      },
      error: (error) => console.error('Error loading departments:', error)
    });

    this.lookupService.getSuppliers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.suppliers = response.data;
        }
      },
      error: (error) => console.error('Error loading suppliers:', error)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.assetForm.invalid) {
      this.assetForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    
    Object.keys(this.assetForm.value).forEach(key => {
      const value = this.assetForm.value[key];
      if (value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.assetService.createAsset(formData).subscribe({
      next: (response) => {
        console.log('Asset created:', response);
        this.showSuccessMessage = true;
        
        setTimeout(() => {
          if (response.data?.id) {
            this.router.navigate(['/assets', response.data.id]);
          }
        }, 1500);
      },
      error: (error) => {
        console.error('Error creating asset:', error);
        alert('Error creating asset. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  resetForm() {
    this.assetForm.reset({ currency: 'USD' });
    this.selectedFile = null;
    this.imagePreview = null;
  }
}