import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useGuest } from '../../context/GuestContext';
import { getEditorialAsset } from '../../config/editorialAssets';

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FULL_SEQUENCE_DURATION_MS = 1200;
const REDUCED_SEQUENCE_DURATION_MS = 380;

export const WaxSealEntrance: React.FC = () => {
  const {
    guest,
    isOpened,
    isOpening,
    startEnvelopeOpening,
    completeEnvelopeOpen,
    unlockAndPlayAudio,
  } = useGuest();

  const prefersReducedMotion = useReducedMotion();
  const [envelopeTextureFailed, setEnvelopeTextureFailed] = useState(false);
  const [liningTextureFailed, setLiningTextureFailed] = useState(false);
  const [waxSealFailed, setWaxSealFailed] = useState(false);
  const [vellumTextureFailed, setVellumTextureFailed] = useState(false);

  const envelopeAsset = getEditorialAsset('envelopeTexture');
  const liningAsset = getEditorialAsset('envelopeLiningOlive');
  const waxSealAsset = getEditorialAsset('waxSealBurgundy');
  const vellumAsset = getEditorialAsset('vellumOverlay');

  const envelopeSrc = !envelopeTextureFailed ? envelopeAsset.resolvedSrc : null;
  const liningSrc = !liningTextureFailed ? liningAsset.resolvedSrc : null;
  const waxSealSrc = !waxSealFailed ? waxSealAsset.resolvedSrc : null;
  const vellumSrc = !vellumTextureFailed ? vellumAsset.resolvedSrc : null;

  // Temporizador determinista para finalizar el desmontaje sin depender solo de callbacks
  useEffect(() => {
    if (!isOpening || isOpened) return;

    const durationMs = prefersReducedMotion
      ? REDUCED_SEQUENCE_DURATION_MS
      : FULL_SEQUENCE_DURATION_MS;

    const timerId = window.setTimeout(() => {
      completeEnvelopeOpen();
    }, durationMs);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [completeEnvelopeOpen, isOpened, isOpening, prefersReducedMotion]);

  if (isOpened) {
    return null;
  }

  const handleSealClick = () => {
    if (isOpening || isOpened) return;

    // 1. Disparo síncrono de desbloqueo y reproducción de audio DENTRO del gesto de usuario
    unlockAndPlayAudio();

    // 2. Iniciar secuencia visual de apertura 3D en 2 tiempos
    startEnvelopeOpening();
  };

  // Fecha blindada en el sobre: Tier B jamás recibe ni renderiza referencia al 16 de Julio
  const envelopeDateLabel =
    guest.tier === 'A' ? '16 & 17 · Julio · 2027' : '17 · Julio · 2027';

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Sobre de invitación de boda de Montse y Gerardo"
      data-testid="wax-seal-entrance"
      initial={{ opacity: 1 }}
      animate={
        isOpening && prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 1 }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0.35, ease: 'easeOut' }
          : { duration: 0.2 }
      }
      className="fixed inset-0 z-50 w-screen h-[100dvh] overflow-hidden select-none"
    >
      {/* Capa Tiempo 2 (0.48s - 1.15s): Doble hoja simétrica de papel vegetal (Vellum en Warm Cream) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex overflow-hidden"
      >
        <motion.div
          initial={{ x: '0%', opacity: 1 }}
          animate={
            isOpening && !prefersReducedMotion
              ? { x: '-104%', opacity: 0.15 }
              : { x: '0%', opacity: 1 }
          }
          transition={{
            delay: prefersReducedMotion ? 0 : 0.48,
            duration: prefersReducedMotion ? 0.35 : 0.65,
            ease: EDITORIAL_EASE,
          }}
          className="relative w-1/2 h-full bg-cream/90 editorial-vellum-leaf backdrop-blur-md border-r border-divider/90 transform-gpu will-change-transform backface-hidden"
        >
          {vellumSrc && (
            <img
              src={vellumSrc}
              alt=""
              width={vellumAsset.recommendedDimensions.width}
              height={vellumAsset.recommendedDimensions.height}
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              onError={() => setVellumTextureFailed(true)}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-55"
            />
          )}
          <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-olive-envelope-dark/[0.12] to-transparent" />
        </motion.div>

        <motion.div
          initial={{ x: '0%', opacity: 1 }}
          animate={
            isOpening && !prefersReducedMotion
              ? { x: '104%', opacity: 0.15 }
              : { x: '0%', opacity: 1 }
          }
          transition={{
            delay: prefersReducedMotion ? 0 : 0.48,
            duration: prefersReducedMotion ? 0.35 : 0.65,
            ease: EDITORIAL_EASE,
          }}
          className="relative w-1/2 h-full bg-cream/90 editorial-vellum-leaf backdrop-blur-md border-l border-divider/90 transform-gpu will-change-transform backface-hidden"
        >
          {vellumSrc && (
            <img
              src={vellumSrc}
              alt=""
              width={vellumAsset.recommendedDimensions.width}
              height={vellumAsset.recommendedDimensions.height}
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              onError={() => setVellumTextureFailed(true)}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-55 scale-x-[-1]"
            />
          )}
          <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-olive-envelope-dark/[0.12] to-transparent" />
        </motion.div>
      </div>

      {/* Capa Tiempo 1 (0.0s - 0.68s): Sobre de Boda Full-Bleed en Papel Algodón Fino Verde Olivo */}
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={
          isOpening && !prefersReducedMotion
            ? { opacity: 0, scale: 1.02 }
            : { opacity: 1, scale: 1 }
        }
        transition={{
          delay: prefersReducedMotion ? 0 : 0.36,
          duration: prefersReducedMotion ? 0.35 : 0.34,
          ease: EDITORIAL_EASE,
        }}
        className="relative z-10 w-full h-full bg-olive-envelope editorial-envelope-body perspective-1000 transform-style-3d overflow-hidden"
      >
        {/* Forro interior botánico verde olivo revelado al desplegar la solapa superior 3D */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[52%] overflow-hidden bg-olive-envelope-dark"
        >
          {liningSrc ? (
            <img
              src={liningSrc}
              alt=""
              width={liningAsset.recommendedDimensions.width}
              height={liningAsset.recommendedDimensions.height}
              loading="eager"
              decoding="sync"
              onError={() => setLiningTextureFailed(true)}
              className="w-full h-full object-cover object-center opacity-85"
            />
          ) : (
            <div className="w-full h-full editorial-envelope-grain opacity-90" />
          )}
          <div className="absolute inset-0 bg-olive-envelope-dark/25" />
        </div>

        {/* Bolsillo Inferior Limpio en Papel Algodón Fino Verde Olivo (sin cruce X rígido) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[3] editorial-envelope-pocket overflow-hidden"
        >
          {envelopeSrc ? (
            <img
              src={envelopeSrc}
              alt=""
              width={envelopeAsset.recommendedDimensions.width}
              height={envelopeAsset.recommendedDimensions.height}
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              onError={() => setEnvelopeTextureFailed(true)}
              className="w-full h-full object-cover object-center opacity-90"
            />
          ) : (
            <div className="w-full h-full editorial-envelope-grain" />
          )}
          {/* Sombreo lateral ultra-suave en los bordes para profundidad táctil */}
          <div className="absolute inset-0 bg-gradient-to-b from-olive-envelope-dark/25 via-transparent to-olive-envelope-dark/30" />
          <div className="absolute inset-y-0 left-0 w-10 sm:w-20 bg-gradient-to-r from-olive-envelope-dark/22 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-10 sm:w-20 bg-gradient-to-l from-olive-envelope-dark/22 to-transparent" />
          {/* Filete interior ultra-sutil de papelería */}
          <div className="absolute inset-4 sm:inset-7 border border-cream/15 pointer-events-none" />
        </div>

        {/* Solapa Superior Triangular en V (0% a 47% de altura) con Sombra Proyectada Realista y Rotación 3D */}
        <motion.div
          aria-hidden="true"
          initial={{ rotateX: 0 }}
          animate={
            isOpening && !prefersReducedMotion
              ? { rotateX: -174 }
              : { rotateX: 0 }
          }
          transition={{
            duration: prefersReducedMotion ? 0.35 : 0.62,
            ease: EDITORIAL_EASE,
          }}
          className="pointer-events-none absolute inset-x-0 top-0 h-[47%] z-[8] transform-gpu will-change-transform backface-hidden origin-top drop-shadow-[0_18px_28px_rgba(20,26,10,0.44)]"
        >
          <div className="relative w-full h-full editorial-envelope-flap overflow-hidden">
            {envelopeSrc ? (
              <img
                src={envelopeSrc}
                alt=""
                width={envelopeAsset.recommendedDimensions.width}
                height={envelopeAsset.recommendedDimensions.height}
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                onError={() => setEnvelopeTextureFailed(true)}
                className="w-full h-full object-cover object-center opacity-88"
              />
            ) : (
              <div className="w-full h-full editorial-envelope-grain" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-cream/[0.04] via-transparent to-olive-envelope-dark/28" />
          </div>
          <svg
            viewBox="0 0 1000 470"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
          >
            <path
              d="M0 0 L475 462 Q500 472 525 462 L1000 0"
              fill="none"
              stroke="rgba(242, 236, 225, 0.24)"
              strokeWidth="1.15"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </motion.div>

        {/* Destinatario en la Zona Superior de la Solapa con Amplio Aire */}
        <motion.div
          animate={isOpening ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: EDITORIAL_EASE }}
          className="pointer-events-none absolute inset-x-0 top-[11%] sm:top-[12%] z-20 px-6 flex flex-col items-center text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.34em] text-cream/90 font-sans font-medium">
            Para
          </p>
          <p className="mt-2 max-w-md font-display text-2xl sm:text-3xl md:text-[2.15rem] text-cream tracking-wide font-normal leading-snug drop-shadow-[0_1px_6px_rgba(24,30,12,0.3)]">
            {guest.nombreInvitacion}
          </p>
        </motion.div>

        {/* Sello de Cera Artesanal Realista (.webp transparente) exactamente sobre el Vértice de la Solapa (47%) */}
        <div className="absolute left-1/2 top-[47%] -translate-x-1/2 -translate-y-1/2 z-30">
          <motion.button
            type="button"
            onClick={handleSealClick}
            disabled={isOpening}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.045 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
            animate={
              isOpening && !prefersReducedMotion
                ? { scale: 1.12, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.42, ease: EDITORIAL_EASE }}
            aria-label="Abrir invitación de boda de Montse y Gerardo"
            className="group relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center cursor-pointer transform-gpu will-change-transform rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream disabled:cursor-default"
          >
            {waxSealSrc ? (
              <img
                src={waxSealSrc}
                alt=""
                aria-hidden="true"
                width={waxSealAsset.recommendedDimensions.width}
                height={waxSealAsset.recommendedDimensions.height}
                loading="eager"
                decoding="sync"
                onError={() => setWaxSealFailed(true)}
                className="pointer-events-none w-full h-full object-contain drop-shadow-[0_12px_20px_rgba(20,10,12,0.48)] transition-transform duration-300"
              />
            ) : (
              <span
                aria-hidden="true"
                className="pointer-events-none w-24 h-24 sm:w-28 sm:h-28 rounded-full editorial-wax-seal border border-cream/25"
              />
            )}

            {/* Monograma M & G estampado en Foil Oro Viejo sobre el centro del sello borgoña */}
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="font-display font-medium text-base sm:text-lg tracking-[0.12em] whitespace-nowrap editorial-foil-gold">
                M &amp; G
              </span>
            </span>
          </motion.button>
        </div>

        {/* Indicación Discreta y Fecha Blindada por Tier en la Zona Inferior Despejada */}
        <motion.div
          animate={isOpening ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
          className="pointer-events-none absolute inset-x-0 bottom-[11%] sm:bottom-[12%] z-20 px-6 flex flex-col items-center gap-3.5 text-center"
        >
          <div className="inline-flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="inline-block w-1.5 h-1.5 rounded-full bg-cream/85 editorial-pulse-dot"
            />
            <span className="text-[11px] uppercase tracking-[0.28em] text-cream font-sans font-medium">
              Toca el sello para abrir
            </span>
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-cream/90 font-sans">
            {envelopeDateLabel}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
