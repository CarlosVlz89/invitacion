import React, { useEffect, useId, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { getEditorialAsset } from '../../config/editorialAssets';

export interface EditorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}

function isPointerOutsideDialog(
  event: PointerEvent,
  dialog: HTMLDialogElement,
): boolean {
  const rect = dialog.getBoundingClientRect();
  return (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  );
}

export const EditorialModal: React.FC<EditorialModalProps> = ({
  isOpen,
  onClose,
  title,
  eyebrow,
  children,
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const [frameFailed, setFrameFailed] = useState(false);

  const frameAsset = getEditorialAsset('botanicalCardFrame');
  const frameSrc = !frameFailed ? frameAsset.resolvedSrc : null;

  // Configurar light-dismiss nativo (closedby="any") cuando el navegador lo soporta
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.setAttribute('closedby', 'any');
  }, []);

  // Sincronizar estado controlado React con <dialog>.showModal() / .close()
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus({ preventScroll: true });
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Sincronizar cierre nativo (tecla Escape o closedby="any") y fallback de clic fuera para Safari
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.returnValue = '';
      onClose();
    };

    dialog.addEventListener('close', handleClose);

    // Fallback de light-dismiss por coordenadas cuando closedBy no está soportado (ej. Safari)
    let cleanupOutsideClick: (() => void) | undefined;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      let pressedOutside = false;

      const handlePointerDown = (event: PointerEvent) => {
        pressedOutside = isPointerOutsideDialog(event, dialog);
      };

      const handlePointerUp = (event: PointerEvent) => {
        if (pressedOutside && isPointerOutsideDialog(event, dialog)) {
          dialog.close();
        }
        pressedOutside = false;
      };

      dialog.addEventListener('pointerdown', handlePointerDown);
      dialog.addEventListener('pointerup', handlePointerUp);

      cleanupOutsideClick = () => {
        dialog.removeEventListener('pointerdown', handlePointerDown);
        dialog.removeEventListener('pointerup', handlePointerUp);
      };
    }

    return () => {
      dialog.removeEventListener('close', handleClose);
      cleanupOutsideClick?.();
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="editorial-dialog w-[calc(100%-2rem)] max-w-md rounded-sm border border-divider bg-card text-espresso p-0 editorial-letterpress-shadow overflow-x-hidden overflow-y-auto backdrop:bg-burgundy-hover/55"
    >
      <div className="relative px-7 py-10 sm:px-10 sm:py-12 editorial-paper-grain overflow-hidden">
        {/* Textura botánica perimetral coherente con la tarjeta letterpress de RSVP */}
        {frameSrc && (
          <>
            <img
              src={frameSrc}
              alt=""
              aria-hidden="true"
              width={frameAsset.recommendedDimensions.width}
              height={frameAsset.recommendedDimensions.height}
              loading="lazy"
              decoding="async"
              onError={() => setFrameFailed(true)}
              className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover object-center opacity-75"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-card/30"
            />
          </>
        )}

        {/* Doble filete interior fino 1px de papelería editorial */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2.5 sm:inset-3.5 border border-divider/90 rounded-[2px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3.5 sm:inset-[18px] border border-divider/45 rounded-[1px]"
        />

        {/* Botón de cierre minimalista sin círculo pesado (mínimo 44x44px accesible) */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Cerrar ventana"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 min-w-[44px] min-h-[44px] flex items-center justify-center text-mocha hover:text-burgundy transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy rounded-sm"
        >
          <X aria-hidden="true" strokeWidth={1.35} className="w-5 h-5" />
        </button>

        {/* Encabezado Centrado de Tarjeta de Papelería */}
        <div className="relative z-10">
          <div className="flex flex-col items-center text-center pt-1 pb-6">
            {eyebrow && (
              <p className="text-[11px] uppercase tracking-[0.24em] text-mocha font-sans font-medium">
                {eyebrow}
              </p>
            )}
            <h1
              id={titleId}
              className="mt-2 font-script text-4xl sm:text-5xl leading-tight text-espresso font-normal px-4"
            >
              {title}
            </h1>
            <div aria-hidden="true" className="mt-3.5 w-px h-7 bg-divider mx-auto" />
          </div>

          <div>{children}</div>
        </div>
      </div>
    </dialog>
  );
};
