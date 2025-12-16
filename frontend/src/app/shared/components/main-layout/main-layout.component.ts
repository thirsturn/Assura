import { Component, Input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, SidebarComponent, HeaderComponent],
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
    @Input() title: string = '';
    @Input() subtitle: string = '';
    isSidebarOpen = false;

    // User info to pass to sidebar
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

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    closeSidebar() {
        this.isSidebarOpen = false;
    }
}
