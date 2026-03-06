import { Scale } from 'lucide-react';

interface LogoProps {
  variant?: 'white' | 'navy';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ variant = 'navy', size = 'md' }: LogoProps) {
  const textColor = variant === 'white' ? '#FFFFFF' : '#1B2B4B';
  const iconSize = size === 'sm' ? 30 : size === 'md' ? 38 : 50;
  const fontSize = size === 'sm' ? '17px' : size === 'md' ? '22px' : '28px';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', userSelect: 'none' }}>
      <SealIcon size={iconSize} />
      <span
        style={{
          fontFamily: "'DM Serif Display', serif",
          color: textColor,
          fontSize,
          letterSpacing: '0.01em',
          lineHeight: 1,
          fontWeight: 400,
        }}
      >
        NotaryLink
      </span>
    </div>
  );
}

function SealIcon({ size = 38 }: { size?: number }) {
  const gold = '#C9A84C';
  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <circle cx="20" cy="20" r="18.5" stroke={gold} strokeWidth="1.1" strokeDasharray="2.2 2.8" />
        <circle cx="20" cy="20" r="13.5" stroke={gold} strokeWidth="0.75" />
        {/* Decorative dots at cardinal points */}
        <circle cx="20" cy="2" r="1.2" fill={gold} opacity="0.7" />
        <circle cx="38" cy="20" r="1.2" fill={gold} opacity="0.7" />
        <circle cx="20" cy="38" r="1.2" fill={gold} opacity="0.7" />
        <circle cx="2" cy="20" r="1.2" fill={gold} opacity="0.7" />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Scale size={Math.round(size * 0.42)} color={gold} strokeWidth={1.4} />
      </div>
    </div>
  );
}
