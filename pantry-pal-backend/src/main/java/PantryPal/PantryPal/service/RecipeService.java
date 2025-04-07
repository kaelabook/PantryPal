package com.pantrypal.service;

import com.pantrypal.dto.*;
import com.pantrypal.model.*;
import com.pantrypal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final PantryItemRepository pantryItemRepository;
    private final ShoppingCartRepository shoppingCartRepository;

    @Autowired
    public RecipeService(RecipeRepository recipeRepository,
                        RecipeIngredientRepository recipeIngredientRepository,
                        PantryItemRepository pantryItemRepository,
                        ShoppingCartRepository shoppingCartRepository) {
        this.recipeRepository = recipeRepository;
        this.recipeIngredientRepository = recipeIngredientRepository;
        this.pantryItemRepository = pantryItemRepository;
        this.shoppingCartRepository = shoppingCartRepository;
    }

    public List<RecipeDTO> getAllRecipesForUser(Long userId) {
        List<Recipe> recipes = recipeRepository.findByUserId(userId);
        return recipes.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public RecipeDTO getRecipeById(Long id) {
        return recipeRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
    }

    @Transactional
    public RecipeDTO createRecipe(RecipeDTO recipeDTO) {
        Recipe recipe = new Recipe();
        recipe.setName(recipeDTO.getName());
        recipe.setDescription(recipeDTO.getDescription());
        recipe.setCookTime(recipeDTO.getCookTime());
        recipe.setTemperature(recipeDTO.getTemperature());
        recipe.setServings(recipeDTO.getServings());
        recipe.setInstructions(recipeDTO.getInstructions());
        recipe.setUserId(recipeDTO.getUserId());

        Recipe savedRecipe = recipeRepository.save(recipe);

        // Save ingredients
        List<RecipeIngredient> ingredients = recipeDTO.getIngredients().stream()
                .map(ingDTO -> {
                    RecipeIngredient ingredient = new RecipeIngredient();
                    ingredient.setName(ingDTO.getName());
                    ingredient.setQuantity(ingDTO.getQuantity());
                    ingredient.setUnit(ingDTO.getUnit());
                    ingredient.setRecipe(savedRecipe);
                    return recipeIngredientRepository.save(ingredient);
                }).collect(Collectors.toList());

        savedRecipe.setIngredients(ingredients);

        // Check pantry and update shopping cart
        checkPantryAndUpdateCart(savedRecipe, recipeDTO.getUserId());

        return convertToDTO(savedRecipe);
    }

    @Transactional
    public RecipeDTO updateRecipe(Long id, RecipeDTO recipeDTO) {
        Recipe existingRecipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        existingRecipe.setName(recipeDTO.getName());
        existingRecipe.setDescription(recipeDTO.getDescription());
        existingRecipe.setCookTime(recipeDTO.getCookTime());
        existingRecipe.setTemperature(recipeDTO.getTemperature());
        existingRecipe.setServings(recipeDTO.getServings());
        existingRecipe.setInstructions(recipeDTO.getInstructions());

        // Update ingredients
        recipeIngredientRepository.deleteByRecipeId(id);
        
        List<RecipeIngredient> ingredients = recipeDTO.getIngredients().stream()
                .map(ingDTO -> {
                    RecipeIngredient ingredient = new RecipeIngredient();
                    ingredient.setName(ingDTO.getName());
                    ingredient.setQuantity(ingDTO.getQuantity());
                    ingredient.setUnit(ingDTO.getUnit());
                    ingredient.setRecipe(existingRecipe);
                    return recipeIngredientRepository.save(ingredient);
                }).collect(Collectors.toList());

        existingRecipe.setIngredients(ingredients);

        Recipe updatedRecipe = recipeRepository.save(existingRecipe);
        
        // Re-check pantry after update
        checkPantryAndUpdateCart(updatedRecipe, recipeDTO.getUserId());

        return convertToDTO(updatedRecipe);
    }

    public void deleteRecipe(Long id) {
        recipeRepository.deleteById(id);
    }

    private void checkPantryAndUpdateCart(Recipe recipe, Long userId) {
        for (RecipeIngredient ingredient : recipe.getIngredients()) {
            Optional<PantryItem> pantryItemOpt = pantryItemRepository
                    .findByUserIdAndName(userId, ingredient.getName());

            double neededQuantity = ingredient.getQuantity();
            double availableQuantity = pantryItemOpt.map(PantryItem::getQuantity).orElse(0.0);

            if (availableQuantity < neededQuantity) {
                // Check if item already exists in cart
                Optional<ShoppingCart> existingCartItem = shoppingCartRepository
                        .findByUserIdAndName(userId, ingredient.getName());

                if (existingCartItem.isPresent()) {
                    // Update existing cart item
                    ShoppingCart cartItem = existingCartItem.get();
                    double newQuantity = Math.max(neededQuantity - availableQuantity, cartItem.getQuantity());
                    cartItem.setQuantity(newQuantity);
                    shoppingCartRepository.save(cartItem);
                } else {
                    // Add new item to cart
                    ShoppingCart cartItem = new ShoppingCart();
                    cartItem.setUserId(userId);
                    cartItem.setName(ingredient.getName());
                    cartItem.setQuantity(neededQuantity - availableQuantity);
                    cartItem.setUnit(ingredient.getUnit());
                    cartItem.setCategory(determineCategory(ingredient.getName()));
                    shoppingCartRepository.save(cartItem);
                }
            }
        }
    }

    private String determineCategory(String ingredientName) {
        // Simple categorization logic - expand as needed
        if (ingredientName.toLowerCase().contains("apple") || 
            ingredientName.toLowerCase().contains("banana")) {
            return "FRUITS";
        } else if (ingredientName.toLowerCase().contains("chicken") || 
                   ingredientName.toLowerCase().contains("beef")) {
            return "PROTEIN";
        }
        return "MISC";
    }

    private RecipeDTO convertToDTO(Recipe recipe) {
        RecipeDTO dto = new RecipeDTO();
        dto.setId(recipe.getId());
        dto.setName(recipe.getName());
        dto.setDescription(recipe.getDescription());
        dto.setCookTime(recipe.getCookTime());
        dto.setTemperature(recipe.getTemperature());
        dto.setServings(recipe.getServings());
        dto.setInstructions(recipe.getInstructions());
        dto.setUserId(recipe.getUserId());

        List<RecipeIngredientDTO> ingredientDTOs = recipe.getIngredients().stream()
                .map(ing -> {
                    RecipeIngredientDTO ingDTO = new RecipeIngredientDTO();
                    ingDTO.setName(ing.getName());
                    ingDTO.setQuantity(ing.getQuantity());
                    ingDTO.setUnit(ing.getUnit());
                    return ingDTO;
                }).collect(Collectors.toList());

        dto.setIngredients(ingredientDTOs);
        return dto;
    }
}