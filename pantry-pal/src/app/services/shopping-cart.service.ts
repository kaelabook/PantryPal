import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShoppingCartItem } from '../models/shopping-cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private apiUrl = 'http://localhost:8080/api/shopping-cart';

  constructor(private http: HttpClient) { }

  getAllItems(): Observable<ShoppingCartItem[]> {
    return this.http.get<ShoppingCartItem[]>(this.apiUrl);
  }

  addItem(item: ShoppingCartItem): Observable<ShoppingCartItem> {
    return this.http.post<ShoppingCartItem>(this.apiUrl, item);
  }

  updateItem(id: number, item: ShoppingCartItem): Observable<ShoppingCartItem> {
    return this.http.put<ShoppingCartItem>(`${this.apiUrl}/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/checkout`, {});
  }
}