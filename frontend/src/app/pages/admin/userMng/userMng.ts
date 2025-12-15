import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserService } from "../../../core/services/user.service";

@Component({
    selector: 'app-user-mng',
    imports: [CommonModule, FormsModule],
    templateUrl: './userMng.html',
    styleUrl: '../allAssets/allAssets.css',
    standalone: true
})

export class UserMngComponent implements OnInit {
    users: any[] = [];
    isEditModalOpen = false;
    selectedUser: any = {};

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers() {
        this.userService.getAllUsers().subscribe({
            next: (data) => {
                this.users = data;
            },
            error: (error) => {
                console.error('Error fetching users:', error);
            }
        });
    }

    openEditModal(user: any) {
        this.selectedUser = { ...user }; // Create a copy
        this.isEditModalOpen = true;
    }

    closeEditModal() {
        this.isEditModalOpen = false;
        this.selectedUser = {};
    }

    saveUser() {
        this.userService.updateUser(this.selectedUser.userID, this.selectedUser).subscribe({
            next: () => {
                this.loadUsers(); // Refresh list
                this.closeEditModal();
            },
            error: (error) => {
                console.error('Error updating user:', error);
            }
        });
    }
}