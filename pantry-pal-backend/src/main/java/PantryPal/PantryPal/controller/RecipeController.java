package PantryPal.PantryPal.controller;

import PantryPal.PantryPal.dto.RecipeDTO;
import PantryPal.PantryPal.service.RecipeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping
    public ResponseEntity<List<RecipeDTO>> getAllRecipes() {
        List<RecipeDTO> recipes = recipeService.getAllRecipes();
        System.out.println("[DEBUG] Returning " + recipes.size() + " recipes");
        return ResponseEntity.ok(recipes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDTO> getRecipe(@PathVariable Long id) {
        RecipeDTO recipe = recipeService.getRecipe(id);
        System.out.println("[DEBUG] Returning recipe ID: " + id);
        return ResponseEntity.ok(recipe);
    }

    @PostMapping
    public ResponseEntity<RecipeDTO> createRecipe(@RequestBody RecipeDTO recipeDTO) {
        RecipeDTO createdRecipe = recipeService.saveRecipe(recipeDTO);
        System.out.println("[DEBUG] Created new recipe: " + createdRecipe.getName());
        return ResponseEntity.ok(createdRecipe);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeDTO> updateRecipe(
            @PathVariable Long id,
            @RequestBody RecipeDTO recipeDTO) {
        recipeDTO.setId(id);
        RecipeDTO updatedRecipe = recipeService.saveRecipe(recipeDTO);
        System.out.println("[DEBUG] Updated recipe ID: " + id);
        return ResponseEntity.ok(updatedRecipe);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        recipeService.deleteRecipe(id);
        System.out.println("[DEBUG] Deleted recipe ID: " + id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/cook")
    public ResponseEntity<Void> cookRecipe(@PathVariable Long id) {
        recipeService.cookRecipe(id);
        System.out.println("[DEBUG] Cooking recipe ID: " + id);
        return ResponseEntity.ok().build();
    }
}