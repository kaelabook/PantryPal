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

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
  }

  toggleSignupForm() {
    this.showSignupForm = !this.showSignupForm;
  }
}
