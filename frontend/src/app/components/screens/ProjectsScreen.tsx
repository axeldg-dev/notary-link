import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Home, Users, Gift, Folder, Plus, Pencil, Trash2, X, ChevronRight,
    Clock, CheckCircle2, Send, Archive, Search,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    fetchProjects, createProject, updateProject, deleteProject,
    selectProjects, selectProjectStatus, selectProjectError, resetProjectStatus,
} from '../../features/projectSlice';
import type { ProjectResponseDto, CreateProjectRequestDto, UpdateProjectRequestDto } from '../../api/projectApi';

// ─── Constants ──────────────────────────────────────────────────────────────

const TYPE_META: Record<ProjectResponseDto['type'], { label: string; icon: React.ReactNode; color: string }> = {
    REAL_ESTATE_PURCHASE: {
        label: 'Achat immobilier',
        icon: <Home size={20} strokeWidth={1.5} />,
        color: '#3B82F6',
    },
    SUCCESSION: {
        label: 'Succession',
        icon: <Users size={20} strokeWidth={1.5} />,
        color: '#8B5CF6',
    },
    DONATION: {
        label: 'Donation',
        icon: <Gift size={20} strokeWidth={1.5} />,
        color: '#EC4899',
    },
    OTHER: {
        label: 'Autre démarche',
        icon: <Folder size={20} strokeWidth={1.5} />,
        color: '#6B7280',
    },
};

const STATUS_META: Record<ProjectResponseDto['status'], { label: string; icon: React.ReactNode; bg: string; text: string }> = {
    IN_PROGRESS: { label: 'En cours', icon: <Clock size={12} />, bg: 'rgba(201,168,76,0.12)', text: '#C9A84C' },
    COMPLETE:    { label: 'Terminé',  icon: <CheckCircle2 size={12} />, bg: 'rgba(34,197,94,0.12)',  text: '#16A34A' },
    SENT:        { label: 'Envoyé',   icon: <Send size={12} />,        bg: 'rgba(59,130,246,0.12)', text: '#2563EB' },
    ARCHIVED:    { label: 'Archivé',  icon: <Archive size={12} />,     bg: 'rgba(107,114,128,0.12)',text: '#6B7280' },
};

