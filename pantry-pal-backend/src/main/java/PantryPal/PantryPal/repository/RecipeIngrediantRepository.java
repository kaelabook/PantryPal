package com.pantrypal.repository;

import com.pantrypal.model.RecipeIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, Long> {
    List<RecipeIngredient> findByRecipeId(Long recipeId);
}