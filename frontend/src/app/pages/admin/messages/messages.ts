
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { UserService } from '../../../core/services/user.service';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.html',
    styleUrl: './messages.css',
    imports: [CommonModule, FormsModule],
    standalone: true
})

export class MsgComponent implements OnInit {
    currentTab: 'inbox' | 'sent' = 'inbox';
    messages: any[] = []; // Empty for now to show empty state
    isComposeOpen = false;

    // Autocomplete properties
    searchTerm = '';
    showSuggestions = false;
    filteredUsers: any[] = [];
    private searchTerms = new Subject<string>();

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.searchTerms.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((term: string) => {
                if (!term.trim()) {
                    return of([]);
                }
                return this.userService.searchUsers(term);
            })
        ).subscribe(users => {
            this.filteredUsers = users;
            this.showSuggestions = true;
        });
    }

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
        this.searchTerms.next(this.searchTerm);
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
