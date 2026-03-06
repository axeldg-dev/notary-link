import {useNavigate, useLocation} from 'react-router';
import {useAppSelector, useAppDispatch} from "../store/hooks";
import {selectIsAuthenticated, logout} from "../features/usersSlice";
import { motion, AnimatePresence } from 'motion/react';
import React from "react";

const NAV_SCREENS = [
    {path: '/', label: 'Déconnexion'},
    {path: '/home', label: 'Accueil'},
    {path: '/projet', label: 'Projet'},
    {path: '/documents', label: 'Documents'},
    {path: '/patrimoine', label: 'Patrimoine'},
    {path: '/envoi', label: 'Envoi'},
];

export function AppNav() {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const dispatch = useAppDispatch();
    const [hoveredPath, setHoveredPath] = React.useState<string | null>(null);

    return (
        <AnimatePresence>
            {isAuthenticated && (
                <motion.div
                    initial={{ clipPath: 'inset(0 50% 0 50% round 50px)', opacity: 0 }}
                    animate={{ clipPath: 'inset(0 0% 0 0% round 50px)', opacity: 1 }}
                    exit={{ clipPath: 'inset(0 50% 0 50% round 50px)', opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        left: '50%',
                        translateX: '-50%',
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
                    {NAV_SCREENS.map((screen) => {
                        const isActive = location.pathname === screen.path;
                        const isDeconnexion = screen.label === 'Déconnexion';
                        const isHovered = hoveredPath === screen.path;
                        return (
                            <button
                                key={screen.path + screen.label}
                                onClick={() => {
                                    if (isDeconnexion) dispatch(logout());
                                    navigate(screen.path);
                                }}
                                onMouseEnter={() => setHoveredPath(screen.path)}
                                onMouseLeave={() => setHoveredPath(null)}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '50px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: isActive ? 600 : 400,
                                    background: isDeconnexion && isHovered
                                        ? 'rgba(239, 68, 68, 0.18)'
                                        : isActive ? '#C9A84C' : 'transparent',
                                    color: isDeconnexion && isHovered
                                        ? '#FCA5A5'
                                        : isActive ? 'white' : 'rgba(255,255,255,0.6)',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {screen.label}
                            </button>
                        );
                    })}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
