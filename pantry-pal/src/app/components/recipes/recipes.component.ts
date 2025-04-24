import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { PantryService } from '../../services/pantry.service';
import { Recipe } from '../../models/recipe.model';
import { PantryItem } from '../../models/pantry-item.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

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
    pantryItems: [] as { name: string; quantity: number; unit: string }[],
    missingItems: [] as { name: string; quantity: number; unit: string }[],
    message: ''
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

  categoryDisplayMap = {
    'FRUITS': 'Fruits',
    'VEGETABLES': 'Vegetables',
    'GRAINS': 'Grains',
    'PROTEIN': 'Protein',
    'DAIRY': 'Dairy',
    'SEASONINGS': 'Seasonings',
    'SUBSTITUTIONS': 'Substitutions',
    'MISC': 'Miscellaneous'
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
      next: recipes => {
        this.savedRecipes = recipes || [];
        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading recipes:', err);
        this.errorMessage = 'Failed to load recipes';
        this.isLoading = false;
      }
    });
  }

  loadPantryItems(): void {
    this.pantryService.getAllItems().subscribe({
      next: items => {
        this.pantryItems = items;
        this.filteredPantryItems = [...items];
      },
      error: err => console.error('Error loading pantry items:', err)
    });
  }

  toggleRecipeForm(): void {
    this.showRecipeForm = !this.showRecipeForm;
    if (!this.showRecipeForm) this.resetForm();
  }

  viewRecipe(recipe: Recipe): void { this.selectedRecipe = recipe; }
  closeRecipeView(): void { this.selectedRecipe = null; }

  editRecipe(recipe: Recipe): void {
    this.isEditing = true;
    this.currentRecipe = {
      ...recipe,
      ingredients: recipe.ingredients.map(ing => ({
        ...ing,
        category: ing.category || 'MISC'
      }))
    };
    this.showRecipeForm = true;
  }

  getCategoryDisplay(categoryValue: string): string {
    return this.categoryDisplayMap[categoryValue as keyof typeof this.categoryDisplayMap] || categoryValue;
  }

  saveRecipe(): void {
    if (!this.validateRecipe()) return;

    const op = this.isEditing
      ? this.recipeService.updateRecipe(this.currentRecipe.id!, this.currentRecipe)
      : this.recipeService.createRecipe(this.currentRecipe);

    op.subscribe({
      next: () => {
        this.loadRecipes();
        this.toggleRecipeForm();
      },
      error: err => {
        console.error('Error saving recipe:', err);
        this.errorMessage = 'Failed to save recipe';
      }
    });
  }

  deleteRecipe(recipe: Recipe): void {
    if (!recipe.id || !confirm('Delete this recipe?')) return;

    this.recipeService.deleteRecipe(recipe.id).subscribe({
      next: () => this.loadRecipes(),
      error: err => {
        console.error('Error deleting recipe:', err);
        this.errorMessage = 'Failed to delete recipe';
      }
    });
  }

  async prepareCookRecipe(recipe: Recipe): Promise<void> {
    try {
      const pantryItems = await this.pantryService.getAllItems().toPromise();
      if (!pantryItems) throw new Error('Failed to load pantry items');

      this.cookData = { recipe: { ...recipe }, pantryItems: [], missingItems: [], message: '' };
      let allAvailable = true;

      recipe.ingredients.forEach(ing => {
        const pantryItem = pantryItems.find(i => i.name.toLowerCase() === ing.name.toLowerCase());
        if (pantryItem && pantryItem.quantity >= ing.quantity) {
          this.cookData.pantryItems.push({ name: ing.name, quantity: ing.quantity, unit: ing.unit });
        } else {
          allAvailable = false;
          const needed = pantryItem ? Math.max(ing.quantity - pantryItem.quantity, 0) : ing.quantity;
          if (needed > 0)
            this.cookData.missingItems.push({ name: ing.name, quantity: needed, unit: ing.unit });
        }
      });

      this.cookData.message = allAvailable
        ? 'All ingredients are available in your pantry.'
        : 'Some ingredients are missing and will be added to your shopping cart.';

      this.showCookConfirmation = true;
    } catch (err) {
      console.error('Error preparing cook:', err);
      this.errorMessage = err instanceof Error ? err.message : 'Failed to prepare cooking';
    }
  }

  executeCookRecipe(): void {
    if (!this.cookData.recipe.id) { this.errorMessage = 'Invalid recipe'; return; }

    this.recipeService.cookRecipe(this.cookData.recipe.id).subscribe({
      next: () => {
        this.showCookConfirmation = false;
        alert(`Successfully cooked ${this.cookData.recipe.name}!`);
        this.loadPantryItems();
      },
      error: err => {
        console.error('Error cooking recipe:', err);
        this.errorMessage = 'Failed to cook recipe';
        this.showCookConfirmation = false;
      }
    });
  }

  shareRecipe(recipe: Recipe): void {
    console.log('Share recipe', recipe);
    alert(`Pretend this link is now copied to your clipboard:\n/recipes/${recipe.id}`);
  }

  addIngredient(): void {
    this.currentRecipe.ingredients.push({ 
      name: '', 
      quantity: 1, 
      unit: '',
      category: 'MISC'
    });
  }

  removeIngredient(i: number): void { this.currentRecipe.ingredients.splice(i, 1); }

  filterPantryItems(term: string, idx: number): void {
    this.activeIngredientIndex = idx;
    this.filteredPantryItems = term
      ? this.pantryItems.filter(item => item.name.toLowerCase().includes(term.toLowerCase()))
      : [...this.pantryItems];
  }

  selectPantryItem(item: PantryItem, index: number): void {
    const ing = this.currentRecipe.ingredients[index];
    ing.name = item.name;
    ing.unit = item.unit || '';
    ing.category = item.category || 'MISC';
    this.filteredPantryItems = [];
    this.activeIngredientIndex = null;
  }

  private validateRecipe(): boolean {
    if (!this.currentRecipe.name.trim()) { this.errorMessage = 'Recipe name is required'; return false; }
    if (this.currentRecipe.ingredients.some(i => !i.name.trim())) {
      this.errorMessage = 'All ingredients must have names'; return false;
    }
    if (!this.currentRecipe.instructions.trim()) { this.errorMessage = 'Instructions are required'; return false; }
    this.errorMessage = ''; return true;
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