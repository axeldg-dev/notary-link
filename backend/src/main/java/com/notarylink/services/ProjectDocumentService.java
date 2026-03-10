package com.notarylink.services;

import com.notarylink.dto.auth.ProjectDocumentItem;
import com.notarylink.dto.auth.ProjectDocumentsResponse;
import com.notarylink.model.entities.Project;
import com.notarylink.model.entities.ProjectDocument;
import com.notarylink.model.entities.ProjectRequiredDocument;
import com.notarylink.model.entities.User;
import com.notarylink.repositories.ProjectDocumentRepository;
import com.notarylink.repositories.ProjectRepository;
import com.notarylink.repositories.ProjectRequiredDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectDocumentService {

    private final ProjectRepository projectRepository;
    private final ProjectRequiredDocumentRepository requiredDocumentRepository;
    private final ProjectDocumentRepository projectDocumentRepository;

    public ProjectDocumentsResponse getProjectDocuments(UUID projectId, User user) {
        Project project = projectRepository.findByIdAndUser_Id(projectId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projet introuvable"));

        // Map of documentTypeId → uploaded ProjectDocument
        Map<UUID, ProjectDocument> uploadedByTypeId = projectDocumentRepository
                .findByProject_Id(projectId)
                .stream()
                .collect(Collectors.toMap(
                        pd -> pd.getDocumentType().getId(),
                        pd -> pd,
                        (a, b) -> b // keep latest if duplicates
                ));

        List<ProjectDocumentItem> items = new ArrayList<>();

        if (project.getProjectType() != null) {
            List<ProjectRequiredDocument> required = requiredDocumentRepository
                    .findByProjectType(project.getProjectType());

            for (ProjectRequiredDocument req : required) {
                UUID dtId = req.getDocumentType().getId();
                ProjectDocument uploaded = uploadedByTypeId.get(dtId);

                ProjectDocumentItem item = new ProjectDocumentItem();
                item.setDocumentTypeId(dtId.toString());
                item.setDocumentTypeName(req.getDocumentType().getName());
                item.setDocumentTypeCategory(req.getDocumentType().getCategory());
                item.setRequired(req.isRequired());
                item.setUploaded(uploaded != null);

                if (uploaded != null) {
                    item.setFileUrl(uploaded.getFileUrl());
                    item.setDocumentStatus(ProjectDocumentItem.DocumentStatusEnum.valueOf(uploaded.getStatus().name()));
                    item.setUploadedAt(uploaded.getUploadedAt().atOffset(ZoneOffset.UTC));
                }

                items.add(item);
                uploadedByTypeId.remove(dtId); // remove so extras are handled below
            }
        }

        // Include any extra uploaded documents not in required list
        for (ProjectDocument extra : uploadedByTypeId.values()) {
            ProjectDocumentItem item = new ProjectDocumentItem();
            item.setDocumentTypeId(extra.getDocumentType().getId().toString());
            item.setDocumentTypeName(extra.getDocumentType().getName());
            item.setDocumentTypeCategory(extra.getDocumentType().getCategory());
            item.setRequired(false);
            item.setUploaded(true);
            item.setFileUrl(extra.getFileUrl());
            item.setDocumentStatus(ProjectDocumentItem.DocumentStatusEnum.valueOf(extra.getStatus().name()));
            item.setUploadedAt(extra.getUploadedAt().atOffset(ZoneOffset.UTC));
            items.add(item);
        }

        long totalRequired = items.stream().filter(ProjectDocumentItem::getRequired).count();
        long totalUploaded = items.stream().filter(i -> i.getRequired() && i.getUploaded()).count();
        int progress = totalRequired > 0 ? (int) ((totalUploaded * 100) / totalRequired) : 0;

        ProjectDocumentsResponse response = new ProjectDocumentsResponse();
        response.setProjectId(project.getId().toString());
        response.setProjectTitle(project.getTitle());
        response.setProjectTypeName(project.getProjectType() != null ? project.getProjectType().getName() : null);
        response.setTotalRequired((int) totalRequired);
        response.setTotalUploaded((int) totalUploaded);
        response.setProgress(progress);
        response.setDocuments(items);

        return response;
    }
}
