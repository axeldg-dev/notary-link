import { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle,
  MapPin,
  Star,
  Lock,
  Send,
  ChevronRight,
  FileText,
  Calendar,
  Tag,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import type { ReactNode } from 'react';
import React from "react";

const NOTARIES = [
  {
    id: 1,
    name: 'Me. Isabelle Fontaine',
    initials: 'IF',
    city: 'Paris 8ème',
    specialty: 'Immobilier',
    rating: 4.9,
    reviews: 128,
    available: "Disponible dès lundi",
    specialtyColor: '#1B2B4B',
  },
  {
    id: 2,
    name: 'Me. François Leclerc',
    initials: 'FL',
    city: 'Neuilly-sur-Seine',
    specialty: 'Successions',
    rating: 4.7,
    reviews: 94,
    available: "Disponible mercredi",
    specialtyColor: '#C9A84C',
  },
  {
    id: 3,
    name: 'Me. Claire Beaumont',
    initials: 'CB',
    city: 'Versailles',
    specialty: 'Droit immobilier',
    rating: 4.8,
    reviews: 211,
    available: "Disponible mardi",
    specialtyColor: '#1B2B4B',
  },
];

export function SendScreen() {
  const navigate = useNavigate();
  const [selectedNotary, setSelectedNotary] = useState<number | null>(null);
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (selectedNotary) {
      setSent(true);
    }
  }

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


      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '48px 24px',
          paddingBottom: '120px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '680px' }}>
          {/* Success header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '40px' }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 180, delay: 0.15, damping: 15 }}
              style={{ display: 'inline-flex', marginBottom: '20px' }}
            >
              <div
                style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  background: 'rgba(201, 168, 76, 0.1)',
                  border: '2px solid rgba(201, 168, 76, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle size={44} color="#C9A84C" strokeWidth={1.5} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h1
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  color: '#1B2B4B',
                  fontSize: '36px',
                  fontWeight: 400,
                  lineHeight: 1.2,
                  marginBottom: '10px',
                }}
              >
                Votre dossier est prêt
              </h1>
              <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.6 }}>
                Tous vos documents ont été vérifiés. Sélectionnez un notaire
                <br />
                pour transmettre votre dossier de façon sécurisée.
              </p>
            </motion.div>
          </motion.div>

          {/* Summary card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '28px 32px',
              boxShadow: '0 4px 24px rgba(27, 43, 75, 0.07)',
              border: '1px solid rgba(27, 43, 75, 0.06)',
              marginBottom: '32px',
            }}
          >
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                color: '#1B2B4B',
                fontSize: '18px',
                fontWeight: 400,
                marginBottom: '20px',
              }}
            >
              Récapitulatif du dossier
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
              }}
              className="grid-cols-1 sm:grid-cols-2"
            >
              <SummaryItem
                icon={<FileText size={15} color="#C9A84C" />}
                label="Type de projet"
                value="Achat immobilier"
              />
              <SummaryItem
                icon={<CheckCircle size={15} color="#22C55E" />}
                label="Documents fournis"
                value="7 sur 10"
              />
              <SummaryItem
                icon={<Tag size={15} color="#C9A84C" />}
                label="Valeur estimée"
                value="320 000 €"
              />
              <SummaryItem
                icon={<Calendar size={15} color="#C9A84C" />}
                label="Date de dépôt"
                value="5 mars 2026"
              />
            </div>

            {/* Progress pills */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '20px',
                flexWrap: 'wrap',
              }}
            >
              {['Projet défini', 'Documents déposés', 'Vérification effectuée'].map((label) => (
                <div
                  key={label}
                  style={{
                    background: 'rgba(34, 197, 94, 0.08)',
                    color: '#22C55E',
                    borderRadius: '50px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                    <path
                      d="M1 3.5L3 5.5L7 1"
                      stroke="#22C55E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Notary selection */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                color: '#1B2B4B',
                fontSize: '22px',
                fontWeight: 400,
                marginBottom: '6px',
              }}
            >
              Choisir un notaire partenaire
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '20px' }}>
              Notaires certifiés — vérifiés par NotaryLink
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
              {NOTARIES.map((notary, i) => (
                <motion.div
                  key={notary.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.5 + i * 0.08 }}
                >
                  <NotaryCard
                    notary={notary}
                    isSelected={selectedNotary === notary.id}
                    onSelect={() =>
                      setSelectedNotary(selectedNotary === notary.id ? null : notary.id)
                    }
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            style={{ textAlign: 'center' }}
          >
            {sent ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  borderRadius: '14px',
                  padding: '24px',
                }}
              >
                <CheckCircle size={32} color="#22C55E" style={{ marginBottom: '8px' }} />
                <p
                  style={{
                    color: '#22C55E',
                    fontSize: '15px',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  Dossier transmis avec succès !
                </p>
                <p style={{ color: '#6B7280', fontSize: '13px' }}>
                  {NOTARIES.find((n) => n.id === selectedNotary)?.name} a été notifié(e).
                </p>
              </motion.div>
            ) : (
              <>
                <button
                  onClick={handleSend}
                  disabled={!selectedNotary}
                  style={{
                    background: selectedNotary ? '#C9A84C' : '#E5E7EB',
                    color: selectedNotary ? 'white' : '#9CA3AF',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '16px 40px',
                    fontSize: '16px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    cursor: selectedNotary ? 'pointer' : 'not-allowed',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: selectedNotary ? '0 6px 24px rgba(201, 168, 76, 0.4)' : 'none',
                    transition: 'all 0.2s ease',
                    marginBottom: '12px',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedNotary) {
                      (e.currentTarget as HTMLButtonElement).style.background = '#B8973B';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedNotary) {
                      (e.currentTarget as HTMLButtonElement).style.background = '#C9A84C';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <Lock size={17} />
                  Envoyer le dossier
                  <Send size={15} />
                </button>

                <p
                  style={{
                    color: '#9CA3AF',
                    fontSize: '12px',
                    fontStyle: 'italic',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                  }}
                >
                  <Lock size={11} />
                  Transmission sécurisée et chiffrée
                </p>

                {!selectedNotary && (
                  <p style={{ color: '#C9A84C', fontSize: '12px', marginTop: '8px' }}>
                    Veuillez sélectionner un notaire pour continuer
                  </p>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>

    </div>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: '#F8F6F1',
        borderRadius: '10px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 1px 6px rgba(27, 43, 75, 0.06)',
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ color: '#9CA3AF', fontSize: '11px', marginBottom: '2px' }}>{label}</p>
        <p style={{ color: '#2C2C2C', fontSize: '14px', fontWeight: 500 }}>{value}</p>
      </div>
    </div>
  );
}

interface NotaryCardProps {
  notary: (typeof NOTARIES)[0];
  isSelected: boolean;
  onSelect: () => void;
}

function NotaryCard({ notary, isSelected, onSelect }: NotaryCardProps) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: 'white',
        borderRadius: '14px',
        padding: '20px 24px',
        border: isSelected ? '2px solid #C9A84C' : '2px solid transparent',
        boxShadow: isSelected
          ? '0 6px 28px rgba(201, 168, 76, 0.16)'
          : '0 2px 14px rgba(27, 43, 75, 0.06)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201, 168, 76, 0.4)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateX(3px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
        }
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: isSelected ? '#C9A84C' : '#1B2B4B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isSelected ? 'white' : '#C9A84C',
          fontSize: '15px',
          fontFamily: "'DM Serif Display', serif",
          flexShrink: 0,
          transition: 'background 0.2s ease',
        }}
      >
        {notary.initials}
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <p style={{ color: '#2C2C2C', fontSize: '15px', fontWeight: 500 }}>{notary.name}</p>
          <span
            style={{
              background:
                notary.specialtyColor === '#C9A84C'
                  ? 'rgba(201, 168, 76, 0.1)'
                  : 'rgba(27, 43, 75, 0.07)',
              color: notary.specialtyColor,
              borderRadius: '50px',
              padding: '2px 10px',
              fontSize: '11px',
              fontWeight: 500,
            }}
          >
            {notary.specialty}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#9CA3AF',
              fontSize: '12px',
            }}
          >
            <MapPin size={12} />
            {notary.city}
          </span>
          <span style={{ color: 'rgba(27, 43, 75, 0.15)', fontSize: '12px' }}>•</span>
          <StarRating rating={notary.rating} reviews={notary.reviews} />
          <span style={{ color: 'rgba(27, 43, 75, 0.15)', fontSize: '12px' }}>•</span>
          <span style={{ color: '#22C55E', fontSize: '12px', fontWeight: 500 }}>
            {notary.available}
          </span>
        </div>
      </div>

      {/* Select button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        style={{
          background: isSelected ? '#C9A84C' : 'transparent',
          color: isSelected ? 'white' : '#1B2B4B',
          border: isSelected ? 'none' : '1.5px solid #1B2B4B',
          borderRadius: '9px',
          padding: '9px 18px',
          fontSize: '13px',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {isSelected ? (
          <>
            Sélectionné <ChevronRight size={13} />
          </>
        ) : (
          'Sélectionner'
        )}
      </button>
    </div>
  );
}

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          color="#C9A84C"
          fill={s <= Math.floor(rating) ? '#C9A84C' : 'none'}
          strokeWidth={1.5}
        />
      ))}
      <span style={{ color: '#6B7280', fontSize: '11px', marginLeft: '3px' }}>
        {rating} ({reviews})
      </span>
    </div>
  );
}