package com.notarylink.model.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = true)
    private Project project;

    @Column(nullable = false, length = 255)
    private String fileName;

    @Column(length = 255)
    private String originalName;

    @Column(length = 100)
    private String mimeType;

    private Long fileSize;

    @Column(length = 255)
    private String minioBucket;

    @Column(length = 500)
    private String minioKey;

    @Builder.Default
    @Column(nullable = false)
    private boolean encrypted = true;

    @Builder.Default
    @Column(nullable = false)
    private boolean ocrProcessed = false;

    @Column(columnDefinition = "TEXT")
    private String ocrContent;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
