package PantryPal.PantryPal.controller;

import PantryPal.PantryPal.dto.ShoppingCartDTO;
import PantryPal.PantryPal.service.ShoppingCartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shopping-cart")
@CrossOrigin(origins = "http://localhost:4200")
public class ShoppingCartController {
    private final ShoppingCartService shoppingCartService;

    public ShoppingCartController(ShoppingCartService shoppingCartService) {
        this.shoppingCartService = shoppingCartService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ShoppingCartDTO>> getShoppingCartForUser(@PathVariable Long userId) {
        List<ShoppingCartDTO> cartItems = shoppingCartService.getShoppingCartForUser(userId);
        return ResponseEntity.ok(cartItems);
    }

    @PostMapping
    public ResponseEntity<ShoppingCartDTO> addToCart(@RequestBody ShoppingCartDTO cartDTO) {
    try {
        ShoppingCartDTO addedItem = shoppingCartService.addToCart(cartDTO);
        return ResponseEntity.ok(addedItem);
    } catch (Exception e) {
        return ResponseEntity.badRequest().build();
    }
    }


    @PutMapping("/{id}")
    public ResponseEntity<ShoppingCartDTO> updateCartItem(
            @PathVariable Long id,
            @RequestBody ShoppingCartDTO cartDTO) {
        ShoppingCartDTO updatedItem = shoppingCartService.updateCartItem(id, cartDTO);
        return ResponseEntity.ok(updatedItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long id) {
        shoppingCartService.removeFromCart(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear/user/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        shoppingCartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}