const TYPE_OPTIONS: ProjectResponseDto['type'][] = [
    'REAL_ESTATE_PURCHASE', 'SUCCESSION', 'DONATION', 'OTHER',
];
const STATUS_OPTIONS: ProjectResponseDto['status'][] = [
    'IN_PROGRESS', 'COMPLETE', 'SENT', 'ARCHIVED',
];

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export function ProjectsScreen() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const projects = useAppSelector(selectProjects);
    const status = useAppSelector(selectProjectStatus);
    const error = useAppSelector(selectProjectError);

    const [search, setSearch] = useState('');
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<ProjectResponseDto | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ProjectResponseDto | null>(null);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    const filtered = projects.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        TYPE_META[p.type].label.toLowerCase().includes(search.toLowerCase())
    );

    const counts = {
        total: projects.length,
        inProgress: projects.filter(p => p.status === 'IN_PROGRESS').length,
        complete: projects.filter(p => p.status === 'COMPLETE').length,
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F8F6F1', fontFamily: "'Inter', sans-serif" }}>

            {/* ── Header bar ── */}
            <div
                style={{
                    background: '#1B2B4B',
                    padding: '28px 32px 24px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
                className="px-6 md:px-12"
            >
                {/* Decorative rings */}
                {[{ top: -30, right: 60, size: 160 }, { top: 20, right: 20, size: 80 }].map((r, i) => (
                    <div key={i} style={{
                        position: 'absolute', top: r.top, right: r.right,
                        width: r.size, height: r.size, borderRadius: '50%',
                        border: '1px solid rgba(201,168,76,0.08)', pointerEvents: 'none',
                    }} />
                ))}

                <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <p style={{ color: '#C9A84C', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 6 }}>
                                Espace personnel
                            </p>
                            <h1 style={{ fontFamily: "'DM Serif Display', serif", color: 'white', fontSize: 32, fontWeight: 400, lineHeight: 1.15, margin: 0 }}>
                                Mes projets
                            </h1>
                        </div>

                        {/* Stats chips */}
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <StatChip value={counts.total} label="total" color="rgba(255,255,255,0.15)" text="rgba(255,255,255,0.8)" />
                            <StatChip value={counts.inProgress} label="en cours" color="rgba(201,168,76,0.2)" text="#C9A84C" />
                            <StatChip value={counts.complete} label="terminés" color="rgba(34,197,94,0.15)" text="#4ADE80" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Toolbar ── */}
            <div style={{ background: 'white', borderBottom: '1px solid rgba(27,43,75,0.08)', padding: '16px 32px' }} className="px-6 md:px-12">
                <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Search */}
                    <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
                        <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Rechercher un projet…"
                            style={{
                                width: '100%', padding: '9px 12px 9px 36px',
                                border: '1.5px solid rgba(27,43,75,0.12)', borderRadius: 10,
                                fontSize: 13, fontFamily: "'Inter', sans-serif", color: '#1B2B4B',
                                background: '#F8F6F1', outline: 'none', boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    {/* New project button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setCreateOpen(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 7,
                            background: '#C9A84C', color: 'white', border: 'none',
                            borderRadius: 10, padding: '9px 18px', fontSize: 13,
                            fontFamily: "'Inter', sans-serif", fontWeight: 500, cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(201,168,76,0.3)', whiteSpace: 'nowrap',
                        }}
                    >
                        <Plus size={15} />
                        Nouveau projet
                    </motion.button>
                </div>
            </div>

            {/* ── Content ── */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 32px 120px' }} className="px-6 md:px-12">

                {/* Loading */}
                {status === 'loading' && projects.length === 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
                        <LoadingDots />
                    </div>
                )}

                {/* Error */}
                {status === 'failed' && error && (
                    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '14px 18px', color: '#DC2626', fontSize: 14, marginBottom: 24 }}>
                        {error}
                    </div>
                )}

                {/* Empty state */}
                {status === 'succeeded' && projects.length === 0 && (
                    <EmptyState onNew={() => setCreateOpen(true)} />
                )}

                {/* No search results */}
                {projects.length > 0 && filtered.length === 0 && (
                    <div style={{ textAlign: 'center', paddingTop: 60, color: '#9CA3AF', fontSize: 14 }}>
                        Aucun projet ne correspond à « {search} »
                    </div>
                )}

                {/* Grid */}
                {filtered.length > 0 && (
                    <div
                        style={{ display: 'grid', gap: 20 }}
                        className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        <AnimatePresence>
                            {filtered.map((project, i) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                >
                                    <ProjectCard
                                        project={project}
                                        onOpen={() => navigate(`/projets/${project.id}/documents`)}
                                        onEdit={() => setEditTarget(project)}
                                        onDelete={() => setDeleteTarget(project)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* ── Modals ── */}
            <AnimatePresence>
                {createOpen && (
                    <CreateModal
                        onClose={() => { setCreateOpen(false); dispatch(resetProjectStatus()); }}
                        onSubmit={(req) => {
                            dispatch(createProject(req)).then(() => setCreateOpen(false));
                        }}
                        loading={status === 'loading'}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {editTarget && (
                    <EditModal
                        project={editTarget}
                        onClose={() => { setEditTarget(null); dispatch(resetProjectStatus()); }}
                        onSubmit={(req) => {
                            dispatch(updateProject({ id: editTarget.id, request: req })).then(() => setEditTarget(null));
                        }}
                        loading={status === 'loading'}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {deleteTarget && (
                    <DeleteConfirm
                        project={deleteTarget}
                        onClose={() => setDeleteTarget(null)}
                        onConfirm={() => {
                            dispatch(deleteProject(deleteTarget.id)).then(() => setDeleteTarget(null));
                        }}
                        loading={status === 'loading'}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({
    project,
    onOpen,
    onEdit,
    onDelete,
}: {
    project: ProjectResponseDto;
    onOpen: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const [hovered, setHovered] = useState(false);
    const typeMeta = TYPE_META[project.type];
    const statusMeta = STATUS_META[project.status];

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onOpen}
            style={{
                background: 'white',
                borderRadius: 16,
                border: hovered ? '1.5px solid rgba(201,168,76,0.4)' : '1.5px solid rgba(27,43,75,0.07)',
                boxShadow: hovered ? '0 12px 40px rgba(27,43,75,0.12)' : '0 2px 12px rgba(27,43,75,0.06)',
                transition: 'all 0.22s ease',
                transform: hovered ? 'translateY(-3px)' : 'none',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Color stripe by type */}
            <div style={{ height: 4, background: typeMeta.color, opacity: 0.7 }} />

            <div style={{ padding: '20px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Top row: type icon + status badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: `${typeMeta.color}18`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: typeMeta.color, flexShrink: 0,
                    }}>
                        {typeMeta.icon}
                    </div>
                    <StatusBadge status={project.status} />
                </div>

                {/* Title */}
                <h3 style={{
                    fontFamily: "'DM Serif Display', serif", color: '#1B2B4B',
                    fontSize: 18, fontWeight: 400, lineHeight: 1.25,
                    marginBottom: 6, margin: '0 0 6px',
                }}>
                    {project.title}
                </h3>

                {/* Type label */}
                <p style={{ color: typeMeta.color, fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                    {typeMeta.label}
                </p>

                {/* Description */}
                {project.description && (
                    <p style={{
                        color: '#6B7280', fontSize: 13, lineHeight: 1.55,
                        marginBottom: 14, flex: 1,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                        {project.description}
                    </p>
                )}

                {/* Progress */}
                <div style={{ marginTop: 'auto', paddingTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ color: '#9CA3AF', fontSize: 11 }}>Progression</span>
                        <span style={{ color: '#1B2B4B', fontSize: 12, fontWeight: 600 }}>{project.progress}%</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(27,43,75,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', borderRadius: 99,
                            width: `${project.progress}%`,
                            background: project.status === 'COMPLETE' ? '#22C55E' : '#C9A84C',
                            transition: 'width 0.5s ease',
                        }} />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                padding: '12px 20px',
                borderTop: '1px solid rgba(27,43,75,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <span style={{ color: '#9CA3AF', fontSize: 11 }}>
                    Créé le {formatDate(project.createdAt)}
                </span>
                <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                    <ActionBtn onClick={onEdit} title="Modifier" color="#1B2B4B">
                        <Pencil size={13} />
                    </ActionBtn>
                    <ActionBtn onClick={onDelete} title="Supprimer" color="#EF4444" hoverBg="rgba(239,68,68,0.08)">
                        <Trash2 size={13} />
                    </ActionBtn>
                </div>
            </div>
        </div>
    );
}

// ─── Create Modal ─────────────────────────────────────────────────────────────

function CreateModal({ onClose, onSubmit, loading }: {
    onClose: () => void;
    onSubmit: (req: CreateProjectRequestDto) => void;
    loading: boolean;
}) {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<ProjectResponseDto['type']>('REAL_ESTATE_PURCHASE');
    const [description, setDescription] = useState('');

    return (
        <Overlay onClose={onClose}>
            <ModalBox title="Nouveau projet" onClose={onClose}>
                <form onSubmit={e => { e.preventDefault(); onSubmit({ title, type, description: description || undefined }); }}>
                    <FieldGroup label="Titre du projet">
                        <ModalInput value={title} onChange={setTitle} placeholder="Ex : Achat appartement Paris" required />
                    </FieldGroup>
                    <FieldGroup label="Type de projet">
                        <ModalSelect value={type} onChange={v => setType(v as ProjectResponseDto['type'])}
                            options={TYPE_OPTIONS.map(t => ({ value: t, label: TYPE_META[t].label }))} />
                    </FieldGroup>
                    <FieldGroup label="Description (optionnel)">
                        <ModalTextarea value={description} onChange={setDescription} placeholder="Quelques mots sur votre projet…" />
                    </FieldGroup>
                    <ModalActions onCancel={onClose} loading={loading} submitLabel="Créer le projet" />
                </form>
            </ModalBox>
        </Overlay>
    );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({ project, onClose, onSubmit, loading }: {
    project: ProjectResponseDto;
    onClose: () => void;
    onSubmit: (req: UpdateProjectRequestDto) => void;
    loading: boolean;
}) {
    const [title, setTitle] = useState(project.title);
    const [type, setType] = useState<ProjectResponseDto['type']>(project.type);
    const [status, setStatus] = useState<ProjectResponseDto['status']>(project.status);
    const [description, setDescription] = useState(project.description ?? '');

    return (
        <Overlay onClose={onClose}>
            <ModalBox title="Modifier le projet" onClose={onClose}>
                <form onSubmit={e => { e.preventDefault(); onSubmit({ title, type, status, description: description || undefined }); }}>
                    <FieldGroup label="Titre du projet">
                        <ModalInput value={title} onChange={setTitle} placeholder="Titre" required />
                    </FieldGroup>
                    <FieldGroup label="Type de projet">
                        <ModalSelect value={type} onChange={v => setType(v as ProjectResponseDto['type'])}
                            options={TYPE_OPTIONS.map(t => ({ value: t, label: TYPE_META[t].label }))} />
                    </FieldGroup>
                    <FieldGroup label="Statut">
                        <ModalSelect value={status} onChange={v => setStatus(v as ProjectResponseDto['status'])}
                            options={STATUS_OPTIONS.map(s => ({ value: s, label: STATUS_META[s].label }))} />
                    </FieldGroup>
                    <FieldGroup label="Description">
                        <ModalTextarea value={description} onChange={setDescription} placeholder="Description…" />
                    </FieldGroup>
                    <ModalActions onCancel={onClose} loading={loading} submitLabel="Enregistrer" />
                </form>
            </ModalBox>
        </Overlay>
    );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({ project, onClose, onConfirm, loading }: {
    project: ProjectResponseDto;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}) {
    return (
        <Overlay onClose={onClose}>
            <ModalBox title="Supprimer le projet" onClose={onClose}>
                <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                    Voulez-vous vraiment supprimer <strong style={{ color: '#1B2B4B' }}>«&nbsp;{project.title}&nbsp;»</strong> ? Cette action est irréversible.
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button type="button" onClick={onClose} style={cancelBtnStyle}>Annuler</button>
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={onConfirm} disabled={loading}
                        style={{ ...submitBtnStyle, background: '#EF4444', boxShadow: '0 4px 14px rgba(239,68,68,0.3)' }}
                    >
                        {loading ? '…' : 'Supprimer'}
                    </motion.button>
                </div>
            </ModalBox>
        </Overlay>
    );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function StatChip({ value, label, color, text }: { value: number; label: string; color: string; text: string }) {
    return (
        <div style={{ background: color, borderRadius: 50, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: text, fontSize: 15, fontWeight: 600 }}>{value}</span>
            <span style={{ color: text, fontSize: 11, opacity: 0.8 }}>{label}</span>
        </div>
    );
}

function StatusBadge({ status }: { status: ProjectResponseDto['status'] }) {
    const m = STATUS_META[status];
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: m.bg, borderRadius: 50, padding: '4px 9px',
        }}>
            <span style={{ color: m.text }}>{m.icon}</span>
            <span style={{ color: m.text, fontSize: 11, fontWeight: 500 }}>{m.label}</span>
        </div>
    );
}

function ActionBtn({ children, onClick, title, color, hoverBg = 'rgba(27,43,75,0.08)' }: {
    children: React.ReactNode; onClick: () => void; title: string; color: string; hoverBg?: string;
}) {
    const [hov, setHov] = useState(false);
    return (
        <button
            onClick={onClick} title={title}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                background: hov ? hoverBg : 'transparent', color,
                border: 'none', borderRadius: 7, padding: '5px 7px',
                cursor: 'pointer', transition: 'background 0.15s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
        >
            {children}
        </button>
    );
}

function EmptyState({ onNew }: { onNew: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, gap: 16, textAlign: 'center' }}
        >
            <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Folder size={32} color="#C9A84C" strokeWidth={1.5} />
            </div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", color: '#1B2B4B', fontSize: 22, fontWeight: 400, margin: 0 }}>
                Aucun projet pour l'instant
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: 14, maxWidth: 320, lineHeight: 1.6, margin: 0 }}>
                Créez votre premier projet notarial et suivez son avancement ici.
            </p>
            <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={onNew}
                style={{
                    marginTop: 8, display: 'flex', alignItems: 'center', gap: 8,
                    background: '#C9A84C', color: 'white', border: 'none',
                    borderRadius: 12, padding: '12px 24px', fontSize: 14,
                    fontFamily: "'Inter', sans-serif", fontWeight: 500, cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(201,168,76,0.35)',
                }}
            >
                <Plus size={16} /> Créer un projet
                <ChevronRight size={15} />
            </motion.button>
        </motion.div>
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

// ── Modal scaffold ──────────────────────────────────────────────────────────

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.5)',
                backdropFilter: 'blur(4px)', zIndex: 10000,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ type: 'spring', damping: 24, stiffness: 280 }}
                onClick={e => e.stopPropagation()}
                style={{ width: '100%', maxWidth: 460 }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}

function ModalBox({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 80px rgba(17,24,39,0.2)' }}>
            <div style={{ background: '#1B2B4B', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", color: 'white', fontSize: 20, fontWeight: 400, margin: 0 }}>{title}</h2>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 4, display: 'flex' }}>
                    <X size={18} />
                </button>
            </div>
            <div style={{ padding: 24 }}>{children}</div>
        </div>
    );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#6B7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
            {children}
        </div>
    );
}

function ModalInput({ value, onChange, placeholder, required }: { value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
    return (
        <input
            value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} required={required}
            style={{ ...inputBase }}
        />
    );
}

function ModalSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
    return (
        <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputBase }}>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
    );
}

function ModalTextarea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <textarea
            value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} rows={3}
            style={{ ...inputBase, resize: 'vertical' as const, minHeight: 80 }}
        />
    );
}

function ModalActions({ onCancel, loading, submitLabel }: { onCancel: () => void; loading: boolean; submitLabel: string }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onCancel} style={cancelBtnStyle}>Annuler</button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading} style={submitBtnStyle}>
                {loading ? '…' : submitLabel}
            </motion.button>
        </div>
    );
}

const inputBase: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: '1.5px solid rgba(27,43,75,0.12)',
    borderRadius: 10, fontSize: 14, fontFamily: "'Inter', sans-serif", color: '#1B2B4B',
    background: '#F8F6F1', outline: 'none', boxSizing: 'border-box',
};

const cancelBtnStyle: React.CSSProperties = {
    padding: '9px 18px', borderRadius: 10, border: '1.5px solid rgba(27,43,75,0.15)',
    background: 'transparent', color: '#6B7280', fontSize: 13,
    fontFamily: "'Inter', sans-serif", fontWeight: 500, cursor: 'pointer',
};

const submitBtnStyle: React.CSSProperties = {
    padding: '9px 20px', borderRadius: 10, border: 'none',
    background: '#C9A84C', color: 'white', fontSize: 13,
    fontFamily: "'Inter', sans-serif", fontWeight: 500, cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(201,168,76,0.3)',
};
