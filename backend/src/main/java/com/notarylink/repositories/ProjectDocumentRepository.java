package com.notarylink.repositories;

import com.notarylink.model.entities.ProjectDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectDocumentRepository extends JpaRepository<ProjectDocument, UUID> {
    List<ProjectDocument> findByProject_Id(UUID projectId);

    Optional<ProjectDocument> findByProject_IdAndDocumentType_Id(UUID projectId, UUID documentTypeId);
}
