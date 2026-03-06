import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  FileText,
  Folder,
  TrendingUp,
  TrendingDown,
  Minus as Flat,
  Calendar,
  Home,
  FolderOpen,
  Lightbulb,
  ArrowUpRight,
  CheckSquare,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate, useLocation } from 'react-router';
import { Logo } from '../Logo';
import React from "react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Tableau de bord', path: '/patrimoine' },
  { icon: Building2, label: 'Mes biens', path: '#' },
  { icon: CreditCard, label: 'Mes comptes', path: '#' },
  { icon: FileText, label: 'Mes contrats', path: '#' },
  { icon: Folder, label: 'Documents', path: '/documents' },
];

const KPIS = [
  {
    label: 'Immobilier',
    value: '320 000 €',
    change: '+2,3 %',
    positive: true,
    icon: Home,
    color: '#1B2B4B',
  },
  {
    label: 'Placements',
    value: '125 000 €',
    change: '+5,1 %',
    positive: true,
    icon: TrendingUp,
    color: '#C9A84C',
  },
  {
    label: 'Liquidités',
    value: '42 500 €',
    change: '0,0 %',
    positive: null,
    icon: Wallet,
    color: '#6B7280',
  },
];

const CHART_DATA = [
  { name: 'Immobilier', value: 320000, color: '#1B2B4B' },
  { name: 'Placements', value: 125000, color: '#C9A84C' },
  { name: 'Liquidités', value: 42500, color: '#E8D9B5' },
];

const TIMELINE = [
  {
    id: 1,
    date: "Aujourd'hui, 14h32",
    action: 'Document signé',
    detail: 'Compromis de vente — Rue de Rivoli, Paris',
    icon: CheckSquare,
    color: '#22C55E',
  },
  {
    id: 2,
    date: 'Hier, 09h15',
    action: 'Consultation planifiée',
    detail: 'Me. Fontaine — 12 mars à 10h00',
    icon: Calendar,
    color: '#C9A84C',
  },
  {
    id: 3,
    date: '28 fév., 16h45',
    action: 'Bien ajouté',
    detail: 'Appartement T3 — Estimation 92 000 €',
    icon: Home,
    color: '#1B2B4B',
  },
  {
    id: 4,
    date: '26 fév., 11h20',
    action: 'Dossier créé',
    detail: 'Achat immobilier — Paris 7ème',
    icon: FolderOpen,
    color: '#9CA3AF',
  },
];

const SUGGESTIONS = [
  {
    id: 1,
    title: 'Optimisation fiscale',
    detail: 'La création d\'une SCI familiale pourrait réduire votre imposition de 15 % sur vos revenus fonciers.',
  },
  {
    id: 2,
    title: 'Diversification conseillée',
    detail: 'Votre portefeuille manque d\'exposition internationale. Envisagez des ETF Europe ou Monde.',
  },
  {
    id: 3,
    title: 'Assurance vie',
    detail: 'Pensez à mettre à jour les bénéficiaires de votre contrat Predica ouvert en 2019.',
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'white',
          borderRadius: '10px',
          padding: '10px 16px',
          boxShadow: '0 4px 20px rgba(27, 43, 75, 0.1)',
          border: '1px solid rgba(27, 43, 75, 0.08)',
        }}
      >
        <p style={{ color: '#1B2B4B', fontSize: '13px', fontWeight: 600 }}>{payload[0].name}</p>
        <p style={{ color: '#C9A84C', fontSize: '14px', fontFamily: "'DM Serif Display', serif" }}>
          {payload[0].value.toLocaleString('fr-FR')} €
        </p>
      </div>
    );
  }
  return null;
};

