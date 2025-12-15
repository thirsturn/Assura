export interface LookupItem {
    id: number;
    name: string;
    description?: string;
    color?: string;
    manufacturer?: string;
    address?: string;
    city?: string;
    country?: string;
    contact_person?: string;
    email?: string;
    phone?: string;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    count?: number;
    message?: string;
    error?: string;
  }