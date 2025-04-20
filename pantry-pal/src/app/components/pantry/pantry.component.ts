import { Component, OnInit } from '@angular/core';
import { PantryService } from '../../services/pantry.service';
import { PantryItem } from '../../models/pantry-item.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

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
    category: 'FRUITS', // Default to uppercase value
    quantity: 1, 
    unit: '' 
  };
  debugData: any;
  apiError: any;
  
  searchQuery = '';
  selectedCategory = '';
  userId = 1;
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
    this.pantryService.getAllItems(this.userId)
      .pipe(
        finalize(() => this.isLoading = false),
        catchError(err => {
          console.error('Load error:', err);
          this.apiError = err;
          this.error = 'Failed to load items. See console.';
          return of([]);
        })
      )
      .subscribe(items => {
        this.allIngredients = items;
        this.applyFilter(); // Apply any existing filters to new data
      });
  }

  applyFilter(): void {
    this.filteredIngredients = this.allIngredients.filter(ingredient => {
      // Case-insensitive name search
      const nameMatch = ingredient.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      // Case-insensitive category filter
      const categoryMatch = !this.selectedCategory || 
                          ingredient.category.toLowerCase() === this.selectedCategory.toLowerCase();
      
      return nameMatch && categoryMatch;
    });
    
    console.log('Filter Results:', {
      searchQuery: this.searchQuery,
      selectedCategory: this.selectedCategory,
      filteredCount: this.filteredIngredients.length,
      allIngredients: this.allIngredients.length
    });
  }

  updateIngredientDetails(): void {
    if (!this.currentIngredient.name) return;
    
    const selected = this.allIngredients.find(i => 
      i.name.toLowerCase() === this.currentIngredient.name.toLowerCase()
    );
    
    if (selected) {
      this.currentIngredient = { ...selected };
    } else {
      this.currentIngredient.category = 'FRUITS';
      this.currentIngredient.unit = '';
    }
  }

  toggleFoodForm(): void {
    this.showIngredientForm = !this.showIngredientForm;
    if (!this.showIngredientForm) {
      this.resetForm();
    }
  }

  saveIngredient(): void {
    if (!this.currentIngredient.name) return;

    const payload = {
      ...this.currentIngredient,
      category: this.currentIngredient.category.toUpperCase(),
      userId: this.userId
    };

    const operation = this.isEditing 
      ? this.pantryService.updateItem(this.currentIngredient.id!, payload)
      : this.pantryService.addItem(payload);

    this.isLoading = true;
    operation
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.loadPantryItems();
          this.toggleFoodForm();
        },
        error: (err) => {
          console.error('Error saving item:', err);
          this.error = 'Failed to save item. Please try again.';
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
    if (!id) return;

    if (confirm('Are you sure you want to delete this item?')) {
      this.isLoading = true;
      this.pantryService.deleteItem(id)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => this.loadPantryItems(),
          error: (err) => {
            console.error('Error deleting item:', err);
            this.error = 'Failed to delete item. Please try again.';
          }
        });
    }
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
    if (!categoryValue) return 'Unknown';
    
    const foundCategory = this.categories.find(c => 
      c.value.toLowerCase() === categoryValue.toLowerCase()
    );
    
    return foundCategory?.display || categoryValue;
  }
}