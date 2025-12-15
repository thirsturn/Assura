import { Component, OnInit, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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

    constructor(private authService: AuthService) {
        // Effect to update local state when auth service state changes
        effect(() => {
            const user = this.authService.getCurrentUser();
            if (user) {
                this.adminName = user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username || 'Admin';
                this.adminRole = user.role || 'Admin';
                // this.adminProfilePicture = user.profilePicture || ''; 
            }
        });
    }

    ngOnInit(): void {
        // Initial load handled by effect
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