import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PantryComponent } from './components/pantry/pantry.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'pantry', component: PantryComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'view-recipe/:id', component: RecipesComponent, data: { viewMode: true } }
];
