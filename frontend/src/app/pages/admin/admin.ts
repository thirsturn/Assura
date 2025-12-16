import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from '../../shared/components';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, RouterOutlet, MainLayoutComponent],
    templateUrl: './admin.html',
    styleUrl: './admin.css'
})
export class AdminComponent {
    // Logic moved to MainLayoutComponent
}