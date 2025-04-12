import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Recipe, RecipeIngredient } from '../../models/recipe.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';

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
  savedRecipes: Recipe[] = []; // Initialize as empty array
  isLoading = false;
  errorMessage = '';
  userId: number | null = null; // Properly declare userId
  
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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      this.userId = this.authService.getCurrentUserId();
      
      if (!this.userId) {
        throw new Error('User not authenticated');
      }

      this.recipeService.getAllRecipes(this.userId).subscribe({
        next: (recipes) => {
          this.savedRecipes = recipes || []; // Ensure it's never undefined
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading recipes:', err);
          this.errorMessage = 'Failed to load recipes';
          this.isLoading = false;
          this.savedRecipes = []; // Reset to empty array on error
        }
      });
    } catch (err) {
      console.error('Authentication error:', err);
      this.errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      this.isLoading = false;
    }
  }

  // ... rest of your methods remain unchanged ...
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
    if (!this.userId) {
      this.errorMessage = 'User not authenticated';
      return;
    }

    this.currentRecipe.userId = this.userId;

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
    if (!recipe.id) return;
    
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(recipe.id).subscribe({
        next: () => this.loadRecipes(),
        error: (err) => {
          console.error('Error deleting recipe:', err);
          this.errorMessage = 'Failed to delete recipe';
        }
      });
    }
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

  private validateRecipe(): boolean {
    if (!this.currentRecipe.name.trim()) {
      this.errorMessage = 'Recipe name is required';
      return false;
    }
    if (this.currentRecipe.ingredients.some(ing => !ing.name.trim())) {
      this.errorMessage = 'All ingredients must have names';
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
    this.errorMessage = '';
  }
}