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
	
=======
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pantry',
  standalone: true,
  imports: [NavbarComponent, NgIf, NgFor, FormsModule],
  templateUrl: './pantry.component.html',
  styleUrls: ['./pantry.component.css']
})
export class PantryComponent {
  showIngredientForm = false;
  isEditing = false;
  currentIngredient = { name: '', category: '', quantity: 1, unit: '' };
  
  // All ingredients in the pantry
  allIngredients = [
    { name: 'Apple', category: 'fruits', quantity: 10, unit: 'pieces' },
    { name: 'Tomato', category: 'vegetables', quantity: 5, unit: 'pieces' },
    { name: 'Rice', category: 'grains', quantity: 2, unit: 'kg' },
    { name: 'Chicken', category: 'protein', quantity: 1, unit: 'kg' },
    { name: 'Milk', category: 'dairy', quantity: 1, unit: 'liter' },
    { name: 'Banana', category: 'fruits', quantity: 6, unit: 'pieces' },
    { name: 'Carrot', category: 'vegetables', quantity: 4, unit: 'pieces' },
    { name: 'Cucumber', category: 'vegetables', quantity: 3, unit: 'pieces' },
    { name: 'Lettuce', category: 'vegetables', quantity: 1, unit: 'head' },
    { name: 'Spinach', category: 'vegetables', quantity: 2, unit: 'bunches' },
    { name: 'Eggplant', category: 'vegetables', quantity: 2, unit: 'pieces' },
    { name: 'Potato', category: 'vegetables', quantity: 10, unit: 'pieces' },
    { name: 'Onion', category: 'vegetables', quantity: 5, unit: 'pieces' },
    { name: 'Garlic', category: 'vegetables', quantity: 2, unit: 'heads' },
    { name: 'Olive Oil', category: 'seasonings', quantity: 1, unit: 'liter' },
    { name: 'Soy Sauce', category: 'seasonings', quantity: 1, unit: 'liter' },
    { name: 'Sugar', category: 'misc', quantity: 2, unit: 'kg' },
    { name: 'Flour', category: 'misc', quantity: 3, unit: 'kg' },
    { name: 'Salt', category: 'seasonings', quantity: 1, unit: 'kg' },
    { name: 'Pepper', category: 'seasonings', quantity: 1, unit: 'kg' },
    { name: 'Chili', category: 'seasonings', quantity: 50, unit: 'grams' },
    { name: 'Oregano', category: 'seasonings', quantity: 1, unit: 'bag' },
    { name: 'Basil', category: 'seasonings', quantity: 1, unit: 'bunch' },
    { name: 'Chicken Broth', category: 'misc', quantity: 2, unit: 'liters' },
    { name: 'Beef', category: 'protein', quantity: 1, unit: 'kg' },
    { name: 'Pork', category: 'protein', quantity: 1, unit: 'kg' },
    { name: 'Fish', category: 'protein', quantity: 1, unit: 'kg' },
    { name: 'Butter', category: 'dairy', quantity: 500, unit: 'grams' },
    { name: 'Cheese', category: 'dairy', quantity: 1, unit: 'kg' },
    { name: 'Yogurt', category: 'dairy', quantity: 1, unit: 'liter' },
    { name: 'Juice', category: 'misc', quantity: 2, unit: 'liters' },
  ];

  // Variables for search and filter functionality
  searchQuery = '';
  selectedCategory = '';
  filteredIngredients = [...this.allIngredients];

  toggleIngredientForm() {
    this.showIngredientForm = !this.showIngredientForm;
    if (!this.showIngredientForm) {
      this.resetForm();
    }
  }

  saveIngredient() {
    if (this.isEditing) {
      const index = this.allIngredients.findIndex(ingredient => ingredient.name === this.currentIngredient.name);
      if (index !== -1) {
        this.allIngredients[index] = this.currentIngredient;
      }
    } else {
      this.allIngredients.push({ ...this.currentIngredient });
    }
    this.toggleIngredientForm();
  }

  editIngredient(index: number) {
    this.isEditing = true;
    this.currentIngredient = { ...this.allIngredients[index] };
    this.showIngredientForm = true;
  }

  removeIngredient(index: number) {
    this.allIngredients.splice(index, 1);
  }

  resetForm() {
    this.isEditing = false;
    this.currentIngredient = { name: '', category: '', quantity: 1, unit: '' };
  }

  // Apply search filter based on the search query
  applySearchFilter() {
    this.filteredIngredients = this.allIngredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Apply category filter based on selected category
  applyFilter() {
    this.filteredIngredients = this.allIngredients.filter(ingredient =>
      (this.selectedCategory ? ingredient.category === this.selectedCategory : true) &&
      (this.searchQuery ? ingredient.name.toLowerCase().includes(this.searchQuery.toLowerCase()) : true)
    );
  }
}
