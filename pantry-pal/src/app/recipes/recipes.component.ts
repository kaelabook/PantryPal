import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})
export class RecipesComponent {

}
