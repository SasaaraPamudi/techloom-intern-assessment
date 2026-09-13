package com.techloomai.pos_system.Service;

import com.techloomai.pos_system.DTO.OrderDTO;
import com.techloomai.pos_system.DTO.PaymentDTO;

public interface PaymentService {
    OrderDTO processPayment(PaymentDTO payment);
}
