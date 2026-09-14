package com.techloom.ecommerce_backend.Service.Impl;

import com.techloom.ecommerce_backend.DAO.CartItemDAO;
import com.techloom.ecommerce_backend.DAO.OrderDAO;
import com.techloom.ecommerce_backend.DAO.ProductDAO;
import com.techloom.ecommerce_backend.DAO.ReservationDAO;
import com.techloom.ecommerce_backend.DTO.OrderDTO;
import com.techloom.ecommerce_backend.Entity.CartItemEntity;
import com.techloom.ecommerce_backend.Entity.OrderEntity;
import com.techloom.ecommerce_backend.Entity.ProductEntity;
import com.techloom.ecommerce_backend.Entity.ReservationEntity;
import com.techloom.ecommerce_backend.Service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    @Autowired
    private CartItemDAO cartItemDAO;
    @Autowired
    private ProductDAO productDAO;
    @Autowired
    private ReservationDAO reservationDAO;
    @Autowired
    private OrderDAO orderDAO;

    @Override
    public OrderEntity checkout(String sessionId) {
        List<CartItemEntity> cartItems = cartItemDAO.findBySessionId(sessionId);
        if(cartItems.isEmpty()){
            throw new RuntimeException("Cart is empty!");
        }
        double totalAmount = 0.0;
        ReservationEntity activeReservation = null;

        for(CartItemEntity item: cartItems){
            ProductEntity product = productDAO.findById(item.getProductId()).orElseThrow(()-> new RuntimeException("Product not found"));

            if(product.getStock() < item.getQuantity()){
                throw new RuntimeException("Out of stock for the product: " + product.getName());
            }

            product.setStock(product.getStock() - item.getQuantity());
            productDAO.save(product);

            ReservationEntity reservationEntity = new ReservationEntity();
            reservationEntity.setSessionId(sessionId);
            reservationEntity.setProductId(product.getProductId());
            reservationEntity.setQuantity(item.getQuantity());
            reservationEntity.setStatus("ACTIVE");
            reservationEntity.setExpiresAt(LocalDateTime.now().plusMinutes(5));
            activeReservation = reservationDAO.save(reservationEntity);

            totalAmount += product.getPrice() * item.getQuantity();
        }
        OrderEntity order = new OrderEntity();
        order.setSessionId(sessionId);
        order.setReservationId(activeReservation.getReservationId());
        order.setTotalAmount(totalAmount);
        order.setStatus("PENDING");
        OrderEntity savedOrder = orderDAO.save(order);

        cartItemDAO.deleteBySessionId(sessionId);
        return savedOrder;
    }

    @Override
    public OrderEntity processPayment(Long orderId, String paymentToken, String simulationStatus) {
        orderDAO.findByPaymentToken(paymentToken).ifPresent(o->{throw new RuntimeException("Duplicate payment attempt detected for the token: " + paymentToken);
        });

        OrderEntity orderEntity = orderDAO.findById(orderId).orElseThrow(()-> new RuntimeException("Order not found"));

        orderEntity.setPaymentToken(paymentToken);
        if("SUCCESS".equalsIgnoreCase(simulationStatus)){
            orderEntity.setStatus("PAID");
        }else if("TIMEOUT".equalsIgnoreCase(simulationStatus)){
            orderEntity.setStatus("FAILED");
        }else{
            orderEntity.setStatus("FAILED");
        }
        return orderDAO.save(orderEntity);
    }

    @Override
    public List<OrderEntity> getOrderHistory(String sessionId) {
        return orderDAO.findBySessionId(sessionId);
    }

    @Override
    public OrderEntity cancelOrder(Long orderId, String reason) {
        OrderEntity order = orderDAO.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        if ("PAID".equals(order.getStatus()) || "PENDING".equals(order.getStatus())) {
            order.setStatus("PAID".equals(order.getStatus()) ? "REFUNDED" : "CANCELLED");
            if (order.getReservationId() != null) {
                ReservationEntity reservation = reservationDAO.findById(order.getReservationId()).orElse(null);
                if (reservation != null) {
                    ProductEntity product = productDAO.findById(reservation.getProductId()).orElse(null);
                    if (product != null) {
                        product.setStock(product.getStock() + reservation.getQuantity());
                        productDAO.save(product);
                    }
                    reservation.setStatus("CANCELLED");
                    reservationDAO.save(reservation);
                }
            }
        }
        return orderDAO.save(order);
    }
}
