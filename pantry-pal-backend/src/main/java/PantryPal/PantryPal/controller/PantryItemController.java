package PantryPal.PantryPal.controller;

import PantryPal.PantryPal.dto.PantryItemDTO;
import PantryPal.PantryPal.model.Category;
import PantryPal.PantryPal.service.PantryItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pantry-items")
public class PantryItemController {
    private final PantryItemService pantryItemService;

    public PantryItemController(PantryItemService pantryItemService) {
        this.pantryItemService = pantryItemService;
    }

    @GetMapping
    public ResponseEntity<List<PantryItemDTO>> getAllItems() {
        List<PantryItemDTO> items = pantryItemService.getAllItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PantryItemDTO>> getAllItemsForUser(@PathVariable Long userId) {
        List<PantryItemDTO> items = pantryItemService.getAllItemsForUser(userId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PantryItemDTO> getItemById(@PathVariable Long id) {
        PantryItemDTO item = pantryItemService.getItemById(id);
        return ResponseEntity.ok(item);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<PantryItemDTO>> getItemsByCategory(@PathVariable Category category) {
        List<PantryItemDTO> items = pantryItemService.getItemsByCategory(category);
        return ResponseEntity.ok(items);
}

    @PostMapping
    public ResponseEntity<PantryItemDTO> createItem(@RequestBody PantryItemDTO pantryItemDTO) {
        try {
            PantryItemDTO createdItem = pantryItemService.createOrUpdateItem(pantryItemDTO);
            return ResponseEntity.ok(createdItem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PantryItemDTO> updateItem(
            @PathVariable Long id,
            @RequestBody PantryItemDTO pantryItemDTO) {
        PantryItemDTO updatedItem = pantryItemService.updateItem(id, pantryItemDTO);
        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        pantryItemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}