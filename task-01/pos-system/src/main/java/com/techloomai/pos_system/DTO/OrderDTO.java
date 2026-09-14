package com.techloomai.pos_system.DTO;

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

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getPaymentToken() {
        return paymentToken;
    }

    public void setPaymentToken(String paymentToken) {
        this.paymentToken = paymentToken;
    }

    public ReservationEntity getReservationId() {
        return reservationId;
    }

    public void setReservationId(ReservationEntity reservationId) {
        this.reservationId = reservationId;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}
