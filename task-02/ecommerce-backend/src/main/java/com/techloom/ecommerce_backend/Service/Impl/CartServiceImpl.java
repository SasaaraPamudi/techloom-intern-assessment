package com.techloom.ecommerce_backend.Service.Impl;

import com.techloom.ecommerce_backend.DAO.CartItemDAO;
import com.techloom.ecommerce_backend.Entity.CartItemEntity;
import com.techloom.ecommerce_backend.Service.CartService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    @Autowired
    private CartItemDAO cartItemDAO;

    @Override
    public CartItemEntity addToCart(String sessionId, Long productId, Integer quantity) {
        Optional<CartItemEntity> existingItem = cartItemDAO.findBySessionIdAndProductId(sessionId, productId);

        if(existingItem.isPresent()){
            CartItemEntity item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemDAO.save(item);
        }else{
            CartItemEntity newItem = new CartItemEntity();
            newItem.setSessionId(sessionId);
            newItem.setProductId(productId);
            newItem.setQuantity(quantity);
            return cartItemDAO.save(newItem);
        }
    }

    @Override
    public List<CartItemEntity> getCartItems(String sessionId) {
        return cartItemDAO.findBySessionId(sessionId);
    }

    @Override
    public void removeFromCart(Long cartItemId) {
        cartItemDAO.deleteById(cartItemId);

    }
}
