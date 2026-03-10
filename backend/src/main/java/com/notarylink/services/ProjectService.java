package com.notarylink.services;

import com.notarylink.dto.auth.CreateProjectRequest;
import com.notarylink.dto.auth.ProjectResponse;
import com.notarylink.dto.auth.UpdateProjectRequest;
import com.notarylink.model.entities.Project;
import com.notarylink.model.entities.ProjectType;
import com.notarylink.model.entities.User;
import com.notarylink.model.enums.ProjectStatus;
import com.notarylink.model.enums.ProjectTypeCode;
import com.notarylink.repositories.ProjectRepository;
import com.notarylink.repositories.ProjectTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectTypeRepository projectTypeRepository;

    public ProjectResponse createProject(CreateProjectRequest request, User user) {
        String typeCode = request.getType().getValue();
        ProjectType projectType = projectTypeRepository.findByCode(typeCode)
                .orElse(null);

        Project project = Project.builder()
                .user(user)
                .title(request.getTitle())
                .typeCode(ProjectTypeCode.valueOf(typeCode))
                .projectType(projectType)
                .description(request.getDescription())
                .status(ProjectStatus.IN_PROGRESS)
                .build();

        return toResponse(projectRepository.save(project));
    }

    public List<ProjectResponse> getProjects(User user) {
        return projectRepository.findByUser_Id(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProjectResponse getProject(UUID id, User user) {
        return projectRepository.findByIdAndUser_Id(id, user.getId())
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projet introuvable"));
    }

    public ProjectResponse updateProject(UUID id, UpdateProjectRequest request, User user) {
        Project project = projectRepository.findByIdAndUser_Id(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projet introuvable"));

        if (request.getTitle() != null) project.setTitle(request.getTitle());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            project.setStatus(ProjectStatus.valueOf(request.getStatus().getValue()));
        }
        if (request.getType() != null) {
            String typeCode = request.getType().getValue();
            project.setTypeCode(ProjectTypeCode.valueOf(typeCode));
            projectTypeRepository.findByCode(typeCode).ifPresent(project::setProjectType);
        }

        return toResponse(projectRepository.save(project));
    }

    public void deleteProject(UUID id, User user) {
        Project project = projectRepository.findByIdAndUser_Id(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projet introuvable"));
        projectRepository.delete(project);
    }

    public ProjectResponse toResponse(Project project) {
        ProjectResponse dto = new ProjectResponse();
        dto.setId(project.getId().toString());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setProgress(project.getProgress());
        dto.setCreatedAt(project.getCreatedAt().atOffset(ZoneOffset.UTC));
        dto.setUpdatedAt(project.getUpdatedAt().atOffset(ZoneOffset.UTC));

        // Type: use projectType.code if available, fall back to typeCode enum
        if (project.getProjectType() != null) {
            dto.setType(ProjectResponse.TypeEnum.valueOf(project.getProjectType().getCode()));
            dto.setProjectTypeName(project.getProjectType().getName());
        } else if (project.getTypeCode() != null) {
            dto.setType(ProjectResponse.TypeEnum.valueOf(project.getTypeCode().name()));
        }

        if (project.getStatus() != null) {
            dto.setStatus(ProjectResponse.StatusEnum.valueOf(project.getStatus().name()));
        }

        return dto;
    }
}
