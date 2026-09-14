package com.techloom.ecommerce_backend.DTO;

import lombok.Data;

@Data
public class CartItemDTO {
    private Long cartItemId;
    private Long productId;
    private String productName;
    private Double price;
    private Integer quantity;
    private Double subtotal;
}
