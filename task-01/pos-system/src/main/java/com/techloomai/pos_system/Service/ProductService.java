package com.techloomai.pos_system.Service;

import com.techloomai.pos_system.DTO.ProductDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ProductService {
    ResponseEntity<ProductDTO> saveProduct(ProductDTO productDTO);
    ResponseEntity<ProductDTO> updateProduct(Long productId, ProductDTO product);
    void deleteProduct(Long productId);
    ProductDTO getProductById(Long productId);
    List<ProductDTO> getAllProducts();
    ProductDTO addStock(Long productId, Integer quantity);
    List<ProductDTO> getLowStockProducts(Integer threshold);

}
