package com.techloomai.pos_system.Controller;

import com.techloomai.pos_system.DAO.ProductDAO;
import com.techloomai.pos_system.DTO.ProductDTO;
import com.techloomai.pos_system.Service.Impl.ProductServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/product")
@RequiredArgsConstructor
public class ProductController {
    private final ProductServiceImpl productService;
    private final ProductDAO productDAO;

    @PostMapping("/save")
    public ResponseEntity<Long> saveProduct(@RequestBody ProductDTO productDTO){
        productService.saveProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId){
        try{
            productService.deleteProduct(productId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping
    public ResponseEntity<Void> updateProduct(@RequestBody ProductDTO productDTO){
        try{
            productService.updateProduct(productDTO.getProduct_id(), productDTO);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping(value = "/get-all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ProductDTO>> getAllProducts(){
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long productId){
        return ResponseEntity.ok(productService.getProductById(productId));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductDTO>> getLowStockProducts(@RequestParam(defaultValue = "10")Integer threshhold){
        return ResponseEntity.ok(productService.getLowStockProducts(threshhold));
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<ProductDTO> addStock(@PathVariable Long Id, @RequestParam Integer quantity){
        return ResponseEntity.ok(productService.addStock(Id, quantity));
    }


}
