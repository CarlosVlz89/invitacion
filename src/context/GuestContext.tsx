import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Guest } from '../types/guest';
import {
  DEFAULT_GENERIC_GUEST,
  GENERIC_GUEST_ID,
  mockGuests,
} from '../data/mockGuests';
import {
  GuestRsvpUpdate,
  loadStoredDevRsvp,
} from '../services/rsvpService';
import { sanitizeText } from '../utils/sanitize';
import weddingThemeUrl from '../assets/audio/wedding-theme.mp3';

const TARGET_AMBIENT_VOLUME = 0.45;
const VOLUME_FADE_IN_MS = 1200;

export interface GuestContextType {
  guest: Guest;
  isIdentifiedGuest: boolean;
  isGenericGuest: boolean;
  guestLookupError: boolean;
  resolveGuestByCode: (code: string) => boolean;
  applyGuestRsvpUpdate: (update: GuestRsvpUpdate) => void;
  isOpened: boolean;
  isOpening: boolean;
  startEnvelopeOpening: () => void;
  completeEnvelopeOpen: () => void;
  openEnvelope: () => void;
  isPlaying: boolean;
  audioUnlocked: boolean;
  toggleAudio: () => void;
  unlockAndPlayAudio: () => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

function findMockGuestByCode(rawCode: string): Guest | null {
  const normalized = sanitizeText(rawCode, 80).toLowerCase();
  if (normalized.length === 0) return null;

  for (const [key, candidate] of Object.entries(mockGuests)) {
    if (
      key.toLowerCase() === normalized ||
      candidate.id.toLowerCase() === normalized ||
      candidate.slug?.toLowerCase() === normalized
    ) {
      return candidate;
    }
  }

  return null;
}

function hydrateGuestWithDevRsvp(baseGuest: Guest): Guest {
  if (baseGuest.id === GENERIC_GUEST_ID) {
    return baseGuest;
  }

  const storedUpdate = loadStoredDevRsvp(baseGuest.id);
  if (!storedUpdate) {
    return baseGuest;
  }

  return {
    ...baseGuest,
    estatusWeb: storedUpdate.estatusWeb,
    asistentesConfirmados: storedUpdate.asistentesConfirmados,
    restriccionesDieteticas: storedUpdate.restriccionesDieteticas,
    fechaConfirmacion: storedUpdate.fechaConfirmacion,
    statusRecepcion: storedUpdate.statusRecepcion,
    mensajeNovios: storedUpdate.mensajeNovios,
    updatedAt: storedUpdate.updatedAt,
    syncOrigin: storedUpdate.syncOrigin,
    ...(baseGuest.tier === 'A' ? { statusCivil: storedUpdate.statusCivil } : {}),
  };
}

interface InitialGuestResolution {
  readonly guest: Guest;
  readonly lookupError: boolean;
}

function resolveInitialGuestState(): InitialGuestResolution {
  if (typeof window === 'undefined') {
    return { guest: DEFAULT_GENERIC_GUEST, lookupError: false };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const rawGuestParam = searchParams.get('guest');

  if (rawGuestParam === null || rawGuestParam.trim().length === 0) {
    return { guest: DEFAULT_GENERIC_GUEST, lookupError: false };
  }

  const matched = findMockGuestByCode(rawGuestParam);
  if (matched) {
    return {
      guest: hydrateGuestWithDevRsvp(matched),
      lookupError: false,
    };
  }

  // ID inexistente -> Tier B genérico seguro + indicador elegante de búsqueda fallida
  return {
    guest: DEFAULT_GENERIC_GUEST,
    lookupError: true,
  };
}

function setAudioVolumeSafe(audio: HTMLAudioElement, volume: number): void {
  const clamped = Math.min(1, Math.max(0, volume));
  try {
    audio.volume = clamped;
  } catch {
    // En iOS Safari audio.volume es de solo lectura; ignorar de forma segura
  }
}

function createAmbientAudio(): HTMLAudioElement {
  const audio = new Audio(weddingThemeUrl);
  audio.loop = true;
  audio.preload = 'metadata';
  setAudioVolumeSafe(audio, TARGET_AMBIENT_VOLUME);
  return audio;
}

export const GuestProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [initialResolution] = useState<InitialGuestResolution>(
    resolveInitialGuestState,
  );
  const [guest, setGuest] = useState<Guest>(initialResolution.guest);
  const [guestLookupError, setGuestLookupError] = useState<boolean>(
    initialResolution.lookupError,
  );
  // isOpened vive únicamente en estado de React en memoria para que el sobre C00
  // vuelva a mostrarse al recargar (F5) y permita desbloquear el audio en cada ciclo del documento,
  // manteniéndose abierto en navegación por anclas, modales, RSVP o resize.
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [isOpening, setIsOpening] = useState<boolean>(false);

  // En navegadores móviles, el AudioContext siempre inicia bloqueado tras una recarga.
  // Nunca hidratar audioUnlocked ni isPlaying desde sessionStorage para evitar falsos estados activos.
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioUnlocked, setAudioUnlocked] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number | null>(null);

