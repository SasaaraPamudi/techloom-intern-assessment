package com.techloomai.pos_system.Service.Impl;

import com.techloomai.pos_system.DAO.ProductDAO;
import com.techloomai.pos_system.DTO.ProductDTO;
import com.techloomai.pos_system.Entity.ProductEntity;
import com.techloomai.pos_system.Service.ProductService;
import com.techloomai.pos_system.util.EntityDTOConversion;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {
    private final ProductDAO productDao;
    private final EntityDTOConversion entityDTOConversion;

    public ProductServiceImpl(ProductDAO productDAO, EntityDTOConversion entityDTOConversion){
        this.productDao = productDAO;
        this.entityDTOConversion = entityDTOConversion;
    }

    @Override
    public ResponseEntity<ProductDTO> saveProduct(ProductDTO productDTO) {
        if (productDTO == null || productDTO.getProduct_name() == null || productDTO.getProduct_name().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be null or empty.");
        }

        ProductEntity entity = new ProductEntity();
        entity.setProduct_name(productDTO.getProduct_name());
        entity.setPrice(productDTO.getPrice());
        entity.setTotalStock(productDTO.getTotalStock());

        ProductEntity savedEntity = productDao.save(entity);

        ProductDTO responseDto = new ProductDTO();
        responseDto.setProduct_id(savedEntity.getProduct_id());
        responseDto.setProduct_name(savedEntity.getProduct_name());
        responseDto.setPrice(savedEntity.getPrice());
        responseDto.setTotalStock(savedEntity.getTotalStock());

        return ResponseEntity.ok(responseDto);
    }

    @Override
    public ResponseEntity<ProductDTO> updateProduct(Long productId, ProductDTO product) {
        Optional<ProductEntity> foundproduct = productDao.findById(productId);
        if (!foundproduct.isPresent()) {
            throw new RuntimeException("The product is not found");
        }

        ProductEntity existingProduct = foundproduct.get();
        existingProduct.setProduct_name(product.getProduct_name());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setTotalStock(product.getTotalStock());
        ProductEntity savedProduct = productDao.save(existingProduct);
        ProductDTO responseDto = new ProductDTO();
        responseDto.setProduct_id(savedProduct.getProduct_id());
        responseDto.setProduct_name(savedProduct.getProduct_name());
        responseDto.setPrice(savedProduct.getPrice());
        responseDto.setTotalStock(savedProduct.getTotalStock());

        return ResponseEntity.ok(responseDto);
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
