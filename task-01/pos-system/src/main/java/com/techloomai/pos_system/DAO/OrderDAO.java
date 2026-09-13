package com.techloomai.pos_system.DAO;

import com.techloomai.pos_system.Entity.OrderEntity;
import com.techloomai.pos_system.Entity.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDAO extends JpaRepository<OrderEntity,Long> {
    boolean existsByPaymentToken(String paymentToken);
    OrderEntity findByPaymentToken(String paymentToken);
    OrderEntity findByReservation(ReservationEntity reservation);
}
