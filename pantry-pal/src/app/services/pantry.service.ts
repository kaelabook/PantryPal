import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { PantryItem } from '../models/pantry-item.model';

@Injectable({ providedIn: 'root' })
export class PantryService {
  private apiUrl = '/api/pantry-items';

  constructor(private http: HttpClient) { }

  getAllItems(userId: number): Observable<PantryItem[]> {
    return this.http.get<PantryItem[]>(`${this.apiUrl}/user/${userId}`).pipe(
      tap(data => console.log('Received data:', data)), // Add this to debug
      catchError(error => {
        console.error('API Error:', error);
        return of([]); // Return empty array instead of failing
      })
    );
  }

  getAllItemsForUser(userId: number): Observable<PantryItem[]> {
    return this.http.get<PantryItem[]>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  getItem(id: number): Observable<PantryItem> {
    return this.http.get<PantryItem>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addItem(item: PantryItem): Observable<PantryItem> {
    const payload = {
      ...item,
      category: item.category.toUpperCase() // Force uppercase
    };
    return this.http.post<PantryItem>(this.apiUrl, payload);
  }

  updateItem(id: number, item: PantryItem): Observable<PantryItem> {
    return this.http.put<PantryItem>(`${this.apiUrl}/${id}`, item).pipe(
      catchError(this.handleError)
    );
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error) {
        errorMessage += `\nDetails: ${JSON.stringify(error.error)}`;
      }
    }
    console.error(errorMessage);
    // Return a user-friendly error message
    return throwError(() => new Error('Failed to load data. Please try again later.'));
  }
}