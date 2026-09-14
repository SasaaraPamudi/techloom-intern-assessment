package com.techloom.ecommerce_backend.Service.Impl;

import com.techloom.ecommerce_backend.DAO.ProductDAO;
import com.techloom.ecommerce_backend.Entity.ProductEntity;
import com.techloom.ecommerce_backend.Service.ProductService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductDAO productDAO;
    @Override
    public List<ProductEntity> getAllProducts() {
        return productDAO.findAll();
    }

    @Override
    public ProductEntity getProductById(Long Id) {
        return productDAO.findById(Id).orElseThrow(()-> new RuntimeException("Product not found with id: "+  Id));
    }

    @Override
    public List<ProductEntity> searchProducts(String keyword) {
        return productDAO.findByName(keyword);
    }

    @Override
    public List<ProductEntity> getProductsByCategory(String category) {
        return productDAO.findByCategory(category);
    }
}
