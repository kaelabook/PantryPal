import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserId: number | null = 1;

  setCurrentUser(userId: number): void {
    this.currentUserId = userId;
  }

  getCurrentUserId(): number {
    if (this.currentUserId === null) {
      throw new Error('User not authenticated');
    }
    return this.currentUserId;
  }

  // Add more authentication methods as needed
  isAuthenticated(): boolean {
    return this.currentUserId !== null;
  }
}