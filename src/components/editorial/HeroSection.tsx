import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useGuest } from '../../context/GuestContext';
import { getEditorialAsset } from '../../config/editorialAssets';
import { MonogramMG } from './MonogramMG';

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const HeroSection: React.FC = () => {
  const { guest, isIdentifiedGuest } = useGuest();
  const prefersReducedMotion = useReducedMotion();
  const [photoFailed, setPhotoFailed] = useState(false);

  const heroPhotoAsset = getEditorialAsset('heroCoupleBw');
  const heroPhotoSrc = !photoFailed ? heroPhotoAsset.resolvedSrc : null;

  const pasesAsignados = guest.pasesAsignados;
  const pasesTexto =
    pasesAsignados === 1 ? '1 pase reservado' : `${pasesAsignados} pases reservados`;

  // Blindaje estricto de textos por Tier (Zero Information Leak)
  const dateHeaderLabel =
    guest.tier === 'A'
      ? 'Fin de semana de celebración — 16 y 17 de Julio, 2027'
      : 'Nuestra Boda — Sábado 17 de Julio, 2027';

  return (
    <section
      id="portada"
      aria-labelledby="hero-couple-names"
      className="relative w-full min-h-[100dvh] md:grid md:grid-cols-2 bg-cream text-espresso overflow-hidden"
    >
      {/* Panel Fotográfico B&N: Full-bleed en móvil, lámina editorial íntegra a la izquierda en Desktop */}
      <div className="absolute inset-0 md:relative md:inset-auto md:min-h-[100dvh] bg-burgundy overflow-hidden">
        {heroPhotoSrc ? (
          <img
            src={heroPhotoSrc}
            alt={heroPhotoAsset.alt}
            width={heroPhotoAsset.recommendedDimensions.width}
            height={heroPhotoAsset.recommendedDimensions.height}
            loading="eager"
            decoding="sync"
            onError={() => setPhotoFailed(true)}
            className="w-full h-full object-cover object-top select-none"
          />
        ) : (
          <div
            aria-hidden="true"
            className="w-full h-full bg-burgundy editorial-relief-dark-pattern"
          />
        )}

        {/* Velos degradados suaves únicamente en bordes superior/inferior en móvil para contraste WCAG AA (>= 7:1) */}
        <div
          aria-hidden="true"
          className="pointer-events-none md:hidden absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#1A1311]/75 via-[#1A1311]/30 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none md:hidden absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[#1A1311]/90 via-[#1A1311]/55 to-transparent"
        />
      </div>

      {/* Panel Tipográfico Editorial: Superpuesto en móvil (text-cream), lámina Warm Cream en Desktop */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.75,
          ease: EDITORIAL_EASE,
        }}
        className="relative z-10 min-h-[100dvh] md:bg-cream md:editorial-cotton-paper md:border-l md:border-divider flex flex-col items-center justify-between md:justify-center px-6 pt-16 pb-10 md:px-12 lg:px-16 md:py-20 text-center"
      >
        {/* Encabezado Superior Discreto */}
        <div className="flex flex-col items-center md:mb-6">
          <div className="hidden md:flex mb-6">
            <MonogramMG
              className="w-16 h-16 text-burgundy"
              decorative={false}
              label="Monograma de boda M y G"
            />
          </div>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.34em] text-cream/95 md:text-mocha md:editorial-letterpress font-sans font-medium max-w-xs leading-relaxed">
            Con la bendición de nuestras familias
          </p>
          <span
            aria-hidden="true"
            className="hidden md:block mt-6 w-px h-9 editorial-debossed-rule-y"
          />
        </div>

        {/* Composición Central / Inferior de Nombres, Fecha Blindada y Dedicatoria */}
        <div className="w-full max-w-md flex flex-col items-center">
          <h1
            id="hero-couple-names"
            className="font-script text-[3.5rem] leading-[1.04] sm:text-7xl lg:text-[5.25rem] text-cream md:text-espresso font-normal tracking-normal drop-shadow-[0_2px_10px_rgba(20,14,12,0.45)] md:drop-shadow-none md:editorial-engraving"
          >
            <span className="block sm:inline">Montse</span>
            <span
              aria-hidden="true"
              className="block sm:inline font-script text-cream/95 md:text-burgundy text-4xl sm:text-5xl lg:text-6xl my-0.5 sm:my-0 sm:mx-3.5"
            >
              &amp;
            </span>
            <span className="sr-only"> y </span>
            <span className="block sm:inline">Gerardo</span>
          </h1>

          {/* Fecha Blindada Estrictamente por Tier */}
          <div className="mt-6 md:mt-8 w-full max-w-sm border-y border-cream/35 md:border-divider py-3.5 px-2">
            <p
              data-testid="hero-tier-date"
              className="font-display text-base sm:text-lg lg:text-xl text-cream md:text-espresso md:editorial-letterpress tracking-[0.06em] font-medium leading-snug"
            >
              {dateHeaderLabel}
            </p>
          </div>

          {/* Dedicatoria Personalizada en Prosa Limpia (sin badges SaaS) */}
          <div className="mt-5 md:mt-7 space-y-1.5 max-w-sm">
            {isIdentifiedGuest ? (
              <>
                <p className="font-sans text-xs sm:text-sm text-cream/90 md:text-mocha tracking-wide leading-relaxed">
                  Con especial cariño para{' '}
                  <strong className="font-medium text-cream md:text-espresso">
                    {guest.nombreInvitacion}
                  </strong>
                </p>
                <p className="text-[11px] uppercase tracking-[0.26em] text-cream/90 md:text-olive font-sans font-medium">
                  {pasesTexto}
                </p>
              </>
            ) : (
              <p className="font-sans text-xs sm:text-sm text-cream/90 md:text-mocha tracking-wide leading-relaxed">
                Nos llena de alegría compartir este día tan esperado contigo.
              </p>
            )}
          </div>

          {/* Invitación Sutil al Scroll */}
          <a
            href="#cuenta-regresiva"
            className="mt-8 md:mt-12 group inline-flex flex-col items-center gap-2.5 text-cream/90 md:text-mocha hover:text-cream md:hover:text-burgundy transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream md:focus-visible:outline-burgundy rounded-sm"
          >
            <span className="text-[10px] uppercase tracking-[0.32em] font-sans font-medium">
              Deslizar
            </span>
            <span
              aria-hidden="true"
              className="w-px h-8 bg-gradient-to-b from-cream/85 md:from-mocha/75 to-transparent group-hover:from-cream md:group-hover:from-burgundy transition-colors"
            />
          </a>
        </div>
      </motion.div>
    </section>
  );
};
