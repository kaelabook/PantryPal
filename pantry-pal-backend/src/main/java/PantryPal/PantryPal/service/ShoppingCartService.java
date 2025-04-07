package com.pantrypal.service;

import com.pantrypal.dto.ShoppingCartDTO;
import com.pantrypal.model.ShoppingCart;
import com.pantrypal.repository.ShoppingCartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShoppingCartService {
    private final ShoppingCartRepository shoppingCartRepository;

    @Autowired
    public ShoppingCartService(ShoppingCartRepository shoppingCartRepository) {
        this.shoppingCartRepository = shoppingCartRepository;
    }

    public List<ShoppingCartDTO> getShoppingCartForUser(Long userId) {
        List<ShoppingCart> cartItems = shoppingCartRepository.findByUserId(userId);
        return cartItems.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ShoppingCartDTO addToCart(ShoppingCartDTO cartDTO) {
        ShoppingCart cartItem = new ShoppingCart();
        cartItem.setUserId(cartDTO.getUserId());
        cartItem.setName(cartDTO.getName());
        cartItem.setQuantity(cartDTO.getQuantity());
        cartItem.setUnit(cartDTO.getUnit());
        cartItem.setCategory(cartDTO.getCategory());

        ShoppingCart savedItem = shoppingCartRepository.save(cartItem);
        return convertToDTO(savedItem);
    }

    public ShoppingCartDTO updateCartItem(Long id, ShoppingCartDTO cartDTO) {
        ShoppingCart existingItem = shoppingCartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        existingItem.setName(cartDTO.getName());
        existingItem.setQuantity(cartDTO.getQuantity());
        existingItem.setUnit(cartDTO.getUnit());
        existingItem.setCategory(cartDTO.getCategory());

        ShoppingCart updatedItem = shoppingCartRepository.save(existingItem);
        return convertToDTO(updatedItem);
    }

    public void removeFromCart(Long id) {
        shoppingCartRepository.deleteById(id);
    }

    public void clearCart(Long userId) {
        shoppingCartRepository.deleteByUserId(userId);
    }

    private ShoppingCartDTO convertToDTO(ShoppingCart cartItem) {
        ShoppingCartDTO dto = new ShoppingCartDTO();
        dto.setId(cartItem.getId());
        dto.setUserId(cartItem.getUserId());
        dto.setName(cartItem.getName());
        dto.setQuantity(cartItem.getQuantity());
        dto.setUnit(cartItem.getUnit());
        dto.setCategory(cartItem.getCategory());
        return dto;
    }
}