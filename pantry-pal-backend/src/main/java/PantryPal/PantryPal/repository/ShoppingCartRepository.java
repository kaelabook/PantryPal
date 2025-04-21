package PantryPal.PantryPal.repository;

import PantryPal.PantryPal.model.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Long> {
    // Basic CRUD operations are provided by JpaRepository
}