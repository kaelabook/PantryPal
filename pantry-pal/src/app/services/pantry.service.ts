import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { PantryItem } from '../models/pantry-item.model';

@Injectable({ providedIn: 'root' })
export class PantryService {
  private apiUrl = 'http://localhost:8080/api/pantry-items';

  constructor(private http: HttpClient) { }

  getAllItems(): Observable<PantryItem[]> {
    return this.http.get<PantryItem[]>(this.apiUrl).pipe(
      tap(data => console.log('Fetched pantry items:', data)),
      catchError(this.handleError)
    );
  }

  getItem(id: number): Observable<PantryItem> {
    return this.http.get<PantryItem>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addItem(item: PantryItem): Observable<PantryItem> {
    return this.http.post<PantryItem>(this.apiUrl, item).pipe(
      tap(newItem => console.log('Added item:', newItem)),
      catchError(this.handleError)
    );
  }

  updateItem(id: number, item: PantryItem): Observable<PantryItem> {
    return this.http.put<PantryItem>(`${this.apiUrl}/${id}`, item).pipe(
      tap(updatedItem => console.log('Updated item:', updatedItem)),
      catchError(this.handleError)
    );
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log('Deleted item ID:', id)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('PantryService error:', error);
    return of([] as any);
  }
}