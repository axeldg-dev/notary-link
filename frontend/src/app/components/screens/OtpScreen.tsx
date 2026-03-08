import React, {useState, useRef, useEffect} from 'react';
import {motion} from 'motion/react';
import {Shield, CheckCircle, Mail, ArrowRight, RotateCcw} from 'lucide-react';
import {useNavigate} from 'react-router';
import {Logo} from '../Logo';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
    verifyOtp,
    resendOtp,
    resetUserStatus,
    selectUserEmail,
    selectUserStatus,
    selectUserError,
} from '../../features/userSlice';

const RESEND_DELAY = 60;

export function OtpScreen() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const email = useAppSelector(selectUserEmail);
    const status = useAppSelector(selectUserStatus);
    const error = useAppSelector(selectUserError);

    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(RESEND_DELAY);
    const [resendStatus, setResendStatus] = useState<'idle' | 'sent' | 'error'>('idle');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
        dispatch(resetUserStatus());
    }, []);

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const code = digits.join('');
    const isLoading = status === 'loading';
    const isFilled = code.length === 6;

    function handleDigitChange(index: number, value: string) {
        const digit = value.replace(/\D/g, '').slice(-1);
        const next = [...digits];
        next[index] = digit;
        setDigits(next);
        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    function handlePaste(e: React.ClipboardEvent) {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;
        const next = ['', '', '', '', '', ''];
        pasted.split('').forEach((c, i) => { next[i] = c; });
        setDigits(next);
        const focusIndex = Math.min(pasted.length, 5);
        inputRefs.current[focusIndex]?.focus();
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!isFilled || !email) return;
        const result = await dispatch(verifyOtp({email, code}));
        if (verifyOtp.fulfilled.match(result)) {
            navigate('/home');
        }
    }

    async function handleResend() {
        if (countdown > 0 || !email) return;
        setResendStatus('idle');
        const result = await dispatch(resendOtp(email));
        if (resendOtp.fulfilled.match(result)) {
            setResendStatus('sent');
            setCountdown(RESEND_DELAY);
            setDigits(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } else {
            setResendStatus('error');
        }
    }

    const maskedEmail = email
        ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(Math.max(b.length, 3)) + c)
        : '';

    return (
        <div
            style={{display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif"}}
            className="flex-col md:flex-row"
        >
            {/* Left panel */}
            <div
                style={{
                    background: '#1B2B4B',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                }}
                className="w-full md:w-[46%] min-h-[44vh] md:min-h-screen p-8 md:px-14 md:py-[52px]"
            >
                {[
                    {size: 420, top: -80, right: -120, opacity: 0.04},
                    {size: 280, top: -20, right: -60, opacity: 0.06},
                    {size: 320, bottom: -60, left: -100, opacity: 0.04},
                    {size: 180, bottom: 60, left: -40, opacity: 0.06},
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

                <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    <Logo variant="white" size="md"/>
                </motion.div>

                <motion.div
                    initial={{opacity: 0, y: 24}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6, delay: 0.2}}
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        paddingTop: '40px',
                        paddingBottom: '32px',
                    }}
                >
                    <p style={{
                        color: '#C9A84C',
                        fontSize: '12px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        marginBottom: '18px',
                    }}>
                        Sécurité renforcée
                    </p>
                    <h1
                        className="text-3xl md:text-[42px]"
                        style={{
                            fontFamily: "'DM Serif Display', serif",
                            color: 'white',
                            lineHeight: 1.15,
                            fontWeight: 400,
                            marginBottom: '20px',
                        }}
                    >
                        Vérifiez
                        <br/>
                        votre identité
                        <br/>
                        <span style={{color: '#C9A84C'}}>en toute sécurité.</span>
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.55)',
                        fontSize: '16px',
                        lineHeight: 1.7,
                        maxWidth: '340px',
                    }}>
                        Cette étape garantit que vous êtes bien le propriétaire de ce compte.
                    </p>

                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '36px'}}>
                        {[
                            {icon: Shield, label: 'Code à usage unique'},
                            {icon: CheckCircle, label: 'Expire après 15 minutes'},
                            {icon: Mail, label: 'Envoyé à votre adresse e-mail'},
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{opacity: 0, x: -12}}
                                    animate={{opacity: 1, x: 0}}
                                    transition={{duration: 0.4, delay: 0.5 + i * 0.1}}
                                    style={{display: 'flex', alignItems: 'center', gap: '10px'}}
                                >
                                    <div style={{
                                        width: '26px',
                                        height: '26px',
                                        borderRadius: '50%',
                                        background: 'rgba(201,168,76,0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <Icon size={13} color="#C9A84C" strokeWidth={2}/>
                                    </div>
                                    <span style={{color: 'rgba(255,255,255,0.65)', fontSize: '13px'}}>
                                        {item.label}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.5, delay: 0.8}}
                    style={{
                        display: 'flex',
                        gap: '24px',
                        flexWrap: 'wrap',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        paddingTop: '24px',
                    }}
                >
                    {[
                        {value: 'AES-256', label: 'Chiffrement'},
                        {value: 'RGPD', label: 'Conforme'},
                        {value: 'France', label: 'Hébergé'},
                    ].map((s) => (
                        <div key={s.label}>
                            <p style={{
                                fontFamily: "'DM Serif Display', serif",
                                color: '#C9A84C',
                                fontSize: '22px',
                                fontWeight: 400,
                                lineHeight: 1,
                                marginBottom: '4px',
                            }}>
                                {s.value}
                            </p>
                            <p style={{color: 'rgba(255,255,255,0.4)', fontSize: '12px'}}>{s.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Right panel */}
            <div
                style={{
                    flex: 1,
                    background: '#F8F6F1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                className="px-4 py-10 md:px-10 md:py-12"
            >
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.25}}
                    style={{width: '100%', maxWidth: '420px'}}
                >
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '40px',
                        boxShadow: '0 8px 48px rgba(27,43,75,0.09)',
                        border: '1px solid rgba(27,43,75,0.06)',
                    }}>
                        {/* Icon */}
                        <div style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '14px',
                            background: 'rgba(201,168,76,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '20px',
                        }}>
                            <Mail size={24} color="#C9A84C" strokeWidth={1.5}/>
                        </div>

                        <h2 style={{
                            fontFamily: "'DM Serif Display', serif",
                            color: '#1B2B4B',
                            fontSize: '26px',
                            fontWeight: 400,
                            marginBottom: '8px',
                            lineHeight: 1.2,
                        }}>
                            Vérification e-mail
                        </h2>
                        <p style={{color: '#9CA3AF', fontSize: '14px', marginBottom: '8px', lineHeight: 1.6}}>
                            Un code à 6 chiffres a été envoyé à
                        </p>
                        <p style={{
                            color: '#1B2B4B',
                            fontSize: '14px',
                            fontWeight: 600,
                            marginBottom: '32px',
                        }}>
                            {maskedEmail}
                        </p>

                        <form onSubmit={handleSubmit}>
                            {/* 6 digit inputs */}
                            <div style={{
                                display: 'flex',
                                gap: '10px',
                                justifyContent: 'center',
                                marginBottom: '24px',
                            }}>
                                {digits.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => { inputRefs.current[i] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleDigitChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        onPaste={handlePaste}
                                        style={{
                                            width: '48px',
                                            height: '56px',
                                            textAlign: 'center',
                                            fontSize: '22px',
                                            fontWeight: 600,
                                            fontFamily: "'Inter', sans-serif",
                                            color: '#1B2B4B',
                                            background: digit ? 'rgba(201,168,76,0.07)' : '#F8F6F1',
                                            border: digit
                                                ? '1.5px solid #C9A84C'
                                                : '1.5px solid rgba(27,43,75,0.1)',
                                            borderRadius: '12px',
                                            outline: 'none',
                                            transition: 'all 0.18s ease',
                                            caretColor: '#C9A84C',
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.border = '1.5px solid #C9A84C';
                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.15)';
                                        }}
                                        onBlur={(e) => {
                                            if (!digit) {
                                                e.currentTarget.style.border = '1.5px solid rgba(27,43,75,0.1)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Error */}
                            {error && (
                                <div style={{
                                    background: '#FEF2F2',
                                    border: '1px solid #FECACA',
                                    borderRadius: '10px',
                                    padding: '10px 14px',
                                    color: '#DC2626',
                                    fontSize: '13px',
                                    marginBottom: '16px',
                                    textAlign: 'center',
                                }}>
                                    {error}
                                </div>
                            )}

                            {/* Resend sent confirmation */}
                            {resendStatus === 'sent' && (
                                <div style={{
                                    background: '#F0FDF4',
                                    border: '1px solid #BBF7D0',
                                    borderRadius: '10px',
                                    padding: '10px 14px',
                                    color: '#16A34A',
                                    fontSize: '13px',
                                    marginBottom: '16px',
                                    textAlign: 'center',
                                }}>
                                    Un nouveau code a été envoyé.
                                </div>
                            )}

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={!isFilled || isLoading}
                                style={{
                                    width: '100%',
                                    background: !isFilled || isLoading ? '#D4B86A' : '#C9A84C',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '14px',
                                    fontSize: '15px',
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 500,
                                    cursor: !isFilled || isLoading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    boxShadow: isFilled && !isLoading ? '0 4px 16px rgba(201,168,76,0.35)' : 'none',
                                    transition: 'all 0.2s ease',
                                    marginBottom: '20px',
                                }}
                                onMouseEnter={(e) => {
                                    if (isFilled && !isLoading) {
                                        e.currentTarget.style.background = '#B8973B';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (isFilled && !isLoading) {
                                        e.currentTarget.style.background = '#C9A84C';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }
                                }}
                            >
                                {isLoading ? 'Vérification...' : 'Vérifier le code'}
                                {!isLoading && <ArrowRight size={16}/>}
                            </button>
                        </form>

                        {/* Resend link */}
                        <div style={{textAlign: 'center'}}>
                            {countdown > 0 ? (
                                <p style={{color: '#9CA3AF', fontSize: '13px', lineHeight: 1.6}}>
                                    Vous n'avez rien reçu ?{' '}
                                    <span style={{color: '#C9A84C', fontWeight: 500}}>
                                        Renvoyer un mail{' '}
                                    </span>
                                    <span style={{color: '#9CA3AF'}}>
                                        ({countdown}s)
                                    </span>
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontFamily: "'Inter', sans-serif",
                                        color: '#9CA3AF',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: 0,
                                    }}
                                >
                                    Vous n'avez rien reçu ?{' '}
                                    <span style={{
                                        color: '#C9A84C',
                                        fontWeight: 500,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}>
                                        <RotateCcw size={12}/>
                                        Renvoyer un mail
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Bottom badges */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '20px',
                        marginTop: '24px',
                    }}>
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
                                {i > 0 && <span style={{color: 'rgba(27,43,75,0.15)', marginRight: '8px'}}>·</span>}
                                <Shield size={10} color="#C9A84C"/>
                                {badge}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
