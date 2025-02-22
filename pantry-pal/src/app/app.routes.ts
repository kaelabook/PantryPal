import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PantryComponent } from './pantry/pantry.component';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

export const routes: Routes = [  // 👈 Ensure 'export' is used
  { path: 'home', component: HomeComponent },
  { path: 'pantry', component: PantryComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' } // Redirect default path to home
];
