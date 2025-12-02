import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,            // <-- 1. Add this
  imports: [ CommonModule, FormsModule ],                 // <-- 2. Add this
  templateUrl: './login.html', // <-- 3. Fix file path
  styleUrl: './login.css'      // <-- 4. Fix file path
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService) {}

  onLogin(): void{
    if (!this.username || !this.password) {
      this.error = 'Please enter username or password';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.login(this.username, this.password).subscribe({
      next: () => this.loading = false,
      error: (err: HttpErrorResponse) => {
        this.error = err.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}