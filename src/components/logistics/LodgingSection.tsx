import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useGuest } from '../../context/GuestContext';
import { EVENT_DETAILS } from '../../config/eventDetails';
import { getEditorialAsset } from '../../config/editorialAssets';
import { copyToClipboard } from '../../utils/clipboard';
import { useToast } from '../common/ToastProvider';
import { EditorialSurface } from '../editorial/EditorialSurface';

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Representación vectorial nítida de código QR interactivo que enlaza
 * directamente al motor de reservas del Hotel Sede (solo Tier A).
 */
const HostHotelQrMatrix: React.FC = () => (
  <svg
    viewBox="0 0 21 21"
    shapeRendering="crispEdges"
    aria-hidden="true"
    className="w-32 h-32 sm:w-36 sm:h-36 text-espresso"
  >
    <rect width="21" height="21" fill="#FAF7F1" />
    <path
      fill="currentColor"
      d="M1 1h7v7H1V1zm1 1v5h5V2H2zm1 1h3v3H3V3z"
    />
    <path
      fill="currentColor"
      d="M13 1h7v7h-7V1zm1 1v5h5V2h-5zm1 1h3v3h-3V3z"
    />
    <path
      fill="currentColor"
      d="M1 13h7v7H1v-7zm1 1v5h5v-5H2zm1 1h3v3H3v-3z"
    />
    <path
      fill="currentColor"
      d="M9 1h1v2H9V1zm2 1h1v1h-1V2zM9 4h2v1H9V4zm0 2h1v2H9V6zm2 1h1v2h-1V7zM1 9h2v1H1V9zm3 0h2v1H4V9zm3 0h2v2H7V9zm3 1h3v1h-3v-1zm4-1h2v1h-2V9zm3 0h3v1h-3V9zM2 11h1v1H2v-1zm3 0h1v1H5v-1zm4 1h2v1H9v-1zm3-1h2v2h-2v-2zm3 1h2v1h-2v-1zm3-1h2v2h-2v-2zM9 14h2v2H9v-2zm3 0h1v3h-1v-3zm2 1h2v1h-2v-1zm3-1h3v2h-3v-2zM9 17h1v3H9v-3zm2 1h2v2h-2v-2zm3-1h2v3h-2v-3zm3 1h2v2h-2v-2z"
    />
    <rect x="9.5" y="9.5" width="2" height="2" fill="#4F141C" />
  </svg>
);

