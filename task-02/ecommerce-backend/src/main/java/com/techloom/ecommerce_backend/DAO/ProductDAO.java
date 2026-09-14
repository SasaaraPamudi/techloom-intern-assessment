package com.techloom.ecommerce_backend.DAO;

import com.techloom.ecommerce_backend.Entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductDAO extends JpaRepository<ProductEntity, Long> {
    List<ProductEntity> findByCategory(String category);
    List<ProductEntity> findByName(String name);
    List<ProductEntity> findByStock(Integer stock);
}
