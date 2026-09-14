package com.techloom.ecommerce_backend.DTO;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long orderId;
    private String paymentToken;
    private String paymentStatusSimulation;
}
