package com.techloomai.pos_system.DAO;

import com.techloomai.pos_system.Entity.ReservationEntity;
import com.techloomai.pos_system.Entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationDAO extends JpaRepository<ReservationEntity,Long> {
    List<ReservationEntity> findAllByStatusAndExpiresAtBefore(ReservationStatus status, LocalDateTime dateTime);

}
