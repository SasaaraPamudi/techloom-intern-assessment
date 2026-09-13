package com.techloomai.pos_system.Controller;

import com.techloomai.pos_system.DTO.ReservationDTO;
import com.techloomai.pos_system.Service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationDTO> createReservation(@RequestBody ReservationDTO reservation){
        return ResponseEntity.status(HttpStatus.CREATED).body(reservationService.createReservation(reservation));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> canselReservation(@PathVariable Long Id){
        reservationService.deleteReservation(Id);
        return ResponseEntity.ok().build();
    }
}
