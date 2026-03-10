package com.notarylink.services;

import com.notarylink.dto.auth.ProjectDocumentItem;
import com.notarylink.model.entities.DocumentType;
import com.notarylink.model.entities.Project;
import com.notarylink.model.entities.ProjectDocument;
import com.notarylink.model.entities.User;
import com.notarylink.model.enums.DocumentStatus;
import com.notarylink.repositories.DocumentTypeRepository;
import com.notarylink.repositories.ProjectDocumentRepository;
import com.notarylink.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZoneOffset;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentUploadService {

    private final ProjectRepository projectRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final ProjectDocumentRepository projectDocumentRepository;
    private final MinioService minioService;

    @Transactional
    public ProjectDocumentItem uploadDocument(UUID projectId, UUID documentTypeId, MultipartFile file, User user) {
        Project project = projectRepository.findByIdAndUser_Id(projectId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projet introuvable"));

        DocumentType documentType = documentTypeRepository.findById(documentTypeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Type de document introuvable"));

        String objectName = "projects/" + projectId + "/" + documentTypeId + "/"
                + System.currentTimeMillis() + "_" + sanitize(file.getOriginalFilename());

        minioService.uploadFile(objectName, file);

        ProjectDocument doc = projectDocumentRepository
                .findByProject_IdAndDocumentType_Id(projectId, documentTypeId)
                .orElse(new ProjectDocument());

        doc.setProject(project);
        doc.setDocumentType(documentType);
        doc.setFileUrl(objectName);
        doc.setStatus(DocumentStatus.PENDING);

        doc = projectDocumentRepository.save(doc);

        ProjectDocumentItem item = new ProjectDocumentItem();
        item.setDocumentTypeId(documentType.getId().toString());
        item.setDocumentTypeName(documentType.getName());
        item.setDocumentTypeCategory(documentType.getCategory());
        item.setRequired(false);
        item.setUploaded(true);
        item.setFileUrl(doc.getFileUrl());
        item.setDocumentStatus(ProjectDocumentItem.DocumentStatusEnum.PENDING);
        if (doc.getUploadedAt() != null) {
            item.setUploadedAt(doc.getUploadedAt().atOffset(ZoneOffset.UTC));
        }

        return item;
    }

    private String sanitize(String filename) {
        if (filename == null) return "file";
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
