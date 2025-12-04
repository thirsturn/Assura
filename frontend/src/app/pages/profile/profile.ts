import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'profile',
    templateUrl: './profile.html',
    styleUrl: './profile.css',
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

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.loadUserData();
    }

    loadUserData(): void {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            this.user = {
                userID: parsedUser.userID || 0,
                username: parsedUser.username || '',
                firstName: parsedUser.firstName || '',
                lastName: parsedUser.lastName || '',
                profilePicture: parsedUser.profilePicture || '',
                roleName: parsedUser.roleName || parsedUser.role || '',
                divisionName: parsedUser.divisionName || parsedUser.division || '',
                isBlocked: parsedUser.isBlocked || false,
                isOnline: parsedUser.isOnline || false,
                createdAt: parsedUser.createdAt || '',
                lastLogin: parsedUser.lastLogin || ''
            };
            this.previewImage = this.user.profilePicture;
        }
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file');
                return;
            }

            // Validate file size (max 5MB)
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
        // Validate required fields
        if (!this.user.firstName || !this.user.lastName) {
            alert('First Name and Last Name are required');
            return;
        }

        this.isSaving = true;

        // TODO: Replace with actual API call to backend
        // Example: this.http.put(`/api/users/${this.user.userID}/profile`, {
        //     firstName: this.user.firstName,
        //     lastName: this.user.lastName,
        //     profilePicture: this.previewImage
        // })

        setTimeout(() => {
            const userData = localStorage.getItem('user');
            if (userData) {
                const currentUser = JSON.parse(userData);
                const updatedUser = {
                    ...currentUser,
                    firstName: this.user.firstName,
                    lastName: this.user.lastName,
                    profilePicture: this.previewImage || ''
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            this.isSaving = false;
            this.isEditing = false;
            alert('Profile updated successfully!');
            
            // Reload to reflect changes in header
            window.location.reload();
        }, 1000);
    }
}