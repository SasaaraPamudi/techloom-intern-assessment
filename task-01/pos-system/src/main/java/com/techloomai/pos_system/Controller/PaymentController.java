package com.techloomai.pos_system.Controller;

import com.techloomai.pos_system.DTO.OrderDTO;
import com.techloomai.pos_system.DTO.PaymentDTO;
import com.techloomai.pos_system.Service.Impl.PaymentServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentServiceImpl paymentService;

    @PostMapping("/simulate")
    public ResponseEntity<OrderDTO> simulatePayment(@RequestBody PaymentDTO paymentDTO){
        OrderDTO order = paymentService.processPayment(paymentDTO);
        return ResponseEntity.ok(order);
    }
}
