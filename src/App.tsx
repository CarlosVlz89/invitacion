import React, { useState } from 'react';
import { GuestProvider, useGuest } from './context/GuestContext';
import { ToastProvider } from './components/common/ToastProvider';
import { EditorialNav } from './components/common/EditorialNav';
import { FloatingAudioPlayer } from './components/common/FloatingAudioPlayer';
import { WaxSealEntrance } from './components/editorial/WaxSealEntrance';
import { HeroSection } from './components/editorial/HeroSection';
import { CountdownBand } from './components/editorial/CountdownBand';
import { EditorialSurface } from './components/editorial/EditorialSurface';
import { EditorialPhotoDivider } from './components/editorial/EditorialPhotoDivider';
import { MonogramMG } from './components/editorial/MonogramMG';
import { VenueSection } from './components/logistics/VenueSection';
import { ItinerarySection } from './components/itinerary/ItinerarySection';
import { DressCodeSection } from './components/dresscode/DressCodeSection';
import { LodgingSection } from './components/logistics/LodgingSection';
import { GiftsSection } from './components/gifts/GiftsSection';
import { RsvpSection } from './components/rsvp/RsvpSection';
import { GuestLookupModal } from './components/rsvp/GuestLookupModal';

const EditorialExperience: React.FC = () => {
  const { guest, guestLookupError, isOpened, audioUnlocked, isPlaying } =
    useGuest();
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);

  const footerDateLabel =
    guest.tier === 'A'
      ? '16 & 17 de Julio, 2027'
      : 'Sábado 17 de Julio, 2027';

  return (
    <div
      data-audio-unlocked={audioUnlocked ? 'true' : 'false'}
      data-audio-playing={isPlaying ? 'true' : 'false'}
      data-envelope-opened={isOpened ? 'true' : 'false'}
      data-guest-tier={guest.tier}
      className="min-h-screen bg-cream text-espresso selection:bg-burgundy selection:text-cream"
    >
      {/* Capa de Bienvenida C00: Sobre Editorial 3D + Doble Hoja Vellum */}
      <WaxSealEntrance />

      {/* Navegación Editorial Discreta (visible tras abrir el sobre) */}
      <EditorialNav />

      {/* Aviso sutil si la URL traía un ?guest=ID inexistente (mantiene vista Tier B genérica) */}
      {isOpened && guestLookupError && (
        <div
          role="status"
          data-testid="guest-lookup-notice"
          className="w-full bg-card/95 border-b border-divider/85 px-4 pt-20 pb-3.5"
        >
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
            <p className="font-sans text-xs text-moka tracking-wide">
              No logramos identificar tu código de enlace. Estás viendo la invitación general.
            </p>
            <button
              type="button"
              onClick={() => setIsLookupModalOpen(true)}
              className="shrink-0 inline-flex items-center justify-center min-h-[44px] border-b border-burgundy/60 pb-0.5 text-burgundy hover:border-espresso hover:text-espresso transition-colors text-[11px] uppercase tracking-[0.22em] font-sans font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
            >
              Ingresar mi código
            </button>
          </div>
        </div>
      )}

      {/* Experiencia Editorial Principal (inert mientras el sobre permanece cerrado) */}
      <main className="relative" inert={!isOpened}>
        <HeroSection />
        <CountdownBand />
        <VenueSection />
        <ItinerarySection />
        <EditorialPhotoDivider />
        <DressCodeSection />
        <LodgingSection />
        <GiftsSection />
        <RsvpSection onOpenLookup={() => setIsLookupModalOpen(true)} />
      </main>

      {/* Footer Editorial en Deep Burgundy (#4F141C) */}
      <footer inert={!isOpened}>
        <EditorialSurface
          as="div"
          variant="relief-dark"
          textureAssetKey="countdownReliefBg"
          className="w-full border-b-0"
          contentClassName="py-14 px-4 text-center flex flex-col items-center"
        >
          <MonogramMG
            className="w-14 h-14 text-cream/95 mb-3"
            decorative
          />
          <p className="font-script text-4xl text-cream leading-none">
            Montse &amp; Gerardo
          </p>
          <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-cream/85 font-sans">
            {footerDateLabel}
          </p>
        </EditorialSurface>
      </footer>

      {/* Modal de Búsqueda de Código / Contacto para Invitados No Identificados */}
      <GuestLookupModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
      />

      {/* Reproductor Flotante de Audio Ambiental */}
      <FloatingAudioPlayer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <GuestProvider>
        <EditorialExperience />
      </GuestProvider>
    </ToastProvider>
  );
};

export default App;
