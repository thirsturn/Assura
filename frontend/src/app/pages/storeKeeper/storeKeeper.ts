import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar';

@Component({
    selector: 'app-store-keeper',
    standalone: true,
    imports: [CommonModule, RouterModule, NavbarComponent],
    templateUrl: './storeKeeper.html',
    styleUrls: ['./storeKeeper.css']
})
export class StoreKeeperComponent {
    isSidebarCollapsed = false;

    onSidebarToggle(collapsed: boolean) {
        this.isSidebarCollapsed = collapsed;
    }
}
