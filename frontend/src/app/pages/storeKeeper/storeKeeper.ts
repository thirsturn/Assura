import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from '../../shared/components';

@Component({
    selector: 'app-store-keeper',
    standalone: true,
    imports: [CommonModule, RouterOutlet, MainLayoutComponent],
    templateUrl: './storeKeeper.html',
    styleUrls: ['./storeKeeper.css']
})
export class StoreKeeperComponent {
    // Logic moved to MainLayoutComponent
}
