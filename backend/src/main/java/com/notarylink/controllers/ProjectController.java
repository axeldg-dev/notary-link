package com.notarylink.controllers;

import com.notarylink.api.ProjectApi;
import com.notarylink.dto.auth.CreateProjectRequest;
import com.notarylink.dto.auth.ProjectResponse;
import com.notarylink.model.entities.User;
import com.notarylink.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProjectController implements ProjectApi {

    private final ProjectService projectService;

    @Override
    public ResponseEntity<ProjectResponse> createProject(CreateProjectRequest createProjectRequest) {
        User principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ProjectResponse response = projectService.createProject(createProjectRequest, principal);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
