import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useGuest } from '../../context/GuestContext';
import { EVENT_DETAILS, VenueDetail } from '../../config/eventDetails';
import { getEditorialAsset } from '../../config/editorialAssets';
import { EditorialSurface } from '../editorial/EditorialSurface';

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface VenueEditorialBlockProps {
  venue: VenueDetail;
  featured?: boolean;
}

const VenueEditorialBlock: React.FC<VenueEditorialBlockProps> = ({
  venue,
  featured = false,
}) => (
  <article
    className={`flex flex-col justify-between text-center ${
      featured
        ? 'max-w-xl mx-auto py-10 md:py-12 px-2 sm:px-6'
        : 'py-10 md:py-12 px-2 sm:px-6 md:px-9'
    }`}
  >
    <div className="flex flex-col items-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-olive font-sans font-medium">
        {venue.tag}
      </p>

      <h3 className="mt-3 font-display text-2xl sm:text-[1.95rem] text-espresso font-normal leading-tight">
        {venue.title}
      </h3>

      <div aria-hidden="true" className="my-4 w-8 h-px bg-divider" />

      <div className="space-y-1 text-xs sm:text-sm font-sans text-mocha tracking-wide">
        <p className="text-espresso font-medium">{venue.dateLabel}</p>
        <p className="tabular-nums">{venue.timeLabel}</p>
      </div>

      <div className="mt-5 space-y-1.5 max-w-sm">
        <p className="font-display text-lg sm:text-xl text-espresso font-medium">
          {venue.venueName}
        </p>
        <p className="font-sans text-xs sm:text-[13px] text-mocha tracking-wide leading-relaxed">
          {venue.address}
        </p>
        {venue.note && (
          <p className="pt-2 font-sans text-xs text-mocha italic leading-relaxed">
            {venue.note}
          </p>
        )}
      </div>
    </div>

    <div className="mt-7 flex justify-center">
      <a
        href={venue.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center min-h-[44px] border-b border-espresso/45 pb-1 text-xs uppercase tracking-[0.22em] text-espresso hover:border-burgundy hover:text-burgundy transition-colors font-sans font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
      >
        Ver ubicación
      </a>
    </div>
  </article>
);

export const VenueSection: React.FC = () => {
  const { guest } = useGuest();
  const prefersReducedMotion = useReducedMotion();
  const [engravingFailed, setEngravingFailed] = useState(false);

  const engravingAsset = getEditorialAsset('venueEngraving');
  const engravingSrc = !engravingFailed ? engravingAsset.resolvedSrc : null;

  return (
    <EditorialSurface
      as="section"
      variant="paper-ivory"
      id="ubicacion"
      className="w-full py-20 md:py-28 px-4 sm:px-6 scroll-mt-16"
      contentClassName="w-full max-w-3xl mx-auto"
    >
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.7,
          ease: EDITORIAL_EASE,
        }}
        className="flex flex-col items-center text-center"
      >
        <p className="text-xs uppercase tracking-[0.24em] text-mocha font-sans font-medium">
          Dónde y Cuándo
        </p>
        <h2 className="mt-3 font-script text-5xl md:text-6xl text-espresso font-normal leading-tight">
          Ubicaciones
        </h2>
        <div aria-hidden="true" className="mt-5 w-px h-10 bg-divider mx-auto" />

        {/* Grabado arquitectónico raster real: se omite limpiamente cuando el archivo no existe */}
        {engravingSrc && (
          <figure className="mt-10 w-full max-w-lg aspect-[4/3] border border-divider p-2.5 bg-card/90">
            <div className="w-full h-full border border-divider/70 overflow-hidden">
              <img
                src={engravingSrc}
                alt={engravingAsset.alt}
                width={engravingAsset.recommendedDimensions.width}
                height={engravingAsset.recommendedDimensions.height}
                loading="lazy"
                decoding="async"
                onError={() => setEngravingFailed(true)}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </figure>
        )}

        <div className="mt-10 w-full">
          {/* Bloque exclusivo Tier A: Ceremonia Civil y Brindis (Viernes 16) */}
          {guest.tier === 'A' && (
            <div
              className="w-full border-t border-divider"
              data-testid="tier-a-civil-venue"
            >
              <VenueEditorialBlock
                venue={EVENT_DETAILS.venues.fridayCivil}
                featured
              />
            </div>
          )}

          {/* Bloques Universales del Sábado 17 separados por filetes finos 1px */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 border-y border-divider divide-y md:divide-y-0 md:divide-x divide-divider">
            <VenueEditorialBlock venue={EVENT_DETAILS.venues.saturdayCeremony} />
            <VenueEditorialBlock venue={EVENT_DETAILS.venues.saturdayReception} />
          </div>
        </div>
      </motion.div>
    </EditorialSurface>
  );
};
