export interface PantryItem {
  id?: number;
  userId?: number;
  name: string;
  category: string; // This should match the enum values from backend
  quantity: number;
  unit: string;
}