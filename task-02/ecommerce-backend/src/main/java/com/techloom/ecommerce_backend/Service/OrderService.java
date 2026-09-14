package com.techloom.ecommerce_backend.Service;

import com.techloom.ecommerce_backend.DTO.OrderDTO;
import com.techloom.ecommerce_backend.Entity.OrderEntity;

import java.util.List;

public interface OrderService {
    OrderEntity checkout(String sessionId);
    OrderEntity processPayment(Long orderId, String paymentToken, String simulationStatus);
    List<OrderEntity> getOrderHistory(String sessionId);
    OrderEntity cancelOrder(Long orderId, String reason);


}
