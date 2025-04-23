package PantryPal.PantryPal.service;

import PantryPal.PantryPal.dto.PantryItemDTO;
import PantryPal.PantryPal.dto.ShoppingCartDTO;
import PantryPal.PantryPal.model.ShoppingCart;
import PantryPal.PantryPal.repository.ShoppingCartRepository;
import PantryPal.PantryPal.repository.PantryItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import PantryPal.PantryPal.model.Category;

@SuppressWarnings("unused")
@Service
public class ShoppingCartService {
    private final ShoppingCartRepository shoppingCartRepository;
    private final PantryItemService pantryItemService;
    private final ValidationService validationService;

    public ShoppingCartService(ShoppingCartRepository shoppingCartRepository,
                             PantryItemService pantryItemService,
                             ValidationService validationService) {
        this.shoppingCartRepository = shoppingCartRepository;
        this.pantryItemService = pantryItemService;
        this.validationService = validationService;
    }

    public List<ShoppingCartDTO> getAllItems() {
        return shoppingCartRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ShoppingCartDTO addToCart(ShoppingCartDTO cartDTO) {
        ValidationService.ValidationResult validation = validateCartItem(cartDTO);
        if (!validation.isValid()) {
            throw new IllegalArgumentException(String.join(", ", validation.getErrors()));
        }

        String unit = cartDTO.getUnit() != null ? cartDTO.getUnit() : "";
        Optional<ShoppingCart> existingItem = shoppingCartRepository
            .findByNameAndCategoryAndUnitIgnoreCase(
                cartDTO.getName(),
                cartDTO.getCategory(),
                unit);

        ShoppingCart cartItem;
        if (existingItem.isPresent()) {
            cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + cartDTO.getQuantity());
        } else {
            cartItem = new ShoppingCart();
            cartItem.setName(cartDTO.getName());
            cartItem.setQuantity(cartDTO.getQuantity());
            cartItem.setUnit(cartDTO.getUnit());
            cartItem.setCategory(cartDTO.getCategory());
        }

        ShoppingCart savedItem = shoppingCartRepository.save(cartItem);
        return convertToDTO(savedItem);
    }

    @Transactional
    public void checkout() {
        List<ShoppingCart> cartItems = shoppingCartRepository.findAll();
        
        for (ShoppingCart cartItem : cartItems) {
            PantryItemDTO dto = new PantryItemDTO();
            dto.setName(cartItem.getName());
            dto.setCategory(cartItem.getCategory());
            dto.setQuantity(cartItem.getQuantity());
            dto.setUnit(cartItem.getUnit());
            
            pantryItemService.createOrUpdateItem(dto);
        }
        
        shoppingCartRepository.deleteAll();
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

    private ShoppingCartDTO convertToDTO(ShoppingCart cartItem) {
        ShoppingCartDTO dto = new ShoppingCartDTO();
        dto.setId(cartItem.getId());
        dto.setName(cartItem.getName());
        dto.setQuantity(cartItem.getQuantity());
        dto.setUnit(cartItem.getUnit());
        dto.setCategory(cartItem.getCategory());
        return dto;
    }

    private ValidationService.ValidationResult validateCartItem(ShoppingCartDTO cartDTO) {
        ValidationService.ValidationResult result = new ValidationService.ValidationResult();
        
        if (cartDTO.getName() == null || cartDTO.getName().trim().isEmpty()) {
            result.addError("Item name is required");
        }
        
        if (cartDTO.getCategory() == null) {
            result.addError("Category is required");
        }
        
        if (cartDTO.getQuantity() <= 0) {
            result.addError("Quantity must be positive");
        }
        
        return result;
    }

    public List<ShoppingCartDTO> getItemsByCategory(Category category) {
        return shoppingCartRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}