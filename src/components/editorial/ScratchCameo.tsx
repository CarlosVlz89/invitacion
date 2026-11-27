import React, { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { getEditorialAsset } from '../../config/editorialAssets';
import { MonogramMG } from './MonogramMG';

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const ScratchCameo: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [photoFailed, setPhotoFailed] = useState<boolean>(false);
  const [vellumFailed, setVellumFailed] = useState<boolean>(false);
  const portraitId = useId();

  const cameoAsset = getEditorialAsset('coupleCameoPhoto');
  const vellumAsset = getEditorialAsset('vellumOverlay');

  const cameoSrc = !photoFailed ? cameoAsset.resolvedSrc : null;
  const vellumSrc = !vellumFailed ? vellumAsset.resolvedSrc : null;

  const handleReveal = () => {
    if (isRevealed) return;
    setIsRevealed(true);
  };

  return (
    <div className="flex flex-col items-center text-center">
      {/* Marco Editorial Rectangular (3:4) con Paspartú y Doble Filete Fino en Oro Viejo */}
      <div className="relative p-2.5 sm:p-3 rounded-none border border-[#E6D2A2]/35 bg-cream/[0.03] shadow-[0_22px_50px_-16px_rgba(18,4,7,0.62)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-2 rounded-none border border-[#E6D2A2]/20"
        />

        <div
          id={portraitId}
          data-testid="vellum-portrait-frame"
          data-revealed={isRevealed ? 'true' : 'false'}
          className="relative w-[252px] sm:w-[288px] md:w-[308px] aspect-[3/4] rounded-none overflow-hidden border border-[#E6D2A2]/35 bg-burgundy-hover isolate"
        >
          {/* Capa Inferior: Fotografía Editorial B&N con Micro-Enfoque al Descubrir */}
          <motion.div
            initial={false}
            animate={
              isRevealed || prefersReducedMotion
                ? { scale: 1 }
                : { scale: 1.04 }
            }
            transition={{
              duration: prefersReducedMotion ? 0 : 0.85,
              ease: EDITORIAL_EASE,
            }}
            className="w-full h-full transform-gpu will-change-transform"
          >
            {cameoSrc ? (
              <img
                src={cameoSrc}
                alt={cameoAsset.alt}
                width={cameoAsset.recommendedDimensions.width}
                height={cameoAsset.recommendedDimensions.height}
                loading="lazy"
                decoding="async"
                onError={() => setPhotoFailed(true)}
                className="w-full h-full object-cover object-center select-none"
              />
            ) : (
              <figure className="w-full h-full editorial-cameo-placeholder flex flex-col items-center justify-center px-6 py-8 text-espresso relative select-none">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3 border border-espresso/20"
                />
                <MonogramMG
                  className="w-20 h-20 text-burgundy mb-3"
                  decorative
                />
                <figcaption className="space-y-1">
                  <span className="block font-script text-3xl text-espresso leading-none">
                    Montse &amp; Gerardo
                  </span>
                  <span className="block text-[10px] uppercase tracking-[0.26em] text-mocha font-sans pt-1">
                    Julio · 2027
                  </span>
                </figcaption>
              </figure>
            )}
          </motion.div>

          {/* Viñeta editorial muy sutil sobre los bordes del retrato */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_24px_rgba(24,10,12,0.28)]"
          />

          {/* Capa Superior Interactiva: Hoja Translúcida de Papel Vegetal (Vellum) */}
          <AnimatePresence>
            {!isRevealed && (
              <motion.button
                key="vellum-reveal-sheet"
                type="button"
                onClick={handleReveal}
                data-testid="vellum-reveal-button"
                aria-expanded={isRevealed}
                aria-controls={portraitId}
                aria-label="Toca para descubrir la fotografía editorial de Montse y Gerardo"
                initial={{ opacity: 1, y: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -18 }
                }
                transition={{
                  duration: prefersReducedMotion ? 0.25 : 0.85,
                  ease: EDITORIAL_EASE,
                }}
                className="group absolute inset-0 z-10 w-full h-full min-h-[44px] flex flex-col items-center justify-center p-6 text-center bg-cream/60 backdrop-blur-[2px] hover:bg-cream/55 active:scale-[0.99] transition-colors cursor-pointer transform-gpu will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-burgundy"
              >
                {vellumSrc && (
                  <img
                    src={vellumSrc}
                    alt=""
                    aria-hidden="true"
                    width={vellumAsset.recommendedDimensions.width}
                    height={vellumAsset.recommendedDimensions.height}
                    loading="lazy"
                    decoding="async"
                    onError={() => setVellumFailed(true)}
                    className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover object-center opacity-55"
                  />
                )}

                {/* Filete interior fino sobre la hoja de papel vegetal */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3 border border-burgundy/25 transition-colors duration-300 group-hover:border-burgundy/40"
                />

                {/* Emblema discreto e indicación táctil estampados directamente sobre el papel vegetal */}
                <span className="relative z-10 flex flex-col items-center px-4 py-3">
                  <MonogramMG
                    className="w-14 h-14 text-burgundy transition-transform duration-300 group-hover:scale-105"
                    decorative
                  />
                  <span
                    aria-hidden="true"
                    className="my-3 w-px h-6 bg-burgundy/35"
                  />
                  <span className="text-[11px] uppercase tracking-[0.26em] text-espresso group-hover:text-burgundy transition-colors font-sans font-medium">
                    Toca para descubrir
                  </span>
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pie de Foto Editorial y Región Live Accesible */}
      <div className="mt-5 min-h-[28px] flex flex-col items-center justify-center">
        {isRevealed ? (
          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: EDITORIAL_EASE }}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-cream/90 font-sans"
          >
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full bg-[#E6D2A2]/80"
            />
            <span>Montse &amp; Gerardo · Retrato Editorial</span>
          </motion.p>
        ) : (
          <p className="text-[10px] uppercase tracking-[0.28em] text-cream/80 font-sans">
            Velo de papel vegetal · Toca el retrato
          </p>
        )}

        <p className="sr-only" aria-live="polite">
          {isRevealed
            ? 'Fotografía editorial de Montse y Gerardo descubierta.'
            : 'Retrato editorial cubierto con velo translúcido. Activa el botón sobre la imagen para descubrirlo.'}
        </p>
      </div>
    </div>
  );
};
