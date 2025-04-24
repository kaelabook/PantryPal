package PantryPal.PantryPal.repository;

import PantryPal.PantryPal.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    @SuppressWarnings("null")
    List<Recipe> findAll();
    @Query("SELECT DISTINCT r FROM Recipe r LEFT JOIN FETCH r.ingredients")
    List<Recipe> findAllWithIngredients();
}