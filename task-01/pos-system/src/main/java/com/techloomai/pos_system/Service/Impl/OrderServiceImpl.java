package com.techloomai.pos_system.Service.Impl;

import com.techloomai.pos_system.DAO.OrderDAO;
import com.techloomai.pos_system.DAO.ReservationDAO;
import com.techloomai.pos_system.DTO.OrderDTO;
import com.techloomai.pos_system.Entity.OrderEntity;
import com.techloomai.pos_system.Entity.OrderStatus;
import com.techloomai.pos_system.Entity.ReservationEntity;
import com.techloomai.pos_system.Entity.ReservationStatus;
import com.techloomai.pos_system.Service.OrderService;
import com.techloomai.pos_system.util.EntityDTOConversion;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderDAO orderDao;
    private final ReservationDAO reservationDao;
    private final EntityDTOConversion entityDTOConversion;
    @Override
    public OrderDTO processCheckout(OrderDTO orderDto) {
        if(orderDao.existsByPaymentToken(orderDto.getPaymentToken())){
            OrderEntity existingOrder =orderDao.findByPaymentToken(orderDto.getPaymentToken());
            return entityDTOConversion.toOrderDTO(existingOrder);
        }
        ReservationEntity reservation = reservationDao.findById(orderDto.getReservationId().getResId())
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found with ID: " + orderDto.getReservationId().getResId()));

        if (reservation.getStatus() != ReservationStatus.ACTIVE || LocalDateTime.now().isAfter(reservation.getExpiresAt())) {
            throw new IllegalStateException("Reservation is invalid or expired");
        }

        reservation.setStatus(ReservationStatus.COMPLETED);
        reservationDao.save(reservation);

        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setReservation(reservation);
        orderEntity.setPaymentToken(orderDto.getPaymentToken());
        orderEntity.setTotalAmount(orderDto.getTotalAmount());

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
    public void saveOrder(OrderDTO order) {

    }

    @Override
    public void updateOrder(Long orderId, OrderDTO order) {

    }

    @Override
    public void deleteOrder(Long orderId) {

    }

    @Override
    public List<OrderDTO> getAllOrders() {
        return List.of();
    }
}
