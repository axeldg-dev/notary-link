import { motion } from 'motion/react';
import {
  Check,
  Clock,
  Minus,
  Upload,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import React from "react";

const STEPS = [
  { id: 1, label: 'Projet', status: 'done' as const },
  { id: 2, label: 'Documents', status: 'current' as const },
  { id: 3, label: 'Vérification', status: 'upcoming' as const },
  { id: 4, label: 'Envoi', status: 'upcoming' as const },
];

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

export function DocumentsScreen() {
  const navigate = useNavigate();

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
        {/* Left sidebar — Navy */}
        <div
          style={{
            background: '#1B2B4B',
            padding: '40px 32px',
            flexShrink: 0,
            position: 'relative',
          }}
          className="w-full md:w-72"
        >
          {/* Project info */}
          <div style={{ marginBottom: '40px' }}>
            <p
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '10px',
                fontWeight: 500,
              }}
            >
              Projet en cours
            </p>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                color: 'white',
                fontSize: '22px',
                fontWeight: 400,
                lineHeight: 1.2,
                marginBottom: '8px',
              }}
            >
              Achat immobilier
            </h2>
            <div
              style={{
                background: 'rgba(201, 168, 76, 0.15)',
                borderRadius: '6px',
                padding: '6px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#C9A84C',
                }}
              />
              <span style={{ color: '#C9A84C', fontSize: '12px', fontWeight: 500 }}>
                En cours
              </span>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: '1px',
              background: 'rgba(255,255,255,0.08)',
              marginBottom: '36px',
            }}
          />

          {/* Progress tracker */}
          <p
            style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '24px',
              fontWeight: 500,
            }}
          >
            Progression
          </p>

          <div>
            {STEPS.map((step, index) => (
              <ProgressStep
                key={step.id}
                label={step.label}
                status={step.status}
                isLast={index === STEPS.length - 1}
              />
            ))}
          </div>

          {/* Decorative ring */}
          <div
            style={{
              position: 'absolute',
              bottom: '-40px',
              right: '-40px',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              border: '1px solid rgba(201, 168, 76, 0.06)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Main panel */}
        <div
          style={{
            flex: 1,
            padding: '40px 48px',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                color: '#1B2B4B',
                fontSize: '32px',
                fontWeight: 400,
                marginBottom: '20px',
              }}
            >
              Documents nécessaires
            </h1>

            {/* Progress bar */}
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px 24px',
                boxShadow: '0 2px 16px rgba(27, 43, 75, 0.06)',
                border: '1px solid rgba(27, 43, 75, 0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <span style={{ color: '#2C2C2C', fontSize: '14px', fontWeight: 500 }}>
                  {doneCount} documents sur {totalCount} fournis
                </span>
                <span
                  style={{
                    color: '#C9A84C',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: "'DM Serif Display', serif",
                  }}
                >
                  {Math.round((doneCount / totalCount) * 100)}%
                </span>
              </div>
              <div
                style={{
                  height: '6px',
                  background: '#F3F4F6',
                  borderRadius: '50px',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(doneCount / totalCount) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #C9A84C, #E8D9B5)',
                    borderRadius: '50px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Document list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '100px' }}>
            {DOCUMENTS.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                <DocumentRow doc={doc} />
              </motion.div>
            ))}
          </div>

          {/* Continue button */}
          <div
            style={{
              borderTop: '1px solid rgba(27, 43, 75, 0.08)',
              paddingTop: '24px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginBottom: '32px',
            }}
          >
            <button
              style={{
                background: 'none',
                border: '1.5px solid #1B2B4B',
                color: '#1B2B4B',
                borderRadius: '10px',
                padding: '12px 24px',
                fontSize: '14px',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Sauvegarder
            </button>
            <button
              onClick={() => navigate('/envoi')}
              style={{
                background: '#C9A84C',
                border: 'none',
                color: 'white',
                borderRadius: '10px',
                padding: '12px 24px',
                fontSize: '14px',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
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
          position: 'fixed',
          bottom: '88px',
          right: '32px',
          background: '#E8D9B5',
          borderRadius: '16px',
          padding: '20px 24px',
          maxWidth: '320px',
          boxShadow: '0 8px 32px rgba(27, 43, 75, 0.15)',
          border: '1px solid rgba(201, 168, 76, 0.25)',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#C9A84C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sparkles size={17} color="white" strokeWidth={2} />
          </div>
          <div>
            <p
              style={{
                color: '#1B2B4B',
                fontSize: '13px',
                lineHeight: 1.6,
                marginBottom: '10px',
                fontWeight: 400,
              }}
            >
              Vous avez presque terminé ! Il vous manque{' '}
              <strong style={{ fontWeight: 600 }}>3 documents clés</strong> pour finaliser votre
              dossier.
            </p>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#C9A84C',
                fontSize: '13px',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: 0,
              }}
            >
              Voir les conseils
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </motion.div>

    </div>
  );
}

type DocStatus = 'done' | 'pending' | 'missing';

function DocumentRow({ doc }: { doc: { id: number; name: string; note: string; status: DocStatus } }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '10px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        border: '1px solid rgba(27, 43, 75, 0.05)',
        transition: 'all 0.18s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 4px 16px rgba(27, 43, 75, 0.08)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateX(2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
      }}
    >
      {/* Status icon */}
      <StatusIcon status={doc.status} />

      {/* Doc info */}
      <div style={{ flex: 1 }}>
        <p
          style={{
            color: '#2C2C2C',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '2px',
          }}
        >
          {doc.name}
        </p>
        <p style={{ color: '#9CA3AF', fontSize: '12px' }}>{doc.note}</p>
      </div>

      {/* Status label */}
      <StatusBadge status={doc.status} />

      {/* Upload button */}
      {doc.status !== 'done' && (
        <button
          style={{
            background: doc.status === 'missing' ? '#C9A84C' : 'rgba(27, 43, 75, 0.06)',
            color: doc.status === 'missing' ? 'white' : '#1B2B4B',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 14px',
            fontSize: '12px',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
        >
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
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Check size={14} color="#22C55E" strokeWidth={2.5} />
      </div>
    );
  }
  if (status === 'pending') {
    return (
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'rgba(249, 115, 22, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Clock size={14} color="#F97316" strokeWidth={2} />
      </div>
    );
  }
  return (
    <div
      style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: 'rgba(156, 163, 175, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Minus size={14} color="#9CA3AF" strokeWidth={2.5} />
    </div>
  );
}

function StatusBadge({ status }: { status: DocStatus }) {
  const config = {
    done: { label: 'Fourni', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.08)' },
    pending: { label: 'En attente', color: '#F97316', bg: 'rgba(249, 115, 22, 0.08)' },
    missing: { label: 'Manquant', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.1)' },
  };
  const c = config[status];
  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        borderRadius: '50px',
        padding: '3px 10px',
        fontSize: '11px',
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {c.label}
    </span>
  );
}

function ProgressStep({
  label,
  status,
  isLast,
}: {
  label: string;
  status: 'done' | 'current' | 'upcoming';
  isLast: boolean;
}) {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      {/* Indicator column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        {/* Circle */}
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background:
              status === 'done'
                ? '#C9A84C'
                : 'transparent',
            border:
              status === 'done'
                ? 'none'
                : status === 'current'
                ? '2px solid #C9A84C'
                : '2px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {status === 'done' && <Check size={13} color="white" strokeWidth={2.5} />}
          {status === 'current' && (
            <div
              style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: '#C9A84C',
              }}
            />
          )}
        </div>
        {/* Connecting line */}
        {!isLast && (
          <div
            style={{
              width: '2px',
              height: '36px',
              background:
                status === 'done' ? '#C9A84C' : 'rgba(255,255,255,0.1)',
              marginTop: '4px',
              borderRadius: '1px',
            }}
          />
        )}
      </div>

      {/* Label */}
      <div
        style={{
          paddingTop: '2px',
          paddingBottom: isLast ? 0 : '24px',
        }}
      >
        <span
          style={{
            color:
              status === 'upcoming'
                ? 'rgba(255,255,255,0.35)'
                : status === 'current'
                ? 'white'
                : 'rgba(255,255,255,0.75)',
            fontSize: '14px',
            fontFamily: "'Inter', sans-serif",
            fontWeight: status === 'current' ? 600 : 400,
          }}
        >
          {label}
        </span>
        {status === 'current' && (
          <p style={{ color: '#C9A84C', fontSize: '11px', marginTop: '2px' }}>En cours</p>
        )}
      </div>
    </div>
  );
}