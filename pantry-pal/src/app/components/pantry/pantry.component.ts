import { Component, OnInit } from '@angular/core';
import { PantryService } from '../../services/pantry.service';
import { PantryItem } from '../../models/pantry-item.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-pantry',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './pantry.component.html',
  styleUrls: ['./pantry.component.css']
})
export class PantryComponent implements OnInit {
  filteredIngredients: PantryItem[] = [];
  allIngredients: PantryItem[] = [];
  showIngredientForm = false;
  isEditing = false;
  currentIngredient: PantryItem = { 
    name: '', 
    category: '', 
    quantity: 1, 
    unit: '' 
  };
  
  searchQuery = '';
  selectedCategory = '';

  constructor(private pantryService: PantryService) {}

  ngOnInit(): void {
    this.loadPantryItems();
  }

  loadPantryItems(): void {
    this.pantryService.getAllItems().subscribe({
      next: (items) => {
        this.allIngredients = items;
        this.filteredIngredients = [...items];
      },
      error: (err) => console.error('Error loading items:', err)
    });
  }

  toggleFoodForm(): void {  // Renamed to match template
    this.showIngredientForm = !this.showIngredientForm;
    if (!this.showIngredientForm) {
      this.resetForm();
    }
  }

  updateIngredientDetails(): void {
    const selected = this.allIngredients.find(i => i.name === this.currentIngredient.name);
    if (selected) {
      this.currentIngredient.category = selected.category;
      this.currentIngredient.unit = selected.unit;
    }
  }

  saveIngredient(): void {
    if (!this.currentIngredient.name) return;

    const operation = this.isEditing 
      ? this.pantryService.updateItem(this.currentIngredient.id!, this.currentIngredient)
      : this.pantryService.addItem(this.currentIngredient);

    operation.subscribe({
      next: () => {
        this.loadPantryItems();
        this.toggleFoodForm();
      },
      error: (err) => console.error('Error saving item:', err)
    });
  }

  editIngredient(index: number): void {
    this.isEditing = true;
    this.currentIngredient = { ...this.filteredIngredients[index] };
    this.showIngredientForm = true;
  }

  removeIngredient(index: number): void {
    const id = this.filteredIngredients[index].id;
    if (!id) return;

    if (confirm('Are you sure you want to delete this item?')) {
      this.pantryService.deleteItem(id).subscribe({
        next: () => this.loadPantryItems(),
        error: (err) => console.error('Error deleting item:', err)
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentIngredient = { 
      name: '', 
      category: '', 
      quantity: 1, 
      unit: '' 
    };
  }

  applySearchFilter(): void {
    this.filteredIngredients = this.allIngredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  applyFilter(): void {
    this.filteredIngredients = this.allIngredients.filter(ingredient =>
      (this.selectedCategory ? ingredient.category === this.selectedCategory : true) &&
      (this.searchQuery ? ingredient.name.toLowerCase().includes(this.searchQuery.toLowerCase()) : true)
    );
  }
}