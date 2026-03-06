import { motion } from 'motion/react';
import { ChevronDown, FileText, Check, PieChart, Shield, Lock, Flag } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { ReactNode } from 'react';
import { Logo } from '../Logo';
import React from "react";

export function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: "'Inter', sans-serif",
      }}
      className="flex-col md:flex-row"
    >
      {/* Left panel — Deep Navy */}
      <div
        style={{
          background: '#1B2B4B',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="w-full md:w-[42%] min-h-[50vh] md:min-h-screen p-8 md:px-[52px] md:py-12"
      >
        {/* Decorative rings */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '-40px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: '1px solid rgba(201, 168, 76, 0.08)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '80px',
            right: '-10px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '1px solid rgba(201, 168, 76, 0.06)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '-60px',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            border: '1px solid rgba(201, 168, 76, 0.05)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '200px',
            right: '40px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '1px solid rgba(201, 168, 76, 0.07)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo variant="white" size="md" />
        </motion.div>

        {/* Welcome text */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: '48px',
            paddingBottom: '32px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <p
              style={{
                color: '#C9A84C',
                fontSize: '12px',
                letterSpacing: '0.12em',
                marginBottom: '20px',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              Espace personnel sécurisé
            </p>
            <h1
              className="text-4xl md:text-[48px]"
              style={{
                fontFamily: "'DM Serif Display', serif",
                color: 'white',
                lineHeight: 1.15,
                marginBottom: '20px',
                fontWeight: 400,
              }}
            >
              Bonjour,
              <br />
              Sophie.
            </h1>
            <p
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '18px',
                lineHeight: 1.7,
                maxWidth: '320px',
              }}
            >
              Que souhaitez-vous
              <br />
              faire aujourd'hui ?
            </p>
          </motion.div>
        </div>

        {/* Chevron animated */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '8px' }}>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown size={22} color="rgba(201, 168, 76, 0.6)" />
          </motion.div>
        </div>
      </div>

      {/* Right panel — Off-white */}
      <div
        style={{
          flex: 1,
          background: '#F8F6F1',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="px-6 py-10 md:px-14 md:py-12"
      >
        {/* Top right area */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              background: 'rgba(27, 43, 75, 0.05)',
              borderRadius: '50px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22C55E',
              }}
            />
            <span
              style={{
                color: '#2C2C2C',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              Connexion sécurisée
            </span>
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <ActionCard
              icon={<DocumentCheckIcon />}
              title="Préparer un projet"
              description="Achat immobilier, succession, donation…"
              cta="Commencer"
              ctaVariant="gold"
              onClick={() => navigate('/projet')}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <ActionCard
              icon={
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: 'rgba(27, 43, 75, 0.07)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PieChart size={26} color="#1B2B4B" strokeWidth={1.5} />
                </div>
              }
              title="Gérer mon patrimoine"
              description="Visualisez et optimisez vos actifs"
              cta="Accéder"
              ctaVariant="navy"
              onClick={() => navigate('/patrimoine')}
            />
          </motion.div>
        </div>

        {/* Footer — Security badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.75 }}
          style={{
            borderTop: '1px solid rgba(27, 43, 75, 0.1)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          <SecurityBadge icon={<Shield size={13} color="#1B2B4B" />} label="RGPD" />
          <Divider />
          <SecurityBadge icon={<Lock size={13} color="#1B2B4B" />} label="Chiffrement AES-256" />
          <Divider />
          <SecurityBadge icon={<Flag size={13} color="#1B2B4B" />} label="Hébergé en France" />
        </motion.div>
      </div>

    </div>
  );
}

function DocumentCheckIcon() {
  return (
    <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
      <div
        style={{
          width: 48,
          height: 48,
          background: 'rgba(201, 168, 76, 0.1)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FileText size={26} color="#C9A84C" strokeWidth={1.5} />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: -3,
          right: -5,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#C9A84C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #F8F6F1',
        }}
      >
        <Check size={11} color="white" strokeWidth={3} />
      </div>
    </div>
  );
}

interface ActionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  cta: string;
  ctaVariant: 'gold' | 'navy';
  onClick: () => void;
}

function ActionCard({ icon, title, description, cta, ctaVariant, onClick }: ActionCardProps) {
  return (
    <div
      onClick={onClick}
      className="p-5 md:p-[32px_36px]"
      style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(27, 43, 75, 0.07)',
        border: '1px solid rgba(27, 43, 75, 0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 12px 48px rgba(27, 43, 75, 0.13)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201, 168, 76, 0.3)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 4px 24px rgba(27, 43, 75, 0.07)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(27, 43, 75, 0.06)';
      }}
    >
      <div style={{ flexShrink: 0 }}>{icon}</div>

      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontFamily: "'DM Serif Display', serif",
            color: '#1B2B4B',
            fontSize: '22px',
            marginBottom: '6px',
            fontWeight: 400,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h3>
        <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.5 }}>{description}</p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        style={{
          flexShrink: 0,
          background: ctaVariant === 'gold' ? '#C9A84C' : 'transparent',
          color: ctaVariant === 'gold' ? 'white' : '#1B2B4B',
          border: ctaVariant === 'navy' ? '1.5px solid #1B2B4B' : 'none',
          borderRadius: '10px',
          padding: '11px 22px',
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          if (ctaVariant === 'gold') {
            el.style.background = '#B8973B';
          } else {
            el.style.background = '#1B2B4B';
            el.style.color = 'white';
          }
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          if (ctaVariant === 'gold') {
            el.style.background = '#C9A84C';
          } else {
            el.style.background = 'transparent';
            el.style.color = '#1B2B4B';
          }
        }}
      >
        {cta}
      </button>
    </div>
  );
}

function SecurityBadge({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {icon}
      <span style={{ color: '#6B7280', fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
        {label}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ width: '1px', height: '18px', background: 'rgba(27, 43, 75, 0.1)' }} />
  );
}