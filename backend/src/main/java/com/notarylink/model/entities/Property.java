package com.notarylink.model.entities;

import com.notarylink.model.enums.PropertyType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PropertyType type;

    @Column(nullable = false, length = 255)
    private String label;

    @Column(precision = 15, scale = 2)
    private BigDecimal estimatedValue;

    @Column(columnDefinition = "TEXT")
    private String address;

    private LocalDate acquisitionDate;

    @Builder.Default
    @Column(nullable = false)
    private boolean coOwnership = false;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
