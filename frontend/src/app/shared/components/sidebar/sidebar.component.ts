import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
    @Input() isOpen = false;
    @Input() role: string = 'Admin';
    @Input() userName: string = 'Admin';
    @Input() userProfilePicture: string = '';

    @Output() closeSidebar = new EventEmitter<void>();

    isProfileDropdownOpen = false;

    toggleProfileDropdown() {
        this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    }
}
