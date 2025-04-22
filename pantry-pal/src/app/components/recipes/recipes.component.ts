import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { PantryService } from '../../services/pantry.service';
import { Recipe, RecipeIngredient } from '../../models/recipe.model';
import { PantryItem } from '../../models/pantry-item.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  showRecipeForm = false;
  isEditing = false;
  selectedRecipe: Recipe | null = null;
  savedRecipes: Recipe[] = [];
  isLoading = false;
  errorMessage = '';
  pantryItems: PantryItem[] = [];
  filteredPantryItems: PantryItem[] = [];
  activeIngredientIndex: number | null = null;

  showCookConfirmation = false;
  cookData = {
    recipe: {} as Recipe,
    pantryItems: [] as {name: string, quantity: number, unit: string}[],
    missingItems: [] as {name: string, quantity: number, unit: string}[],
    message: '' as string
  };

  currentRecipe: Recipe = {
    name: '',
    description: '',
    cookTime: 30,
    temperature: 350,
    servings: 2,
    ingredients: [],
    instructions: ''
  };

  constructor(
    private recipeService: RecipeService,
    private pantryService: PantryService
  ) {}

  ngOnInit(): void {
    this.loadRecipes();
    this.loadPantryItems();
  }

  loadRecipes(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.recipeService.getAllRecipes().subscribe({
      next: (recipes) => {
        console.log('Received recipes:', recipes);
        this.savedRecipes = recipes || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading recipes:', err);
        this.errorMessage = 'Failed to load recipes';
        this.isLoading = false;
      }
    });
  }

  loadPantryItems(): void {
    this.pantryService.getAllItems().subscribe({
      next: (items) => {
        this.pantryItems = items;
        this.filteredPantryItems = [...items];
      },
      error: (err) => console.error('Error loading pantry items:', err)
    });
  }

  toggleRecipeForm(): void {
    this.showRecipeForm = !this.showRecipeForm;
    if (!this.showRecipeForm) {
      this.resetForm();
    }
  }

  viewRecipe(recipe: Recipe): void {
    this.selectedRecipe = recipe;
  }

  closeRecipeView(): void {
    this.selectedRecipe = null;
  }

  editRecipe(recipe: Recipe): void {
    this.isEditing = true;
    this.currentRecipe = JSON.parse(JSON.stringify(recipe));
    this.showRecipeForm = true;
  }

  saveRecipe(): void {
    if (!this.validateRecipe()) return;

    const operation = this.isEditing
      ? this.recipeService.updateRecipe(this.currentRecipe.id!, this.currentRecipe)
      : this.recipeService.createRecipe(this.currentRecipe);

    operation.subscribe({
      next: () => {
        this.loadRecipes();
        this.toggleRecipeForm();
      },
      error: (err) => {
        console.error('Error saving recipe:', err);
        this.errorMessage = 'Failed to save recipe';
      }
    });
  }

  deleteRecipe(recipe: Recipe): void {
    if (!recipe.id || !confirm('Are you sure you want to delete this recipe?')) return;
    
    this.recipeService.deleteRecipe(recipe.id).subscribe({
      next: () => this.loadRecipes(),
      error: (err) => {
        console.error('Error deleting recipe:', err);
        this.errorMessage = 'Failed to delete recipe';
      }
    });
  }

  async prepareCookRecipe(recipe: Recipe): Promise<void> {
    try {
      const pantryItems = await this.pantryService.getAllItems().toPromise();
      if (!pantryItems) throw new Error('Failed to load pantry items');
      
      this.cookData = {
        recipe: {...recipe},
        pantryItems: [],
        missingItems: [],
        message: ''
      };
  
      let allAvailable = true;
  
      recipe.ingredients.forEach(ingredient => {
        const pantryItem = pantryItems.find(item => 
          item.name.toLowerCase() === ingredient.name.toLowerCase()
        );
        
        if (pantryItem && pantryItem.quantity >= ingredient.quantity) {
          this.cookData.pantryItems.push({
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit
          });
        } else {
          allAvailable = false;
          const neededQty = pantryItem ? 
            Math.max(ingredient.quantity - pantryItem.quantity, 0) : 
            ingredient.quantity;
          
          if (neededQty > 0) {
            this.cookData.missingItems.push({
              name: ingredient.name,
              quantity: neededQty,
              unit: ingredient.unit
            });
          }
        }
      });
  
      if (allAvailable) {
        this.cookData.message = "All ingredients are available in your pantry. Cooking will use these items.";
      } else {
        this.cookData.message = "Some ingredients are missing. These will be added to your shopping cart.";
      }
  
      this.showCookConfirmation = true;
    } catch (err) {
      console.error('Error preparing cook:', err);
      this.errorMessage = err instanceof Error ? err.message : 'Failed to prepare cooking';
    }
  }

  executeCookRecipe(): void {
    if (!this.cookData.recipe.id) {
      this.errorMessage = 'Invalid recipe';
      return;
    }

    this.recipeService.cookRecipe(this.cookData.recipe.id).subscribe({
      next: () => {
        this.showCookConfirmation = false;
        alert(`Successfully cooked ${this.cookData.recipe.name}!`);
        this.loadPantryItems();
      },
      error: (err) => {
        console.error('Error cooking recipe:', err);
        this.errorMessage = 'Failed to cook recipe';
        this.showCookConfirmation = false;
      }
    });
  }

  addIngredient(): void {
    this.currentRecipe.ingredients.push({ 
      name: '', 
      quantity: 1, 
      unit: '' 
    });
  }

  removeIngredient(index: number): void {
    this.currentRecipe.ingredients.splice(index, 1);
  }

  filterPantryItems(searchTerm: string, index: number): void {
    this.activeIngredientIndex = index;
    if (!searchTerm) {
      this.filteredPantryItems = [...this.pantryItems];
      return;
    }
    this.filteredPantryItems = this.pantryItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  selectPantryItem(item: PantryItem): void {
    if (this.activeIngredientIndex !== null) {
      this.currentRecipe.ingredients[this.activeIngredientIndex].name = item.name;
      this.currentRecipe.ingredients[this.activeIngredientIndex].unit = item.unit || '';
      this.filteredPantryItems = [];
      this.activeIngredientIndex = null;
    }
  }

  private validateRecipe(): boolean {
    if (!this.currentRecipe.name.trim()) {
      this.errorMessage = 'Recipe name is required';
      return false;
    }
    if (this.currentRecipe.ingredients.some(ing => !ing.name.trim())) {
      this.errorMessage = 'All ingredients must have names';
      return false;
    }
    if (!this.currentRecipe.instructions.trim()) {
      this.errorMessage = 'Instructions are required';
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  private resetForm(): void {
    this.isEditing = false;
    this.currentRecipe = {
      name: '',
      description: '',
      cookTime: 30,
      temperature: 350,
      servings: 2,
      ingredients: [],
      instructions: ''
    };
    this.filteredPantryItems = [];
    this.activeIngredientIndex = null;
  }
}