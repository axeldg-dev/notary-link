package com.notarylink.repositories;

import com.notarylink.model.entities.ProjectType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProjectTypeRepository extends JpaRepository<ProjectType, UUID> {
    Optional<ProjectType> findByCode(String code);
}
