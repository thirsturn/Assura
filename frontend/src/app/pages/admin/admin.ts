import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [DashboardComponent, CommonModule, RouterLink, RouterOutlet],
    templateUrl: './admin.html',
    styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {
    isSidebarOpen = false;
    isProfileDropdownOpen = false;
    adminName: string = 'Admin';
    adminRole: string = 'Admin';
    adminProfilePicture: string = '';

    constructor() { }

    ngOnInit(): void {
        this.loadAdminInfo();

        // listen for storage changes (e.g., profile update)
        window.addEventListener('storage', this.onStorageChange.bind(this));
    }

    ngOnDestroy(): void {
        window.removeEventListener('storage', this.onStorageChange.bind(this));
    }

    onStorageChange(event: StorageEvent): void{
        if (event.key === 'user') {
            this.loadAdminInfo();
        }
    }

    @HostListener('window:focus', [])
    onWindowFocus() {
        this.loadAdminInfo();
    }

    loadAdminInfo(): void {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            this.adminName = user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.name || user.username || 'Admin';
            this.adminRole = user.role || 'Admin';
            this.adminProfilePicture = user.profilePicture || '';
        }
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    closeSidebar() {
        this.isSidebarOpen = false;
    }

    toggleProfileDropdown() {
        this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    }
}