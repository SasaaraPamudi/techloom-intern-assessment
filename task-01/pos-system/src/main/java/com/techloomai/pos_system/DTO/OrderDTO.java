package com.techloomai.pos_system.DTO;

import com.techloomai.pos_system.Entity.OrderEntity;
import com.techloomai.pos_system.Entity.OrderStatus;
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
    private ReservationEntity reservationId;
    private BigDecimal totalAmount;
    private OrderStatus status = OrderStatus.PENDING;
    private String paymentToken;
}
