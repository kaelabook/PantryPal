import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [NavbarComponent, FormsModule, NgFor, NgIf],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  searchQuery: string = ''; // Search query for the ingredients list
  selectedCategory: string = ''; // Selected category filter for the ingredients list
  cartSearchQuery: string = ''; // Search query for the shopping cart
  selectedCartCategory: string = ''; // Selected category filter for the shopping cart

  showItemForm: boolean = false; // Tracks the visibility of the item form
  isEditing: boolean = false; // Tracks whether we're editing or adding an item
  currentItem: Ingredient = { name: '', quantity: 0, unit: '', category: '' };

  // Sample ingredients data (added more items for both the left and right boxes)
  ingredients: Ingredient[] = [
    { name: 'Apple', quantity: 5, unit: 'pcs', category: 'fruits' },
    { name: 'Carrot', quantity: 3, unit: 'pcs', category: 'vegetables' },
    { name: 'Rice', quantity: 2, unit: 'kg', category: 'grains' },
    { name: 'Chicken Breast', quantity: 1, unit: 'kg', category: 'protein' },
    { name: 'Milk', quantity: 2, unit: 'L', category: 'dairy' },
    { name: 'Salt', quantity: 1, unit: 'packet', category: 'seasonings' },
    { name: 'Banana', quantity: 6, unit: 'pcs', category: 'fruits' },
    { name: 'Broccoli', quantity: 2, unit: 'pcs', category: 'vegetables' },
    { name: 'Olive Oil', quantity: 1, unit: 'L', category: 'seasonings' },
    { name: 'Beef', quantity: 3, unit: 'kg', category: 'protein' },
    { name: 'Cheese', quantity: 1, unit: 'kg', category: 'dairy' },
    { name: 'Oats', quantity: 1, unit: 'kg', category: 'grains' }
  ];

  // Shopping cart items (add more items for the cart too)
  shoppingCart: Ingredient[] = [
    { name: 'Apple', quantity: 3, unit: 'pcs', category: 'fruits' },
    { name: 'Chicken Breast', quantity: 1, unit: 'kg', category: 'protein' }
  ];

  // Filtered ingredients based on search and category
  get filteredIngredients(): Ingredient[] {
    return this.ingredients.filter(ingredient =>
      (this.selectedCategory === '' || ingredient.category === this.selectedCategory) &&
      ingredient.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Filtered items in the shopping cart based on search and category
  get filteredCartItems(): Ingredient[] {
    return this.shoppingCart.filter(item =>
      (this.selectedCartCategory === '' || item.category === this.selectedCartCategory) &&
      item.name.toLowerCase().includes(this.cartSearchQuery.toLowerCase())
    );
  }

  // Add an ingredient to the shopping cart
  addToCart(index: number) {
    const item = this.ingredients[index];
    this.shoppingCart.push({ ...item });
  }

  // Remove an item from the shopping cart
  removeItem(index: number) {
    this.shoppingCart.splice(index, 1);
  }

  // Edit an item in the shopping cart (you can expand this functionality)
  editItem(index: number) {
    const item = this.shoppingCart[index];
    this.isEditing = true;
    this.currentItem = { ...item };
    this.showItemForm = true; // Show the form when editing
  }

  // Checkout function (currently logs the cart and clears it)
  checkout() {
    console.log('Checking out:', this.shoppingCart);
    this.shoppingCart = [];
  }

  // Toggle the form for adding/editing items
  toggleItemForm() {
    this.showItemForm = !this.showItemForm;
    this.isEditing = false; // Reset editing flag when toggling off the form
    this.currentItem = { name: '', quantity: 0, unit: '', category: '' }; // Reset current item
  }

  // Apply search filter to ingredients
  applySearchFilter() {
    // Automatically updates filteredIngredients based on searchQuery
  }

  // Apply category filter to ingredients
  applyFilter() {
    // Automatically updates filteredIngredients based on selectedCategory
  }

  // Apply search filter to shopping cart
  applyCartSearchFilter() {
    // Automatically updates filteredCartItems based on cartSearchQuery
  }

  // Apply category filter to shopping cart
  applyCartFilter() {
    // Automatically updates filteredCartItems based on selectedCartCategory
  }

  // Save the item (either adding or editing)
  saveItem() {
    if (this.isEditing) {
      // Update the item in the shopping cart
      const index = this.shoppingCart.findIndex(item => item.name === this.currentItem.name);
      if (index !== -1) {
        this.shoppingCart[index] = { ...this.currentItem };
      }
    } else {
      // Add a new item to the shopping cart
      this.shoppingCart.push({ ...this.currentItem });
    }
    this.toggleItemForm(); // Close the form after saving
  }
}
