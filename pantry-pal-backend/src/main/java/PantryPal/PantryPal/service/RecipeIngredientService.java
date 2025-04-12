package PantryPal.PantryPal.service;

import PantryPal.PantryPal.dto.RecipeIngredientDTO;
import PantryPal.PantryPal.model.Recipe;
import PantryPal.PantryPal.model.RecipeIngredient;
import PantryPal.PantryPal.repository.RecipeIngredientRepository;
import PantryPal.PantryPal.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeIngredientService {
    private final RecipeIngredientRepository ingredientRepository;
    private final RecipeRepository recipeRepository;

    @Autowired
    public RecipeIngredientService(RecipeIngredientRepository ingredientRepository,
            RecipeRepository recipeRepository) {
        this.ingredientRepository = ingredientRepository;
        this.recipeRepository = recipeRepository;
    }

    public List<RecipeIngredientDTO> getIngredientsByRecipeId(Long recipeId) {
        List<RecipeIngredient> ingredients = ingredientRepository.findByRecipeId(recipeId);
        return ingredients.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RecipeIngredientDTO getIngredientById(Long id) {
        return ingredientRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));
    }

    public RecipeIngredientDTO addIngredientToRecipe(Long recipeId, RecipeIngredientDTO ingredientDTO) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        RecipeIngredient ingredient = new RecipeIngredient();
        ingredient.setName(ingredientDTO.getName());
        ingredient.setQuantity(ingredientDTO.getQuantity());
        ingredient.setUnit(ingredientDTO.getUnit());
        ingredient.setRecipe(recipe);

        RecipeIngredient savedIngredient = ingredientRepository.save(ingredient);
        return convertToDTO(savedIngredient);
    }

    public RecipeIngredientDTO updateIngredient(Long id, RecipeIngredientDTO ingredientDTO) {
        RecipeIngredient existingIngredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));

        existingIngredient.setName(ingredientDTO.getName());
        existingIngredient.setQuantity(ingredientDTO.getQuantity());
        existingIngredient.setUnit(ingredientDTO.getUnit());

        RecipeIngredient updatedIngredient = ingredientRepository.save(existingIngredient);
        return convertToDTO(updatedIngredient);
    }

    public void deleteIngredient(Long id) {
        ingredientRepository.deleteById(id);
    }

    private RecipeIngredientDTO convertToDTO(RecipeIngredient ingredient) {
        RecipeIngredientDTO dto = new RecipeIngredientDTO();
        dto.setId(ingredient.getId());
        dto.setName(ingredient.getName());
        dto.setQuantity(ingredient.getQuantity());
        dto.setUnit(ingredient.getUnit());
        dto.setRecipeId(ingredient.getRecipe().getId());
        return dto;
    }
}