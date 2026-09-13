package com.techloomai.pos_system.Service;

import com.techloomai.pos_system.DTO.OrderDTO;

import java.util.List;

public interface OrderService {
    OrderDTO processCheckout(OrderDTO orderDto);
    OrderDTO handlePaymentFailure(Long orderId);
}
