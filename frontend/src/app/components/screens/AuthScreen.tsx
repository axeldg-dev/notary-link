import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Logo } from '../Logo';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, register, resetAuthStatus, selectAuthError, selectAuthStatus, selectIsAuthenticated } from '../../features/usersSlice';

const TRUST_ITEMS = [
  { icon: Shield, label: 'Données chiffrées AES-256' },
  { icon: CheckCircle, label: 'Certifié RGPD & hébergé en France' },
  { icon: CheckCircle, label: '+5 000 clients font confiance à NotaryLink' },
];

export function AuthScreen() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    confirm: '',
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/home');
  }, [isAuthenticated]);

  function handleModeChange(m: 'login' | 'register') {
    setMode(m);
    dispatch(resetAuthStatus());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'register') {
      dispatch(register({
        email: form.email,
        password: form.password,
        firstName: form.prenom,
        lastName: form.nom,
      }));
    } else {
      dispatch(login({ email: form.email, password: form.password }));
    }
  }

  const isLoading = status === 'loading';

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: "'Inter', sans-serif",
      }}
      className="flex-col md:flex-row"
    >
      {/* ── Left panel ── */}
      <div
        style={{
          background: '#1B2B4B',
          display: 'flex',
          flexDirection: 'column',
          padding: '52px 56px',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="w-full md:w-[46%] min-h-[44vh] md:min-h-screen"
      >
        {/* Decorative rings */}
        {[
          { size: 420, top: -80, right: -120, opacity: 0.04 },
          { size: 280, top: -20, right: -60, opacity: 0.06 },
          { size: 320, bottom: -60, left: -100, opacity: 0.04 },
          { size: 180, bottom: 60, left: -40, opacity: 0.06 },
        ].map((r, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: r.size,
              height: r.size,
              borderRadius: '50%',
              border: `1px solid rgba(201,168,76,${r.opacity * 10})`,
              top: r.top,
              right: r.right,
              bottom: r.bottom,
              left: r.left,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo variant="white" size="md" />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '40px', paddingBottom: '32px' }}
        >
          <p
            style={{
              color: '#C9A84C',
              fontSize: '12px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 500,
              marginBottom: '18px',
            }}
          >
            Plateforme notariale de confiance
          </p>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              color: 'white',
              fontSize: '42px',
              lineHeight: 1.15,
              fontWeight: 400,
              marginBottom: '20px',
            }}
          >
            Gérez vos actes
            <br />
            notariaux en
            <br />
            <span style={{ color: '#C9A84C' }}>toute sérénité.</span>
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: '16px',
              lineHeight: 1.7,
              maxWidth: '340px',
            }}
          >
            NotaryLink connecte particuliers et notaires pour simplifier chaque démarche juridique.
          </p>

          {/* Trust items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '36px' }}>
            {TRUST_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'rgba(201,168,76,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={13} color="#C9A84C" strokeWidth={2} />
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>
                    {item.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{
            display: 'flex',
            gap: '32px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '24px',
          }}
        >
          {[
            { value: '5 000+', label: 'Clients' },
            { value: '200+', label: 'Notaires' },
            { value: '12 ans', label: "d'expertise" },
          ].map((s) => (
            <div key={s.label}>
              <p
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  color: '#C9A84C',
                  fontSize: '22px',
                  fontWeight: 400,
                  lineHeight: 1,
                  marginBottom: '4px',
                }}
              >
                {s.value}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Right panel ── */}
      <div
        style={{
          flex: 1,
          background: '#F8F6F1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 40px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{ width: '100%', maxWidth: '420px' }}
        >
          {/* Card */}
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 8px 48px rgba(27,43,75,0.09)',
              border: '1px solid rgba(27,43,75,0.06)',
            }}
          >
            {/* Tab switcher */}
            <div
              style={{
                display: 'flex',
                background: '#F8F6F1',
                borderRadius: '12px',
                padding: '4px',
                marginBottom: '32px',
              }}
            >
              {(['login', 'register'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => handleModeChange(m)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '9px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: mode === m ? 600 : 400,
                    background: mode === m ? 'white' : 'transparent',
                    color: mode === m ? '#1B2B4B' : '#9CA3AF',
                    boxShadow: mode === m ? '0 2px 8px rgba(27,43,75,0.08)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {m === 'login' ? 'Connexion' : 'Créer un compte'}
                </button>
              ))}
            </div>

            {/* Heading */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                <h2
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    color: '#1B2B4B',
                    fontSize: '26px',
                    fontWeight: 400,
                    marginBottom: '6px',
                    lineHeight: 1.2,
                  }}
                >
                  {mode === 'login' ? 'Bon retour parmi nous' : 'Rejoignez NotaryLink'}
                </h2>
                <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '28px' }}>
                  {mode === 'login'
                    ? 'Connectez-vous à votre espace personnel.'
                    : 'Créez votre compte en quelques secondes.'}
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Name fields (register only) */}
                  {mode === 'register' && (
                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                      <FormField
                        icon={<User size={15} color="#9CA3AF" />}
                        placeholder="Prénom"
                        value={form.prenom}
                        onChange={(v) => setForm({ ...form, prenom: v })}
                        type="text"
                      />
                      <FormField
                        icon={<User size={15} color="#9CA3AF" />}
                        placeholder="Nom"
                        value={form.nom}
                        onChange={(v) => setForm({ ...form, nom: v })}
                        type="text"
                      />
                    </div>
                  )}

                  {/* Email */}
                  <FormField
                    icon={<Mail size={15} color="#9CA3AF" />}
                    placeholder="Adresse e-mail"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    type="email"
                  />

                  {/* Password */}
                  <FormField
                    icon={<Lock size={15} color="#9CA3AF" />}
                    placeholder="Mot de passe"
                    value={form.password}
                    onChange={(v) => setForm({ ...form, password: v })}
                    type={showPassword ? 'text' : 'password'}
                    rightAction={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                      >
                        {showPassword
                          ? <EyeOff size={15} color="#9CA3AF" />
                          : <Eye size={15} color="#9CA3AF" />}
                      </button>
                    }
                  />

                  {/* Confirm password (register only) */}
                  {mode === 'register' && (
                    <FormField
                      icon={<Lock size={15} color="#9CA3AF" />}
                      placeholder="Confirmer le mot de passe"
                      value={form.confirm}
                      onChange={(v) => setForm({ ...form, confirm: v })}
                      type={showConfirm ? 'text' : 'password'}
                      rightAction={
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                        >
                          {showConfirm
                            ? <EyeOff size={15} color="#9CA3AF" />
                            : <Eye size={15} color="#9CA3AF" />}
                        </button>
                      }
                    />
                  )}

                  {/* Forgot password */}
                  {mode === 'login' && (
                    <div style={{ textAlign: 'right', marginTop: '-4px' }}>
                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#C9A84C',
                          fontSize: '13px',
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500,
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                  )}

                  {/* Error banner */}
                  {error && (
                    <div
                      style={{
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        color: '#DC2626',
                        fontSize: '13px',
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* Terms (register only) */}
                  {mode === 'register' && (
                    <p style={{ color: '#9CA3AF', fontSize: '12px', lineHeight: 1.6 }}>
                      En créant un compte, vous acceptez nos{' '}
                      <span style={{ color: '#C9A84C', cursor: 'pointer', fontWeight: 500 }}>
                        Conditions d'utilisation
                      </span>{' '}
                      et notre{' '}
                      <span style={{ color: '#C9A84C', cursor: 'pointer', fontWeight: 500 }}>
                        Politique de confidentialité
                      </span>.
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      background: isLoading ? '#D4B86A' : '#C9A84C',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px',
                      fontSize: '15px',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginTop: '4px',
                      boxShadow: '0 4px 16px rgba(201,168,76,0.35)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        (e.currentTarget as HTMLButtonElement).style.background = '#B8973B';
                        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(201,168,76,0.45)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        (e.currentTarget as HTMLButtonElement).style.background = '#C9A84C';
                        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(201,168,76,0.35)';
                      }
                    }}
                  >
                    {isLoading
                      ? 'Chargement...'
                      : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                    {!isLoading && <ArrowRight size={16} />}
                  </button>
                </form>

                {/* Switch mode */}
                <p
                  style={{
                    textAlign: 'center',
                    marginTop: '24px',
                    color: '#9CA3AF',
                    fontSize: '13px',
                  }}
                >
                  {mode === 'login' ? "Pas encore de compte ?" : 'Déjà un compte ?'}{' '}
                  <button
                    onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1B2B4B',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {mode === 'login' ? 'Créer un compte' : 'Se connecter'}
                  </button>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom badges */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '20px',
              marginTop: '24px',
            }}
          >
            {['RGPD', 'AES-256', 'France'].map((badge, i) => (
              <span
                key={badge}
                style={{
                  color: '#9CA3AF',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                {i > 0 && (
                  <span style={{ color: 'rgba(27,43,75,0.15)', marginRight: '8px' }}>·</span>
                )}
                <Shield size={10} color="#C9A84C" />
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
}

// ── Reusable form field ──
interface FormFieldProps {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  rightAction?: React.ReactNode;
}

function FormField({ icon, placeholder, value, onChange, type, rightAction }: FormFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: '#F8F6F1',
        borderRadius: '10px',
        padding: '0 14px',
        border: focused ? '1.5px solid #C9A84C' : '1.5px solid transparent',
        transition: 'border-color 0.18s ease',
        boxShadow: focused ? '0 0 0 3px rgba(201,168,76,0.1)' : 'none',
        flex: 1,
      }}
    >
      <div style={{ flexShrink: 0 }}>{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          border: 'none',
          background: 'transparent',
          padding: '13px 0',
          fontSize: '14px',
          fontFamily: "'Inter', sans-serif",
          color: '#2C2C2C',
          outline: 'none',
        }}
      />
      {rightAction}
    </div>
  );
}
