import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useGuest } from '../../context/GuestContext';
import { EVENT_DETAILS, ItineraryMilestone } from '../../config/eventDetails';
import { getEditorialAsset } from '../../config/editorialAssets';
import { BlindEmbossMargins } from '../editorial/BlindEmbossMargins';
import { EditorialSurface } from '../editorial/EditorialSurface';

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface TimelineBlockProps {
  heading: string;
  dateLabel: string;
  items: readonly ItineraryMilestone[];
  testId?: string;
}

const TimelineBlock: React.FC<TimelineBlockProps> = ({
  heading,
  dateLabel,
  items,
  testId,
}) => (
  <div data-testid={testId} className="w-full max-w-xl mx-auto">
    <div className="text-center mb-12">
      <p className="text-xs uppercase tracking-[0.24em] text-olive editorial-letterpress font-sans font-medium">
        {dateLabel}
      </p>
      <h3 className="mt-2 font-display text-2xl sm:text-3xl text-espresso editorial-letterpress font-normal tracking-wide">
        {heading}
      </h3>
    </div>

    {/* Composición editorial vertical: hora vertical a la izquierda, filete 1px, momento en caligrafía a la derecha */}
    <ol className="space-y-9 sm:space-y-11 text-left">
      {items.map((item) => (
        <li
          key={item.id}
          className="grid grid-cols-[2.75rem_1px_1fr] items-stretch gap-5 sm:gap-7"
        >
          {/* Hora vertical tabular-nums */}
          <div className="flex items-center justify-center py-1">
            <span className="editorial-vertical-time tabular-nums text-[11px] uppercase tracking-[0.24em] text-mocha font-sans font-medium whitespace-nowrap">
              {item.time} hrs
            </span>
          </div>

          {/* Línea divisoria vertical 1px marcada en cuño seco */}
          <div aria-hidden="true" className="w-px editorial-debossed-rule-y self-stretch" />

          {/* Momento en Pinyon Script y descripción limpia */}
          <div className="py-0.5 flex flex-col justify-center">
            <h4 className="font-script text-3xl sm:text-[2.25rem] text-espresso editorial-engraving font-normal leading-tight">
              {item.title}
            </h4>
            <p className="mt-1.5 font-sans text-xs sm:text-sm text-mocha tracking-wide leading-relaxed">
              {item.description}
            </p>
            {item.locationHint && (
              <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-olive font-sans font-medium">
                {item.locationHint}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  </div>
);

export const ItinerarySection: React.FC = () => {
  const { guest } = useGuest();
  const prefersReducedMotion = useReducedMotion();
  const [curtainsFailed, setCurtainsFailed] = useState(false);

  const curtainsAsset = getEditorialAsset('itineraryCurtains');
  const curtainsSrc = !curtainsFailed ? curtainsAsset.resolvedSrc : null;

  return (
    <EditorialSurface
      as="section"
      variant="paper-ivory"
      sideDecoration={<BlindEmbossMargins />}
      id="itinerario"
      className="w-full py-20 md:py-28 px-4 sm:px-6 scroll-mt-16"
      contentClassName="w-full max-w-3xl mx-auto"
    >
      {curtainsSrc && (
        <img
          src={curtainsSrc}
          alt=""
          aria-hidden="true"
          width={curtainsAsset.recommendedDimensions.width}
          height={curtainsAsset.recommendedDimensions.height}
          loading="lazy"
          decoding="async"
          onError={() => setCurtainsFailed(true)}
          className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover object-center opacity-20"
        />
      )}

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
        <p className="text-xs uppercase tracking-[0.24em] text-mocha editorial-letterpress font-sans font-medium">
          Programa de Celebración
        </p>
        <h2 className="mt-3 font-script text-5xl md:text-6xl text-espresso editorial-engraving font-normal leading-tight">
          Itinerario
        </h2>
        <div aria-hidden="true" className="mt-5 w-px h-10 editorial-debossed-rule-y mx-auto" />

        <div className="mt-12 w-full">
          {/* Bloque exclusivo Tier A: Viernes 16 de Julio */}
          {guest.tier === 'A' && (
            <>
              <TimelineBlock
                heading={EVENT_DETAILS.itinerary.friday.heading}
                dateLabel={EVENT_DETAILS.itinerary.friday.dateLabel}
                items={EVENT_DETAILS.itinerary.friday.items}
                testId="tier-a-friday-itinerary"
              />

              {/* Separador editorial presente únicamente cuando existen ambos días (Tier A) */}
              <div
                aria-hidden="true"
                className="my-14 w-px h-12 editorial-debossed-rule-y mx-auto"
              />
            </>
          )}

          {/* Bloque Universal: Sábado 17 de Julio */}
          <TimelineBlock
            heading={EVENT_DETAILS.itinerary.saturday.heading}
            dateLabel={EVENT_DETAILS.itinerary.saturday.dateLabel}
            items={EVENT_DETAILS.itinerary.saturday.items}
            testId="saturday-itinerary"
          />
        </div>
      </motion.div>
    </EditorialSurface>
  );
};
