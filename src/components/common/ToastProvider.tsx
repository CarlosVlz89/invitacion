import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, Info, X } from 'lucide-react';

export type ToastTone = 'espresso' | 'olive' | 'burgundy';

interface ToastEntry {
  readonly id: number;
  readonly message: string;
  readonly tone: ToastTone;
}

interface ToastContextValue {
  showToast: (message: string, tone?: ToastTone) => void;
}

interface DocumentWithAriaNotify extends Document {
  ariaNotify?: (message: string) => void;
}

const TOAST_DURATION_MS = 3800;

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function announceViaAriaNotify(message: string): void {
  if (typeof document === 'undefined') return;
  const doc = document as DocumentWithAriaNotify;
  if (typeof doc.ariaNotify === 'function') {
    try {
      doc.ariaNotify(message);
    } catch {
      // Fallback asegurado mediante la región aria-live="polite"
    }
  }
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [toasts, setToasts] = useState<readonly ToastEntry[]>([]);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');

  const nextIdRef = useRef<number>(1);
  const timersRef = useRef<Map<number, number>>(new Map());
  const pausedIdsRef = useRef<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement | null>(null);

  const supportsPopover =
    typeof HTMLElement !== 'undefined' &&
    Object.prototype.hasOwnProperty.call(HTMLElement.prototype, 'popover');

  const dismissToast = useCallback((id: number) => {
    const existingTimer = timersRef.current.get(id);
    if (existingTimer !== undefined) {
      window.clearTimeout(existingTimer);
      timersRef.current.delete(id);
    }
    pausedIdsRef.current.delete(id);
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const scheduleDismiss = useCallback(
    (id: number) => {
      const existingTimer = timersRef.current.get(id);
      if (existingTimer !== undefined) {
        window.clearTimeout(existingTimer);
      }

      const timerId = window.setTimeout(() => {
        if (!pausedIdsRef.current.has(id)) {
          dismissToast(id);
        }
      }, TOAST_DURATION_MS);

      timersRef.current.set(id, timerId);
    },
    [dismissToast],
  );

  const pauseToastDismissal = useCallback((id: number) => {
    pausedIdsRef.current.add(id);
    const existingTimer = timersRef.current.get(id);
    if (existingTimer !== undefined) {
      window.clearTimeout(existingTimer);
      timersRef.current.delete(id);
    }
  }, []);

  const resumeToastDismissal = useCallback(
    (id: number) => {
      pausedIdsRef.current.delete(id);
      scheduleDismiss(id);
    },
    [scheduleDismiss],
  );

  const promoteToastTopLayer = useCallback(() => {
    const el = containerRef.current;
    if (!el || !supportsPopover || typeof el.showPopover !== 'function') {
      return;
    }

    try {
      // Re-promover al tope del Top Layer para quedar siempre visible incluso sobre <dialog> abierto
      if (el.matches(':popover-open') && typeof el.hidePopover === 'function') {
        el.hidePopover();
      }
      el.showPopover();
    } catch {
      // Mantener posicionamiento fijo si el navegador rechaza la promoción
    }
  }, [supportsPopover]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !supportsPopover) return;
    el.setAttribute('popover', 'manual');
  }, [supportsPopover]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !supportsPopover) return;

    if (toasts.length === 0) {
      try {
        if (el.matches(':popover-open') && typeof el.hidePopover === 'function') {
          el.hidePopover();
        }
      } catch {
        // Ignorar si ya estaba oculto
      }
    }
  }, [supportsPopover, toasts.length]);

  useEffect(() => {
    const activeTimers = timersRef.current;
    return () => {
      activeTimers.forEach((timerId) => window.clearTimeout(timerId));
      activeTimers.clear();
    };
  }, []);

  const showToast = useCallback(
    (message: string, tone: ToastTone = 'burgundy') => {
      const id = nextIdRef.current;
      nextIdRef.current += 1;

      setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
      setLiveAnnouncement(message);
      announceViaAriaNotify(message);
      scheduleDismiss(id);

      window.requestAnimationFrame(() => {
        promoteToastTopLayer();
      });
    },
    [promoteToastTopLayer, scheduleDismiss],
  );

  const toneClasses: Record<ToastTone, string> = {
    espresso: 'bg-burgundy-hover text-cream border-cream/20',
    olive: 'bg-olive text-cream border-cream/25',
    burgundy: 'bg-burgundy text-cream border-cream/25',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Región live persistente para lectores de pantalla */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      {/* Contenedor flotante sobrio en paleta editorial (Top Layer vía popover="manual" cuando está disponible) */}
      <div
        ref={containerRef}
        role="region"
        aria-label="Notificaciones"
        className="editorial-toast-layer fixed bottom-20 inset-x-4 sm:inset-x-auto sm:right-5 sm:left-auto z-[70] pointer-events-none flex flex-col items-center sm:items-end gap-2.5 m-0 p-0 bg-transparent border-0 max-w-none overflow-visible"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              role="status"
              aria-live="polite"
              data-testid="editorial-toast"
              initial={
                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }
              }
              transition={{ duration: prefersReducedMotion ? 0.15 : 0.28, ease: 'easeOut' }}
              onMouseEnter={() => pauseToastDismissal(toast.id)}
              onMouseLeave={() => resumeToastDismissal(toast.id)}
              onFocusCapture={() => pauseToastDismissal(toast.id)}
              onBlurCapture={() => resumeToastDismissal(toast.id)}
              className={`pointer-events-auto w-full max-w-sm rounded-sm border px-4 py-3 shadow-xl backdrop-blur-md flex items-center justify-between gap-3 ${toneClasses[toast.tone]}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  aria-hidden="true"
                  className="shrink-0 w-5 h-5 rounded-full bg-cream/15 flex items-center justify-center"
                >
                  {toast.tone === 'olive' ? (
                    <Check className="w-3.5 h-3.5 text-cream" />
                  ) : (
                    <Info className="w-3.5 h-3.5 text-cream" />
                  )}
                </span>
                <p className="font-sans text-xs sm:text-[13px] tracking-wide leading-snug text-cream">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Cerrar notificación"
                className="shrink-0 p-1.5 rounded-full text-cream/80 hover:text-cream hover:bg-cream/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
              >
                <X aria-hidden="true" className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser utilizado dentro de un ToastProvider');
  }
  return context;
};
