import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { EVENT_DETAILS } from '../../config/eventDetails';
import { copyToClipboard } from '../../utils/clipboard';
import { useToast } from '../common/ToastProvider';
import { EditorialModal } from '../common/EditorialModal';
import { EditorialSurface } from '../editorial/EditorialSurface';

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const GiftsSection: React.FC = () => {
  const { showToast } = useToast();
  const prefersReducedMotion = useReducedMotion();

  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [clabeCopied, setClabeCopied] = useState(false);

  const { gifts } = EVENT_DETAILS;
  const { bankTransfer } = gifts;

  const handleCopyClabe = async () => {
    const ok = await copyToClipboard(bankTransfer.clabe);
    if (ok) {
      setClabeCopied(true);
      showToast('CLABE copiada al portapapeles', 'olive');
      window.setTimeout(() => {
        setClabeCopied(false);
      }, 2600);
    } else {
      showToast(
        'No fue posible copiar la CLABE. Por favor selecciónala manualmente.',
        'burgundy',
      );
    }
  };

  return (
    <EditorialSurface
      as="section"
      variant="paper-ivory"
      id="regalos"
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
        <p className="text-xs uppercase tracking-[0.24em] text-mocha editorial-letterpress font-sans font-medium">
          Detalle de Bodas
        </p>
        <h2 className="mt-3 font-script text-5xl md:text-6xl text-espresso editorial-engraving font-normal leading-tight">
          Mesa de Regalos
        </h2>
        <div aria-hidden="true" className="mt-5 w-px h-10 editorial-debossed-rule-y mx-auto" />

        <p className="mt-6 max-w-xl font-sans text-xs sm:text-sm text-mocha tracking-wide leading-relaxed">
          {gifts.introNote}
        </p>

        {/* Lista Editorial Sobria de Mesas de Regalos con Enlaces Subrayados 1px */}
        <ul className="mt-10 w-full border-y border-divider divide-y divide-divider text-left">
          {gifts.registries.map((registry) => (
            <li
              key={registry.id}
              className="py-6 sm:py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="space-y-1">
                <h3 className="font-display text-2xl sm:text-[1.75rem] text-espresso editorial-letterpress font-normal leading-snug">
                  {registry.storeName}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-sans text-xs text-mocha tracking-wide">
                    {registry.subtitle}
                  </span>
                  {registry.eventNumber && (
                    <>
                      <span aria-hidden="true" className="text-divider">
                        ·
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.18em] text-olive font-sans font-medium tabular-nums">
                        {registry.eventNumber}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <a
                href={registry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start sm:self-center inline-flex items-center justify-center min-h-[44px] border-b border-espresso/45 pb-1 text-xs uppercase tracking-[0.22em] text-espresso hover:border-burgundy hover:text-burgundy transition-colors font-sans font-medium shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
              >
                Ver mesa
              </a>
            </li>
          ))}
        </ul>

        {/* Bloque Centrado Elegante: Lluvia de Sobres / Transferencia Bancaria */}
        <div className="mt-12 flex flex-col items-center max-w-md">
          <p className="text-[11px] uppercase tracking-[0.28em] text-olive editorial-letterpress font-sans font-medium">
            Lluvia de Sobres
          </p>
          <p className="mt-2.5 font-sans text-xs sm:text-sm text-mocha tracking-wide leading-relaxed">
            También agradecemos con el corazón sus buenos deseos en lluvia de sobres o transferencia bancaria.
          </p>
          <button
            type="button"
            onClick={() => setIsBankModalOpen(true)}
            className="mt-5 inline-flex items-center justify-center min-h-[44px] border-b border-burgundy/65 pb-1 text-xs uppercase tracking-[0.22em] text-burgundy hover:border-espresso hover:text-espresso transition-colors font-sans font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
          >
            Lluvia de Sobres / Transferencia Bancaria
          </button>
        </div>
      </motion.div>

      {/* Modal Editorial con Datos Bancarios y Botón Copiar CLABE */}
      <EditorialModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        eyebrow="Lluvia de Sobres"
        title="Transferencia Bancaria"
      >
        <div className="space-y-4 text-left">
          <dl className="divide-y divide-divider/75 border-y border-divider/75">
            <div className="py-3 flex items-baseline justify-between gap-4">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-mocha font-sans">
                Banco
              </dt>
              <dd className="font-sans text-sm text-espresso font-medium text-right">
                {bankTransfer.banco}
              </dd>
            </div>

            <div className="py-3 flex items-baseline justify-between gap-4">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-mocha font-sans">
                Beneficiario
              </dt>
              <dd className="font-sans text-sm text-espresso font-medium text-right">
                {bankTransfer.beneficiario}
              </dd>
            </div>

            <div className="py-3 flex items-baseline justify-between gap-4">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-mocha font-sans">
                Cuenta
              </dt>
              <dd className="font-sans text-sm text-espresso font-medium tabular-nums text-right">
                {bankTransfer.cuenta}
              </dd>
            </div>

            <div className="py-3.5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-mocha font-sans">
                CLABE Interbancaria (18 dígitos)
              </dt>
              <dd className="mt-1.5 px-3 py-2.5 border-b border-divider bg-cream/65 font-sans text-sm sm:text-base tracking-[0.12em] text-espresso font-semibold tabular-nums text-center select-all">
                {bankTransfer.clabeFormatted}
              </dd>
            </div>
          </dl>

          <p className="font-sans text-xs text-mocha tracking-wide leading-relaxed">
            {bankTransfer.referenceNote}
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleCopyClabe}
              className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-sm text-cream transition-colors text-[11px] uppercase tracking-[0.22em] font-sans font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
                clabeCopied
                  ? 'bg-olive hover:bg-olive/90 focus-visible:outline-olive'
                  : 'bg-burgundy hover:bg-burgundy-hover focus-visible:outline-burgundy'
              }`}
            >
              {clabeCopied ? (
                <>
                  <Check aria-hidden="true" className="w-4 h-4" />
                  <span>CLABE copiada</span>
                </>
              ) : (
                <>
                  <Copy aria-hidden="true" className="w-4 h-4" />
                  <span>Copiar CLABE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </EditorialModal>
    </EditorialSurface>
  );
};
