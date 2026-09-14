package com.techloom.ecommerce_backend.DAO;

import com.techloom.ecommerce_backend.Entity.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartItemDAO extends JpaRepository<CartItemEntity, Long> {
    List<CartItemEntity> findBySessionId(String sessionId);
    Optional<CartItemEntity> findBySessionIdAndProductId(String sessionId, Long productId);
    void deleteBySessionId(String sessionId);
}
