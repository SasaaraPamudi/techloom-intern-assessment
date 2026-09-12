package com.techloomai.pos_system.Service;

import com.techloomai.pos_system.DTO.OrderDTO;

import java.util.List;

public interface OrderService {
    OrderDTO processCheckout(OrderDTO orderDto);
    OrderDTO handlePaymentFailure(Long orderId);
    void saveOrder(OrderDTO order);
    void updateOrder(Long orderId, OrderDTO order);
    void deleteOrder(Long orderId);
    List<OrderDTO> getAllOrders();
}
