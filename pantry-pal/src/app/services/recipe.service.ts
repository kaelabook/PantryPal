import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { Recipe, RecipeIngredient } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private apiUrl = 'http://localhost:8080/api/recipes';

  constructor(private http: HttpClient) { }

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl).pipe(
      tap(response => console.log('Fetched recipes:', response)),
      map(response => Array.isArray(response) ? response : []),
      catchError(this.handleError)
    );
  }

  createRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipe).pipe(
      tap(newRecipe => console.log('Created recipe:', newRecipe)),
      catchError(this.handleError)
    );
  }

  updateRecipe(id: number, recipe: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, recipe).pipe(
      tap(updatedRecipe => console.log('Updated recipe:', updatedRecipe)),
      catchError(this.handleError)
    );
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log('Deleted recipe ID:', id)),
      catchError(this.handleError)
    );
  }

  cookRecipe(recipeId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${recipeId}/cook`, {}).pipe(
      tap(() => console.log('Cooked recipe ID:', recipeId)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('RecipeService error:', error);
    return throwError(() => new Error('Failed to process recipe operation'));
  }
}