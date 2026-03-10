package com.notarylink.controllers;

import com.notarylink.api.ProjectApi;
import com.notarylink.dto.auth.CreateProjectRequest;
import com.notarylink.dto.auth.ProjectDocumentItem;
import com.notarylink.dto.auth.ProjectDocumentsResponse;
import com.notarylink.dto.auth.ProjectResponse;
import com.notarylink.dto.auth.UpdateProjectRequest;
import com.notarylink.model.entities.User;
import com.notarylink.services.DocumentUploadService;
import com.notarylink.services.ProjectDocumentService;
import com.notarylink.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ProjectController implements ProjectApi {

    private final ProjectService projectService;
    private final ProjectDocumentService projectDocumentService;
    private final DocumentUploadService documentUploadService;

    @Override
    public ResponseEntity<ProjectResponse> createProject(CreateProjectRequest createProjectRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(createProjectRequest, principal()));
    }

    @Override
    public ResponseEntity<List<ProjectResponse>> getProjects() {
        return ResponseEntity.ok(projectService.getProjects(principal()));
    }

    @Override
    public ResponseEntity<ProjectResponse> getProject(String id) {
        return ResponseEntity.ok(projectService.getProject(UUID.fromString(id), principal()));
    }

    @Override
    public ResponseEntity<ProjectResponse> updateProject(String id, UpdateProjectRequest updateProjectRequest) {
        return ResponseEntity.ok(projectService.updateProject(UUID.fromString(id), updateProjectRequest, principal()));
    }

    @Override
    public ResponseEntity<Void> deleteProject(String id) {
        projectService.deleteProject(UUID.fromString(id), principal());
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<ProjectDocumentsResponse> getProjectDocuments(String id) {
        return ResponseEntity.ok(projectDocumentService.getProjectDocuments(UUID.fromString(id), principal()));
    }

    @Override
    public ResponseEntity<ProjectDocumentItem> uploadProjectDocument(String id, String documentTypeId, MultipartFile file) {
        return ResponseEntity.ok(documentUploadService.uploadDocument(
                UUID.fromString(id), UUID.fromString(documentTypeId), file, principal()));
    }

    private User principal() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
