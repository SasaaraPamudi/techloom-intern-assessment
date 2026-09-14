package com.techloom.ecommerce_backend.DTO;

import lombok.Data;

@Data
public class AddToCartRequest {
    private String sessionId;
    private Long productId;
    private Integer quantity;
}
