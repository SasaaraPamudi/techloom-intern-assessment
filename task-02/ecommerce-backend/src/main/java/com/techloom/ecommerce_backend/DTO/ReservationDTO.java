package com.techloom.ecommerce_backend.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReservationDTO {
    private Long reservationId;
    private String sessionId;
    private Long productId;
    private Integer quantity;
    private String status = "ACTIVE";
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime expiresAt;

}
