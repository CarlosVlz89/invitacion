import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EVENT_DETAILS } from '../../config/eventDetails';
import { getEditorialAsset } from '../../config/editorialAssets';
import { BlindEmbossMargins } from '../editorial/BlindEmbossMargins';
import { EditorialSurface } from '../editorial/EditorialSurface';

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const DressCodeSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [sketchFailed, setSketchFailed] = useState(false);

  const sketchAsset = getEditorialAsset('dressCodeSketch');
  const sketchSrc = !sketchFailed ? sketchAsset.resolvedSrc : null;
  const { dressCode } = EVENT_DETAILS;

  return (
    <EditorialSurface
      as="section"
      variant="paper-ivory"
      sideDecoration={<BlindEmbossMargins />}
      id="vestimenta"
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
        <p className="text-xs uppercase tracking-[0.24em] text-olive editorial-letterpress font-sans font-medium">
          {dressCode.badgeLabel}
        </p>
        <h2 className="mt-3 font-script text-5xl md:text-6xl text-espresso editorial-engraving font-normal leading-tight">
          {dressCode.title}
        </h2>
        <div aria-hidden="true" className="mt-5 w-px h-10 editorial-debossed-rule-y mx-auto" />
        <p className="mt-5 font-display text-lg sm:text-xl italic text-mocha editorial-letterpress">
          {dressCode.subtitle}
        </p>

        {/* Ilustración editorial raster opcional: se omite limpiamente cuando no existe */}
        {sketchSrc && (
          <figure className="mt-10 w-[200px] sm:w-[228px] aspect-[4/5] border border-divider p-2 bg-card/90">
            <div className="w-full h-full border border-divider/70 overflow-hidden">
              <img
                src={sketchSrc}
                alt={sketchAsset.alt}
                width={sketchAsset.recommendedDimensions.width}
                height={sketchAsset.recommendedDimensions.height}
                loading="lazy"
                decoding="async"
                onError={() => setSketchFailed(true)}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </figure>
        )}

        {/* Prosa Editorial Concisa y Centrada (sin cajas pesadas) */}
        <div className="mt-10 max-w-lg space-y-6">
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.26em] text-espresso editorial-letterpress font-sans font-medium">
              Damas
            </h3>
            <p className="mt-2 font-sans text-xs sm:text-sm text-mocha tracking-wide leading-relaxed">
              {dressCode.womenGuidance}
            </p>
          </div>

          <div aria-hidden="true" className="w-10 h-px editorial-debossed-rule-x mx-auto" />

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.26em] text-espresso editorial-letterpress font-sans font-medium">
              Caballeros
            </h3>
            <p className="mt-2 font-sans text-xs sm:text-sm text-mocha tracking-wide leading-relaxed">
              {dressCode.menGuidance}
            </p>
          </div>
        </div>

        {/* Tira Horizontal de Muestras de Tela / Color (evocando retazos de seda y lino) */}
        <div className="mt-12 w-full max-w-xl flex flex-col items-center">
          <p className="text-[11px] uppercase tracking-[0.26em] text-mocha editorial-letterpress font-sans font-medium mb-6">
            Paleta de Inspiración
          </p>

          <ul className="w-full grid grid-cols-5 gap-2 sm:gap-3">
            {dressCode.suggestedPalette.map((swatch) => (
              <li
                key={swatch.name}
                className="flex flex-col items-center gap-2.5"
              >
                <span
                  aria-hidden="true"
                  className={`w-full h-24 sm:h-32 border border-divider/70 editorial-swatch-silk shadow-sm ${swatch.swatchClass}`}
                />
                <span className="text-[10px] tracking-[0.16em] uppercase text-mocha font-sans">
                  {swatch.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 max-w-md font-display italic text-sm sm:text-base text-mocha leading-relaxed">
          {dressCode.reservedColorNote}
        </p>
      </motion.div>
    </EditorialSurface>
  );
};
