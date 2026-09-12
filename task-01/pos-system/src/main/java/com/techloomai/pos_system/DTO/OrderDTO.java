package com.techloomai.pos_system.DTO;

import com.techloomai.pos_system.Entity.OrderEntity;
import com.techloomai.pos_system.Entity.ReservationEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderDTO {
    private Long orderId;
    private ReservationEntity reservation;
    private BigDecimal totalAmount;
    private OrderEntity.Status status = OrderEntity.Status.PENDING;
    private String paymentToken;
}
