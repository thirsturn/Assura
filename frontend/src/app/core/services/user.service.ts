import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:3000/api/users';

    constructor(private http: HttpClient, private authService: AuthService) { }

    searchUsers(query: string): Observable<any[]> {
        const token = this.authService.getToken();
        return this.http.get<any[]>(`${this.apiUrl}/search?q=${query}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    getAllUsers(): Observable<any[]> {
        const token = this.authService.getToken();
        return this.http.get<any[]>(`${this.apiUrl}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    updateUser(id: number, userData: any): Observable<any> {
        const token = this.authService.getToken();
        return this.http.put<any>(`${this.apiUrl}/${id}`, userData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}