export const LodgingSection: React.FC = () => {
  const { guest } = useGuest();
  const { showToast } = useToast();
  const prefersReducedMotion = useReducedMotion();

  const [stampFailed, setStampFailed] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const stampAsset = getEditorialAsset('logisticsStamp');
  const stampSrc = !stampFailed ? stampAsset.resolvedSrc : null;

  const handleCopyCode = async (code: string, toastMessage: string) => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopiedCode(code);
      showToast(toastMessage, 'olive');
      window.setTimeout(() => {
        setCopiedCode((current) => (current === code ? null : current));
      }, 2400);
    } else {
      showToast(
        'No fue posible copiar automáticamente. Selecciona el código manualmente.',
        'burgundy',
      );
    }
  };

  return (
    <EditorialSurface
      as="section"
      variant="paper-ivory"
      id="hospedaje"
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
        {stampSrc && (
          <div
            className="mb-5 w-20 h-20 sm:w-24 sm:h-24 aspect-square flex items-center justify-center"
            aria-hidden="true"
          >
            <img
              src={stampSrc}
              alt=""
              width={stampAsset.recommendedDimensions.width}
              height={stampAsset.recommendedDimensions.height}
              loading="lazy"
              decoding="async"
              onError={() => setStampFailed(true)}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        <p className="text-xs uppercase tracking-[0.24em] text-mocha editorial-letterpress font-sans font-medium">
          Logística y Estancia
        </p>
        <h2 className="mt-3 font-script text-5xl md:text-6xl text-espresso editorial-engraving font-normal leading-tight">
          Hospedaje
        </h2>
        <div aria-hidden="true" className="mt-5 w-px h-10 editorial-debossed-rule-y mx-auto" />

        {/* Aislamiento Estricto Tier A (Hotel Sede + QR) vs Tier B (Directorio Editorial de Convenios) */}
        {guest.tier === 'A' ? (
          <article
            className="mt-10 w-full border-y border-divider py-10 sm:py-12"
            data-testid="tier-a-host-hotel"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-9 items-center">
              <div className="md:col-span-7 text-center md:text-left">
                <p className="text-[11px] uppercase tracking-[0.26em] text-olive editorial-letterpress font-sans font-medium">
                  {EVENT_DETAILS.lodging.tierAHostHotel.badgeLabel}
                </p>

                <h3 className="mt-3 font-display text-2xl sm:text-3xl text-espresso editorial-letterpress font-normal leading-tight">
                  {EVENT_DETAILS.lodging.tierAHostHotel.name}
                </h3>

                <p className="mt-2 font-sans text-xs sm:text-sm text-mocha tracking-wide leading-relaxed">
                  {EVENT_DETAILS.lodging.tierAHostHotel.address}
                </p>

                <p className="mt-4 font-sans text-xs sm:text-[13px] text-espresso/90 tracking-wide leading-relaxed">
                  {EVENT_DETAILS.lodging.tierAHostHotel.rateNote}
                </p>

                {/* Código de grupo y enlace subrayado editorial */}
                <div className="mt-6 pt-5 border-t border-divider flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div>
                    <span className="block text-[10px] uppercase tracking-[0.24em] text-mocha font-sans">
                      Código de Grupo
                    </span>
                    <span className="font-display text-xl tracking-[0.14em] text-espresso font-semibold tabular-nums">
                      {EVENT_DETAILS.lodging.tierAHostHotel.groupCode}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopyCode(
                        EVENT_DETAILS.lodging.tierAHostHotel.groupCode,
                        'Código de grupo copiado al portapapeles',
                      )
                    }
                    className="inline-flex items-center justify-center min-h-[44px] border-b border-espresso/45 pb-1 text-xs uppercase tracking-[0.2em] text-espresso hover:border-burgundy hover:text-burgundy transition-colors font-sans font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
                  >
                    {copiedCode === EVENT_DETAILS.lodging.tierAHostHotel.groupCode
                      ? 'Código copiado'
                      : 'Copiar código de grupo'}
                  </button>
                </div>
              </div>

              {/* Bloque QR Interactivo */}
              <div className="md:col-span-5 flex flex-col items-center justify-center pt-8 md:pt-0 border-t md:border-t-0 md:border-l border-divider md:pl-8">
                <a
                  href={EVENT_DETAILS.lodging.tierAHostHotel.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Reservar en Hotel Sede con código de grupo"
                  className="group p-3.5 border border-divider bg-card hover:border-burgundy/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
                >
                  <HostHotelQrMatrix />
                </a>

                <p className="mt-3.5 max-w-[220px] font-sans text-[11px] text-mocha tracking-wide leading-relaxed">
                  {EVENT_DETAILS.lodging.tierAHostHotel.stayNote}
                </p>

                <a
                  href={EVENT_DETAILS.lodging.tierAHostHotel.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center justify-center min-h-[44px] border-b border-burgundy/60 pb-1 text-xs uppercase tracking-[0.22em] text-burgundy hover:border-espresso hover:text-espresso transition-colors font-sans font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
                >
                  Ir al motor de reservas
                </a>
              </div>
            </div>
          </article>
        ) : (
          <div
            className="mt-10 w-full border-y border-divider divide-y divide-divider"
            data-testid="tier-b-partner-hotels"
          >
            {EVENT_DETAILS.lodging.tierBPartnerHotels.map((hotel) => {
              const isCopied = copiedCode === hotel.promoCode;
              return (
                <article
                  key={hotel.id}
                  className="py-7 sm:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-left"
                >
                  <div className="space-y-1.5 md:max-w-md">
                    <p className="text-[10px] uppercase tracking-[0.26em] text-olive editorial-letterpress font-sans font-medium">
                      Convenio Preferencial
                    </p>

                    <h3 className="font-display text-2xl sm:text-[1.75rem] text-espresso editorial-letterpress font-normal leading-snug">
                      {hotel.name}
                    </h3>

                    <p className="font-sans text-xs text-mocha tracking-wide">
                      {hotel.areaAndDistance}
                    </p>

                    <p className="pt-1 font-sans text-xs sm:text-[13px] text-espresso/85 tracking-wide leading-relaxed">
                      {hotel.rateNote}
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-[10px] uppercase tracking-[0.22em] text-mocha font-sans">
                        Código
                      </span>
                      <span className="font-display text-lg tracking-[0.14em] text-espresso font-semibold tabular-nums">
                        {hotel.promoCode}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyCode(
                            hotel.promoCode,
                            'Código promocional copiado al portapapeles',
                          )
                        }
                        className="inline-flex items-center justify-center min-h-[44px] border-b border-espresso/45 pb-1 text-xs uppercase tracking-[0.2em] text-espresso hover:border-burgundy hover:text-burgundy transition-colors font-sans font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
                      >
                        {isCopied ? 'Código copiado' : 'Copiar código'}
                      </button>

                      <a
                        href={hotel.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center min-h-[44px] border-b border-burgundy/60 pb-1 text-xs uppercase tracking-[0.2em] text-burgundy hover:border-espresso hover:text-espresso transition-colors font-sans font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
                      >
                        Reservar
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </motion.div>
    </EditorialSurface>
  );
};
