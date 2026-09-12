package com.techloomai.pos_system.DTO;

import com.techloomai.pos_system.Entity.ProductEntity;
import com.techloomai.pos_system.Entity.ReservationEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ReservationDTO {
    private Long resId;
    private ProductEntity product;
    private Integer quantity;
    private ReservationEntity.Status status = ReservationEntity.Status.ACTIVE;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    public enum Status { ACTIVE, COMPLETED, EXPIRED, CANCELLED }
}
