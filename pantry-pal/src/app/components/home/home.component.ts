import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent,],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showLoginForm = false;
  showSignupForm = false;

  // Toggle the Login form visibility
  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
  }

  // Toggle the Signup form visibility
  toggleSignupForm() {
    this.showSignupForm = !this.showSignupForm;
  }
}
