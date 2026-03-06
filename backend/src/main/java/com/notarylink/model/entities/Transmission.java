package com.notarylink.model.entities;

import com.notarylink.model.enums.TransmissionStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transmissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transmission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "notary_id", nullable = false)
    private Notary notary;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TransmissionStatus status;

    @Column(unique = true, length = 500)
    private String accessToken;

    private LocalDateTime tokenExpiresAt;

    private LocalDateTime emailSentAt;

    private LocalDateTime openedAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
