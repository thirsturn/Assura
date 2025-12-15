import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { LookupItem, ApiResponse } from '../models/lookup';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() {
    console.log('LookupService initialized with API URL:', this.apiUrl);
  }

  getProducts(): Observable<ApiResponse<LookupItem[]>> {
    console.log('Fetching products from:', `${this.apiUrl}/products`);
    return this.http.get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/products`).pipe(
      tap(response => console.log('Products fetched:', response)),
      catchError(error => {
        console.error('Error fetching products:', error);
        throw error;
      })
    );
  }

  getStatuses(): Observable<ApiResponse<LookupItem[]>> {
    return this.http.get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/statuses`);
  }

  getLocations(): Observable<ApiResponse<LookupItem[]>> {
    return this.http.get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/locations`);
  }

  getDepartments(): Observable<ApiResponse<LookupItem[]>> {
    return this.http.get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/departments`);
  }

  getSuppliers(): Observable<ApiResponse<LookupItem[]>> {
    return this.http.get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/suppliers`);
  }

  createProduct(data: Partial<LookupItem>): Observable<ApiResponse<LookupItem>> {
    return this.http.post<ApiResponse<LookupItem>>(`${this.apiUrl}/products`, data);
  }

  createStatus(data: Partial<LookupItem>): Observable<ApiResponse<LookupItem>> {
    return this.http.post<ApiResponse<LookupItem>>(`${this.apiUrl}/statuses`, data);
  }

  createLocation(data: Partial<LookupItem>): Observable<ApiResponse<LookupItem>> {
    return this.http.post<ApiResponse<LookupItem>>(`${this.apiUrl}/locations`, data);
  }

  createDepartment(data: Partial<LookupItem>): Observable<ApiResponse<LookupItem>> {
    return this.http.post<ApiResponse<LookupItem>>(`${this.apiUrl}/departments`, data);
  }

  createSupplier(data: Partial<LookupItem>): Observable<ApiResponse<LookupItem>> {
    return this.http.post<ApiResponse<LookupItem>>(`${this.apiUrl}/suppliers`, data);
  }
}