package com.techloomai.pos_system.Service;

import com.techloomai.pos_system.DTO.ProductDTO;

import java.util.List;

public interface ProductService {
    void saveProduct(ProductDTO product);
    void updateProduct(Long productId, ProductDTO product);
    void deleteProduct(Long productId);
    ProductDTO getProductById(Long productId);
    List<ProductDTO> getAllProducts();
    ProductDTO addStock(Long productId, Integer quantity);
    List<ProductDTO> getLowStockProducts(Integer threshold);

}
