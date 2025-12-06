
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.html',
    styleUrl: './messages.css',
    imports: [CommonModule, FormsModule],
    standalone: true
})

export class MsgComponent {
    currentTab: 'inbox' | 'sent' = 'inbox';
    messages: any[] = []; // Empty for now to show empty state
    isComposeOpen = false;

    // Autocomplete properties
    searchTerm = '';
    showSuggestions = false;
    filteredUsers: any[] = [];

    // Mock users data
    allUsers = [
        { id: 1, name: 'John Admin', username: 'admin', role: 'Admin' },
        { id: 2, name: 'Sarah User', username: 'sarah.user', role: 'User' },
        { id: 3, name: 'Mike Manager', username: 'mike.manager', role: 'Manager' },
        { id: 4, name: 'Emily Tech', username: 'emily.tech', role: 'Technician' },
        { id: 5, name: 'David Support', username: 'david.support', role: 'Support' }
    ];

    switchTab(tab: 'inbox' | 'sent') {
        this.currentTab = tab;
    }

    composeMessage() {
        this.isComposeOpen = true;
        this.searchTerm = '';
        this.filteredUsers = [];
    }

    closeCompose() {
        this.isComposeOpen = false;
        this.showSuggestions = false;
    }

    sendMessage() {
        console.log('Message sent to:', this.searchTerm);
        this.closeCompose();
        // TODO: Implement actual send logic
    }

    // Autocomplete methods
    filterUsers() {
        if (!this.searchTerm) {
            this.filteredUsers = [];
            return;
        }
        const term = this.searchTerm.toLowerCase();
        this.filteredUsers = this.allUsers.filter(user =>
            user.name.toLowerCase().includes(term) ||
            user.username.toLowerCase().includes(term)
        );
    }

    selectUser(user: any) {
        this.searchTerm = user.username;
        this.showSuggestions = false;
    }

    hideSuggestions() {
        // Small delay to allow click event on suggestion to fire
        setTimeout(() => {
            this.showSuggestions = false;
        }, 200);
    }
}
