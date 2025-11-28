import { Component } from '@angular/core';
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
export class AdminComponent {
    isSidebarOpen = false;

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    closeSidebar() {
        this.isSidebarOpen = false;
    }

    isProfileDropdownOpen = false;

    toggleProfileDropdown() {
        this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    }
}