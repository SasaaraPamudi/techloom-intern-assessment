package com.techloom.ecommerce_backend.Service;

import com.techloom.ecommerce_backend.DTO.ProductDTO;
import com.techloom.ecommerce_backend.Entity.ProductEntity;

import java.util.List;

public interface ProductService {
    List<ProductEntity> getAllProducts();
    ProductEntity getProductById(Long Id);
    List<ProductEntity> searchProducts(String keyword);
    List<ProductEntity> getProductsByCategory(String category);

}
