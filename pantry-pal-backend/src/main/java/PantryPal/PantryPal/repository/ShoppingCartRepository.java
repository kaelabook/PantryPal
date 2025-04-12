package PantryPal.PantryPal.repository;

import PantryPal.PantryPal.model.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Long> {
    List<ShoppingCart> findByUserId(Long userId);

    void deleteByUserIdAndName(Long userId, String name);

    Optional<ShoppingCart> findByUserIdAndName(Long userId, String name);

    void deleteByUserId(Long userId);
}