import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [NavbarComponent, NgIf, NgFor, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  showItemForm = false;
  isEditing = false;
  currentItem = { name: '', quantity: 1, unit: '' };
  
  // All ingredients added to the web app (the pantry)
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

  // Current shopping cart (items that need to be purchased)
  shoppingCart = [
    { name: 'Apple', quantity: 2, unit: 'pieces' },
    { name: 'Tomato', quantity: 1, unit: 'pieces' },
  ];

  // Variables for search and filter functionality
  searchQuery = '';
  selectedCategory = '';
  filteredIngredients = [...this.allIngredients];

  toggleItemForm() {
    this.showItemForm = !this.showItemForm;
    if (!this.showItemForm) {
      this.resetForm();
    }
  }

  saveItem() {
    if (this.isEditing) {
      const index = this.shoppingCart.findIndex(item => item.name === this.currentItem.name);
      if (index !== -1) {
        this.shoppingCart[index] = this.currentItem;
      }
    } else {
      this.shoppingCart.push({ ...this.currentItem });
    }
    this.toggleItemForm();
  }

  editItem(index: number) {
    this.isEditing = true;
    this.currentItem = { ...this.shoppingCart[index] };
    this.showItemForm = true;
  }

  removeItem(index: number) {
    this.shoppingCart.splice(index, 1);
  }

  // Add an ingredient to the shopping cart
  addToCart(index: number) {
    const ingredient = this.allIngredients[index];
    // Check if the ingredient is already in the shopping cart
    const existingItemIndex = this.shoppingCart.findIndex(item => item.name === ingredient.name);
    if (existingItemIndex !== -1) {
      // If it exists, update the quantity
      this.shoppingCart[existingItemIndex].quantity += ingredient.quantity;
    } else {
      // If it's not in the cart, add it
      this.shoppingCart.push({ ...ingredient });
    }
  }

  // Handle checkout (clear the shopping cart)
  checkout() {
    console.log('Checking out:', this.shoppingCart);
    // Clear the shopping cart
    this.shoppingCart = [];
  }

  resetForm() {
    this.isEditing = false;
    this.currentItem = { name: '', quantity: 1, unit: '' };
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
