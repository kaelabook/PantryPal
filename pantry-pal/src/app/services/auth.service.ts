import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserId: number | null = null; // Start as null

  setCurrentUser(userId: number | null): void {
    this.currentUserId = userId;
  }

  getCurrentUserId(): number | null {
    return this.currentUserId; // Return null if not authenticated
  }

  isAuthenticated(): boolean {
    return this.currentUserId !== null;
  }
}