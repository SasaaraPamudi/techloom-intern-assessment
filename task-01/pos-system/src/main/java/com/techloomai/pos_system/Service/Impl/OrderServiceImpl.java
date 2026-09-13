package com.techloomai.pos_system.Service.Impl;

import com.techloomai.pos_system.DAO.OrderDAO;
import com.techloomai.pos_system.DAO.ReservationDAO;
import com.techloomai.pos_system.DTO.OrderDTO;
import com.techloomai.pos_system.Entity.*;
import com.techloomai.pos_system.Service.OrderService;
import com.techloomai.pos_system.util.EntityDTOConversion;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {
    private final OrderDAO orderDao;
    private final ReservationDAO reservationDao;
    private final EntityDTOConversion entityDTOConversion;

    public OrderServiceImpl(OrderDAO orderDao,
                            ReservationDAO reservationDao,
                            EntityDTOConversion entityDTOConversion) {
        this.orderDao = orderDao;
        this.reservationDao = reservationDao;
        this.entityDTOConversion = entityDTOConversion;
    }

    @Override
    public OrderDTO processCheckout(OrderDTO orderDto) {
        if(orderDao.existsByPaymentToken(orderDto.getPaymentToken())){
            OrderEntity existingOrder = orderDao.findByPaymentToken(orderDto.getPaymentToken());
            return entityDTOConversion.toOrderDTO(existingOrder);
        }

        Long targetId = orderDto.getOrderId() != null ? orderDto.getOrderId() :
                (orderDto.getReservationId() != null ? orderDto.getReservationId().getResId() : null);

        OrderEntity orderEntity = orderDao.findById(targetId).orElse(null);

        if (orderEntity == null) {
            ReservationEntity reservation = reservationDao.findById(targetId)
                    .orElseThrow(() -> new IllegalArgumentException("Reservation not found with ID: " + targetId));

            orderEntity = orderDao.findByReservation(reservation);
            if (orderEntity == null) {
                orderEntity = new OrderEntity();
                orderEntity.setReservation(reservation);
                orderEntity.setTotalAmount(java.math.BigDecimal.ZERO);
                orderEntity.setCreatedAt(java.time.LocalDate.now());
            }
        }

        ReservationEntity reservation = orderEntity.getReservation();
        if (reservation == null || reservation.getStatus() != ReservationStatus.ACTIVE || LocalDateTime.now().isAfter(reservation.getExpiresAt())) {
            throw new IllegalStateException("Reservation is invalid or expired");
        }

        reservation.setStatus(ReservationStatus.COMPLETED);
        reservationDao.save(reservation);

        orderEntity.setPaymentToken(orderDto.getPaymentToken());
        if (orderDto.getTotalAmount() != null) {
            orderEntity.setTotalAmount(orderDto.getTotalAmount());
        }

        OrderEntity savedOrder = orderDao.save(orderEntity);

        return entityDTOConversion.toOrderDTO(savedOrder);

    }

    @Override
    public OrderDTO handlePaymentFailure(Long orderId) {
        OrderEntity order = orderDao.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        order.setStatus(OrderStatus.FAILED);
        ReservationEntity reservation = order.getReservation();
        if (reservation != null && LocalDateTime.now().isBefore(reservation.getExpiresAt())) {
            reservation.setStatus(ReservationStatus.ACTIVE);
            reservationDao.save(reservation);
        }

        OrderEntity savedOrder = orderDao.save(order);
        return entityDTOConversion.toOrderDTO(savedOrder);
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        List<OrderEntity> allOrders = orderDao.findAll();
        return entityDTOConversion.toOrderDTOList(allOrders);
    }

}