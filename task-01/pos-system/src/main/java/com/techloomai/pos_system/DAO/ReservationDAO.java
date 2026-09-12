package com.techloomai.pos_system.DAO;

import com.techloomai.pos_system.Entity.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface ReservationDAO extends JpaRepository<ReservationEntity,Long> {
}
