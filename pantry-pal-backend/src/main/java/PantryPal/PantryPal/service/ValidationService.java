package PantryPal.PantryPal.service;

import PantryPal.PantryPal.model.PantryItem;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ValidationService {

    public ValidationResult validatePantryItem(PantryItem item, List<PantryItem> existingItems) {
        ValidationResult result = new ValidationResult();
        
        if (item.getName() == null || item.getName().trim().isEmpty()) {
            result.addError("Name is required");
        }
        
        if (item.getCategory() == null) {
            result.addError("Category is required");
        }
        
        if (item.getQuantity() <= 0) {
            result.addError("Quantity must be greater than 0");
        }
        
        boolean isDuplicate = existingItems.stream()
            .anyMatch(existing -> 
                existing.getName().equalsIgnoreCase(item.getName()) &&
                existing.getCategory() == item.getCategory() &&
                (existing.getUnit() == null && item.getUnit() == null || 
                 existing.getUnit() != null && existing.getUnit().equalsIgnoreCase(item.getUnit())) &&
                !existing.getId().equals(item.getId()));
        
        if (isDuplicate) {
            result.addError("An item with this name, category and unit already exists");
        }
        
        return result;
    }
    
    public static class ValidationResult {
        private boolean valid = true;
        private List<String> errors = new ArrayList<>();
        
        public void addError(String error) {
            errors.add(error);
            valid = false;
        }
        
        public boolean isValid() { return valid; }
        
        public List<String> getErrors() { return errors; }
    }
}