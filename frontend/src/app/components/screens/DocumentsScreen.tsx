import { motion } from 'motion/react';
import {
  Check,
  Clock,
  Minus,
  Upload,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  ChevronDown,
  Home,
  Users,
  Gift,
  Folder,
  Plus,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProjects, selectProjects } from '../../features/projectSlice';
import type { ProjectResponseDto, ProjectDocumentItemDto } from '../../api/projectApi';
import { getProjectDocumentsApi, uploadDocumentApi } from '../../api/projectApi';
import type { ProjectDocumentsResponseDto } from '../../api/projectApi';

// ─── Static demo data (kept as-is) ───────────────────────────────────────────

const STEPS_LABELS = ['Projet', 'Documents', 'Vérification', 'Envoi'];

const DOCUMENTS = [
  { id: 1, name: "Pièce d'identité", note: 'Passeport ou CNI en cours de validité', status: 'done' as const },
  { id: 2, name: 'Justificatif de domicile', note: 'Facture de moins de 3 mois', status: 'done' as const },
  { id: 3, name: 'Compromis de vente', note: 'Signé par les deux parties', status: 'done' as const },
  { id: 4, name: 'Relevé hypothécaire', note: 'Délivré par votre banque', status: 'done' as const },
  { id: 5, name: 'Attestation de financement', note: 'Confirmation de prêt immobilier', status: 'pending' as const },
  { id: 6, name: "Acte de propriété actuel", note: 'Titre de propriété du vendeur', status: 'pending' as const },
  { id: 7, name: 'Diagnostics immobiliers', note: 'DPE, amiante, plomb, etc.', status: 'done' as const },
  { id: 8, name: 'Déclaration fiscale N-1', note: "Avis d'imposition dernière année", status: 'missing' as const },
  { id: 9, name: 'Justificatif de revenus', note: '3 derniers bulletins de salaire', status: 'missing' as const },
  { id: 10, name: 'RIB du compte bénéficiaire', note: 'Pour le virement du solde', status: 'missing' as const },
];

const doneCount = DOCUMENTS.filter((d) => d.status === 'done').length;
const totalCount = DOCUMENTS.length;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_META: Record<ProjectResponseDto['type'], { label: string; icon: React.ReactNode }> = {
  REAL_ESTATE_PURCHASE: { label: 'Achat immobilier', icon: <Home size={14} strokeWidth={1.5} /> },
  SUCCESSION:           { label: 'Succession',        icon: <Users size={14} strokeWidth={1.5} /> },
  DONATION:             { label: 'Donation',           icon: <Gift size={14} strokeWidth={1.5} /> },
  OTHER:                { label: 'Autre démarche',     icon: <Folder size={14} strokeWidth={1.5} /> },
};

const STATUS_LABEL: Record<ProjectResponseDto['status'], string> = {
  IN_PROGRESS: 'En cours',
  COMPLETE:    'Terminé',
  SENT:        'Envoyé',
  ARCHIVED:    'Archivé',
};

