import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShoppingCartItem } from '../models/shopping-cart-item.model';

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
  private apiUrl = '/api/shopping-cart';

  constructor(private http: HttpClient) { }

  getAllItems(userId: number): Observable<ShoppingCartItem[]> {
    return this.http.get<ShoppingCartItem[]>(`${this.apiUrl}/user/${userId}`);
  }

  addItem(item: ShoppingCartItem): Observable<ShoppingCartItem> {
    // Backend should return the item with generated ID
    return this.http.post<ShoppingCartItem>(this.apiUrl, item);
  }

  updateItem(id: number, item: ShoppingCartItem): Observable<ShoppingCartItem> {
    return this.http.put<ShoppingCartItem>(`${this.apiUrl}/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkout(userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/clear/user/${userId}`, {});
  }
}