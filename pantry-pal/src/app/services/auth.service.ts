import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserId: number | null = null;

  setCurrentUser(userId: number | null): void {
    this.currentUserId = userId;
  }

  getCurrentUserId(): number | null {
    return this.currentUserId;
  }

  isAuthenticated(): boolean {
    return this.currentUserId !== null;
  }
}