package com.techloom.ecommerce_backend.DAO;

import com.techloom.ecommerce_backend.Entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderDAO extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findBySessionId(String sessionId);
    Optional<OrderEntity> findByPaymentToken(String paymentToken);
}
