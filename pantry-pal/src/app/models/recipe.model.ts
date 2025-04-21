export interface RecipeIngredient {
  id?: number;
  name: string;
  quantity: number;
  unit: string;
  recipeId?: number;
}

export interface Recipe {
  id?: number;
  name: string;
  description: string;
  cookTime: number;
  temperature: number;
  servings: number;
  ingredients: RecipeIngredient[];
  instructions: string;
}