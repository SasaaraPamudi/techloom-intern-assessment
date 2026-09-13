package com.techloomai.pos_system.Service.Impl;

import com.techloomai.pos_system.DAO.ProductDAO;
import com.techloomai.pos_system.DTO.ProductDTO;
import com.techloomai.pos_system.Entity.ProductEntity;
import com.techloomai.pos_system.Service.ProductService;
import com.techloomai.pos_system.util.EntityDTOConversion;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductDAO productDao;
    private final EntityDTOConversion entityDTOConversion;

    @Override
    public void saveProduct(ProductDTO product) {
        if(productDao.existsById(product.getProduct_id())){
            throw new RuntimeException("Product with id" + product.getProduct_id() + " is already exists!");
        }
        productDao.save(entityDTOConversion.toProductEntity(product));

    }

    @Override
    public void updateProduct(Long productId, ProductDTO product) {
        Optional<ProductEntity> foundproduct = productDao.findById(productId);
        if(!foundproduct.isPresent()){
            throw new RuntimeException("The product is not found");
        }
        foundproduct.get().setProduct_id(product.getProduct_id());
        foundproduct.get().setProduct_name(product.getProduct_name());
        foundproduct.get().setPrice(product.getPrice());
        foundproduct.get().setTotalStock(product.getTotalStock());

    }

    @Override
    public void deleteProduct(Long productId) {
        Optional<ProductEntity> product = productDao.findById(productId);
        if(!product.isPresent()){
            throw new RuntimeException("The product is not found");
        }
        productDao.delete(product.get());

    }

    @Override
    public ProductDTO getProductById(Long productId) {
        Optional<ProductEntity> product = productDao.findById(productId);
        if(!product.isPresent()){
            throw new RuntimeException("The product is not found");
        }
        return entityDTOConversion.toProductDTO(productDao.getReferenceById(product.get().getProduct_id()));
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        List<ProductEntity> allProducts = productDao.findAll();
        return entityDTOConversion.toProductDTOList(allProducts);
    }

    @Override
    public ProductDTO addStock(Long productId, Integer quantity) {
        if(quantity <= 0){
            throw new IllegalArgumentException("Stock quantity must be positive");
        }
        ProductEntity product = productDao.findByIdWithLock(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found witht the Id: " + productId));

        product.setTotalStock(product.getTotalStock() + quantity);
        ProductEntity updatedProduct = productDao.save(product);
        return entityDTOConversion.toProductDTO(updatedProduct);
    }

    @Override
    public List<ProductDTO> getLowStockProducts(Integer threshold) {
        return productDao.findByTotalStockLessThanEqual(threshold).stream()
                .map(entityDTOConversion ::toProductDTO)
                .collect(Collectors.toList());
    }
}
