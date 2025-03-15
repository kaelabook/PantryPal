import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [NavbarComponent, NgIf, NgFor, FormsModule],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent {
  showRecipeForm = false;
  isEditing = false;
  currentRecipe = {
    name: '',
    description: '',
    ingredients: [{ name: '', quantity: 1, unit: '' }],
    instructions: '',
    cookTime: 30,
    temperature: 180
  };
  
  recipes = [
    {
      name: 'Pasta',
      description: 'A simple pasta dish.',
      ingredients: [
        { name: 'Pasta', quantity: 200, unit: 'grams' },
        { name: 'Tomato Sauce', quantity: 100, unit: 'grams' },
      ],
      instructions: 'Boil pasta and add sauce.',
      cookTime: 15,
      temperature: 180
    }
  ];

  toggleRecipeForm() {
    this.showRecipeForm = !this.showRecipeForm;
    if (!this.showRecipeForm) {
      this.resetForm();
    }
  }

  saveRecipe() {
    if (this.isEditing) {
      // Update recipe logic
      const index = this.recipes.findIndex(r => r.name === this.currentRecipe.name);
      if (index !== -1) {
        this.recipes[index] = this.currentRecipe;
      }
    } else {
      // Add new recipe logic
      this.recipes.push({ ...this.currentRecipe });
    }
    this.toggleRecipeForm();
  }

  editRecipe(recipe: any) {
    this.isEditing = true;
    this.currentRecipe = { ...recipe };
    this.showRecipeForm = true;
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
      ingredients: [{ name: '', quantity: 1, unit: '' }],
      instructions: '',
      cookTime: 30,
      temperature: 180
    };
  }
}
