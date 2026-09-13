package com.techloomai.pos_system.DAO;

import com.techloomai.pos_system.Entity.ProductEntity;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import java.util.Optional;

public interface ProductDAO extends JpaRepository<ProductEntity, Long>{
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM ProductEntity p WHERE p.id = :id")
    Optional<ProductEntity> findByIdWithLock(@Param("id") Long id);

    boolean existsById(Long productId);

    List<ProductEntity> findByTotalStockLessThanEqual(Integer threshold);
}
