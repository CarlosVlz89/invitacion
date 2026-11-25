import React, { useId, useState } from 'react';
import { useGuest } from '../../context/GuestContext';
import { buildGuestHelpWhatsAppUrl } from '../../services/whatsappService';
import { sanitizeText } from '../../utils/sanitize';
import { EditorialModal } from '../common/EditorialModal';
import { useToast } from '../common/ToastProvider';

export interface GuestLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuestLookupModal: React.FC<GuestLookupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { resolveGuestByCode } = useGuest();
  const { showToast } = useToast();

  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [requesterName, setRequesterName] = useState('');

  const codeFieldId = useId();
  const codeErrorId = useId();
  const requesterNameId = useId();

  const handleClose = () => {
    setCodeError(null);
    onClose();
  };

  const handleCodeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanedCode = sanitizeText(codeInput, 80);

    if (cleanedCode.length === 0) {
      setCodeError('Por favor ingresa el código o folio de tu invitación.');
      return;
    }

    const found = resolveGuestByCode(cleanedCode);
    if (!found) {
      // Mensaje elegante que nunca expone códigos ni nombres existentes
      setCodeError(
        'No encontramos una invitación con ese código. Verifica tu enlace o solicítalo por WhatsApp.',
      );
      return;
    }

    setCodeInput('');
    setCodeError(null);
    onClose();
    showToast('¡Bienvenido! Tu invitación personalizada está lista.', 'olive');
  };

  const helpWhatsAppUrl = buildGuestHelpWhatsAppUrl(requesterName);

  return (
    <EditorialModal
      isOpen={isOpen}
      onClose={handleClose}
      eyebrow="Acceso Personalizado"
      title="Encuentra tu Invitación"
    >
      <div className="space-y-7 text-center">
        <form onSubmit={handleCodeSubmit} noValidate className="space-y-5">
          <p className="font-sans text-xs sm:text-[13px] text-mocha tracking-wide leading-relaxed">
            Ingresa el folio o código incluido en tu mensaje de invitación para cargar tus pases reservados.
          </p>

          <div className="text-left">
            <label
              htmlFor={codeFieldId}
              className="block text-[11px] uppercase tracking-[0.22em] text-espresso font-sans font-medium mb-1"
            >
              Código o folio de invitación
            </label>
            <input
              id={codeFieldId}
              name="guestCode"
              type="text"
              value={codeInput}
              onChange={(event) => {
                setCodeInput(event.target.value);
                if (codeError) setCodeError(null);
              }}
              placeholder="Ej. GM-001"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              enterKeyHint="go"
              aria-invalid={codeError ? 'true' : 'false'}
              aria-describedby={codeError ? codeErrorId : undefined}
              className={`w-full min-h-[48px] px-1 py-2.5 rounded-none border-0 border-b bg-transparent text-base text-espresso font-sans tracking-wide placeholder:text-muted focus:border-burgundy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy ${
                codeError ? 'border-burgundy' : 'border-muted'
              }`}
            />
            {codeError && (
              <p
                id={codeErrorId}
                className="mt-1.5 font-sans text-xs text-burgundy leading-relaxed"
              >
                {codeError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-6 py-3.5 min-h-[48px] rounded-sm bg-burgundy text-cream hover:bg-burgundy-hover transition-colors text-[11px] uppercase tracking-[0.24em] font-sans font-medium shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
          >
            Cargar mi invitación
          </button>
        </form>

        <div aria-hidden="true" className="flex items-center gap-4 px-6">
          <span className="h-px flex-1 bg-divider" />
          <span className="text-[11px] uppercase tracking-[0.26em] text-mocha font-sans">
            o
          </span>
          <span className="h-px flex-1 bg-divider" />
        </div>

        <div className="space-y-4">
          <p className="font-sans text-xs text-mocha tracking-wide leading-relaxed">
            ¿No tienes tu enlace a la mano? Escribe tu nombre y solicítanos tu invitación personalizada.
          </p>

          <div className="text-left">
            <label
              htmlFor={requesterNameId}
              className="block text-[11px] uppercase tracking-[0.22em] text-espresso font-sans font-medium mb-1"
            >
              Tu nombre completo (opcional)
            </label>
            <input
              id={requesterNameId}
              name="requesterName"
              type="text"
              autoComplete="name"
              value={requesterName}
              onChange={(event) => setRequesterName(event.target.value)}
              placeholder="Ej. Ana Sofía Morales"
              className="w-full min-h-[48px] px-1 py-2.5 rounded-none border-0 border-b border-muted bg-transparent text-base text-espresso font-sans tracking-wide placeholder:text-muted focus:border-burgundy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
            />
          </div>

          <div className="pt-1">
            <a
              href={helpWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[44px] border-b border-olive/60 pb-1 text-xs uppercase tracking-[0.2em] text-olive hover:border-burgundy hover:text-burgundy transition-colors font-sans font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive"
            >
              Solicitar mi invitación por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </EditorialModal>
  );
};
