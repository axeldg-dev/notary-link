package com.notarylink.repositories;

import com.notarylink.model.entities.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface DocumentTypeRepository extends JpaRepository<DocumentType, UUID> {
    Optional<DocumentType> findByName(String name);
}
