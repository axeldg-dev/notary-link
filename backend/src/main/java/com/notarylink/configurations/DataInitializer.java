package com.notarylink.configurations;

import com.notarylink.model.entities.DocumentType;
import com.notarylink.model.entities.Project;
import com.notarylink.model.entities.ProjectRequiredDocument;
import com.notarylink.model.entities.ProjectType;
import com.notarylink.repositories.DocumentTypeRepository;
import com.notarylink.repositories.ProjectRepository;
import com.notarylink.repositories.ProjectRequiredDocumentRepository;
import com.notarylink.repositories.ProjectTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final ProjectTypeRepository projectTypeRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final ProjectRequiredDocumentRepository requiredDocumentRepository;
    private final ProjectRepository projectRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedProjectTypes();
        seedDocumentTypes();
        seedRequiredDocuments();
        migrateExistingProjects();
    }

    // ─── Project types ────────────────────────────────────────────────────────

    private void seedProjectTypes() {
        List<Object[]> types = List.of(
                new Object[]{"REAL_ESTATE_PURCHASE", "Achat immobilier",
                        "Acquisition, vente ou financement d'un bien immobilier"},
                new Object[]{"SUCCESSION", "Succession",
                        "Règlement d'une succession ou héritage"},
                new Object[]{"DONATION", "Donation",
                        "Donation entre vifs, don manuel ou familial"},
                new Object[]{"OTHER", "Autre démarche",
                        "Contrat de mariage, PACS, mandat de protection…"}
        );

        for (Object[] t : types) {
            String code = (String) t[0];
            if (projectTypeRepository.findByCode(code).isEmpty()) {
                projectTypeRepository.save(ProjectType.builder()
                        .code(code)
                        .name((String) t[1])
                        .description((String) t[2])
                        .build());
                log.info("Seeded project type: {}", code);
            }
        }
    }

    // ─── Document types ───────────────────────────────────────────────────────

    private void seedDocumentTypes() {
        List<Object[]> types = List.of(
                // Identité
                new Object[]{"Pièce d'identité",       "Passeport ou CNI en cours de validité",       "Identité"},
                new Object[]{"Justificatif de domicile","Facture de moins de 3 mois",                  "Identité"},
                new Object[]{"Livret de famille",       "Livret de famille à jour",                     "Identité"},
                // Juridique
                new Object[]{"Compromis de vente",      "Signé par les deux parties",                   "Juridique"},
                new Object[]{"Acte de propriété actuel","Titre de propriété du vendeur",                "Juridique"},
                new Object[]{"Acte de décès",           "Acte de décès du défunt",                     "Juridique"},
                new Object[]{"Testament",               "Testament olographe ou authentique",           "Juridique"},
                new Object[]{"Relevé d'inventaire",     "Inventaire des biens du défunt",               "Juridique"},
                new Object[]{"Déclaration de don manuel","Déclaration auprès de l'administration",      "Juridique"},
                // Financement
                new Object[]{"Attestation de financement","Confirmation de prêt immobilier",            "Financement"},
                new Object[]{"Relevé hypothécaire",     "Délivré par votre banque",                    "Financement"},
                new Object[]{"Justificatif de revenus", "3 derniers bulletins de salaire",              "Financement"},
                new Object[]{"RIB du compte bénéficiaire","Pour le virement du solde",                 "Financement"},
                new Object[]{"Relevés bancaires",       "3 derniers relevés de compte",                 "Financement"},
                // Propriété / Fiscal
                new Object[]{"Diagnostics immobiliers", "DPE, amiante, plomb, etc.",                   "Propriété"},
                new Object[]{"Titre de propriété",      "Titre de propriété du bien",                  "Propriété"},
                new Object[]{"Déclaration fiscale N-1", "Avis d'imposition dernière année",            "Fiscal"}
        );

        for (Object[] t : types) {
            String name = (String) t[0];
            if (documentTypeRepository.findByName(name).isEmpty()) {
                documentTypeRepository.save(DocumentType.builder()
                        .name(name)
                        .description((String) t[1])
                        .category((String) t[2])
                        .build());
                log.info("Seeded document type: {}", name);
            }
        }
    }

    // ─── Required document links ──────────────────────────────────────────────

    private void seedRequiredDocuments() {
        Map<String, ProjectType> typesByCode = projectTypeRepository.findAll().stream()
                .collect(Collectors.toMap(ProjectType::getCode, Function.identity()));
        Map<String, DocumentType> docsByName = documentTypeRepository.findAll().stream()
                .collect(Collectors.toMap(DocumentType::getName, Function.identity()));

        // Format: { projectTypeCode, documentTypeName, required }
        List<Object[]> links = List.of(
                // Real estate purchase
                new Object[]{"REAL_ESTATE_PURCHASE", "Pièce d'identité",            true},
                new Object[]{"REAL_ESTATE_PURCHASE", "Justificatif de domicile",    true},
                new Object[]{"REAL_ESTATE_PURCHASE", "Compromis de vente",          true},
                new Object[]{"REAL_ESTATE_PURCHASE", "Relevé hypothécaire",         true},
                new Object[]{"REAL_ESTATE_PURCHASE", "Attestation de financement",  true},
                new Object[]{"REAL_ESTATE_PURCHASE", "Acte de propriété actuel",    true},
                new Object[]{"REAL_ESTATE_PURCHASE", "Diagnostics immobiliers",     true},
                new Object[]{"REAL_ESTATE_PURCHASE", "Déclaration fiscale N-1",     true},
                new Object[]{"REAL_ESTATE_PURCHASE", "Justificatif de revenus",     true},
                new Object[]{"REAL_ESTATE_PURCHASE", "RIB du compte bénéficiaire", true},
                // Succession
                new Object[]{"SUCCESSION", "Pièce d'identité",      true},
                new Object[]{"SUCCESSION", "Acte de décès",          true},
                new Object[]{"SUCCESSION", "Livret de famille",      true},
                new Object[]{"SUCCESSION", "Relevé d'inventaire",    true},
                new Object[]{"SUCCESSION", "Titre de propriété",     true},
                new Object[]{"SUCCESSION", "Relevés bancaires",      true},
                new Object[]{"SUCCESSION", "Testament",              false},
                // Donation
                new Object[]{"DONATION", "Pièce d'identité",               true},
                new Object[]{"DONATION", "Justificatif de domicile",       true},
                new Object[]{"DONATION", "Livret de famille",              true},
                new Object[]{"DONATION", "Déclaration de don manuel",      true},
                new Object[]{"DONATION", "Titre de propriété",             false},
                // Other
                new Object[]{"OTHER", "Pièce d'identité",         true},
                new Object[]{"OTHER", "Justificatif de domicile", true}
        );

        for (Object[] link : links) {
            String typeCode = (String) link[0];
            String docName  = (String) link[1];
            boolean required = (boolean) link[2];

            ProjectType pt = typesByCode.get(typeCode);
            DocumentType dt = docsByName.get(docName);
            if (pt == null || dt == null) continue;

            boolean alreadyExists = requiredDocumentRepository
                    .findByProjectType(pt)
                    .stream()
                    .anyMatch(r -> r.getDocumentType().getId().equals(dt.getId()));

            if (!alreadyExists) {
                requiredDocumentRepository.save(ProjectRequiredDocument.builder()
                        .projectType(pt)
                        .documentType(dt)
                        .required(required)
                        .build());
            }
        }
        log.info("Required document links seeded.");
    }

    // ─── Migrate existing projects ────────────────────────────────────────────

    private void migrateExistingProjects() {
        List<Project> unlinked = projectRepository.findAll().stream()
                .filter(p -> p.getProjectType() == null && p.getTypeCode() != null)
                .toList();

        for (Project p : unlinked) {
            projectTypeRepository.findByCode(p.getTypeCode().name()).ifPresent(pt -> {
                p.setProjectType(pt);
                projectRepository.save(p);
                log.info("Migrated project {} to project type {}", p.getId(), pt.getCode());
            });
        }
    }
}
