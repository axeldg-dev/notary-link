package com.notarylink.model.entities;

import com.notarylink.model.enums.AccountType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AccountType type;

    @Column(length = 255)
    private String bank;

    @Column(length = 255)
    private String label;

    @Column(precision = 15, scale = 2)
    private BigDecimal balance;

    @Column(length = 34)
    private String iban;

    @Builder.Default
    @Column(length = 3)
    private String currency = "EUR";

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
