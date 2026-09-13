package com.techloomai.pos_system.Controller;

import com.techloomai.pos_system.DTO.OrderDTO;
import com.techloomai.pos_system.DTO.PaymentDTO;
import com.techloomai.pos_system.Service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/simulate")
    public ResponseEntity<OrderDTO> simulatePayment(@RequestBody PaymentDTO paymentDTO){
        OrderDTO order = paymentService.processPayment(paymentDTO);
        return ResponseEntity.ok(order);
    }
}
