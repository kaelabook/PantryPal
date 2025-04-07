package com.pantrypal.repository;

import com.pantrypal.model.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Long> {
    List<ShoppingCart> findByUserId(Long userId);
    void deleteByUserIdAndName(Long userId, String name);
}