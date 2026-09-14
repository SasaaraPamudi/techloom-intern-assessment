package com.techloom.ecommerce_backend.DAO;

import com.techloom.ecommerce_backend.Entity.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationDAO extends JpaRepository<ReservationEntity, Long> {
    List<ReservationEntity> findBySessionIdAndStatus(String sessionId, String status);
}
