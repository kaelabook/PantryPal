import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Add this import
import { CommonModule } from '@angular/common'; // Also good to have
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { PantryService } from '../../services/pantry.service';
import { ShoppingCartItem } from '../../models/shopping-cart-item.model';
import { PantryItem } from '../../models/pantry-item.model';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-shopping-cart',
  standalone: true, // Make sure this is true for standalone components
  imports: [CommonModule, FormsModule, NavbarComponent], // Add FormsModule here
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  // Data
  allIngredients: PantryItem[] = [];
  filteredIngredients: PantryItem[] = [];
  cartItems: ShoppingCartItem[] = [];
  filteredCartItems: ShoppingCartItem[] = [];
  
  // Form states
  showItemForm = false;
  isEditing = false;
  editingIndex: number | null = null;
  currentItem: ShoppingCartItem = this.createEmptyItem();
  
  // Filters
  searchQuery = '';
  selectedCategory = '';
  cartSearchQuery = '';
  selectedCartCategory = '';
  
  // Constants
  categories = [
    'Fruits', 'Vegetables', 'Grains', 'Protein', 
    'Dairy', 'Seasonings', 'Substitutions', 'Miscellaneous'
  ];
  
  userId = 1; // Replace with actual user ID from auth service

  constructor(
    private cartService: ShoppingCartService,
    private pantryService: PantryService
  ) {}

  ngOnInit(): void {
    this.loadIngredients();
    this.loadCartItems();
  }

  loadIngredients(): void {
    this.pantryService.getAllItemsForUser(this.userId).subscribe({
      next: (items) => {
        this.allIngredients = items;
        this.filteredIngredients = [...items];
      },
      error: (err) => console.error('Error loading ingredients:', err)
    });
  }

  loadCartItems(): void {
    this.cartService.getAllItems(this.userId).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.filteredCartItems = [...items];
      },
      error: (err) => console.error('Error loading cart items:', err)
    });
  }

  // Filter methods
  applySearchFilter(): void {
    this.filteredIngredients = this.allIngredients.filter(item =>
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
      (this.selectedCategory ? item.category === this.selectedCategory : true)
    );
  }

  applyFilter(): void {
    this.applySearchFilter();
  }

  applyCartSearchFilter(): void {
    this.filteredCartItems = this.cartItems.filter(item =>
      item.name.toLowerCase().includes(this.cartSearchQuery.toLowerCase()) &&
      (this.selectedCartCategory ? item.category === this.selectedCartCategory : true)
    );
  }

  applyCartFilter(): void {
    this.applyCartSearchFilter();
  }

  // Item management
  addToCart(ingredient: PantryItem): void {
    const cartItem: ShoppingCartItem = {
      id: -1, // Temporary ID
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      category: ingredient.category,
      userId: this.userId
    };
  
    this.cartService.addItem(cartItem).subscribe({
      next: (savedItem) => {
        // The savedItem will have the real ID from backend
        this.loadCartItems();
      },
      error: (err) => console.error('Error adding to cart:', err)
    });
  }

  removeItem(id: number): void {
    this.cartService.deleteItem(id).subscribe({
      next: () => this.loadCartItems(),
      error: (err) => console.error('Error removing item:', err)
    });
  }

  // Form handling
  toggleItemForm(): void {
    this.showItemForm = !this.showItemForm;
    if (!this.showItemForm) {
      this.resetForm();
    }
  }

  saveItem(): void {
    if (this.isEditing) {
      if (!this.currentItem.id) return;
      this.cartService.updateItem(this.currentItem.id, this.currentItem).subscribe({
        next: () => {
          this.loadCartItems();
          this.toggleItemForm();
        },
        error: (err) => console.error('Error updating item:', err)
      });
    } else {
      this.currentItem.userId = this.userId;
      this.cartService.addItem(this.currentItem).subscribe({
        next: () => {
          this.loadCartItems();
          this.toggleItemForm();
        },
        error: (err) => console.error('Error adding item:', err)
      });
    }
  }

  // Edit functionality
  startEditing(index: number): void {
    this.editingIndex = index;
  }

  saveEdit(index: number): void {
    const item = this.filteredCartItems[index];
    if (item.id) {
      this.cartService.updateItem(item.id, item).subscribe({
        next: () => {
          this.editingIndex = null;
          this.loadCartItems();
        },
        error: (err) => console.error('Error updating item:', err)
      });
    }
  }

  // Checkout
  checkout(): void {
    if (confirm('Are you sure you want to checkout?')) {
      this.cartService.checkout(this.userId).subscribe({
        next: () => {
          alert('Checkout completed successfully!');
          this.loadCartItems();
        },
        error: (err) => console.error('Error during checkout:', err)
      });
    }
  }

  // Helpers
  private createEmptyItem(): ShoppingCartItem {
    return {
      id: -1, // Temporary ID, will be replaced by backend
      name: '',
      quantity: 1,
      unit: '',
      category: 'Fruits',
      userId: this.userId
    };
  }

  private resetForm(): void {
    this.isEditing = false;
    this.currentItem = this.createEmptyItem();
  }
}