package PantryPal.PantryPal.service;

import PantryPal.PantryPal.dto.ShoppingCartDTO;
import PantryPal.PantryPal.model.PantryItem;
//import PantryPal.PantryPal.model.Category;
import PantryPal.PantryPal.model.ShoppingCart;
import PantryPal.PantryPal.repository.ShoppingCartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import PantryPal.PantryPal.repository.PantryItemRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ShoppingCartService {
    private final ShoppingCartRepository shoppingCartRepository;
    private final PantryItemRepository pantryItemRepository;
    public ShoppingCartService(ShoppingCartRepository shoppingCartRepository, PantryItemRepository pantryItemRepository) {
        this.shoppingCartRepository = shoppingCartRepository;
        this.pantryItemRepository = pantryItemRepository;
    }
    

    public List<ShoppingCartDTO> getAllItems() {
        return shoppingCartRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ShoppingCartDTO addToCart(ShoppingCartDTO cartDTO) {
        ShoppingCart cartItem = new ShoppingCart();
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

    public void clearCart() {
        shoppingCartRepository.deleteAll();
    }

    @Transactional
public void checkout() {
    List<ShoppingCart> cartItems = shoppingCartRepository.findAll();
    List<PantryItem> pantryItems = pantryItemRepository.findAll();
    
    for (ShoppingCart cartItem : cartItems) {
        Optional<PantryItem> existingItem = pantryItems.stream()
            .filter(item -> item.getName().equalsIgnoreCase(cartItem.getName()) && 
                            item.getUnit().equalsIgnoreCase(cartItem.getUnit()))
            .findFirst();
            
        if (existingItem.isPresent()) {
            // Update quantity if same name and unit
            PantryItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + cartItem.getQuantity());
            pantryItemRepository.save(item);
        } else {
            // Create new pantry item
            PantryItem newItem = new PantryItem();
            newItem.setName(cartItem.getName());
            newItem.setCategory(cartItem.getCategory());
            newItem.setQuantity(cartItem.getQuantity());
            newItem.setUnit(cartItem.getUnit());
            pantryItemRepository.save(newItem);
        }
    }
    
    // Clear the cart after checkout
    shoppingCartRepository.deleteAll();
}

    private ShoppingCartDTO convertToDTO(ShoppingCart cartItem) {
        ShoppingCartDTO dto = new ShoppingCartDTO();
        dto.setId(cartItem.getId());
        dto.setName(cartItem.getName());
        dto.setQuantity(cartItem.getQuantity());
        dto.setUnit(cartItem.getUnit());
        dto.setCategory(cartItem.getCategory());
        return dto;
    }
}