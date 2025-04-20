import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { NavbarComponent } from '../navbar/navbar.component';  // Import NavbarComponent

@Component({
  selector: 'app-home',
  standalone: true,  // Keep this for standalone component
  imports: [CommonModule, NavbarComponent,],  // Import CommonModule and NavbarComponent
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
