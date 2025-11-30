export interface DashboardStats {
    totalAssets: number;
    activeAssets: number;
    availableAssets: number;
    underMaintenance: number;
  }
  
  export interface RecentAsset {
    asset_id: string;
    asset_name: string;
    serial_number: string;
    category_name: string;
    created_at: string;
  }
  
  export interface CategoryCount {
    category_name: string;
    count: number;
  }
  
  export interface DashboardData {
    stats: DashboardStats;
    recentAssets: RecentAsset[];
    categories: CategoryCount[];
  }