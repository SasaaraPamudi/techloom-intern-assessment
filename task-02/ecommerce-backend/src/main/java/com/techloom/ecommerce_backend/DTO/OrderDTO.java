package com.techloom.ecommerce_backend.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderDTO {
    private Long orderId;
    private String sessionId;
    private Long reservationId;
    private Double totalAmount;
    private String status;
    private LocalDateTime createdAt;
}