/** Maps project status to which STEPS_LABELS step is "current". */
function stepsFromProject(project: ProjectResponseDto): ('done' | 'current' | 'upcoming')[] {
  const s = project.status;
  if (s === 'IN_PROGRESS') return ['done', 'current', 'upcoming', 'upcoming'];
  if (s === 'COMPLETE')    return ['done', 'done',    'current',  'upcoming'];
  if (s === 'SENT')        return ['done', 'done',    'done',     'current'];
  // ARCHIVED
  return ['done', 'done', 'done', 'done'];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DocumentsScreen() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjects);

  const [projectDocs, setProjectDocs] = useState<ProjectDocumentsResponseDto | null>(null);
  const [docsLoading, setDocsLoading] = useState(false);

  // Fetch projects if not loaded yet
  useEffect(() => {
    if (projects.length === 0) dispatch(fetchProjects());
  }, [dispatch, projects.length]);

  // Fetch real documents when a projectId is present
  useEffect(() => {
    if (!projectId) { setProjectDocs(null); return; }
    setDocsLoading(true);
    getProjectDocumentsApi(projectId)
      .then(setProjectDocs)
      .catch(() => setProjectDocs(null))
      .finally(() => setDocsLoading(false));
  }, [projectId]);

  function refreshDocs() {
    if (!projectId) return;
    setDocsLoading(true);
    getProjectDocumentsApi(projectId)
      .then(setProjectDocs)
      .catch(() => setProjectDocs(null))
      .finally(() => setDocsLoading(false));
  }

  // No project selected → show project picker
  if (!projectId) {
    return <NoProjectSelected projects={projects} />;
  }

  const currentProject = projects.find(p => p.id === projectId) ?? null;
  const otherProjects = projects.filter(p => p.id !== projectId);

  const steps = currentProject
    ? stepsFromProject(currentProject)
    : (['done', 'current', 'upcoming', 'upcoming'] as const);

  const projectTitle  = currentProject ? currentProject.title : '…';
  const projectStatus = currentProject ? STATUS_LABEL[currentProject.status] : '';
  const projectProgress = projectDocs
    ? projectDocs.progress
    : currentProject
      ? currentProject.progress
      : 0;

  const realDoneCount = projectDocs
    ? projectDocs.documents.filter(d => d.uploaded && d.documentStatus !== 'REJECTED').length
    : 0;
  const realTotalCount = projectDocs
    ? (projectDocs.documents.filter(d => d.required).length || projectDocs.documents.length)
    : 0;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F8F6F1',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }} className="flex-col md:flex-row">

        {/* ── Left sidebar — Navy ── */}
        <div
          style={{ background: '#1B2B4B', flexShrink: 0, position: 'relative' }}
          className="w-full md:w-72 p-6 md:p-[40px_32px]"
        >
          {/* Back to projects list */}
          <button
            onClick={() => navigate('/projets')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.45)', fontSize: 12,
              fontFamily: "'Inter', sans-serif", cursor: 'pointer',
              padding: 0, marginBottom: 28,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
          >
            <ArrowLeft size={13} />
            Mes projets
          </button>

          {/* Project info */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{
              color: 'rgba(255,255,255,0.45)', fontSize: '11px',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: '10px', fontWeight: 500,
            }}>
              Projet en cours
            </p>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif", color: 'white',
              fontSize: '20px', fontWeight: 400, lineHeight: 1.2, marginBottom: '8px',
            }}>
              {projectTitle}
            </h2>
            {currentProject && (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginBottom: 10 }}>
                {TYPE_META[currentProject.type].label}
              </p>
            )}
            <div style={{
              background: 'rgba(201, 168, 76, 0.15)', borderRadius: '6px',
              padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9A84C' }} />
              <span style={{ color: '#C9A84C', fontSize: '12px', fontWeight: 500 }}>
                {projectStatus}
              </span>
            </div>

            {/* Project progress bar */}
            {currentProject && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Avancement</span>
                  <span style={{ color: '#C9A84C', fontSize: 11, fontWeight: 600 }}>{projectProgress}%</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${projectProgress}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    style={{ height: '100%', background: '#C9A84C', borderRadius: 99 }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '32px' }} />

          {/* Progress tracker */}
          <p style={{
            color: 'rgba(255,255,255,0.45)', fontSize: '11px',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            marginBottom: '24px', fontWeight: 500,
          }}>
            Progression
          </p>
          <div style={{ marginBottom: 36 }}>
            {STEPS_LABELS.map((label, index) => (
              <ProgressStep
                key={label}
                label={label}
                status={steps[index]}
                isLast={index === STEPS_LABELS.length - 1}
              />
            ))}
          </div>

          {/* ── Project switcher ── */}
          {otherProjects.length > 0 && (
            <ProjectSwitcher
              projects={otherProjects}
              onSelect={(id) => navigate(`/projets/${id}/documents`)}
            />
          )}

          {/* Decorative ring */}
          <div style={{
            position: 'absolute', bottom: '-40px', right: '-40px',
            width: '150px', height: '150px', borderRadius: '50%',
            border: '1px solid rgba(201, 168, 76, 0.06)', pointerEvents: 'none',
          }} />
        </div>

        {/* ── Main panel ── */}
        <div
          className="p-4 sm:p-8 md:p-[40px_48px]"
          style={{ flex: 1, overflowY: 'auto', position: 'relative' }}
        >
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif", color: '#1B2B4B',
              fontSize: '32px', fontWeight: 400, marginBottom: '20px',
            }}>
              Documents nécessaires
            </h1>

            {/* Progress bar */}
            <div style={{
              background: 'white', borderRadius: '12px', padding: '20px 24px',
              boxShadow: '0 2px 16px rgba(27, 43, 75, 0.06)',
              border: '1px solid rgba(27, 43, 75, 0.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: '#2C2C2C', fontSize: '14px', fontWeight: 500 }}>
                  {realDoneCount} documents sur {realTotalCount} fournis
                </span>
                <span style={{ color: '#C9A84C', fontSize: '14px', fontWeight: 600, fontFamily: "'DM Serif Display', serif" }}>
                  {realTotalCount > 0 ? Math.round((realDoneCount / realTotalCount) * 100) : 0}%
                </span>
              </div>
              <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '50px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${realTotalCount > 0 ? (realDoneCount / realTotalCount) * 100 : 0}%` }}
                  transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #C9A84C, #E8D9B5)', borderRadius: '50px' }}
                />
              </div>
            </div>
          </div>

          {/* Document list */}
          {docsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
              <LoadingDots />
            </div>
          ) : projectDocs ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '100px' }}>
              {projectDocs.documents.map((doc, index) => (
                <motion.div
                  key={doc.documentTypeId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                >
                  <ApiDocumentRow doc={doc} projectId={projectId} onUploaded={refreshDocs} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
              <LoadingDots />
            </div>
          )}

          {/* Continue button */}
          <div style={{
            borderTop: '1px solid rgba(27, 43, 75, 0.08)', paddingTop: '24px',
            display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '32px',
          }}>
            <button style={{
              background: 'none', border: '1.5px solid #1B2B4B', color: '#1B2B4B',
              borderRadius: '10px', padding: '12px 24px', fontSize: '14px',
              fontFamily: "'Inter', sans-serif", fontWeight: 500, cursor: 'pointer',
            }}>
              Sauvegarder
            </button>
            <button
              onClick={() => navigate('/envoi')}
              style={{
                background: '#C9A84C', border: 'none', color: 'white',
                borderRadius: '10px', padding: '12px 24px', fontSize: '14px',
                fontFamily: "'Inter', sans-serif", fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 16px rgba(201, 168, 76, 0.3)',
              }}
            >
              Continuer
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* AI Assistant floating card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        style={{
          position: 'fixed', bottom: '88px', right: '16px',
          background: '#E8D9B5', borderRadius: '16px', padding: '20px 24px',
          maxWidth: 'min(320px, calc(100vw - 32px))',
          boxShadow: '0 8px 32px rgba(27, 43, 75, 0.15)',
          border: '1px solid rgba(201, 168, 76, 0.25)', zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%', background: '#C9A84C',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Sparkles size={17} color="white" strokeWidth={2} />
          </div>
          <div>
            <p style={{ color: '#1B2B4B', fontSize: '13px', lineHeight: 1.6, marginBottom: '10px', fontWeight: 400 }}>
              Vous avez presque terminé ! Il vous manque{' '}
              <strong style={{ fontWeight: 600 }}>3 documents clés</strong> pour finaliser votre dossier.
            </p>
            <button style={{
              background: 'none', border: 'none', color: '#C9A84C', fontSize: '13px',
              fontFamily: "'Inter', sans-serif", fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px', padding: 0,
            }}>
              Voir les conseils
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── No project selected ──────────────────────────────────────────────────────

function NoProjectSelected({ projects }: { projects: ProjectResponseDto[] }) {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F1', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif", color: '#1B2B4B',
          fontSize: '32px', fontWeight: 400, marginBottom: '8px',
        }}>
          Documents
        </h1>
        <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 40 }}>
          Sélectionnez un projet pour accéder à ses documents.
        </p>

        {projects.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: 16, padding: '48px 32px',
            textAlign: 'center', border: '1px dashed rgba(27,43,75,0.15)',
            boxShadow: '0 2px 16px rgba(27,43,75,0.04)',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(201,168,76,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            }}>
              <Folder size={26} color="#C9A84C" strokeWidth={1.5} />
            </div>
            <p style={{ color: '#1B2B4B', fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
              Aucun projet pour l'instant
            </p>
            <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 24 }}>
              Créez un projet pour commencer à gérer vos documents notariaux.
            </p>
            <button
              onClick={() => navigate('/projets')}
              style={{
                background: '#C9A84C', color: 'white', border: 'none',
                borderRadius: 10, padding: '12px 24px', fontSize: 14,
                fontFamily: "'Inter', sans-serif", fontWeight: 500, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(201,168,76,0.3)',
              }}
            >
              <Plus size={15} />
              Créer un projet
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {projects.map(project => (
              <motion.button
                key={project.id}
                onClick={() => navigate(`/projets/${project.id}/documents`)}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
                style={{
                  background: 'white', border: '1px solid rgba(27,43,75,0.07)',
                  borderRadius: 12, padding: '20px 24px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 16,
                  textAlign: 'left', width: '100%', fontFamily: "'Inter', sans-serif",
                  boxShadow: '0 2px 8px rgba(27,43,75,0.04)',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: 'rgba(27,43,75,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ color: '#1B2B4B' }}>{TYPE_META[project.type].icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#1B2B4B', fontSize: 15, fontWeight: 500, marginBottom: 3 }}>
                    {project.title}
                  </p>
                  <p style={{ color: '#9CA3AF', fontSize: 12 }}>
                    {TYPE_META[project.type].label} · {project.progress}% complété
                  </p>
                </div>
                <ChevronRight size={16} color="#9CA3AF" />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Project Switcher ─────────────────────────────────────────────────────────

function ProjectSwitcher({
  projects,
  onSelect,
}: {
  projects: ProjectResponseDto[];
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '20px' }} />
      <p style={{
        color: 'rgba(255,255,255,0.45)', fontSize: '11px',
        textTransform: 'uppercase', letterSpacing: '0.1em',
        marginBottom: '10px', fontWeight: 500,
      }}>
        Changer de projet
      </p>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10, padding: '9px 12px', color: 'rgba(255,255,255,0.7)',
          fontSize: 13, fontFamily: "'Inter', sans-serif", cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
      >
        <span>{projects.length} autre{projects.length > 1 ? 's' : ''} projet{projects.length > 1 ? 's' : ''}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.div>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 6, borderRadius: 10, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(15,25,50,0.95)',
          }}
        >
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => { onSelect(p.id); setOpen(false); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                background: 'none', border: 'none', padding: '10px 12px',
                color: 'rgba(255,255,255,0.7)', fontSize: 13,
                fontFamily: "'Inter', sans-serif", cursor: 'pointer',
                textAlign: 'left', transition: 'background 0.15s',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <span style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>
                {TYPE_META[p.type].icon}
              </span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.title}
              </span>
              <ChevronRight size={12} style={{ flexShrink: 0, opacity: 0.4 }} />
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ─── API-driven document row ──────────────────────────────────────────────────

function ApiDocumentRow({
  doc,
  projectId,
  onUploaded,
}: {
  doc: ProjectDocumentItemDto;
  projectId: string;
  onUploaded: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const status: 'done' | 'pending' | 'missing' =
    doc.uploaded && doc.documentStatus !== 'REJECTED'
      ? doc.documentStatus === 'APPROVED' ? 'done' : 'pending'
      : 'missing';

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    uploadDocumentApi(projectId, doc.documentTypeId, file)
      .then(() => onUploaded())
      .catch(() => {/* TODO: surface error */})
      .finally(() => {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      });
  }

  return (
    <div
      style={{
        background: 'white', borderRadius: '10px', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: '16px',
        border: '1px solid rgba(27, 43, 75, 0.05)', transition: 'all 0.18s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(27, 43, 75, 0.08)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateX(2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      />
      <StatusIcon status={status} />
      <div style={{ flex: 1 }}>
        <p style={{ color: '#2C2C2C', fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>
          {doc.documentTypeName}
          {!doc.required && (
            <span style={{ marginLeft: 8, fontSize: 11, color: '#9CA3AF', fontWeight: 400 }}>(optionnel)</span>
          )}
        </p>
        {doc.documentTypeCategory && (
          <p style={{ color: '#9CA3AF', fontSize: '12px' }}>{doc.documentTypeCategory}</p>
        )}
      </div>
      <StatusBadge status={status} />
      {status !== 'done' && (
        <button
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: status === 'missing' ? '#C9A84C' : 'rgba(27, 43, 75, 0.06)',
            color: status === 'missing' ? 'white' : '#1B2B4B',
            border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '12px',
            fontFamily: "'Inter', sans-serif", fontWeight: 500,
            cursor: uploading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
            transition: 'all 0.15s ease', opacity: uploading ? 0.6 : 1,
          }}
        >
          <Upload size={13} />
          {uploading ? 'Envoi…' : 'Déposer'}
        </button>
      )}
    </div>
  );
}

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
          style={{ width: 8, height: 8, borderRadius: '50%', background: '#C9A84C' }}
        />
      ))}
    </div>
  );
}

// ─── Existing subcomponents (unchanged) ──────────────────────────────────────

type DocStatus = 'done' | 'pending' | 'missing';

function DocumentRow({ doc }: { doc: { id: number; name: string; note: string; status: DocStatus } }) {
  return (
    <div
      style={{
        background: 'white', borderRadius: '10px', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: '16px',
        border: '1px solid rgba(27, 43, 75, 0.05)', transition: 'all 0.18s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(27, 43, 75, 0.08)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateX(2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
      }}
    >
      <StatusIcon status={doc.status} />
      <div style={{ flex: 1 }}>
        <p style={{ color: '#2C2C2C', fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>{doc.name}</p>
        <p style={{ color: '#9CA3AF', fontSize: '12px' }}>{doc.note}</p>
      </div>
      <StatusBadge status={doc.status} />
      {doc.status !== 'done' && (
        <button style={{
          background: doc.status === 'missing' ? '#C9A84C' : 'rgba(27, 43, 75, 0.06)',
          color: doc.status === 'missing' ? 'white' : '#1B2B4B',
          border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '12px',
          fontFamily: "'Inter', sans-serif", fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, transition: 'all 0.15s ease',
        }}>
          <Upload size={13} />
          Déposer
        </button>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: DocStatus }) {
  if (status === 'done') {
    return (
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Check size={14} color="#22C55E" strokeWidth={2.5} />
      </div>
    );
  }
  if (status === 'pending') {
    return (
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Clock size={14} color="#F97316" strokeWidth={2} />
      </div>
    );
  }
  return (
    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(156, 163, 175, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Minus size={14} color="#9CA3AF" strokeWidth={2.5} />
    </div>
  );
}

function StatusBadge({ status }: { status: DocStatus }) {
  const config = {
    done:    { label: 'Fourni',     color: '#22C55E', bg: 'rgba(34, 197, 94, 0.08)' },
    pending: { label: 'En attente', color: '#F97316', bg: 'rgba(249, 115, 22, 0.08)' },
    missing: { label: 'Manquant',   color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.1)' },
  };
  const c = config[status];
  return (
    <span style={{ background: c.bg, color: c.color, borderRadius: '50px', padding: '3px 10px', fontSize: '11px', fontWeight: 600, flexShrink: 0 }}>
      {c.label}
    </span>
  );
}

function ProgressStep({ label, status, isLast }: { label: string; status: 'done' | 'current' | 'upcoming'; isLast: boolean }) {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: '26px', height: '26px', borderRadius: '50%',
          background: status === 'done' ? '#C9A84C' : 'transparent',
          border: status === 'done' ? 'none' : status === 'current' ? '2px solid #C9A84C' : '2px solid rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {status === 'done' && <Check size={13} color="white" strokeWidth={2.5} />}
          {status === 'current' && <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#C9A84C' }} />}
        </div>
        {!isLast && (
          <div style={{ width: '2px', height: '36px', background: status === 'done' ? '#C9A84C' : 'rgba(255,255,255,0.1)', marginTop: '4px', borderRadius: '1px' }} />
        )}
      </div>
      <div style={{ paddingTop: '2px', paddingBottom: isLast ? 0 : '24px' }}>
        <span style={{
          color: status === 'upcoming' ? 'rgba(255,255,255,0.35)' : status === 'current' ? 'white' : 'rgba(255,255,255,0.75)',
          fontSize: '14px', fontFamily: "'Inter', sans-serif", fontWeight: status === 'current' ? 600 : 400,
        }}>
          {label}
        </span>
        {status === 'current' && (
          <p style={{ color: '#C9A84C', fontSize: '11px', marginTop: '2px' }}>En cours</p>
        )}
      </div>
    </div>
  );
}
