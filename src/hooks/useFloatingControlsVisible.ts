import { useEffect, useRef, useState } from 'react';

const TOP_SAFE_ZONE_PX = 80;
const SCROLL_DEADZONE_PX = 12;

/**
 * Controla la visibilidad de las pastillas flotantes según la dirección del scroll.
 * - Siempre visible en la zona superior (scrollY < 80).
 * - Deadzone acumulado de 12px para evitar parpadeos por micro-gestos táctiles.
 * - Protegido contra el rebote elástico de iOS Safari en los extremos superior e inferior.
 */
export function useFloatingControlsVisible(): boolean {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const lastScrollYRef = useRef<number>(
    typeof window !== 'undefined' ? Math.max(0, window.scrollY) : 0,
  );
  const accumulatedDeltaRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    lastScrollYRef.current = Math.max(0, window.scrollY);
    accumulatedDeltaRef.current = 0;

    const evaluateScroll = () => {
      rafIdRef.current = null;

      const rawScrollY = window.scrollY;

      // Blindaje contra rebote superior de iOS Safari (scrollY <= 0)
      if (rawScrollY <= 0) {
        lastScrollYRef.current = 0;
        accumulatedDeltaRef.current = 0;
        setIsVisible(true);
        return;
      }

      const maxScrollY = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );

      // Blindaje contra rebote inferior de iOS Safari
      if (maxScrollY > 0 && rawScrollY >= maxScrollY) {
        lastScrollYRef.current = maxScrollY;
        accumulatedDeltaRef.current = 0;
        return;
      }

      // Zona superior / portada siempre visible
      if (rawScrollY < TOP_SAFE_ZONE_PX) {
        lastScrollYRef.current = rawScrollY;
        accumulatedDeltaRef.current = 0;
        setIsVisible(true);
        return;
      }

      const delta = rawScrollY - lastScrollYRef.current;
      lastScrollYRef.current = rawScrollY;

      if (delta === 0) {
        return;
      }

      const directionChanged =
        (accumulatedDeltaRef.current > 0 && delta < 0) ||
        (accumulatedDeltaRef.current < 0 && delta > 0);

      accumulatedDeltaRef.current = directionChanged
        ? delta
        : accumulatedDeltaRef.current + delta;

      if (accumulatedDeltaRef.current > SCROLL_DEADZONE_PX) {
        setIsVisible(false);
        accumulatedDeltaRef.current = 0;
      } else if (accumulatedDeltaRef.current < -SCROLL_DEADZONE_PX) {
        setIsVisible(true);
        accumulatedDeltaRef.current = 0;
      }
    };

    const handleScroll = () => {
      if (rafIdRef.current !== null) {
        return;
      }
      rafIdRef.current = window.requestAnimationFrame(evaluateScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  return isVisible;
}
