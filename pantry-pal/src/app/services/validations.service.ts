// services/validation.service.ts
import { Injectable } from '@angular/core';
import { PantryItem } from '../models/pantry-item.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  validatePantryItem(item: PantryItem, existingItems: PantryItem[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!item.name || item.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (!item.category || item.category.trim().length === 0) {
      errors.push('Category is required');
    }

    if (item.quantity <= 0) {
      errors.push('Quantity must be greater than 0');
    }

    if (isNaN(item.quantity)) {
      errors.push('Quantity must be a number');
    }

    // Check for duplicates (case insensitive)
    const isDuplicate = existingItems.some(
      existing => existing.name.toLowerCase() === item.name.toLowerCase() && existing.id !== item.id
    );
    
    if (isDuplicate) {
      errors.push('An item with this name already exists');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}