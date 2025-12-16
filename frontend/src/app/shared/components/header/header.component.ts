import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Output() toggleSidebar = new EventEmitter<void>();

    onToggleSidebar() {
        this.toggleSidebar.emit();
    }
}
