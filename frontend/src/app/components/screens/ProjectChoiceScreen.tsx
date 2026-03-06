import { useState } from 'react';
import { motion } from 'motion/react';
import { Home, Users, Gift, Folder, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { ReactNode } from 'react';
import { Navbar, DemoNav } from '../Navbar';

const PROJECTS = [
  {
    id: 'immobilier',
    label: 'Achat immobilier',
    description: 'Acquisition, vente ou financement d\'un bien',
    icon: Home,
  },
  {
    id: 'succession',
    label: 'Succession',
    description: 'Règlement d\'une succession ou héritage',
    icon: Users,
  },
  {
    id: 'donation',
    label: 'Donation',
    description: 'Donation entre vifs, don manuel ou familial',
    icon: Gift,
  },
  {
    id: 'autre',
    label: 'Autre démarche',
    description: 'Contrat de mariage, PACS, mandat de protection…',
    icon: Folder,
  },
];

export function ProjectChoiceScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

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
      <Navbar breadcrumb="Nouveau projet" />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '760px' }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                color: '#1B2B4B',
                fontSize: '38px',
                fontWeight: 400,
                lineHeight: 1.2,
                marginBottom: '12px',
              }}
            >
              Quel est votre projet ?
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '16px', lineHeight: 1.6 }}>
              Sélectionnez le type de démarche pour commencer
            </p>
          </div>

          {/* 2x2 Grid of cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '18px',
              marginBottom: '40px',
            }}
            className="grid-cols-1 sm:grid-cols-2"
          >
            {PROJECTS.map((project, index) => {
              const Icon = project.icon;
              const isSelected = selected === project.id;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
                >
                  <ProjectCard
                    icon={<Icon size={28} color={isSelected ? '#C9A84C' : '#C9A84C'} strokeWidth={1.5} />}
                    label={project.label}
                    description={project.description}
                    isSelected={isSelected}
                    onClick={() => setSelected(project.id)}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Bottom action */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <button
              onClick={() => navigate('/home')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6B7280',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '12px 0',
              }}
            >
              ← Retour
            </button>

            <motion.button
              onClick={() => selected && navigate('/documents')}
              disabled={!selected}
              whileHover={selected ? { scale: 1.02 } : {}}
              whileTap={selected ? { scale: 0.98 } : {}}
              style={{
                background: selected ? '#C9A84C' : '#E5E7EB',
                color: selected ? 'white' : '#9CA3AF',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 32px',
                fontSize: '15px',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                cursor: selected ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s ease',
                boxShadow: selected ? '0 4px 16px rgba(201, 168, 76, 0.35)' : 'none',
              }}
            >
              Continuer
              <ChevronRight size={16} />
            </motion.button>
          </div>

          {/* Helper text */}
          {selected && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: 'right',
                fontSize: '12px',
                color: '#9CA3AF',
                marginTop: '10px',
              }}
            >
              Projet sélectionné :{' '}
              <strong style={{ color: '#C9A84C' }}>
                {PROJECTS.find((p) => p.id === selected)?.label}
              </strong>
            </motion.p>
          )}
        </motion.div>
      </div>

      <DemoNav />
    </div>
  );
}

interface ProjectCardProps {
  icon: ReactNode;
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

function ProjectCard({ icon, label, description, isSelected, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '14px',
        padding: '28px',
        border: isSelected ? '2px solid #C9A84C' : '2px solid transparent',
        boxShadow: isSelected
          ? '0 8px 32px rgba(201, 168, 76, 0.18)'
          : '0 2px 16px rgba(27, 43, 75, 0.06)',
        cursor: 'pointer',
        transition: 'all 0.22s ease',
        outline: isSelected ? '0' : 'none',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201, 168, 76, 0.5)';
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            '0 6px 24px rgba(201, 168, 76, 0.1)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            '0 2px 16px rgba(27, 43, 75, 0.06)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        }
      }}
    >
      {/* Selected check */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            background: '#C9A84C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path
              d="M1 4L4 7.5L10 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Icon */}
      <div
        style={{
          width: '52px',
          height: '52px',
          background: isSelected ? 'rgba(201, 168, 76, 0.12)' : 'rgba(201, 168, 76, 0.08)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontFamily: "'DM Serif Display', serif",
          color: '#1B2B4B',
          fontSize: '19px',
          fontWeight: 400,
          marginBottom: '6px',
          lineHeight: 1.2,
        }}
      >
        {label}
      </h3>
      <p style={{ color: '#9CA3AF', fontSize: '13px', lineHeight: 1.5 }}>{description}</p>
    </div>
  );
}