package com.techloomai.pos_system.DTO;

import com.techloomai.pos_system.Entity.ProductEntity;
import com.techloomai.pos_system.Entity.ReservationEntity;
import com.techloomai.pos_system.Entity.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ReservationDTO {
    private Long resId;
    private ProductEntity productId;
    private Integer quantity;
    private ReservationStatus status = ReservationStatus.ACTIVE;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

}
