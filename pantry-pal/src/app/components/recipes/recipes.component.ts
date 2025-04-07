import { Component } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Recipe, RecipeIngredient } from '../../models/recipe.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-recipes',
  standalone: true, // Confirm this is true
  imports: [
    CommonModule,
    FormsModule, // Add this
    NavbarComponent // If used in template
    // Any other components/directives used in template
  ],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent {
  showRecipeForm = false;
  isEditing = false;
  selectedRecipe: Recipe | null = null;
  savedRecipes: Recipe[] = [];
  
  currentRecipe: Recipe = {
    name: '',
    description: '',
    cookTime: 30,
    temperature: 350,
    servings: 2,
    ingredients: [],
    instructions: ''
  };

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.recipeService.getAllRecipes().subscribe(recipes => {
      this.savedRecipes = recipes;
    });
  }

  toggleRecipeForm(): void {
    this.showRecipeForm = !this.showRecipeForm;
    if (!this.showRecipeForm) this.resetForm();
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
    const operation = this.isEditing
      ? this.recipeService.updateRecipe(this.currentRecipe.id!, this.currentRecipe)
      : this.recipeService.createRecipe(this.currentRecipe);

    operation.subscribe(() => {
      this.loadRecipes();
      this.toggleRecipeForm();
    });
  }

  deleteRecipe(recipe: Recipe): void {
    if (recipe.id) {
      this.recipeService.deleteRecipe(recipe.id).subscribe(() => {
        this.loadRecipes();
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

  resetForm(): void {
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
  }
}