package com.notarylink.model.entities;

import com.notarylink.model.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"properties", "accounts", "contracts", "projects", "documents", "conversations"})
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(length = 20)
    private String phone;

    @Builder.Default
    @Column(nullable = false)
    private boolean twoFaEnabled = false;

    @Column(length = 255)
    private String twoFaSecret;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 20)
    private Role role = Role.USER;

    @Column(length = 500)
    private String refreshToken;

    private LocalDateTime refreshTokenExpiry;

    @Column(length = 6)
    private String otpCode;

    private LocalDateTime otpExpiry;

    @Builder.Default
    @Column(nullable = false)
    private boolean otpVerified = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Property> properties;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Account> accounts;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Contract> contracts;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Project> projects;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Document> documents;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<AiConversation> conversations;

    // --- UserDetails ---

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
