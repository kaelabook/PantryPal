package PantryPal.PantryPal.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import PantryPal.PantryPal.dto.RecipeIngredientDTO;
import PantryPal.PantryPal.service.RecipeIngredientService;

@RestController
@RequestMapping("/api/recipes/{recipeId}/ingredients")
public class RecipeIngredientController {
    private final RecipeIngredientService ingredientService;

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