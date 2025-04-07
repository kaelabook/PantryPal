import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { PantryService } from '../../services/pantry.service';
import { ShoppingCartItem } from '../../models/shopping-cart-item.model';
import { PantryItem } from '../../models/pantry-item.model';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent 
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  searchQuery = '';
  selectedCategory = '';
  cartSearchQuery = '';
  selectedCartCategory = '';
  
  showItemForm = false;
  isEditing = false;
  currentItem: ShoppingCartItem = { 
    name: '', 
    quantity: 0, 
    unit: '', 
    category: 'MISC',
    userId: 1 // Default user ID - replace with actual user ID from auth
  };

  // Sample data replaced with actual API data
  ingredients: PantryItem[] = [];
  shoppingCart: ShoppingCartItem[] = [];
  filteredCartItems: ShoppingCartItem[] = [];
  filteredIngredients: PantryItem[] = [];

  constructor(
    private shoppingCartService: ShoppingCartService,
    private pantryService: PantryService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.loadPantryItems();
  }

  loadCartItems(): void {
    this.shoppingCartService.getAllItems().subscribe(items => {
      this.shoppingCart = items;
      this.filteredCartItems = [...items];
      this.applyCartFilter();
    });
  }

  loadPantryItems(): void {
    this.pantryService.getAllItems().subscribe(items => {
      this.ingredients = items;
      this.filteredIngredients = [...items];
      this.applyFilter();
    });
  }

  addToCart(index: number): void {
    const ingredient = this.filteredIngredients[index];
    const cartItem: ShoppingCartItem = {
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      category: ingredient.category,
      userId: 1 // Replace with actual user ID
    };

    this.shoppingCartService.addItem(cartItem).subscribe(() => {
      this.loadCartItems();
    });
  }

  removeItem(index: number): void {
    const id = this.filteredCartItems[index].id;
    if (id) {
      this.shoppingCartService.deleteItem(id).subscribe(() => {
        this.loadCartItems();
      });
    }
  }

  editItem(index: number): void {
    this.isEditing = true;
    this.currentItem = { ...this.filteredCartItems[index] };
    this.showItemForm = true;
  }

  toggleItemForm(): void {
    this.showItemForm = !this.showItemForm;
    if (!this.showItemForm) {
      this.isEditing = false;
      this.currentItem = { 
        name: '', 
        quantity: 0, 
        unit: '', 
        category: 'MISC',
        userId: 1
      };
    }
  }

  saveItem(): void {
    if (this.isEditing) {
      if (this.currentItem.id) {
        this.shoppingCartService.updateItem(this.currentItem.id, this.currentItem)
          .subscribe(() => {
            this.loadCartItems();
            this.toggleItemForm();
          });
      }
    } else {
      this.shoppingCartService.addItem(this.currentItem)
        .subscribe(() => {
          this.loadCartItems();
          this.toggleItemForm();
        });
    }
  }

  checkout(): void {
    this.shoppingCartService.checkout().subscribe(() => {
      this.loadCartItems();
      // Additional logic after checkout if needed
    });
  }

  applySearchFilter(): void {
    this.filteredIngredients = this.ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  applyFilter(): void {
    this.filteredIngredients = this.ingredients.filter(ingredient =>
      (this.selectedCategory ? ingredient.category === this.selectedCategory : true) &&
      (this.searchQuery ? ingredient.name.toLowerCase().includes(this.searchQuery.toLowerCase()) : true)
    );
  }

  applyCartSearchFilter(): void {
    this.filteredCartItems = this.shoppingCart.filter(item =>
      item.name.toLowerCase().includes(this.cartSearchQuery.toLowerCase())
    );
  }

  applyCartFilter(): void {
    this.filteredCartItems = this.shoppingCart.filter(item =>
      (this.selectedCartCategory ? item.category === this.selectedCartCategory : true) &&
      (this.cartSearchQuery ? item.name.toLowerCase().includes(this.cartSearchQuery.toLowerCase()) : true)
    );
  }
}