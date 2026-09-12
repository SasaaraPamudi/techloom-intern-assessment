package com.techloomai.pos_system.Service.Impl;

import com.techloomai.pos_system.DAO.ProductDAO;
import com.techloomai.pos_system.Entity.ProductEntity;
import com.techloomai.pos_system.DAO.ReservationDAO;
import com.techloomai.pos_system.DTO.ReservationDTO;
import com.techloomai.pos_system.Entity.ReservationEntity;
import com.techloomai.pos_system.Entity.ReservationStatus;
import com.techloomai.pos_system.Service.ReservationService;
import com.techloomai.pos_system.util.EntityDTOConversion;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {
    private final ProductDAO productDao;
    private final ReservationDAO reservationDAO;
    private final EntityDTOConversion entityDTOConversion;
    @Override
    public ReservationDTO createReservation(ReservationDTO reservation) {
        ProductEntity product = productDao.findByIdWithLock(reservation.getProductId().getProduct_id())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if(product.getTotalStock()<reservation.getQuantity()){
            throw new IllegalStateException("Not enough stock items available");
        }
        product.setTotalStock(product.getTotalStock() - reservation.getQuantity());
        productDao.save(product);

        ReservationEntity reservationEntity = new ReservationEntity();
        reservationEntity.setProduct(product);
        reservationEntity.setQuantity(reservation.getQuantity());
        reservationEntity.setStatus(ReservationStatus.ACTIVE);
        reservationEntity.setCreatedAt(LocalDateTime.now());
        reservationEntity.setExpiresAt(LocalDateTime.now().plusMinutes(5));

        ReservationEntity saved = reservationDAO.save(reservationEntity);

        return entityDTOConversion.toReservationDTO(saved);



    }

    @Override
    public void updateReservation(Long reservationId, ReservationDTO reservation) {

    }

    @Override
    public void deleteReservation(Long reservationId) {
        ReservationEntity reservation = reservationDAO.findById(reservationId)
                .orElseThrow(()-> new IllegalArgumentException("Reservation Not Found With ID: " + reservationId));

        if(reservation.getStatus() != ReservationStatus.ACTIVE){
            throw new IllegalStateException("Only active reservations can be cancelled");
        }

        ProductEntity product = productDao.findByIdWithLock(reservation.getProduct().getProduct_id())
                .orElseThrow(()-> new IllegalArgumentException("Associate product not found"));

        product.setTotalStock(product.getTotalStock() + reservation.getQuantity());
        productDao.save(product);

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationDAO.save(reservation);

    }

    @Override
    @Scheduled(fixedRate = 60000)
    public void cleanupExpiredReservations() {
        List<ReservationEntity> expired = reservationDAO
                .findAllByStatusAndExpiresAtBefore(ReservationStatus.ACTIVE, LocalDateTime.now());

        for(ReservationEntity reservation : expired){
            ProductEntity product = reservation.getProduct();
            product.setTotalStock(product.getTotalStock() + reservation.getQuantity());
            productDao.save(product);

            reservation.setStatus(ReservationStatus.EXPIRED);
            reservationDAO.save(reservation);

        }

    }

    @Override
    public List<ReservationDTO> getAllReservations() {
        return List.of();
    }
}
