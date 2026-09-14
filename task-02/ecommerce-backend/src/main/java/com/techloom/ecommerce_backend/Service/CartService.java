package com.techloom.ecommerce_backend.Service;

import com.techloom.ecommerce_backend.DTO.CartItemDTO;
import com.techloom.ecommerce_backend.Entity.CartItemEntity;

import java.util.List;

public interface CartService {
    CartItemEntity addToCart(String sessionId, Long productId, Integer quantity);
    List<CartItemEntity> getCartItems(String sessionId);
    void removeFromCart(Long cartItemId);
}
