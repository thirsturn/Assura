import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,            // <-- 1. Add this
  imports: [],                 // <-- 2. Add this
  templateUrl: './login.html', // <-- 3. Fix file path
  styleUrl: './login.css'      // <-- 4. Fix file path
})
export class LoginComponent {

}