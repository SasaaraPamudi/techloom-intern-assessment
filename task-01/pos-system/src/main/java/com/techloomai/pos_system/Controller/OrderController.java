package com.techloomai.pos_system.Controller;

import com.techloomai.pos_system.DTO.OrderDTO;
import com.techloomai.pos_system.Service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderDTO> processCheckout(@RequestBody OrderDTO dto){
        return ResponseEntity.ok(orderService.processCheckout(dto));
    }

    @PostMapping("/{id}/payment-failure")
    public ResponseEntity<OrderDTO> handlePaymentFailure(@PathVariable Long Id){
        return ResponseEntity.ok(orderService.handlePaymentFailure(Id));
    }
}
