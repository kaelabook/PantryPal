import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PantryItem } from '../models/pantry-item.model';

@Injectable({
  providedIn: 'root'
})
export class PantryService {
  private apiUrl = 'http://localhost:8080/api/pantry';

  constructor(private http: HttpClient) { }

  getAllItems(): Observable<PantryItem[]> {
    return this.http.get<PantryItem[]>(this.apiUrl);
  }

  addItem(item: PantryItem): Observable<PantryItem> {
    return this.http.post<PantryItem>(this.apiUrl, item);
  }

  updateItem(id: number, item: PantryItem): Observable<PantryItem> {
    return this.http.put<PantryItem>(`${this.apiUrl}/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}