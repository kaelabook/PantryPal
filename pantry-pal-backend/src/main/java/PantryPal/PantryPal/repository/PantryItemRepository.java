package com.pantrypal.repository;

import com.pantrypal.model.PantryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PantryItemRepository extends JpaRepository<PantryItem, Long> {
    List<PantryItem> findByUserId(Long userId);
    Optional<PantryItem> findByUserIdAndName(Long userId, String name);
}