  const cancelVolumeFade = useCallback(() => {
    if (fadeRafRef.current !== null) {
      window.cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
  }, []);

  const startVolumeFadeIn = useCallback(
    (audio: HTMLAudioElement) => {
      cancelVolumeFade();
      setAudioVolumeSafe(audio, 0);

      const startTime = performance.now();

      const step = (now: number) => {
        if (audio.paused) {
          fadeRafRef.current = null;
          return;
        }

        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / VOLUME_FADE_IN_MS);
        const eased = 1 - Math.pow(1 - progress, 2);
        setAudioVolumeSafe(audio, TARGET_AMBIENT_VOLUME * eased);

        if (progress < 1) {
          fadeRafRef.current = window.requestAnimationFrame(step);
        } else {
          fadeRafRef.current = null;
        }
      };

      fadeRafRef.current = window.requestAnimationFrame(step);
    },
    [cancelVolumeFade],
  );

  const attachAudioListeners = useCallback(
    (audio: HTMLAudioElement): (() => void) => {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => {
        cancelVolumeFade();
        setIsPlaying(false);
      };
      const handleEnded = () => {
        cancelVolumeFade();
        setIsPlaying(false);
      };

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      };
    },
    [cancelVolumeFade],
  );

  useEffect(() => {
    const audio = createAmbientAudio();
    audioRef.current = audio;
    const detachAudioListeners = attachAudioListeners(audio);

    // Ciclo de vida móvil: pausar limpiamente si el invitado minimiza o regresa a WhatsApp
    const handleVisibilityChange = () => {
      if (document.hidden && !audio.paused) {
        cancelVolumeFade();
        audio.pause();
      }
    };

    const handlePageHide = () => {
      if (!audio.paused) {
        cancelVolumeFade();
        audio.pause();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      cancelVolumeFade();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      detachAudioListeners();
      audio.pause();
      audioRef.current = null;
    };
  }, [attachAudioListeners, cancelVolumeFade]);

  const ensureAudioElement = useCallback((): HTMLAudioElement => {
    if (!audioRef.current) {
      audioRef.current = createAmbientAudio();
    }
    return audioRef.current;
  }, []);

  /**
   * Debe invocarse sincrónicamente dentro del manejador de clic/toque
   * del sello de cera o del reproductor flotante para cumplir con Polite Autoplay
   * en Safari iOS y Chrome Android.
   */
  const unlockAndPlayAudio = useCallback(() => {
    const audio = ensureAudioElement();
    setAudioUnlocked(true);
    setAudioVolumeSafe(audio, 0);

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          startVolumeFadeIn(audio);
        })
        .catch(() => {
          cancelVolumeFade();
          setIsPlaying(false);
        });
    } else {
      setIsPlaying(true);
      startVolumeFadeIn(audio);
    }
  }, [cancelVolumeFade, ensureAudioElement, startVolumeFadeIn]);

  const toggleAudio = useCallback(() => {
    const audio = ensureAudioElement();

    if (!audio.paused) {
      cancelVolumeFade();
      audio.pause();
      setIsPlaying(false);
      return;
    }

    unlockAndPlayAudio();
  }, [cancelVolumeFade, ensureAudioElement, unlockAndPlayAudio]);

  const startEnvelopeOpening = useCallback(() => {
    if (isOpened || isOpening) return;
    setIsOpening(true);
  }, [isOpened, isOpening]);

  const completeEnvelopeOpen = useCallback(() => {
    setIsOpening(false);
    setIsOpened(true);
  }, []);

  const openEnvelope = useCallback(() => {
    unlockAndPlayAudio();
    completeEnvelopeOpen();
  }, [completeEnvelopeOpen, unlockAndPlayAudio]);

  const resolveGuestByCode = useCallback((code: string): boolean => {
    const matched = findMockGuestByCode(code);
    if (!matched) {
      return false;
    }

    const hydrated = hydrateGuestWithDevRsvp(matched);
    setGuest(hydrated);
    setGuestLookupError(false);

    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('guest', matched.slug ?? matched.id);
        window.history.replaceState(null, '', url.toString());
      } catch {
        // Ignorar si replaceState no está disponible en el entorno
      }
    }

    return true;
  }, []);

  /**
   * Soberanía de datos: muta únicamente los campos propiedad de la Web/RSVP
   * preservando intactos los metadatos de Google Sheets.
   */
  const applyGuestRsvpUpdate = useCallback((update: GuestRsvpUpdate) => {
    setGuest((current) => ({
      ...current,
      estatusWeb: update.estatusWeb,
      asistentesConfirmados: update.asistentesConfirmados,
      restriccionesDieteticas: update.restriccionesDieteticas,
      fechaConfirmacion: update.fechaConfirmacion,
      statusRecepcion: update.statusRecepcion,
      mensajeNovios: update.mensajeNovios,
      updatedAt: update.updatedAt,
      syncOrigin: update.syncOrigin,
      ...(current.tier === 'A' ? { statusCivil: update.statusCivil } : {}),
    }));
  }, []);

  const isIdentifiedGuest = guest.id !== GENERIC_GUEST_ID;

  return (
    <GuestContext.Provider
      value={{
        guest,
        isIdentifiedGuest,
        isGenericGuest: !isIdentifiedGuest,
        guestLookupError,
        resolveGuestByCode,
        applyGuestRsvpUpdate,
        isOpened,
        isOpening,
        startEnvelopeOpening,
        completeEnvelopeOpen,
        openEnvelope,
        isPlaying,
        audioUnlocked,
        toggleAudio,
        unlockAndPlayAudio,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = (): GuestContextType => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest debe ser utilizado dentro de un GuestProvider');
  }
  return context;
};
