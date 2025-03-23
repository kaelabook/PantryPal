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
	//store possible ingredients to choose from (json)
	allIngredients: any[] = [];
	
	//the user's list of added ingredients
	ingredientList: {name: string; category: string; quantity: number; unit: string }[] = [];
	
	//Variables for search and filter
	searchQuery = '';
	selectedCategory = '';
	filteredIngredients = [...this.ingredientList];

	currentIngredient = {name: '', category: '', unit: '', quantity: 1};
	showIngredientForm = false;
	isEditing = false;
	
	//switch between showing and closing the popup for adding an ingredient
	toggleFoodForm() {
		if (this.showIngredientForm){
			console.log("Closing Form...")
			//reset flags and variables
			this.isEditing = false;
			this.showIngredientForm = false;
			
			this.searchQuery = '';
			this.selectedCategory = '';
			this.filteredIngredients = [...this.ingredientList];
			this.currentIngredient = { name: '', category: '', unit: '', quantity: 1}
		}else {
			console.log("Opening Form...");
			this.showIngredientForm = true;
		}
	}
	
	ngOnInit(): void {
		this.loadIngredients();
	}

	async loadIngredients(): Promise<void>{
		try{
			const response = await fetch('/ingredients.json');
			if (!response.ok) throw new Error('Failed to load ingredients.json');
			
			const data = await response.json();
			console.log('Loaded Ingredients:', data); // Debugging output
			this.allIngredients = data.ingredients;

			if (!this.allIngredients || this.allIngredients.length === 0) {
				//Empty ingredient json
				console.warn('No ingredients found');
			}
		} catch (error) {
			console.error('Error loading ingredients:', error);
		}
	}

	saveIngredient() {
		if (this.isEditing) {
		  const index = this.ingredientList.findIndex(ingredient => ingredient.name === this.currentIngredient.name);
			if (index !== -1) {
				this.ingredientList[index] = this.currentIngredient;
			}
		} else {
		  this.ingredientList.push({ ...this.currentIngredient });
		}
		this.toggleFoodForm();
	}

	updateIngredientDetails(): void{
		const selectedIngredient = this.allIngredients.find(i => i.name === this.currentIngredient.name)
		if (selectedIngredient){
			this.currentIngredient.unit = selectedIngredient.defaultUnit;
			this.currentIngredient.category = selectedIngredient.category;
		}
	}

	editIngredient(index: number){
		this.isEditing = true;
		console.log('Editing ingredient:', this.ingredientList[index]);

		const ingredientToEdit = this.ingredientList[index];

		this.currentIngredient = {
			name: ingredientToEdit.name,
			quantity: ingredientToEdit.quantity,
			unit: ingredientToEdit.unit,
			category: ingredientToEdit.category
		};

		this.toggleFoodForm();
	}

	removeIngredient(index: number){
		this.isEditing = true;
		this.currentIngredient = this.ingredientList[index];
		console.log('Removing ingredient:', this.ingredientList[index]);
		
		this.ingredientList.splice(index, 1);
		
		this.toggleFoodForm();
	}

	applySearchFilter() {
		this.filteredIngredients = this.ingredientList.filter(ingredient =>
		  ingredient.name.toLowerCase().includes(this.searchQuery.toLowerCase())
		);
	}

	// Apply category filter based on selected category
	applyFilter() {
		this.filteredIngredients = this.ingredientList.filter(ingredient =>
			(this.selectedCategory ? ingredient.category === this.selectedCategory : true) &&
			(this.searchQuery ? ingredient.name.toLowerCase().includes(this.searchQuery.toLowerCase()) : true)
		);
	}
	
}
