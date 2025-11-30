import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { DashboardData } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api/dashboard';
  
  // Toggle between mock and real API
  private useMockData = true; // Set to false when backend is ready

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<{ success: boolean; data: DashboardData }> {
    if (this.useMockData) {
      return this.getMockData();
    }
    return this.http.get<{ success: boolean; data: DashboardData }>(this.apiUrl);
  }

  // Mock data for testing
  private getMockData(): Observable<{ success: boolean; data: DashboardData }> {
    const mockData = {
      success: true,
      data: {
        stats: {
          totalAssets: 245,
          activeAssets: 182,
          availableAssets: 45,
          underMaintenance: 18
        },
        recentAssets: [
          {
            asset_id: 'AST-2024-001',
            asset_name: 'Dell Laptop XPS 15',
            serial_number: 'DL-2024-001',
            category_name: 'IT Equipment',
            created_at: new Date().toISOString()
          },
          {
            asset_id: 'AST-2024-002',
            asset_name: 'Office Chair Ergonomic',
            serial_number: 'OC-2024-002',
            category_name: 'Furniture',
            created_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            asset_id: 'AST-2024-003',
            asset_name: 'HP Printer LaserJet',
            serial_number: 'HP-2024-003',
            category_name: 'Office Equipment',
            created_at: new Date(Date.now() - 172800000).toISOString()
          },
          {
            asset_id: 'AST-2024-004',
            asset_name: 'MacBook Pro 16"',
            serial_number: 'MB-2024-004',
            category_name: 'IT Equipment',
            created_at: new Date(Date.now() - 259200000).toISOString()
          },
          {
            asset_id: 'AST-2024-005',
            asset_name: 'Conference Table',
            serial_number: 'CT-2024-005',
            category_name: 'Furniture',
            created_at: new Date(Date.now() - 345600000).toISOString()
          }
        ],
        categories: [
          { category_name: 'IT Equipment', count: 110 },
          { category_name: 'Furniture', count: 65 },
          { category_name: 'Office Equipment', count: 40 },
          { category_name: 'Vehicles', count: 20 },
          { category_name: 'Machinery', count: 10 }
        ]
      }
    };

    // Simulate API delay
    return of(mockData).pipe(delay(1000));
  }
}