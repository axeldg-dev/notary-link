import { Bell, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { Logo } from './Logo';

interface NavbarProps {
  breadcrumb?: string;
}

const DEMO_SCREENS = [
  { path: '/', label: 'Connexion' },
  { path: '/home', label: 'Accueil' },
  { path: '/projet', label: 'Projet' },
  { path: '/documents', label: 'Documents' },
  { path: '/patrimoine', label: 'Patrimoine' },
  { path: '/envoi', label: 'Envoi' },
];

export function Navbar({ breadcrumb }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <nav
      style={{
        background: 'white',
        borderBottom: '1px solid rgba(27, 43, 75, 0.08)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 20px rgba(27, 43, 75, 0.05)',
        flexShrink: 0,
      }}
    >
      <button
        onClick={() => navigate('/home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <Logo variant="navy" size="sm" />
      </button>

      {breadcrumb && (
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '16px', gap: '6px' }}>
          <ChevronRight size={15} color="#9CA3AF" />
          <span
            style={{
              color: '#6B7280',
              fontSize: '14px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {breadcrumb}
          </span>
        </div>
      )}

      <div
        style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            padding: '6px',
            borderRadius: '8px',
          }}
        >
          <Bell size={19} color="#6B7280" />
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#C9A84C',
              border: '1.5px solid white',
            }}
          />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#1B2B4B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C9A84C',
              fontSize: '13px',
              fontFamily: "'DM Serif Display', serif",
              flexShrink: 0,
            }}
          >
            SM
          </div>
          <span
            style={{
              color: '#2C2C2C',
              fontSize: '14px',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
            }}
          >
            Sophie Martin
          </span>
        </div>
      </div>
    </nav>
  );
}

export function DemoNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(27, 43, 75, 0.96)',
        backdropFilter: 'blur(12px)',
        borderRadius: '50px',
        padding: '8px 14px',
        display: 'flex',
        gap: '4px',
        zIndex: 9999,
        boxShadow: '0 8px 32px rgba(27, 43, 75, 0.45)',
        alignItems: 'center',
        border: '1px solid rgba(201, 168, 76, 0.2)',
      }}
    >
      <span
        style={{
          color: 'rgba(255,255,255,0.35)',
          fontSize: '10px',
          letterSpacing: '0.08em',
          paddingRight: '10px',
          paddingLeft: '2px',
          borderRight: '1px solid rgba(255,255,255,0.12)',
          marginRight: '4px',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        DÉMO
      </span>
      {DEMO_SCREENS.map((screen) => {
        const isActive = location.pathname === screen.path;
        return (
          <button
            key={screen.path}
            onClick={() => navigate(screen.path)}
            style={{
              padding: '6px 14px',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: "'Inter', sans-serif",
              fontWeight: isActive ? 600 : 400,
              background: isActive ? '#C9A84C' : 'transparent',
              color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
              transition: 'all 0.2s ease',
            }}
          >
            {screen.label}
          </button>
        );
      })}
    </div>
  );
}