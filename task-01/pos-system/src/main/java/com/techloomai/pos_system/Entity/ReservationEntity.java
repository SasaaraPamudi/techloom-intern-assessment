package com.techloomai.pos_system.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="reservations")
public class ReservationEntity {
    @Id
    @GeneratedValue(strategy =GenerationType.IDENTITY)
    @Column(name = "res_id")
    private Long resId;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private ProductEntity product;

    @Column(nullable = false)
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    private Status status =Status.ACTIVE;

    @Column(name="created_at", nullable=false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    public enum Status { ACTIVE, COMPLETED, EXPIRED, CANCELLED }
    }
