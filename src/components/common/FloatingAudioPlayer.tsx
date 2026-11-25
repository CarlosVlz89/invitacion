import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useGuest } from '../../context/GuestContext';

export const FloatingAudioPlayer: React.FC = () => {
  const { isOpened, isPlaying, toggleAudio } = useGuest();
  const prefersReducedMotion = useReducedMotion();

  // Solo mostrar el reproductor flotante cuando el sobre ha sido abierto
  if (!isOpened) return null;

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: prefersReducedMotion ? 0 : 0.25,
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: 'easeOut',
      }}
      className="fixed bottom-5 right-5 z-40"
    >
      <button
        type="button"
        onClick={toggleAudio}
        aria-pressed={isPlaying}
        className="group relative flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-full bg-cream/95 border border-divider/90 shadow-md backdrop-blur-md text-espresso hover:text-burgundy hover:border-burgundy/40 transition-colors duration-300 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
        aria-label={isPlaying ? 'Pausar música ambiental' : 'Reproducir música ambiental'}
      >
        <div aria-hidden="true" className="relative flex items-center justify-center w-5 h-5">
          {isPlaying ? (
            <div className="flex items-end gap-[2px] h-3">
              <span className="w-[2px] bg-burgundy rounded-full editorial-eq-bar-1 h-full" />
              <span className="w-[2px] bg-burgundy rounded-full editorial-eq-bar-2 h-2/3" />
              <span className="w-[2px] bg-burgundy rounded-full editorial-eq-bar-3 h-4/5" />
            </div>
          ) : (
            <VolumeX className="w-4 h-4 text-espresso group-hover:text-burgundy transition-colors" />
          )}
        </div>

        <span className="text-[11px] font-sans font-medium tracking-wider uppercase text-espresso group-hover:text-burgundy transition-colors">
          {isPlaying ? 'Música activa' : 'Silencio'}
        </span>

        {isPlaying && (
          <Volume2 aria-hidden="true" className="w-3.5 h-3.5 text-burgundy" />
        )}
      </button>
    </motion.div>
  );
};
