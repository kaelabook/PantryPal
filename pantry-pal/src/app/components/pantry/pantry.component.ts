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
    category: 'FRUITS',
    quantity: 1, 
    unit: '' 
  };
  searchQuery = '';
  selectedCategory = '';
  isLoading = false;
  error: string | null = null;
  
  categories = [
    { value: 'FRUITS', display: 'Fruits' },
    { value: 'VEGETABLES', display: 'Vegetables' },
    { value: 'GRAINS', display: 'Grains' },
    { value: 'PROTEIN', display: 'Protein' },
    { value: 'DAIRY', display: 'Dairy' },
    { value: 'SEASONINGS', display: 'Seasonings' },
    { value: 'SUBSTITUTIONS', display: 'Substitutions' },
    { value: 'MISC', display: 'Miscellaneous' }
  ];

  constructor(private pantryService: PantryService) {}

  ngOnInit(): void {
    this.loadPantryItems();
  }

  loadPantryItems(): void {
    this.isLoading = true;
    this.pantryService.getAllItems().subscribe({
      next: (items) => {
        this.allIngredients = items;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading items:', err);
        this.error = 'Failed to load pantry items';
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    this.filteredIngredients = this.allIngredients.filter(ingredient => {
      const nameMatch = ingredient.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const categoryMatch = !this.selectedCategory || 
                          ingredient.category === this.selectedCategory;
      return nameMatch && categoryMatch;
    });
  }

  toggleFoodForm(): void {
    this.showIngredientForm = !this.showIngredientForm;
    if (!this.showIngredientForm) {
      this.resetForm();
    }
  }

  saveIngredient(): void {
    if (!this.currentIngredient.name) return;

    const operation = this.isEditing 
      ? this.pantryService.updateItem(this.currentIngredient.id!, this.currentIngredient)
      : this.pantryService.addItem(this.currentIngredient);

    this.isLoading = true;
    operation.subscribe({
      next: () => {
        this.loadPantryItems();
        this.toggleFoodForm();
      },
      error: (err) => {
        console.error('Error saving item:', err);
        this.error = 'Failed to save item';
        this.isLoading = false;
      }
    });
  }

  editIngredient(index: number): void {
    this.isEditing = true;
    this.currentIngredient = { ...this.filteredIngredients[index] };
    this.showIngredientForm = true;
  }

  removeIngredient(index: number): void {
    const id = this.filteredIngredients[index].id;
    if (!id || !confirm('Delete this item?')) return;

    this.isLoading = true;
    this.pantryService.deleteItem(id).subscribe({
      next: () => this.loadPantryItems(),
      error: (err) => {
        console.error('Error deleting item:', err);
        this.error = 'Failed to delete item';
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentIngredient = { 
      name: '', 
      category: 'FRUITS', 
      quantity: 1, 
      unit: '' 
    };
  }

  getCategoryDisplay(categoryValue: string): string {
    const found = this.categories.find(c => c.value === categoryValue);
    return found?.display || categoryValue;
  }
}