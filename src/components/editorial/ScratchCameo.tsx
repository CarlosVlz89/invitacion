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
      {/* Paspartú Físico de Papel Algodón con Ventana Interior Biselada Hundida */}
      <div className="relative p-3.5 sm:p-5 rounded-none editorial-passepartout">
        <div
          id={portraitId}
          data-testid="vellum-portrait-frame"
          data-revealed={isRevealed ? 'true' : 'false'}
          className="relative w-[244px] sm:w-[276px] md:w-[296px] aspect-[3/4] rounded-none overflow-hidden bg-burgundy-hover isolate"
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

          {/* Capa Superior Interactiva: Hoja Translúcida de Papel Vegetal (Vellum) con Guiño Orgánico */}
          <AnimatePresence>
            {!isRevealed && (
              <motion.button
                key="vellum-reveal-sheet"
                type="button"
                onClick={handleReveal}
                data-testid="vellum-reveal-button"
                aria-expanded={isRevealed}
                aria-controls={portraitId}
                aria-label="Descubrir fotografía de Montse y Gerardo"
                initial={{ opacity: 1, y: 0 }}
                animate={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 1, y: [0, -3, 0] }
                }
                exit={
                  prefersReducedMotion
                    ? {
                        opacity: 0,
                        transition: { duration: 0.25, ease: 'easeOut' },
                      }
                    : {
                        opacity: 0,
                        y: -18,
                        transition: { duration: 0.85, ease: EDITORIAL_EASE },
                      }
                }
                transition={{
                  y: prefersReducedMotion
                    ? { duration: 0 }
                    : {
                        duration: 4.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                }}
                className="group absolute inset-0 z-10 w-full h-full min-h-[44px] flex items-center justify-center p-6 text-center bg-cream/55 backdrop-blur-[2px] hover:bg-cream/50 active:scale-[0.99] transition-colors cursor-pointer transform-gpu will-change-transform editorial-vellum-glint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-burgundy"
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

                {/* Monograma tipográfico discreto estampado sobre el papel vegetal (sin botón ni instrucciones) */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none relative z-10 font-display font-medium text-xl sm:text-2xl tracking-[0.22em] pl-[0.22em] text-burgundy/80 group-hover:text-burgundy transition-colors"
                >
                  M &amp; G
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Bisel Interior Hundido del Paspartú sobre la Ventana Fotográfica */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 editorial-passepartout-window"
          />
        </div>
      </div>

      {/* Región Live Silenciosa para Accesibilidad sin Textos Instructivos Visibles */}
      <p className="sr-only" aria-live="polite">
        {isRevealed
          ? 'Fotografía de Montse y Gerardo descubierta.'
          : 'Fotografía de Montse y Gerardo cubierta con velo de papel vegetal.'}
      </p>
    </div>
  );
};
