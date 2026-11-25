import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useGuest } from '../../context/GuestContext';
import { useCountdown } from '../../hooks/useCountdown';
import { EditorialSurface } from './EditorialSurface';
import { ScratchCameo } from './ScratchCameo';

// Fecha universal de la boda religiosa y recepción (Sábado 17 de Julio de 2027)
const WEDDING_TARGET_ISO = '2027-07-17T16:30:00';
const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface CountdownUnit {
  readonly label: string;
  readonly value: number;
}

export const CountdownBand: React.FC = () => {
  const { guest } = useGuest();
  const prefersReducedMotion = useReducedMotion();
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_TARGET_ISO);

  const units: readonly CountdownUnit[] = [
    { label: 'Días', value: days },
    { label: 'Horas', value: hours },
    { label: 'Minutos', value: minutes },
    { label: 'Segundos', value: seconds },
  ];

  // Subtítulo emotivo respetando estrictamente el aislamiento Tier A/B
  const emotiveSubtitle =
    guest.tier === 'A'
      ? 'Cada día nos acerca a un fin de semana inolvidable junto a quienes más amamos.'
      : 'Cada día nos acerca a celebrar juntos el inicio de nuestra nueva historia.';

  return (
    <EditorialSurface
      as="section"
      variant="relief-dark"
      textureAssetKey="countdownReliefBg"
      id="cuenta-regresiva"
      className="w-full py-20 md:py-28 px-4 sm:px-6 scroll-mt-20"
      contentClassName="w-full max-w-3xl mx-auto flex flex-col items-center text-center"
    >
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.7,
          ease: EDITORIAL_EASE,
        }}
        className="w-full flex flex-col items-center"
      >
        <p className="text-[11px] uppercase tracking-[0.34em] text-cream/85 font-sans font-medium">
          Cuenta Regresiva
        </p>

        <h2
          id="countdown-heading"
          className="mt-3 font-display text-3xl sm:text-4xl md:text-[2.75rem] text-cream font-normal tracking-[0.04em]"
        >
          Faltan
        </h2>

        {/* Números Serif Limpios en Foil Oro Viejo sobre Deep Burgundy */}
        <div
          role="group"
          aria-label="Tiempo restante para la boda"
          className="mt-8 sm:mt-10 w-full max-w-xl grid grid-cols-4 divide-x divide-[#E6D2A2]/25 border-y border-[#E6D2A2]/30 py-5 sm:py-6"
        >
          {units.map((unit) => (
            <div
              key={unit.label}
              className="flex flex-col items-center justify-center px-1.5 sm:px-4"
            >
              <span className="font-display tabular-nums text-3xl sm:text-5xl md:text-[3.4rem] leading-none font-normal tracking-wide editorial-foil-gold">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="mt-2.5 text-[9px] sm:text-[11px] uppercase tracking-[0.22em] sm:tracking-[0.28em] text-cream/85 font-sans font-light">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        {/* Línea Divisoria Fina con Ornamento en Oro Viejo y Subtítulo Emotivo */}
        <div
          aria-hidden="true"
          className="my-7 sm:my-8 flex items-center gap-3 w-full max-w-[168px]"
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E6D2A2]/55 to-[#E6D2A2]/75" />
          <span className="w-1.5 h-1.5 rotate-45 border border-[#E6D2A2]/80 bg-[#E6D2A2]/20" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#E6D2A2]/55 to-[#E6D2A2]/75" />
        </div>

        <p className="max-w-md font-sans text-xs sm:text-sm text-cream/90 tracking-wide leading-relaxed font-light">
          {emotiveSubtitle}
        </p>

        {/* Medallón Interactivo Scratch-to-Reveal Integrado en la Banda Oscura */}
        <div className="mt-12 sm:mt-14 w-full flex flex-col items-center">
          <ScratchCameo />
        </div>
      </motion.div>
    </EditorialSurface>
  );
};
