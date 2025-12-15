import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { Asset } from '../models/asset';
import { ApiResponse } from '../models/lookup';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/assets`;

  constructor() {
    console.log('AssetService initialized with API URL:', this.apiUrl);
  }

  createAsset(assetData: FormData): Observable<ApiResponse<Asset>> {
    console.log('Creating asset...');
    return this.http.post<ApiResponse<Asset>>(this.apiUrl, assetData).pipe(
      tap(response => console.log('Asset created:', response)),
      catchError(error => {
        console.error('Error creating asset:', error);
        throw error;
      })
    );
  }

  getAssets(filters?: any): Observable<ApiResponse<Asset[]>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key].toString());
        }
      });
    }
    console.log('Fetching assets with URL:', this.apiUrl);
    return this.http.get<ApiResponse<Asset[]>>(this.apiUrl, { params }).pipe(
      tap(response => console.log('Assets fetched:', response)),
      catchError(error => {
        console.error('Error fetching assets:', error);
        throw error;
      })
    );
  }

  getAssetById(id: number): Observable<ApiResponse<Asset>> {
    console.log('Fetching asset by ID:', id);
    return this.http.get<ApiResponse<Asset>>(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log('Asset fetched:', response)),
      catchError(error => {
        console.error('Error fetching asset:', error);
        throw error;
      })
    );
  }

  updateAsset(id: number, assetData: FormData): Observable<ApiResponse<Asset>> {
    return this.http.put<ApiResponse<Asset>>(`${this.apiUrl}/${id}`, assetData);
  }

  deleteAsset(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/stats`);
  }
}