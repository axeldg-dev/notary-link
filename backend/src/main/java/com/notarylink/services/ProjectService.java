package com.notarylink.services;

import com.notarylink.dto.auth.CreateProjectRequest;
import com.notarylink.dto.auth.ProjectResponse;
import com.notarylink.model.entities.Project;
import com.notarylink.model.entities.User;
import com.notarylink.model.enums.ProjectStatus;
import com.notarylink.model.enums.ProjectType;
import com.notarylink.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectResponse createProject(CreateProjectRequest request, User user) {
        Project project = Project.builder()
                .user(user)
                .title(request.getTitle())
                .type(ProjectType.valueOf(request.getType().getValue()))
                .description(request.getDescription())
                .status(ProjectStatus.IN_PROGRESS)
                .build();

        Project saved = projectRepository.save(project);
        return toResponse(saved);
    }

    private ProjectResponse toResponse(Project project) {
        ProjectResponse dto = new ProjectResponse();
        dto.setId(project.getId().toString());
        dto.setTitle(project.getTitle());
        dto.setType(ProjectResponse.TypeEnum.valueOf(project.getType().name()));
        dto.setStatus(ProjectResponse.StatusEnum.valueOf(project.getStatus().name()));
        dto.setDescription(project.getDescription());
        dto.setProgress(project.getProgress());
        dto.setCreatedAt(project.getCreatedAt().atOffset(java.time.ZoneOffset.UTC));
        dto.setUpdatedAt(project.getUpdatedAt().atOffset(java.time.ZoneOffset.UTC));
        return dto;
    }
}
