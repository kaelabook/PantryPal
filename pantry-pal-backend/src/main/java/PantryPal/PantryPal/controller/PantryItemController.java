package com.pantrypal.controller;

import com.pantrypal.dto.PantryItemDTO;
import com.pantrypal.service.PantryItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pantry")
@CrossOrigin(origins = "http://localhost:4200")
public class PantryItemController {
    private final PantryItemService pantryItemService;

    @Autowired
    public PantryItemController(PantryItemService pantryItemService) {
        this.pantryItemService = pantryItemService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PantryItemDTO>> getPantryItemsForUser(@PathVariable Long userId) {
        List<PantryItemDTO> items = pantryItemService.getPantryItemsForUser(userId);
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<PantryItemDTO> addPantryItem(@RequestBody PantryItemDTO itemDTO) {
        PantryItemDTO addedItem = pantryItemService.addPantryItem(itemDTO);
        return ResponseEntity.ok(addedItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PantryItemDTO> updatePantryItem(
            @PathVariable Long id,
            @RequestBody PantryItemDTO itemDTO) {
        PantryItemDTO updatedItem = pantryItemService.updatePantryItem(id, itemDTO);
        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePantryItem(@PathVariable Long id) {
        pantryItemService.deletePantryItem(id);
        return ResponseEntity.noContent().build();
    }
}