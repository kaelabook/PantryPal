import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
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