export function PatrimoineScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#F8F6F1',
        fontFamily: "'Inter', sans-serif",
      }}
    >


      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <div
          style={{
            width: '230px',
            background: '#1B2B4B',
            padding: '32px 0',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
          className="hidden md:flex"
        >
          <p
            style={{
              color: 'rgba(255,255,255,0.3)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '0 24px',
              marginBottom: '16px',
              fontWeight: 600,
            }}
          >
            Navigation
          </p>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path && item.path !== '#';
            return (
              <button
                key={item.label}
                onClick={() => item.path !== '#' && navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 24px',
                  background: isActive ? 'rgba(201, 168, 76, 0.12)' : 'transparent',
                  borderLeft: isActive ? '3px solid #C9A84C' : '3px solid transparent',
                  border: 'none',
                  borderRight: 'none',
                  borderTop: 'none',
                  borderBottom: 'none',
                  width: '100%',
                  textAlign: 'left',
                  cursor: item.path !== '#' ? 'pointer' : 'default',
                  color: isActive ? '#C9A84C' : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.15s ease',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.9)';
                    (e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(255,255,255,0.04)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }
                }}
              >
                <Icon size={17} strokeWidth={isActive ? 2 : 1.5} />
                {item.label}
              </button>
            );
          })}

          {/* Bottom section */}
          <div style={{ marginTop: 'auto', padding: '0 24px' }}>
            <div
              style={{
                height: '1px',
                background: 'rgba(255,255,255,0.06)',
                marginBottom: '20px',
              }}
            />
            <div
              style={{
                background: 'rgba(201, 168, 76, 0.1)',
                borderRadius: '10px',
                padding: '14px',
                border: '1px solid rgba(201, 168, 76, 0.15)',
              }}
            >
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', lineHeight: 1.5 }}>
                <strong style={{ color: '#C9A84C' }}>Nouveau :</strong> Planifiez une consultation
                avec votre notaire.
              </p>
              <button
                style={{
                  marginTop: '10px',
                  color: '#C9A84C',
                  background: 'none',
                  border: 'none',
                  fontSize: '12px',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Réserver <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div style={{ marginBottom: '36px' }}>
              <p
                style={{
                  color: '#9CA3AF',
                  fontSize: '13px',
                  marginBottom: '6px',
                  letterSpacing: '0.02em',
                }}
              >
                Valeur totale estimée
              </p>
              <h1
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  color: '#C9A84C',
                  fontSize: '52px',
                  fontWeight: 400,
                  lineHeight: 1,
                  marginBottom: '6px',
                }}
              >
                487 500 €
              </h1>
              <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
                Mon Patrimoine
                <span
                  style={{
                    marginLeft: '12px',
                    color: '#22C55E',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: 'rgba(34, 197, 94, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '50px',
                  }}
                >
                  +3,2 % ce trimestre
                </span>
              </p>
            </div>

            {/* KPI Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginBottom: '32px',
              }}
              className="grid-cols-1 sm:grid-cols-3"
            >
              {KPIS.map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <motion.div
                    key={kpi.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                    style={{
                      background: 'white',
                      borderRadius: '14px',
                      padding: '22px 24px',
                      boxShadow: '0 2px 16px rgba(27, 43, 75, 0.06)',
                      border: '1px solid rgba(27, 43, 75, 0.05)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '14px',
                      }}
                    >
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background:
                            kpi.color === '#1B2B4B'
                              ? 'rgba(27, 43, 75, 0.08)'
                              : kpi.color === '#C9A84C'
                              ? 'rgba(201, 168, 76, 0.1)'
                              : 'rgba(107, 114, 128, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={19} color={kpi.color} strokeWidth={1.5} />
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background:
                            kpi.positive === true
                              ? 'rgba(34, 197, 94, 0.08)'
                              : kpi.positive === false
                              ? 'rgba(239, 68, 68, 0.08)'
                              : 'rgba(107, 114, 128, 0.08)',
                          color:
                            kpi.positive === true
                              ? '#22C55E'
                              : kpi.positive === false
                              ? '#EF4444'
                              : '#9CA3AF',
                          borderRadius: '50px',
                          padding: '3px 8px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {kpi.positive === true ? (
                          <ArrowUpRight size={12} />
                        ) : kpi.positive === false ? (
                          <TrendingDown size={12} />
                        ) : (
                          <Flat size={12} />
                        )}
                        {kpi.change}
                      </div>
                    </div>

                    <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '4px' }}>
                      {kpi.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Serif Display', serif",
                        color: '#1B2B4B',
                        fontSize: '22px',
                        fontWeight: 400,
                      }}
                    >
                      {kpi.value}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Chart + Legend */}
            <div
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 2px 16px rgba(27, 43, 75, 0.06)',
                border: '1px solid rgba(27, 43, 75, 0.05)',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                <h2
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    color: '#1B2B4B',
                    fontSize: '20px',
                    fontWeight: 400,
                  }}
                >
                  Répartition du patrimoine
                </h2>
                <span
                  style={{
                    color: '#9CA3AF',
                    fontSize: '12px',
                    background: 'rgba(27, 43, 75, 0.05)',
                    padding: '4px 12px',
                    borderRadius: '50px',
                  }}
                >
                  Mars 2026
                </span>
              </div>

              <div
                style={{ display: 'flex', alignItems: 'center', gap: '40px' }}
                className="flex-col md:flex-row"
              >
                {/* Donut chart */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <ResponsiveContainer width={240} height={240}>
                    <PieChart>
                      <Pie
                        data={CHART_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={72}
                        outerRadius={108}
                        paddingAngle={3}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {CHART_DATA.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center label */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <p style={{ color: '#9CA3AF', fontSize: '11px', marginBottom: '4px' }}>
                      Total
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Serif Display', serif",
                        color: '#1B2B4B',
                        fontSize: '18px',
                        lineHeight: 1.1,
                      }}
                    >
                      487 500 €
                    </p>
                  </div>
                </div>

                {/* Legend */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {CHART_DATA.map((item) => {
                    const pct = Math.round((item.value / 487500) * 100);
                    return (
                      <div key={item.name}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '6px',
                          }}
                        >
                          <div
                            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                          >
                            <div
                              style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '3px',
                                background: item.color,
                                flexShrink: 0,
                              }}
                            />
                            <span style={{ color: '#2C2C2C', fontSize: '14px' }}>{item.name}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <span
                              style={{
                                fontFamily: "'DM Serif Display', serif",
                                color: '#1B2B4B',
                                fontSize: '15px',
                              }}
                            >
                              {item.value.toLocaleString('fr-FR')} €
                            </span>
                            <span
                              style={{
                                color: '#9CA3AF',
                                fontSize: '12px',
                                width: '36px',
                                textAlign: 'right',
                              }}
                            >
                              {pct}%
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            height: '4px',
                            background: '#F3F4F6',
                            borderRadius: '50px',
                            overflow: 'hidden',
                          }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            style={{
                              height: '100%',
                              background: item.color,
                              borderRadius: '50px',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '28px 32px',
                boxShadow: '0 2px 16px rgba(27, 43, 75, 0.06)',
                border: '1px solid rgba(27, 43, 75, 0.05)',
                marginBottom: '32px',
              }}
            >
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  color: '#1B2B4B',
                  fontSize: '20px',
                  fontWeight: 400,
                  marginBottom: '24px',
                }}
              >
                Activité récente
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {TIMELINE.map((event, index) => {
                  const Icon = event.icon;
                  const isLast = index === TIMELINE.length - 1;
                  return (
                    <div key={event.id} style={{ display: 'flex', gap: '16px' }}>
                      {/* Timeline indicator */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: `${event.color}18`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon size={15} color={event.color} strokeWidth={2} />
                        </div>
                        {!isLast && (
                          <div
                            style={{
                              width: '1px',
                              height: '28px',
                              background: 'rgba(27, 43, 75, 0.08)',
                              marginTop: '4px',
                            }}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, paddingBottom: isLast ? 0 : '24px' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }}
                        >
                          <div>
                            <p
                              style={{
                                color: '#2C2C2C',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '2px',
                              }}
                            >
                              {event.action}
                            </p>
                            <p style={{ color: '#9CA3AF', fontSize: '12px' }}>{event.detail}</p>
                          </div>
                          <span
                            style={{
                              color: '#9CA3AF',
                              fontSize: '12px',
                              flexShrink: 0,
                              marginLeft: '16px',
                            }}
                          >
                            {event.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right panel — AI Suggestions */}
        <div
          style={{
            width: '300px',
            background: 'white',
            borderLeft: '1px solid rgba(27, 43, 75, 0.07)',
            padding: '32px 24px',
            overflowY: 'auto',
            flexShrink: 0,
          }}
          className="hidden lg:block"
        >
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(201, 168, 76, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Lightbulb size={16} color="#C9A84C" strokeWidth={1.8} />
              </div>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  color: '#1B2B4B',
                  fontSize: '18px',
                  fontWeight: 400,
                }}
              >
                Suggestions intelligentes
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SUGGESTIONS.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  style={{
                    background: '#E8D9B5',
                    borderRadius: '12px',
                    padding: '18px',
                    border: '1px solid rgba(201, 168, 76, 0.2)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#C9A84C',
                        flexShrink: 0,
                        marginTop: '6px',
                      }}
                    />
                    <div>
                      <p
                        style={{
                          color: '#1B2B4B',
                          fontSize: '13px',
                          fontWeight: 600,
                          marginBottom: '6px',
                        }}
                      >
                        {s.title}
                      </p>
                      <p
                        style={{
                          color: '#6B7280',
                          fontSize: '12px',
                          lineHeight: 1.6,
                        }}
                      >
                        {s.detail}
                      </p>
                    </div>
                  </div>
                  <button
                    style={{
                      marginTop: '12px',
                      color: '#C9A84C',
                      background: 'none',
                      border: 'none',
                      fontSize: '12px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    En savoir plus <ChevronRight size={11} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Separator */}
            <div
              style={{
                height: '1px',
                background: 'rgba(27, 43, 75, 0.07)',
                margin: '24px 0',
              }}
            />

            {/* Notary promo */}
            <div
              style={{
                background: '#1B2B4B',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <p
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  marginBottom: '14px',
                }}
              >
                Votre notaire{' '}
                <strong style={{ color: '#C9A84C' }}>Me. Fontaine</strong> est disponible pour
                un rendez-vous cette semaine.
              </p>
              <button
                style={{
                  background: '#C9A84C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 16px',
                  fontSize: '13px',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Planifier une consultation
              </button>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}