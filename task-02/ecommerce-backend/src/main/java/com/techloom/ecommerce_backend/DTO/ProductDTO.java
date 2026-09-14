package com.techloom.ecommerce_backend.DTO;

import lombok.Data;

@Data
public class ProductDTO {
    private Long productId;
    private String name;
    private String description;
    private String category;
    private Double price;
    private Integer stock;
}
