package PantryPal.PantryPal.repository;

import PantryPal.PantryPal.model.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Long> {
    List<ShoppingCart> findByUserId(Long userId);

    void deleteByUserIdAndName(Long userId, String name);
}