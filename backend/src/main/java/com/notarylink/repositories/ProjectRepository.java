package com.notarylink.repositories;

import com.notarylink.model.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByUser_Id(UUID userId);
    Optional<Project> findByIdAndUser_Id(UUID id, UUID userId);
}
