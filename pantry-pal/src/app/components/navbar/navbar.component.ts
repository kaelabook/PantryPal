import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  isLoggedIn = false;  // Simulate if the user is logged in
  username = 'JohnDoe'; // Hardcoded username, replace with actual user data later

  // Simulate login or logout for testing purposes
  toggleLoginStatus() {
    this.isLoggedIn = !this.isLoggedIn;
    this.username = this.isLoggedIn ? 'JohnDoe' : '';  // Reset username if logged out
  }
}
