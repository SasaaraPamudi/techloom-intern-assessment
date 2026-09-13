package com.techloomai.pos_system.Service;

import com.techloomai.pos_system.DTO.ReservationDTO;


public interface ReservationService {
    ReservationDTO createReservation(ReservationDTO reservation);
    void deleteReservation(Long reservationId);
    void cleanupExpiredReservations();
}
