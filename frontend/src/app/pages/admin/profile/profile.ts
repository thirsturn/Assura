import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'profile',
    templateUrl: './profile.html',
    styleUrls: ['./profile.css'],
    imports: [CommonModule, FormsModule],
    standalone: true
})
export class ProfileComponent implements OnInit {
    user = {
        userID: 0,
        username: '',
        firstName: '',
        lastName: '',
        profilePicture: '',
        roleName: '',
        divisionName: '',
        isBlocked: false,
        isOnline: false,
        createdAt: '',
        lastLogin: ''
    };

    previewImage: string | null = null;
    selectedFile: File | null = null;
    isEditing = false;
    isSaving = false;
    isLoading = false;
    private apiUrl = 'http://localhost:3000/api/users';

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        console.log('Profile component initialized');
        this.loadUserData();
    }

    loadUserData(): void {
        this.isLoading = true;

        const token = this.authService.getToken();
        if (!token) {
            console.error('No token found');
            this.router.navigate(['/login']);
            return;
        }

        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        this.http.get<any>(`${this.apiUrl}/profile`, { headers }).subscribe({
            next: (userData) => {
                this.user = {
                    userID: userData.userID,
                    username: userData.username,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    profilePicture: userData.profilePicture || '',
                    roleName: userData.roleName,
                    divisionName: userData.divisionName,
                    isBlocked: !!userData.isBlocked,
                    isOnline: !!userData.isOnline,
                    createdAt: userData.createdAt,
                    lastLogin: userData.lastLogin
                };
                this.previewImage = this.user.profilePicture || null;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error fetching user profile:', error);
                this.isLoading = false;
                if (error.status === 401) {
                    this.authService.logout();
                }
            }
        });
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.previewImage = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    toggleEdit(): void {
        this.isEditing = !this.isEditing;
        if (!this.isEditing) {
            this.loadUserData();
            this.selectedFile = null;
        }
    }

    saveProfile(): void {
        if (!this.user.firstName || !this.user.lastName) {
            alert('First Name and Last Name are required');
            return;
        }

        this.isSaving = true;
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        const updateData = {
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            profilePicture: this.previewImage
        };

        this.http.put(`${this.apiUrl}/profile`, updateData, { headers }).subscribe({
            next: (response: any) => {
                this.isSaving = false;
                this.isEditing = false;
                alert('Profile updated successfully!');

                // Update AuthService state
                const currentUser = this.authService.getCurrentUser();
                if (currentUser) {
                    const updatedUser = {
                        ...currentUser,
                        firstName: this.user.firstName,
                        lastName: this.user.lastName,
                        // profilePicture: this.previewImage 
                    };
                    this.authService.updateCurrentUser(updatedUser);
                }

                this.loadUserData();
            },
            error: (error) => {
                console.error('Error updating profile:', error);
                this.isSaving = false;
                alert('Failed to update profile. Please try again.');
            }
        });
    }
}