package com.techloomai.pos_system.Service;

import com.techloomai.pos_system.DTO.ReservationDTO;

import java.util.List;

public interface ReservationService {
    ReservationDTO createReservation(ReservationDTO reservation);
    void updateReservation(Long reservationId, ReservationDTO reservation);
    void deleteReservation(Long reservationId);
    void cleanupExpiredReservations();
    List<ReservationDTO> getAllReservations();
}
