import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { NgIf, NgFor} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  	selector: 'app-pantry',
  	standalone: true,
  	templateUrl: './pantry.component.html',
  	styleUrl: './pantry.component.css',
	imports: [NavbarComponent, NgIf, NgFor, FormsModule]
})

export class PantryComponent {
	showPopup = false;
	newIngredient = { name: '', quantity: 1, unit: '', type: 'misc' };
	ingredients: { [key: string]: { name: string; quantity: number; unit: string }[] } = {
		fruits: [], vegetables: [], grains: [], protein: [], dairy: [], season: [], sub: [], misc: []
	};

	toggleFoodForm() {
		if (this.showPopup == true){
			this.showPopup = false;
		} else{
			this.showPopup = true;
		}
	}
  
	addIngredient() {
		if (this.newIngredient.name.trim() && this.newIngredient.quantity > 0) {
			const ingredientToAdd = { 
		  		name: this.newIngredient.name, 
		  		quantity: this.newIngredient.quantity, 
		  		unit: (this.newIngredient.unit.trim() || '')
			};

			this.ingredients[this.newIngredient.type].push(ingredientToAdd);
			
			this.newIngredient = { name: '', quantity: 1, unit: '', type: 'misc' };
			this.showPopup = false;
		}
	}	
}
