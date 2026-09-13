package com.techloomai.pos_system.Service.Impl;

import com.techloomai.pos_system.DAO.OrderDAO;
import com.techloomai.pos_system.DAO.ReservationDAO;
import com.techloomai.pos_system.DTO.OrderDTO;
import com.techloomai.pos_system.DTO.PaymentDTO;
import com.techloomai.pos_system.Entity.OrderEntity;
import com.techloomai.pos_system.Entity.OrderStatus;
import com.techloomai.pos_system.Entity.ReservationEntity;
import com.techloomai.pos_system.Entity.ReservationStatus;
import com.techloomai.pos_system.Service.PaymentService;
import com.techloomai.pos_system.util.EntityDTOConversion;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final OrderDAO orderDAO;
    private final ReservationDAO reservationDAO;
    private final EntityDTOConversion entityDTOConversion;


    @Override
    public OrderDTO processPayment(PaymentDTO payment) {
        OrderEntity order = orderDAO.findById(payment.getOrderId())
                .orElseThrow(()-> new IllegalArgumentException("Order not found with ID: " + payment.getOrderId()));
        ReservationEntity reservation = order.getReservation();

        switch(payment.getMode()){
            case SUCCESS:
                order.setStatus(OrderStatus.PAID);
                if(reservation != null){
                    reservation.setStatus(ReservationStatus.COMPLETED);
                    reservationDAO.save(reservation);
                }
                break;
            case TIMEOUT:
                order.setStatus(OrderStatus.EXPIRED);
                if(reservation != null){
                    reservation.setStatus(ReservationStatus.EXPIRED);
                    reservationDAO.save(reservation);
                }
                break;
        }
        OrderEntity savedOrder = orderDAO.save(order);
        return entityDTOConversion.toOrderDTO(savedOrder);
    }
}
