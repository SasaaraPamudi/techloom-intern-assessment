package com.techloomai.pos_system.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductDTO {
    private Long product_id;
    private String product_name;
    private BigDecimal price;
    private Integer totalStock;
    private LocalDateTime createAt;
}
