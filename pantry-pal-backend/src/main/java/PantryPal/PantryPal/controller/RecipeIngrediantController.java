package com.pantrypal.controller;

import com.pantrypal.dto.RecipeIngredientDTO;
import com.pantrypal.service.RecipeIngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes/{recipeId}/ingredients")
@CrossOrigin(origins = "http://localhost:4200")
public class RecipeIngredientController {
    private final RecipeIngredientService ingredientService;

    @Autowired
    public RecipeIngredientController(RecipeIngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping
    public ResponseEntity<List<RecipeIngredientDTO>> getIngredientsByRecipeId(@PathVariable Long recipeId) {
        List<RecipeIngredientDTO> ingredients = ingredientService.getIngredientsByRecipeId(recipeId);
        return ResponseEntity.ok(ingredients);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeIngredientDTO> getIngredientById(@PathVariable Long id) {
        RecipeIngredientDTO ingredient = ingredientService.getIngredientById(id);
        return ResponseEntity.ok(ingredient);
    }

    @PostMapping
    public ResponseEntity<RecipeIngredientDTO> addIngredientToRecipe(
            @PathVariable Long recipeId,
            @RequestBody RecipeIngredientDTO ingredientDTO) {
        RecipeIngredientDTO addedIngredient = ingredientService.addIngredientToRecipe(recipeId, ingredientDTO);
        return ResponseEntity.ok(addedIngredient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeIngredientDTO> updateIngredient(
            @PathVariable Long id,
            @RequestBody RecipeIngredientDTO ingredientDTO) {
        RecipeIngredientDTO updatedIngredient = ingredientService.updateIngredient(id, ingredientDTO);
        return ResponseEntity.ok(updatedIngredient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIngredient(@PathVariable Long id) {
        ingredientService.deleteIngredient(id);
        return ResponseEntity.noContent().build();
    }
}