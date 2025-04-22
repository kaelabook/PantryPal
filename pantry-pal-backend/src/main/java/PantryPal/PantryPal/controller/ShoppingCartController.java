package PantryPal.PantryPal.controller;

import PantryPal.PantryPal.dto.ShoppingCartDTO;
import PantryPal.PantryPal.service.ShoppingCartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shopping-cart")
public class ShoppingCartController {
    private final ShoppingCartService shoppingCartService;

    public ShoppingCartController(ShoppingCartService shoppingCartService) {
        this.shoppingCartService = shoppingCartService;
    }

    @GetMapping
    public ResponseEntity<List<ShoppingCartDTO>> getAllItems() {
        List<ShoppingCartDTO> items = shoppingCartService.getAllItems();
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<ShoppingCartDTO> addToCart(@RequestBody ShoppingCartDTO cartDTO) {
        ShoppingCartDTO addedItem = shoppingCartService.addToCart(cartDTO);
        return ResponseEntity.ok(addedItem);
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

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        shoppingCartService.clearCart();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/checkout")
    public ResponseEntity<Void> checkout() {
    shoppingCartService.checkout();
    return ResponseEntity.ok().build();
}
}