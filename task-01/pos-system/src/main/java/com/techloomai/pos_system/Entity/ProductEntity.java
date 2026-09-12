package com.techloomai.pos_system.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity

@Table(name = "products")
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long product_id;

    @Column(nullable =false)
    private String product_name;

    @Column(nullable =false)
    private BigDecimal price;

    @Column(name= "total_stock", nullable = false)
    private Integer totalStock;

    @CreationTimestamp
    @Column(name="created_at",nullable=false, updatable=false)
    private LocalDateTime createAt;


}
