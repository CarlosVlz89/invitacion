import React, { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useGuest } from '../../context/GuestContext';
import { TierType } from '../../types/guest';

interface NavLinkItem {
  readonly href: string;
  readonly label: string;
  readonly tiers: readonly TierType[];
}

const EDITORIAL_NAV_LINKS: readonly NavLinkItem[] = [
  { href: '#cuenta-regresiva', label: 'Cuenta regresiva', tiers: ['A', 'B'] },
  { href: '#ubicacion', label: 'Ubicación', tiers: ['A', 'B'] },
  { href: '#itinerario', label: 'Itinerario', tiers: ['A', 'B'] },
  { href: '#vestimenta', label: 'Vestimenta', tiers: ['A', 'B'] },
  { href: '#hospedaje', label: 'Hospedaje', tiers: ['A', 'B'] },
  { href: '#regalos', label: 'Regalos', tiers: ['A', 'B'] },
  { href: '#rsvp', label: 'Confirmación', tiers: ['A', 'B'] },
];

function getNavLinksForTier(tier: TierType): readonly NavLinkItem[] {
  return EDITORIAL_NAV_LINKS.filter((item) => item.tiers.includes(tier));
}

export const EditorialNav: React.FC = () => {
  const { guest, isOpened } = useGuest();
  const [menuOpen, setMenuOpen] = useState(false);
  const navContainerRef = useRef<HTMLElement | null>(null);

  const visibleLinks = getNavLinksForTier(guest.tier);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const container = navContainerRef.current;
      if (
        container &&
        event.target instanceof Node &&
        !container.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [menuOpen]);

  if (!isOpened) {
    return null;
  }

  return (
    <nav
      ref={navContainerRef}
      aria-label="Índice de la invitación"
      className="fixed top-4 right-4 z-30 flex flex-col items-end"
    >
      {/* Único botón discreto en esquina superior derecha (sin barra horizontal fija) */}
      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-expanded={menuOpen}
        aria-controls="editorial-index-menu"
        aria-label={menuOpen ? 'Cerrar índice de secciones' : 'Abrir índice de secciones'}
        className="inline-flex items-center gap-2.5 px-4 h-11 rounded-full bg-cream/90 backdrop-blur-md border border-divider/80 shadow-sm text-espresso hover:text-burgundy hover:border-burgundy/40 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
      >
        <span className="font-display text-sm tracking-[0.16em] text-burgundy font-medium">
          M &amp; G
        </span>
        <span aria-hidden="true" className="w-px h-3.5 bg-divider" />
        <span className="text-[10px] uppercase tracking-[0.22em] font-sans font-medium text-espresso">
          {menuOpen ? 'Cerrar' : 'Índice'}
        </span>
        {menuOpen ? (
          <X aria-hidden="true" className="w-3.5 h-3.5 text-espresso" />
        ) : (
          <Menu aria-hidden="true" className="w-3.5 h-3.5 text-espresso" />
        )}
      </button>

      {/* Índice editorial desplegable limpio y accesible */}
      {menuOpen && (
        <div
          id="editorial-index-menu"
          className="mt-2.5 w-[min(calc(100dvw-2rem),16.5rem)] max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-sm bg-cream/95 backdrop-blur-md border border-divider/90 shadow-lg px-5 py-3 text-espresso"
        >
          <ul className="flex flex-col divide-y divide-divider/70">
            <li>
              <a
                href="#portada"
                onClick={() => setMenuOpen(false)}
                className="flex items-center min-h-[44px] py-2 text-[11px] uppercase tracking-[0.24em] font-sans font-medium text-burgundy hover:text-espresso transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy rounded-sm"
              >
                Portada · M &amp; G
              </a>
            </li>
            {visibleLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center min-h-[44px] py-2 text-[11px] uppercase tracking-[0.24em] font-sans font-medium text-espresso hover:text-burgundy transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy rounded-sm"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};
