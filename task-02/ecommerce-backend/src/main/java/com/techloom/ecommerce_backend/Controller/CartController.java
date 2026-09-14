package com.techloom.ecommerce_backend.Controller;

import com.techloom.ecommerce_backend.DTO.AddToCartRequest;
import com.techloom.ecommerce_backend.DTO.CartItemDTO;
import com.techloom.ecommerce_backend.Entity.CartItemEntity;
import com.techloom.ecommerce_backend.Entity.ProductEntity;
import com.techloom.ecommerce_backend.Service.CartService;
import com.techloom.ecommerce_backend.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {
    @Autowired
    private CartService cartService;

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<CartItemDTO> addToCart(@RequestBody AddToCartRequest dto){
        CartItemEntity item = cartService.addToCart(dto.getSessionId(),dto.getProductId(), dto.getQuantity());
        return ResponseEntity.ok(mapToDto(item));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<List<CartItemDTO>> getCart(@PathVariable String sessionId){
        List<CartItemEntity> items = cartService.getCartItems(sessionId);
        List<CartItemDTO> response = items.stream().map(this::mapToDto).collect(Collectors.toList());
        return ResponseEntity.ok(response);

    }

    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<String> removeFromCart(@PathVariable Long cartItemId){
        cartService.removeFromCart(cartItemId);
        return ResponseEntity.ok("Item removed successfully");
    }

    private CartItemDTO mapToDto(CartItemEntity item){
        ProductEntity product = productService.getProductById(item.getProductId());
        CartItemDTO dto = new CartItemDTO();
        dto.setCartItemId(item.getCartItemId());
        dto.setProductId(item.getProductId());
        dto.setProductName(product != null ? product.getName() : "Unknown");
        dto.setPrice(product != null ? product.getPrice() : 0.0);
        dto.setQuantity(item.getQuantity());
        dto.setSubtotal((product != null ? product.getPrice() : 0.0) * item.getQuantity());
        return dto;
    }

}
