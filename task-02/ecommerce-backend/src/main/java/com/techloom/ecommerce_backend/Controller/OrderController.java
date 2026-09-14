package com.techloom.ecommerce_backend.Controller;

import com.techloom.ecommerce_backend.DTO.CancelOrderRequest;
import com.techloom.ecommerce_backend.DTO.CheckoutRequest;
import com.techloom.ecommerce_backend.DTO.OrderDTO;
import com.techloom.ecommerce_backend.DTO.PaymentRequest;
import com.techloom.ecommerce_backend.Entity.OrderEntity;
import com.techloom.ecommerce_backend.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderDTO> checkout(@RequestBody CheckoutRequest request){
        OrderEntity order = orderService.checkout(request.getSessionId());
        return ResponseEntity.ok(mapToDto(order));
    }

    @PostMapping("/payment")
    public ResponseEntity<OrderDTO> processPayment(@RequestBody PaymentRequest request) {
        OrderEntity order = orderService.processPayment(
                request.getOrderId(),
                request.getPaymentToken(),
                request.getPaymentStatusSimulation());
        return ResponseEntity.ok(mapToDto(order));
    }

    @GetMapping("/history/{sessionId}")
    public ResponseEntity<List<OrderDTO>> getOrderHistory(@PathVariable String sessionId) {
        List<OrderEntity> orders = orderService.getOrderHistory(sessionId);
        List<OrderDTO> response = orders.stream().map(this::mapToDto).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cancel/{orderId}")
    public ResponseEntity<OrderDTO> cancelOrder(@PathVariable Long orderId, @RequestBody CancelOrderRequest request) {
        OrderEntity order = orderService.cancelOrder(orderId, request.getReason());
        return ResponseEntity.ok(mapToDto(order));
    }

    private OrderDTO mapToDto(OrderEntity order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setSessionId(order.getSessionId());
        dto.setReservationId(order.getReservationId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        return dto;
    }
}
