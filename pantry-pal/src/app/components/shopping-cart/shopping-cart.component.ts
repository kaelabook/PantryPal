import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { PantryService } from '../../services/pantry.service';
import { ShoppingCartItem } from '../../models/shopping-cart-item.model';
import { PantryItem } from '../../models/pantry-item.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  allIngredients: PantryItem[] = [];
  filteredIngredients: PantryItem[] = [];
  cartItems: ShoppingCartItem[] = [];
  filteredCartItems: ShoppingCartItem[] = [];
  showItemForm = false;
  isEditing = false;
  editingIndex: number | null = null;
  currentItem: ShoppingCartItem = this.createEmptyItem();
  searchQuery = '';
  selectedCategory = '';
  cartSearchQuery = '';
  selectedCartCategory = '';
  
  categories = [
    'Fruits', 'Vegetables', 'Grains', 'Protein', 
    'Dairy', 'Seasonings', 'Substitutions', 'Miscellaneous'
  ];

  constructor(
    private cartService: ShoppingCartService,
    private pantryService: PantryService
  ) {}

  ngOnInit(): void {
    this.loadIngredients();
    this.loadCartItems();
  }

  loadIngredients(): void {
    this.pantryService.getAllItems().subscribe({
      next: (items: PantryItem[]) => {
        this.allIngredients = items;
        this.filteredIngredients = [...items];
      },
      error: (err: Error) => console.error('Error loading ingredients:', err)
    });
  }

  loadCartItems(): void {
    this.cartService.getAllItems().subscribe({
      next: (items: ShoppingCartItem[]) => {
        this.cartItems = items;
        this.filteredCartItems = [...items];
      },
      error: (err: Error) => console.error('Error loading cart items:', err)
    });
  }

  // Add these missing filter methods:
  applyFilter(): void {
    this.filteredIngredients = this.allIngredients.filter(item =>
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
      (this.selectedCategory ? item.category === this.selectedCategory : true)
    );
  }

  applyCartFilter(): void {
    this.filteredCartItems = this.cartItems.filter(item =>
      item.name.toLowerCase().includes(this.cartSearchQuery.toLowerCase()) &&
      (this.selectedCartCategory ? item.category === this.selectedCartCategory : true)
    );
  }

  // These methods can be used as aliases for template binding
  applySearchFilter(): void {
    this.applyFilter();
  }

  applyCartSearchFilter(): void {
    this.applyCartFilter();
  }

  // Rest of your existing methods...
  addToCart(ingredient: PantryItem): void {
    const cartItem: ShoppingCartItem = {
      id: -1,
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      category: ingredient.category
    };
  
    this.cartService.addItem(cartItem).subscribe({
      next: () => this.loadCartItems(),
      error: (err: Error) => console.error('Error adding to cart:', err)
    });
  }

  toggleItemForm(): void {
    this.showItemForm = !this.showItemForm;
    if (!this.showItemForm) {
      this.resetForm();
    }
  }

  saveItem(): void {
    if (this.isEditing && this.currentItem.id) {
      this.cartService.updateItem(this.currentItem.id, this.currentItem).subscribe({
        next: () => {
          this.loadCartItems();
          this.toggleItemForm();
        },
        error: (err: Error) => console.error('Error updating item:', err)
      });
    } else {
      this.cartService.addItem(this.currentItem).subscribe({
        next: () => {
          this.loadCartItems();
          this.toggleItemForm();
        },
        error: (err: Error) => console.error('Error adding item:', err)
      });
    }
  }

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
        error: (err: Error) => console.error('Error updating item:', err)
      });
    }
  }

  removeItem(id: number): void {
    if (!confirm('Remove this item?')) return;
    this.cartService.deleteItem(id).subscribe({
      next: () => this.loadCartItems(),
      error: (err: Error) => console.error('Error removing item:', err)
    });
  }

  checkout(): void {
    if (!confirm('Proceed to checkout? This will add all items to your pantry.')) return;
    
    this.cartService.checkout().subscribe({
      next: () => {
        alert('Checkout completed! Items have been added to your pantry.');
        this.loadCartItems();
        // You might want to refresh the pantry list here if it's displayed elsewhere
      },
      error: (err) => {
        console.error('Checkout error:', err);
        alert('Failed to complete checkout');
      }
    });
  }

  private createEmptyItem(): ShoppingCartItem {
    return {
      id: -1,
      name: '',
      quantity: 1,
      unit: '',
      category: 'Fruits'
    };
  }

  private resetForm(): void {
    this.isEditing = false;
    this.currentItem = this.createEmptyItem();
  }
}