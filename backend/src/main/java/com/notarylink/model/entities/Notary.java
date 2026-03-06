package com.notarylink.model.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "notaries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"projects", "transmissions"})
public class Notary {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 255)
    private String lastName;

    @Column(length = 255)
    private String firstName;

    @Column(unique = true, length = 255)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 10)
    private String postalCode;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "notary_specialties", joinColumns = @JoinColumn(name = "notary_id"))
    @Column(name = "specialty")
    private List<String> specialties;

    @Column(precision = 3, scale = 2)
    private BigDecimal averageRating;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "notary", fetch = FetchType.LAZY)
    private List<Project> projects;

    @OneToMany(mappedBy = "notary", fetch = FetchType.LAZY)
    private List<Transmission> transmissions;
}
