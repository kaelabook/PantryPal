import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { NgIf, NgFor, CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  	selector: 'app-pantry',
  	standalone: true,
  	templateUrl: './pantry.component.html',
  	styleUrl: './pantry.component.css',
	imports: [NavbarComponent, NgIf, NgFor, FormsModule, CommonModule],
})

export class PantryComponent {
	showPopup = false;
	//switch between showing and closing the popup for adding an ingredient
	toggleFoodForm() {
		if (this.showPopup == true){
			this.showPopup = false;
		} else{
			this.showPopup = true;
		}
	}

	get categories(): string[] {
		return Object.keys(this.groupedPantry);
	}	  

	//store possible ingredients to choose from
	ingredientList: any[] = [];
	//store added ingredients
	groupedPantry: { [key:string]: any[] } = {
		fruits: [],
		vegetables: [],
		grains: [],
		protein: [],
		dairy: [],
		seasoning: [],
		misc: []
	};
	newIngredient = {name: '', type: '', unit: '', quantity: 1};
	
	ngOnInit(): void {
		this.loadIngredients();
	}

	async loadIngredients(): Promise<void>{
		try{
			const response = await fetch('assets/ingredients.json');
			if (!response.ok) throw new Error('Failed to load ingredients.json');
			
			const data = await response.json();
			console.log('Loaded Ingredients:', data); // Debugging output
			this.ingredientList = data.ingredients;

			if (!this.ingredientList || this.ingredientList.length === 0) {
				console.warn('No ingredients found');
			}
		} catch (error) {
			console.error('Error loading ingredients:', error);
		}
	}

	updateIngredientDetails(): void{
		const selectedIngredient = this.ingredientList.find(i => i.name === this.newIngredient.name)
		if (selectedIngredient){
			this.newIngredient.type = selectedIngredient.type;
			this.newIngredient.unit = selectedIngredient.defaultUnit;
		}
	}

	addIngredient() {
		if (this.newIngredient.name && this.newIngredient.quantity > 0) {

			const ingredientToAdd = { ...this.newIngredient };			
			if(!this.groupedPantry[ingredientToAdd.type]){
				this.groupedPantry[ingredientToAdd.type] = [];
			}

			//add the new ingredient to the specified section
			this.groupedPantry[ingredientToAdd.type].push(ingredientToAdd)
			
			//reset newIngredient for next input
			this.newIngredient = { name: '', type: '', unit: '', quantity: 1};
			this.showPopup = false;
		}
	}	
}
