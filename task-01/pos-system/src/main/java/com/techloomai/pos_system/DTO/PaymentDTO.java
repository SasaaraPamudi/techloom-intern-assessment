package com.techloomai.pos_system.DTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentDTO {
    private Long orderId;
    private String paymentToken;
    private BigDecimal amount;
    private Mode mode;

}
