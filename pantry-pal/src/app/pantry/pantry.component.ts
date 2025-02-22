import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-pantry',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './pantry.component.html',
  styleUrl: './pantry.component.css'
})
export class PantryComponent {

}
