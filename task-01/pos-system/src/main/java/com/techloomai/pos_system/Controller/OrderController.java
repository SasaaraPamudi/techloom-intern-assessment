package com.techloomai.pos_system.Controller;

import com.techloomai.pos_system.DTO.OrderDTO;
import com.techloomai.pos_system.Service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderDTO> processCheckout(@RequestBody OrderDTO dto){
        return ResponseEntity.ok(orderService.processCheckout(dto));
    }

    @PostMapping("/{id}/payment-failure")
    public ResponseEntity<OrderDTO> handlePaymentFailure(@PathVariable("id") Long id){
        return ResponseEntity.ok(orderService.handlePaymentFailure(id));
    }
}