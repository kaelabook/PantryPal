package PantryPal.PantryPal.service;

import PantryPal.PantryPal.dto.*;
import PantryPal.PantryPal.model.*;
import PantryPal.PantryPal.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final PantryItemRepository pantryItemRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    @SuppressWarnings("unused")
    private final ValidationService validationService;

    public RecipeService(RecipeRepository recipeRepository,
                       RecipeIngredientRepository recipeIngredientRepository,
                       PantryItemRepository pantryItemRepository,
                       ShoppingCartRepository shoppingCartRepository,
                       ValidationService validationService) {
        this.recipeRepository = recipeRepository;
        this.pantryItemRepository = pantryItemRepository;
        this.shoppingCartRepository = shoppingCartRepository;
        this.validationService = validationService;
    }

    @Transactional(readOnly = true)
    public List<RecipeDTO> getAllRecipes() {
        List<Recipe> recipes = recipeRepository.findAllWithIngredients();
        return recipes.stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public RecipeDTO getRecipe(Long id) {
        return recipeRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Recipe not found with id: " + id));
    }

    @Transactional
public RecipeDTO saveRecipe(RecipeDTO recipeDTO) {
    ValidationService.ValidationResult validation = validateRecipe(recipeDTO);
    if (!validation.isValid()) {
        throw new IllegalArgumentException(String.join(", ", validation.getErrors()));
    }

    Recipe recipe = (recipeDTO.getId() != null) ?
            recipeRepository.findById(recipeDTO.getId())
                    .orElse(new Recipe()) :
            new Recipe();

    recipe.setName(recipeDTO.getName());
    recipe.setDescription(recipeDTO.getDescription());
    recipe.setCookTime(recipeDTO.getCookTime());
    recipe.setTemperature(recipeDTO.getTemperature());
    recipe.setServings(recipeDTO.getServings());
    recipe.setInstructions(recipeDTO.getInstructions());

    // Clear existing ingredients if editing
    if (recipeDTO.getId() != null) {
        recipe.getIngredients().clear();
    }

    // Add new ingredients
    for (RecipeIngredientDTO ingDTO : recipeDTO.getIngredients()) {
        RecipeIngredient ingredient = new RecipeIngredient();
        ingredient.setName(ingDTO.getName());
        ingredient.setQuantity(ingDTO.getQuantity());
        ingredient.setUnit(ingDTO.getUnit());
        ingredient.setRecipe(recipe);
        recipe.getIngredients().add(ingredient); // Add to existing collection
    }

    Recipe savedRecipe = recipeRepository.save(recipe);
    return convertToDTO(savedRecipe);
}

    @Transactional
    public void deleteRecipe(Long id) {
        if (!recipeRepository.existsById(id)) {
            throw new RuntimeException("Recipe not found with id: " + id);
        }
        recipeRepository.deleteById(id);
    }

    @Transactional
public void cookRecipe(Long recipeId) {
    Recipe recipe = recipeRepository.findById(recipeId)
            .orElseThrow(() -> new RuntimeException("Recipe not found with id: " + recipeId));
    
    List<RecipeIngredient> missingIngredients = new ArrayList<>();

    // First pass to check for missing ingredients
    for (RecipeIngredient ingredient : recipe.getIngredients()) {
        String name = ingredient.getName().toLowerCase().trim();
        
        // Find matching pantry items (case insensitive name match)
        List<PantryItem> pantryItems = pantryItemRepository.findAll().stream()
            .filter(item -> item.getName().toLowerCase().trim().equals(name))
            .toList();

        boolean found = false;
        for (PantryItem pantryItem : pantryItems) {
            if (pantryItem.getQuantity() >= ingredient.getQuantity()) {
                found = true;
                break;
            }
        }

        if (!found) {
            missingIngredients.add(ingredient);
        }
    }

    if (missingIngredients.isEmpty()) {
        // Deduct from pantry
        for (RecipeIngredient ingredient : recipe.getIngredients()) {
            String name = ingredient.getName().toLowerCase().trim();
            double neededQuantity = ingredient.getQuantity();
            
            List<PantryItem> pantryItems = pantryItemRepository.findAll().stream()
                .filter(item -> item.getName().toLowerCase().trim().equals(name))
                .sorted(Comparator.comparing(PantryItem::getQuantity).reversed())
                .toList();

            for (PantryItem pantryItem : pantryItems) {
                if (neededQuantity <= 0) break;
                
                double available = pantryItem.getQuantity();
                double deduct = Math.min(available, neededQuantity);
                
                if (deduct == available) {
                    pantryItemRepository.delete(pantryItem);
                } else {
                    pantryItem.setQuantity(available - deduct);
                    pantryItemRepository.save(pantryItem);
                }
                
                neededQuantity -= deduct;
            }
        }
    } else {
        // Add missing ingredients to shopping cart
        for (RecipeIngredient ingredient : missingIngredients) {
            Category category = determineCategory(ingredient.getName());
            addToShoppingCart(
                ingredient.getName(),
                ingredient.getQuantity(),
                ingredient.getUnit() != null ? ingredient.getUnit() : "",
                category
            );
        }
    }
}

    private void addToShoppingCart(String name, Double quantity, String unit, Category category) {
        Optional<ShoppingCart> existingItem = shoppingCartRepository
            .findByNameAndCategoryAndUnitIgnoreCase(name, category, unit);
        
        if (existingItem.isPresent()) {
            ShoppingCart item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            shoppingCartRepository.save(item);
        } else {
            ShoppingCart newItem = new ShoppingCart();
            newItem.setName(name);
            newItem.setQuantity(quantity);
            newItem.setUnit(unit);
            newItem.setCategory(category);
            shoppingCartRepository.save(newItem);
        }
    }

    private Category determineCategory(String name) {
        String lowerName = name.toLowerCase();
        if (lowerName.matches(".*(apple|banana|berry|orange|pear|fruit).*")) {
            return Category.FRUITS;
        } else if (lowerName.matches(".*(vegetable|carrot|lettuce|broccoli|spinach|pepper|cucumber).*")) {
            return Category.VEGETABLES;
        } else if (lowerName.matches(".*(milk|cheese|yogurt|cream|butter).*")) {
            return Category.DAIRY;
        } else if (lowerName.matches(".*(beef|chicken|fish|pork|egg|meat|steak).*")) {
            return Category.PROTEIN;
        } else if (lowerName.matches(".*(rice|pasta|bread|flour|oat|grain|cereal).*")) {
            return Category.GRAINS;
        } else if (lowerName.matches(".*(salt|pepper|spice|herb|seasoning).*")) {
            return Category.SEASONINGS;
        }
        return Category.MISC;
    }

    private ValidationService.ValidationResult validateRecipe(RecipeDTO recipeDTO) {
        ValidationService.ValidationResult result = new ValidationService.ValidationResult();
        
        if (recipeDTO.getName() == null || recipeDTO.getName().trim().isEmpty()) {
            result.addError("Recipe name is required");
        }
        
        if (recipeDTO.getIngredients() == null || recipeDTO.getIngredients().isEmpty()) {
            result.addError("At least one ingredient is required");
        } else {
            for (RecipeIngredientDTO ingredient : recipeDTO.getIngredients()) {
                if (ingredient.getName() == null || ingredient.getName().trim().isEmpty()) {
                    result.addError("Ingredient name is required");
                }
                if (ingredient.getQuantity() <= 0) {
                    result.addError("Ingredient quantity must be positive");
                }
            }
        }
        
        if (recipeDTO.getInstructions() == null || recipeDTO.getInstructions().trim().isEmpty()) {
            result.addError("Instructions are required");
        }
        
        return result;
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

        dto.setIngredients(recipe.getIngredients().stream()
            .map(this::convertIngredientToDTO)
            .collect(Collectors.toList()));

        return dto;
    }

    private RecipeIngredientDTO convertIngredientToDTO(RecipeIngredient ingredient) {
        RecipeIngredientDTO dto = new RecipeIngredientDTO();
        dto.setId(ingredient.getId());
        dto.setName(ingredient.getName());
        dto.setQuantity(ingredient.getQuantity());
        dto.setUnit(ingredient.getUnit());
        return dto;
    }
}