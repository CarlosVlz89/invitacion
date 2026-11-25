import React from 'react';

export interface MonogramMGProps {
  className?: string;
  decorative?: boolean;
  label?: string;
}

export const MonogramMG: React.FC<MonogramMGProps> = ({
  className = 'w-12 h-12 text-burgundy',
  decorative = true,
  label = 'Monograma M y G',
}) => {
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
