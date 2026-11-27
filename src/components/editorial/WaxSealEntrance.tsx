import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useGuest } from '../../context/GuestContext';
import { getEditorialAsset } from '../../config/editorialAssets';

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FULL_SEQUENCE_DURATION_MS = 1150;
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
  const [waxSealFailed, setWaxSealFailed] = useState(false);
  const [vellumTextureFailed, setVellumTextureFailed] = useState(false);

  const envelopeAsset = getEditorialAsset('envelopeTexture');
  const waxSealAsset = getEditorialAsset('waxSealBurgundy');
  const vellumAsset = getEditorialAsset('vellumOverlay');

  const envelopeSrc = !envelopeTextureFailed ? envelopeAsset.resolvedSrc : null;
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

    // 2. Iniciar secuencia visual de apertura 3D en 2 tiempos del díptico vertical
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
      {/* Capa Interior (Tiempo 2): Velo translúcido Vellum que se desvanece suavemente hacia la portada Hero */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 1, scale: 1 }}
        animate={
          isOpening && !prefersReducedMotion
            ? { opacity: 0, scale: 1.02 }
            : { opacity: 1, scale: 1 }
        }
        transition={{
          delay: prefersReducedMotion ? 0 : 0.56,
          duration: prefersReducedMotion ? 0.35 : 0.54,
          ease: EDITORIAL_EASE,
        }}
        className="pointer-events-none absolute inset-0 bg-cream/85 editorial-vellum-leaf backdrop-blur-md transform-gpu will-change-transform"
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
            className="w-full h-full object-cover object-center opacity-60"
          />
        )}
      </motion.div>

      {/* Capa Principal: Díptico Vertical 3D de Dos Hojas Full-Bleed en Verde Olivo */}
      <div className="relative z-10 w-full h-full flex perspective-1000 transform-style-3d overflow-hidden">
        {/* Hoja Izquierda del Díptico */}
        <motion.div
          aria-hidden="true"
          data-testid="folio-door-left"
          initial={{ rotateY: 0, x: '0%', opacity: 1 }}
          animate={
            isOpening && !prefersReducedMotion
              ? { rotateY: -42, x: '-102%', opacity: 0.25 }
              : { rotateY: 0, x: '0%', opacity: 1 }
          }
          transition={{
            delay: prefersReducedMotion ? 0 : 0.22,
            duration: prefersReducedMotion ? 0.35 : 0.74,
            ease: EDITORIAL_EASE,
          }}
          className="relative w-1/2 h-full bg-olive-envelope editorial-folio-door-left border-r border-olive-envelope-dark/50 origin-left transform-gpu will-change-transform backface-hidden overflow-hidden"
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
              className="w-full h-full object-cover object-left opacity-92"
            />
          ) : (
            <div className="w-full h-full editorial-envelope-grain" />
          )}

          {/* Sombra interior suave y micro-brillo de costura central */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-olive-envelope-dark/22 via-transparent to-olive-envelope-dark/28" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 bg-gradient-to-r from-olive-envelope-dark/24 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-olive-envelope-dark/28 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-cream/10" />

          {/* Filete perimetral editorial continuo de papelería */}
          <div className="pointer-events-none absolute top-4 bottom-4 left-4 right-0 sm:top-7 sm:bottom-7 sm:left-7 border-y border-l border-cream/15" />
        </motion.div>

        {/* Hoja Derecha del Díptico */}
        <motion.div
          aria-hidden="true"
          data-testid="folio-door-right"
          initial={{ rotateY: 0, x: '0%', opacity: 1 }}
          animate={
            isOpening && !prefersReducedMotion
              ? { rotateY: 42, x: '102%', opacity: 0.25 }
              : { rotateY: 0, x: '0%', opacity: 1 }
          }
          transition={{
            delay: prefersReducedMotion ? 0 : 0.22,
            duration: prefersReducedMotion ? 0.35 : 0.74,
            ease: EDITORIAL_EASE,
          }}
          className="relative w-1/2 h-full bg-olive-envelope editorial-folio-door-right border-l border-cream/10 origin-right transform-gpu will-change-transform backface-hidden overflow-hidden"
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
              className="w-full h-full object-cover object-right opacity-92 scale-x-[-1]"
            />
          ) : (
            <div className="w-full h-full editorial-envelope-grain" />
          )}

          {/* Sombra interior suave y relieve táctil junto a la unión vertical */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-olive-envelope-dark/22 via-transparent to-olive-envelope-dark/28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 bg-gradient-to-l from-olive-envelope-dark/24 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-olive-envelope-dark/22 to-transparent" />

          {/* Filete perimetral editorial continuo de papelería */}
          <div className="pointer-events-none absolute top-4 bottom-4 right-4 left-0 sm:top-7 sm:bottom-7 sm:right-7 border-y border-r border-cream/15" />
        </motion.div>

        {/* Destinatario Editorial en Caligrafía Pinyon Script con Aire Generoso Arriba del Sello */}
        <motion.div
          animate={isOpening ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
          className="pointer-events-none absolute inset-x-0 top-[14%] sm:top-[16%] z-20 px-6 flex flex-col items-center text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.34em] text-cream/90 font-sans font-medium">
            Para
          </p>
          <p
            data-testid="envelope-recipient-name"
            className="mt-3 max-w-lg font-script text-4xl sm:text-5xl text-cream font-normal leading-[1.15] drop-shadow-[0_2px_10px_rgba(20,26,10,0.34)]"
          >
            {guest.nombreInvitacion}
          </p>
        </motion.div>

        {/* Sello de Cera Deep Burgundy Centrado sobre la Unión de Ambas Hojas */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <motion.button
            type="button"
            onClick={handleSealClick}
            disabled={isOpening}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.045 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
            animate={
              isOpening && !prefersReducedMotion
                ? { scale: [1, 1.04, 0.92], opacity: [1, 1, 0] }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
            aria-label="Abrir invitación de Montse y Gerardo"
            className="group relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center cursor-pointer transform-gpu will-change-transform rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream disabled:cursor-default"
          >
            <span className="relative flex items-center justify-center w-full h-full rounded-full overflow-hidden editorial-seal-glint">
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
                  className="pointer-events-none w-full h-full object-contain transition-transform duration-300"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="pointer-events-none w-24 h-24 sm:w-28 sm:h-28 rounded-full editorial-wax-seal border border-cream/25"
                />
              )}

              {/* Monograma M & G estampado en Foil Oro Viejo sobre el centro del sello borgoña */}
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="font-display font-medium text-base sm:text-lg tracking-[0.12em] pl-[0.12em] whitespace-nowrap editorial-foil-gold">
                  M &amp; G
                </span>
              </span>
            </span>
          </motion.button>
        </div>

        {/* Fecha Blindada por Tier en la Zona Inferior Despejada (sin texto instructivo explícito) */}
        <motion.div
          animate={isOpening ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.26, ease: EDITORIAL_EASE }}
          className="pointer-events-none absolute inset-x-0 bottom-[13%] sm:bottom-[15%] z-20 px-6 flex flex-col items-center text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.32em] text-cream/90 font-sans">
            {envelopeDateLabel}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
