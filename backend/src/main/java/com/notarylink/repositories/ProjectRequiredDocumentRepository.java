package com.notarylink.repositories;

import com.notarylink.model.entities.ProjectRequiredDocument;
import com.notarylink.model.entities.ProjectType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectRequiredDocumentRepository extends JpaRepository<ProjectRequiredDocument, UUID> {
    List<ProjectRequiredDocument> findByProjectType(ProjectType projectType);
}
