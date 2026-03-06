package com.notarylink.model.entities;

import com.notarylink.model.enums.ProjectStatus;
import com.notarylink.model.enums.ProjectType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"checklistItems", "documents", "transmissions", "conversations"})
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notary_id", nullable = true)
    private Notary notary;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private ProjectType type;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ProjectStatus status;

    @Column(length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    @Column(nullable = false)
    private int progress = 0;

    private LocalDateTime sentAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChecklistItem> checklistItems;

    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    private List<Document> documents;

    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    private List<Transmission> transmissions;

    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    private List<AiConversation> conversations;
}
