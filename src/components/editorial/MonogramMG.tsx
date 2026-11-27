import React, { useId } from 'react';

export interface MonogramMGProps {
  className?: string;
  decorative?: boolean;
  label?: string;
  variant?: 'solid' | 'foil-gold' | 'burgundy-seal';
}

export const MonogramMG: React.FC<MonogramMGProps> = ({
  className = 'w-12 h-12 text-burgundy',
  decorative = true,
  label = 'Monograma M y G',
  variant = 'solid',
}) => {
  const foilGradientId = useId();

  if (variant === 'burgundy-seal') {
    return (
      <span
        className={`relative isolate overflow-hidden inline-flex items-center justify-center rounded-full bg-burgundy editorial-burgundy-seal select-none ${className}`}
        aria-hidden={decorative ? true : undefined}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : label}
      >
        {/* Grano táctil real de papel algodón integrado sobre el fondo Deep Burgundy */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full editorial-burgundy-seal-grain"
        />
        {/* Doble anillo interior fino en oro viejo suave */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-1.5 rounded-full border border-[#E6D2A2]/50 editorial-burgundy-seal-ring"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[9px] rounded-full border border-[#E6D2A2]/25 border-dashed"
        />
        <span className="pointer-events-none relative z-10 font-display font-medium text-[0.95rem] md:text-[1.1rem] tracking-[0.12em] pl-[0.12em] leading-none editorial-foil-gold">
          M &amp; G
        </span>
      </span>
    );
  }

  const isFoilGold = variant === 'foil-gold';

  if (isFoilGold) {
    return (
      <span
        className={`relative inline-flex items-center justify-center ${className}`}
        aria-hidden={decorative ? true : undefined}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : label}
      >
        <svg
          viewBox="0 0 80 80"
          fill="none"
          aria-hidden="true"
          className="w-full h-full text-[#E6D2A2]"
        >
          <defs>
            <linearGradient
              id={foilGradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#CFAF77" />
              <stop offset="38%" stopColor="#F5E7C6" />
              <stop offset="66%" stopColor="#B69358" />
              <stop offset="100%" stopColor="#EBD9B3" />
            </linearGradient>
          </defs>
          <circle
            cx="40"
            cy="40"
            r="37"
            stroke={`url(#${foilGradientId})`}
            strokeOpacity="0.65"
            strokeWidth="1"
          />
          <circle
            cx="40"
            cy="40"
            r="33.5"
            stroke={`url(#${foilGradientId})`}
            strokeOpacity="0.38"
            strokeWidth="0.65"
            strokeDasharray="1.5 2.5"
          />
        </svg>
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="font-display font-medium text-[0.95rem] tracking-[0.12em] leading-none editorial-foil-gold">
            M &amp; G
          </span>
        </span>
      </span>
    );
  }

  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
    >
      <circle
        cx="40"
        cy="40"
        r="37"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="0.9"
      />
      <circle
        cx="40"
        cy="40"
        r="33.5"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeWidth="0.6"
        strokeDasharray="1.5 2.5"
      />
      <text
        x="40"
        y="46"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="'Cormorant Garamond', 'Playfair Display', Georgia, serif"
        fontSize="21.5"
        fontWeight="500"
        letterSpacing="2"
      >
        M &amp; G
      </text>
    </svg>
  );
};
