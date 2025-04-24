package PantryPal.PantryPal.repository;

import PantryPal.PantryPal.model.ShoppingCart;
import PantryPal.PantryPal.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Long> {
    List<ShoppingCart> findByCategory(Category category);
    
    @Query("SELECT s FROM ShoppingCart s WHERE " +
           "LOWER(s.name) = LOWER(:name) AND " +
           "s.category = :category AND " +
           "(s.unit IS NULL AND :unit IS NULL OR LOWER(s.unit) = LOWER(:unit))")
    Optional<ShoppingCart> findByNameAndCategoryAndUnitIgnoreCase(
        @Param("name") String name,
        @Param("category") Category category,
        @Param("unit") String unit);
}