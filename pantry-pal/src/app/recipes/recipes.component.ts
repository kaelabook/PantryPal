import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { NgIf, NgFor, CommonModule } from '@angular/common'; // <-- Import CommonModule here
import { FormsModule } from '@angular/forms';

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  name: string;
  description: string;
  cookTime: number;
  temperature: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string;
}

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [NavbarComponent, NgIf, NgFor, CommonModule, FormsModule], // <-- Add CommonModule here
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent {
  showRecipeForm = false;
  isEditing = false;
  selectedRecipe: Recipe | null = null;

  currentRecipe: Recipe = {
    name: '',
    description: '',
    cookTime: 30,
    temperature: 350,
    servings: 2,
    ingredients: [],
    instructions: ''
  };

  savedRecipes: Recipe[] = [
    {
      name: "Spaghetti",
      description: "A classic Italian pasta dish with meat sauce.",
      cookTime: 30,
      temperature: 350,
      servings: 4,
      ingredients: [{ name: "Pasta", quantity: 1, unit: "box" }],
      instructions: "Boil pasta, add sauce."
    },
    {
      name: "Chicken Stir-Fry",
      description: "A quick stir-fry with chicken and vegetables.",
      cookTime: 20,
      temperature: 350,
      servings: 3,
      ingredients: [{ name: "Chicken", quantity: 2, unit: "pieces" }, { name: "Vegetables", quantity: 1, unit: "cup" }],
      instructions: "Stir-fry chicken with vegetables and soy sauce."
    },
    {
      name: "Tacos",
      description: "Spicy tacos with seasoned ground beef, lettuce, and cheese.",
      cookTime: 15,
      temperature: 350,
      servings: 2,
      ingredients: [{ name: "Ground Beef", quantity: 1, unit: "lb" }, { name: "Taco Shells", quantity: 8, unit: "shells" }],
      instructions: "Cook beef, assemble tacos with toppings."
    },
    {
      name: "Vegetable Soup",
      description: "A healthy and warm vegetable soup.",
      cookTime: 45,
      temperature: 350,
      servings: 6,
      ingredients: [{ name: "Carrots", quantity: 2, unit: "pieces" }, { name: "Potatoes", quantity: 3, unit: "pieces" }],
      instructions: "Boil vegetables until soft, season to taste."
    }
  ];

  toggleRecipeForm() {
    this.showRecipeForm = !this.showRecipeForm;
    if (!this.showRecipeForm) this.resetForm();
  }

  // Share function (placeholder for future functionality)
  shareRecipe(recipe: any) {
    console.log('Sharing recipe:', recipe);  // Placeholder action
    // You can implement the actual share functionality here
  }

  viewRecipe(recipe: Recipe) {
    this.selectedRecipe = recipe;
  }

  closeRecipeView() {
    this.selectedRecipe = null;
  }

  editRecipe(recipe: Recipe) {
    this.isEditing = true;
    this.currentRecipe = JSON.parse(JSON.stringify(recipe));
    this.showRecipeForm = true;
  }

  saveRecipe() {
    if (this.isEditing) {
      this.savedRecipes = this.savedRecipes.map(r => r.name === this.currentRecipe.name ? this.currentRecipe : r);
    } else {
      this.savedRecipes.push({ ...this.currentRecipe });
    }
    this.toggleRecipeForm();
  }

  deleteRecipe(recipe: Recipe) {
    this.savedRecipes = this.savedRecipes.filter(r => r !== recipe);
  }

  addIngredient() {
    this.currentRecipe.ingredients.push({ name: '', quantity: 1, unit: '' });
  }

  removeIngredient(index: number) {
    this.currentRecipe.ingredients.splice(index, 1);
  }

  resetForm() {
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
