import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ShoppingCartItem } from '../models/shopping-cart-item.model';

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
  private apiUrl = 'http://localhost:8080/api/shopping-cart';

  constructor(private http: HttpClient) { }

  getAllItems(): Observable<ShoppingCartItem[]> {
    return this.http.get<ShoppingCartItem[]>(this.apiUrl).pipe(
      tap(data => console.log('Fetched cart items:', data)),
      catchError(this.handleError)
    );
  }

  addItem(item: ShoppingCartItem): Observable<ShoppingCartItem> {
    return this.http.post<ShoppingCartItem>(this.apiUrl, item).pipe(
      tap(newItem => console.log('Added to cart:', newItem)),
      catchError(this.handleError)
    );
  }

  updateItem(id: number, item: ShoppingCartItem): Observable<ShoppingCartItem> {
    return this.http.put<ShoppingCartItem>(`${this.apiUrl}/${id}`, item).pipe(
      tap(updatedItem => console.log('Updated cart item:', updatedItem)),
      catchError(this.handleError)
    );
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log('Removed cart item ID:', id)),
      catchError(this.handleError)
    );
  }

  checkout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/clear`, {}).pipe(
      tap(() => console.log('Checkout completed')),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('ShoppingCartService error:', error);
    return throwError(() => new Error('Failed to process cart operation'));
  }
}