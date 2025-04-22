package PantryPal.PantryPal.repository;

import PantryPal.PantryPal.model.PantryItem;
import PantryPal.PantryPal.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface PantryItemRepository extends JpaRepository<PantryItem, Long> {
    List<PantryItem> findByUserId(Long userId);
    List<PantryItem> findByCategory(Category category);
    
    @Query("SELECT p FROM PantryItem p WHERE " +
           "LOWER(TRIM(p.name)) = LOWER(TRIM(:name)) AND " +
           "p.category = :category AND " +
           "((p.unit IS NULL OR TRIM(p.unit) = '') AND (:unit IS NULL OR TRIM(:unit) = '') OR " +
           "(TRIM(p.unit) IS NOT NULL AND TRIM(:unit) IS NOT NULL AND " +
           "LOWER(TRIM(p.unit)) = LOWER(TRIM(:unit))))")
    Optional<PantryItem> findByNameAndCategoryAndUnitIgnoreCase(
        @Param("name") String name,
        @Param("category") Category category,
        @Param("unit") String unit);

    Optional<PantryItem> findByUserIdAndName(Long userId, String name);
}