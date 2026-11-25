import React, {
  useEffect,
  useId,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  PencilLine,
  Users,
  XCircle,
} from 'lucide-react';
import { useGuest } from '../../context/GuestContext';
import { Asistente, Guest, RSVPFormData, RSVPStatus } from '../../types/guest';
import { createRsvpSchema, RsvpFormValues } from '../../types/rsvp';
import {
  buildOptimisticRsvpPreview,
  submitRsvp,
} from '../../services/rsvpService';
import {
  buildGuestHelpWhatsAppUrl,
  buildRsvpWhatsAppUrl,
} from '../../services/whatsappService';
import { useToast } from '../common/ToastProvider';
import { EditorialSurface } from '../editorial/EditorialSurface';

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export interface RsvpSectionProps {
  onOpenLookup: () => void;
}

interface OptimisticRsvpView {
  readonly estatusWeb: RSVPStatus;
  readonly asistentesConfirmados: readonly Asistente[];
  readonly restriccionesDieteticas: string;
  readonly statusCivil?: RSVPStatus;
  readonly mensajeNovios: string;
  readonly whatsappUrl: string;
  readonly isSaving: boolean;
}

function createEmptyAttendee(tier: Guest['tier']): RsvpFormValues['asistentes'][number] {
  return {
    nombreCompleto: '',
    asisteReligiosa: true,
    ...(tier === 'A' ? { asisteCivil: true } : {}),
  };
}

function buildDefaultFormValues(guest: Guest): RsvpFormValues {
  const isDeclined = guest.estatusWeb === 'declinado';
  const existingAttendees = guest.asistentesConfirmados.slice(
    0,
    guest.pasesAsignados,
  );

  const initialAttendees =
    existingAttendees.length > 0
      ? existingAttendees.map((person) => ({
          nombreCompleto: person.nombreCompleto,
          asisteReligiosa: true,
          ...(guest.tier === 'A'
            ? { asisteCivil: Boolean(person.asisteCivil) }
            : {}),
          ...(person.restriccionesDieteticas
            ? { restriccionesDieteticas: person.restriccionesDieteticas }
            : {}),
        }))
      : [createEmptyAttendee(guest.tier)];

  return {
    asistenciaRecepcion: !isDeclined,
    ...(guest.tier === 'A'
      ? { asistenciaCivil: guest.statusCivil !== 'declinado' }
      : {}),
    asistentes: initialAttendees,
    restriccionesDieteticasGenerales: guest.restriccionesDieteticas ?? '',
    mensajeNovios: guest.mensajeNovios ?? '',
  };
}

function buildCommittedView(guest: Guest): OptimisticRsvpView {
  const summaryPayload = {
    estatusWeb: guest.estatusWeb,
    asistentesConfirmados: guest.asistentesConfirmados,
    restriccionesDieteticas: guest.restriccionesDieteticas ?? '',
    statusCivil: guest.tier === 'A' ? guest.statusCivil : undefined,
    mensajeNovios: guest.mensajeNovios ?? '',
  };

  return {
    ...summaryPayload,
    whatsappUrl: buildRsvpWhatsAppUrl(guest, summaryPayload),
    isSaving: false,
  };
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ onOpenLookup }) => {
  const { guest, isGenericGuest, applyGuestRsvpUpdate } = useGuest();
  const { showToast } = useToast();
  const prefersReducedMotion = useReducedMotion();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const dietaryFieldId = useId();
  const dietaryErrorId = useId();
  const messageFieldId = useId();
  const messageErrorId = useId();
  const passCountSelectId = useId();

  const committedView = useMemo(() => buildCommittedView(guest), [guest]);
  const [optimisticView, setOptimisticView] = useOptimistic<
    OptimisticRsvpView,
    OptimisticRsvpView
  >(committedView, (_current, next) => next);

  const schema = useMemo(
    () => createRsvpSchema(guest.pasesAsignados, guest.tier),
    [guest.pasesAsignados, guest.tier],
  );

  const defaultValues = useMemo(() => buildDefaultFormValues(guest), [guest]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onTouched',
    shouldFocusError: true,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'asistentes',
  });

  // Sincronizar formulario si el invitado activo cambia (ej. tras usar GuestLookupModal)
  useEffect(() => {
    reset(buildDefaultFormValues(guest));
    setIsEditing(false);
  }, [guest, reset]);

  const asistenciaRecepcion = watch('asistenciaRecepcion');
  const currentPassCount = Math.min(
    Math.max(fields.length, 1),
    guest.pasesAsignados,
  );

  const handlePassCountChange = (targetCount: number) => {
    const clampedCount = Math.min(
      Math.max(1, targetCount),
      guest.pasesAsignados,
    );

    if (clampedCount > fields.length) {
      for (let i = fields.length; i < clampedCount; i += 1) {
        append(createEmptyAttendee(guest.tier));
      }
    } else if (clampedCount < fields.length) {
      for (let i = fields.length - 1; i >= clampedCount; i -= 1) {
        remove(i);
      }
    }
  };

  const handleAttendanceChoice = (willAttend: boolean) => {
    setValue('asistenciaRecepcion', willAttend, { shouldValidate: false });
    if (willAttend && fields.length === 0) {
      append(createEmptyAttendee(guest.tier));
    }
  };

  const onValidSubmit = (values: RsvpFormValues) => {
    const clampedAttendees: Asistente[] = values.asistenciaRecepcion
      ? values.asistentes.slice(0, guest.pasesAsignados).map((person) => ({
          nombreCompleto: person.nombreCompleto,
          asisteReligiosa: true,
          ...(guest.tier === 'A'
            ? { asisteCivil: Boolean(person.asisteCivil) }
            : {}),
          ...(person.restriccionesDieteticas
            ? { restriccionesDieteticas: person.restriccionesDieteticas }
            : {}),
        }))
      : [];

    const payload: RSVPFormData = {
      guestId: guest.id,
      asistenciaRecepcion: values.asistenciaRecepcion,
      asistentes: clampedAttendees,
      restriccionesDieteticasGenerales: values.restriccionesDieteticasGenerales,
      mensajeNovios: values.mensajeNovios,
      ...(guest.tier === 'A'
        ? {
            asistenciaCivil:
              values.asistenciaRecepcion &&
              clampedAttendees.some((person) => person.asisteCivil === true),
          }
        : {}),
    };

    const preview = buildOptimisticRsvpPreview(guest, payload);

    startTransition(async () => {
      // Transición optimista instantánea (UI de éxito sin pantallas bloqueantes)
      setOptimisticView({
        estatusWeb: preview.estatusWeb,
        asistentesConfirmados: preview.asistentesConfirmados,
        restriccionesDieteticas: preview.restriccionesDieteticas,
        statusCivil: preview.statusCivil,
        mensajeNovios: preview.mensajeNovios,
        whatsappUrl: preview.whatsappUrl,
        isSaving: true,
      });
      setIsEditing(false);

      try {
        const savedResult = await submitRsvp(guest, payload);
        applyGuestRsvpUpdate(savedResult);
        showToast(
          savedResult.estatusWeb === 'confirmado'
            ? '¡Asistencia confirmada! Ya puedes enviar tu resumen por WhatsApp.'
            : 'Hemos registrado tu respuesta con mucho cariño.',
          'olive',
        );
      } catch (error: unknown) {
        // Safe rollback: React 19 revierte optimisticView automáticamente al terminar la transición
        setIsEditing(true);
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'No pudimos guardar tu confirmación. Por favor intenta nuevamente.';
        showToast(errorMessage, 'burgundy');
      }
    });
  };

  const passAllocationCopy =
    guest.pasesAsignados === 1
      ? 'Hemos reservado 1 pase para ti'
      : `Hemos reservado ${guest.pasesAsignados} pases para tu familia`;

  const passOptions = Array.from(
    { length: guest.pasesAsignados },
    (_, idx) => idx + 1,
  );

  const showSummaryView =
    !isGenericGuest && optimisticView.estatusWeb !== 'pendiente' && !isEditing;

  const anyCivilConfirmed =
    guest.tier === 'A' &&
    (optimisticView.statusCivil === 'confirmado' ||
      optimisticView.asistentesConfirmados.some(
        (person) => person.asisteCivil === true,
      ));

  return (
    <EditorialSurface
      as="section"
      variant="paper-ivory"
      id="rsvp"
      className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 scroll-mt-14"
      contentClassName="w-full max-w-2xl mx-auto"
    >
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.7,
          ease: EDITORIAL_EASE,
        }}
      >
        <EditorialSurface
          as="article"
          variant="letterpress-card"
          textureAssetKey="botanicalCardFrame"
          className="w-full"
          contentClassName="px-6 py-10 sm:px-12 sm:py-14"
        >
          {/* Encabezado de Sección RSVP */}
          <div className="flex flex-col items-center text-center mb-8">
            <p className="text-xs uppercase tracking-[0.28em] text-burgundy editorial-letterpress font-sans font-medium">
              RSVP
            </p>
            <h2 className="mt-2 font-script text-5xl md:text-6xl text-espresso editorial-engraving font-normal leading-tight">
              Confirmación de Asistencia
            </h2>
            <div aria-hidden="true" className="mt-4 w-px h-8 editorial-debossed-rule-y mx-auto" />
          </div>

          {/* Rama 1: Invitado Genérico (URL sin ?guest=ID o ID no encontrado) */}
          {isGenericGuest ? (
            <div
              data-testid="rsvp-generic-card"
              className="flex flex-col items-center text-center space-y-6"
            >
              <p className="max-w-md font-sans text-xs sm:text-sm text-mocha tracking-wide leading-relaxed">
                Cada invitación está personalizada con los pases reservados especialmente para tu familia. Ingresa tu código de invitación o contáctanos para recibir tu enlace personal.
              </p>

              <div className="w-full max-w-sm flex flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={onOpenLookup}
                  className="w-full inline-flex items-center justify-center px-6 py-3.5 min-h-[48px] rounded-sm bg-burgundy text-cream hover:bg-burgundy-hover transition-colors text-[11px] uppercase tracking-[0.24em] font-sans font-medium shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
                >
                  Ingresar mi código de invitación
                </button>

                <a
                  href={buildGuestHelpWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center min-h-[44px] border-b border-olive/60 pb-1 text-xs uppercase tracking-[0.2em] text-olive hover:border-burgundy hover:text-burgundy transition-colors font-sans font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive"
                >
                  Contactar a los novios por WhatsApp
                </a>
              </div>
            </div>
          ) : showSummaryView ? (
            /* Rama 2: Vista de Estado Confirmado / Declinado (UI Optimista React 19) */
            <div
              data-testid="rsvp-confirmation-summary"
              data-rsvp-status={optimisticView.estatusWeb}
              className="flex flex-col items-center text-center space-y-6"
            >
              {optimisticView.estatusWeb === 'confirmado' ? (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-olive text-cream text-[11px] uppercase tracking-[0.22em] font-sans font-medium shadow-sm">
                  <CheckCircle2 aria-hidden="true" className="w-4 h-4" />
                  <span>Asistencia confirmada</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-divider bg-cream-deep/65 text-espresso text-[11px] uppercase tracking-[0.22em] font-sans font-medium">
                  <XCircle aria-hidden="true" className="w-4 h-4 text-moka" />
                  <span>Respuesta registrada · No podremos asistir</span>
                </span>
              )}

              <div className="space-y-1.5">
                <p className="font-display text-2xl text-espresso editorial-letterpress font-medium">
                  {guest.nombreInvitacion}
                </p>
                <p className="text-[11px] uppercase tracking-[0.22em] text-moka font-sans tabular-nums">
                  Folio: {guest.id}
                </p>
              </div>

              {optimisticView.estatusWeb === 'confirmado' ? (
                <div className="w-full max-w-md rounded-sm border border-divider bg-cream/70 p-5 text-left space-y-3.5">
                  <div className="flex items-center justify-between border-b border-divider/80 pb-2.5">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-moka font-sans">
                      Pases confirmados
                    </span>
                    <span className="text-xs uppercase tracking-[0.18em] text-olive font-sans font-semibold tabular-nums">
                      {optimisticView.asistentesConfirmados.length} de{' '}
                      {guest.pasesAsignados}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-moka font-sans mb-2">
                      Asistentes registrados
                    </p>
                    <ul className="space-y-1.5">
                      {optimisticView.asistentesConfirmados.map(
                        (person, idx) => (
                          <li
                            key={`${person.nombreCompleto}-${idx}`}
                            className="flex flex-wrap items-center justify-between gap-2 font-sans text-sm text-espresso"
                          >
                            <span className="font-medium">
                              {person.nombreCompleto}
                            </span>
                            {guest.tier === 'A' && (
                              <span className="text-[10px] uppercase tracking-[0.16em] text-olive bg-olive/[0.08] border border-olive/25 px-2.5 py-0.5 rounded-full">
                                {person.asisteCivil
                                  ? 'Civil + Sábado'
                                  : 'Solo Sábado'}
                              </span>
                            )}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  {guest.tier === 'A' && (
                    <div className="pt-2 border-t border-divider/70 flex items-center justify-between text-xs font-sans">
                      <span className="text-moka">
                        Ceremonia Civil (Viernes 16)
                      </span>
                      <span className="font-medium text-olive">
                        {anyCivilConfirmed ? 'Confirmada' : 'No asiste'}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-divider/70 text-xs font-sans">
                    <span className="block text-[10px] uppercase tracking-[0.22em] text-moka mb-1">
                      Restricciones dietéticas
                    </span>
                    <span className="text-espresso">
                      {optimisticView.restriccionesDieteticas.length > 0
                        ? optimisticView.restriccionesDieteticas
                        : 'Ninguna'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="max-w-md font-sans text-xs sm:text-sm text-moka tracking-wide leading-relaxed">
                  Lamentamos que no puedan acompañarnos en esta ocasión. Agradecemos mucho habernos avisado para cuidar cada detalle de la celebración.
                </p>
              )}

              {optimisticView.mensajeNovios.length > 0 && (
                <blockquote className="max-w-md font-display italic text-base text-moka border-l-2 border-divider pl-4 text-left">
                  “{optimisticView.mensajeNovios}”
                </blockquote>
              )}

              {/* Despacho a WhatsApp estandarizado */}
              <div className="w-full max-w-sm flex flex-col items-center gap-3 pt-2">
                <a
                  href={optimisticView.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="rsvp-whatsapp-link"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[48px] rounded-sm bg-burgundy text-cream hover:bg-burgundy-hover transition-colors text-[11px] uppercase tracking-[0.22em] font-sans font-medium shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
                >
                  <MessageCircle aria-hidden="true" className="w-4 h-4" />
                  <span>Enviar confirmación por WhatsApp</span>
                  <ExternalLink aria-hidden="true" className="w-3.5 h-3.5" />
                </a>

                {optimisticView.isSaving && (
                  <p className="text-[11px] uppercase tracking-[0.2em] text-moka font-sans">
                    Sincronizando respuesta…
                  </p>
                )}

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    reset(buildDefaultFormValues(guest));
                    setIsEditing(true);
                  }}
                  className="inline-flex items-center gap-1.5 py-2 text-[11px] uppercase tracking-[0.2em] text-moka hover:text-espresso transition-colors font-sans font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy rounded-sm disabled:opacity-50"
                >
                  <PencilLine aria-hidden="true" className="w-3.5 h-3.5" />
                  <span>Modificar mi respuesta</span>
                </button>
              </div>
            </div>
          ) : (
            /* Rama 3: Formulario RSVP Blindado ("Cero Platos Fantasma") */
            <form
              onSubmit={handleSubmit(onValidSubmit)}
              noValidate
              aria-label="Formulario de confirmación de asistencia"
              className="space-y-7 text-left"
            >
              {/* Encabezado de Cupo Estricto en Papelería Editorial */}
              <div className="border-y border-divider py-4 text-center">
                <p className="font-display text-xl sm:text-2xl text-espresso editorial-letterpress font-normal">
                  {guest.nombreInvitacion}
                </p>
                <p
                  data-testid="rsvp-pass-allocation"
                  className="mt-1.5 inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.22em] text-olive font-sans font-medium"
                >
                  <Users aria-hidden="true" className="w-3.5 h-3.5" />
                  <span>{passAllocationCopy}</span>
                </p>
              </div>

              {/* Selección de Asistencia: Sí / No */}
              <fieldset className="space-y-2.5">
                <legend className="text-[11px] uppercase tracking-[0.24em] text-espresso font-sans font-medium mb-2">
                  ¿Nos acompañan en nuestra boda?
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-sm border cursor-pointer transition-colors ${
                      asistenciaRecepcion
                        ? 'border-olive bg-olive/[0.08] text-espresso'
                        : 'border-divider bg-card/85 text-moka hover:border-espresso/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="attendanceChoice"
                      checked={asistenciaRecepcion === true}
                      onChange={() => handleAttendanceChoice(true)}
                      className="w-4 h-4 accent-olive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive"
                    />
                    <span className="font-sans text-sm font-medium tracking-wide">
                      Sí, asistiremos
                    </span>
                  </label>

                  <label
                    className={`flex items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-sm border cursor-pointer transition-colors ${
                      asistenciaRecepcion === false
                        ? 'border-espresso/60 bg-cream-deep/65 text-espresso'
                        : 'border-divider bg-card/85 text-moka hover:border-espresso/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="attendanceChoice"
                      checked={asistenciaRecepcion === false}
                      onChange={() => handleAttendanceChoice(false)}
                      className="w-4 h-4 accent-espresso focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-espresso"
                    />
                    <span className="font-sans text-sm font-medium tracking-wide">
                      No podremos asistir
                    </span>
                  </label>
                </div>
              </fieldset>

              {/* Detalle Nominal (solo si confirma asistencia) */}
              {asistenciaRecepcion && (
                <>
                  {/* Selector de Número de Pases estrictamente acotado (1..guest.pasesAsignados) */}
                  {guest.pasesAsignados > 1 &&
                    (guest.pasesAsignados <= 5 ? (
                      <fieldset className="space-y-2.5">
                        <legend className="text-[11px] uppercase tracking-[0.24em] text-espresso font-sans font-medium mb-2">
                          ¿Cuántos pases utilizarán? (Máximo{' '}
                          {guest.pasesAsignados})
                        </legend>
                        <div className="flex flex-wrap gap-2.5">
                          {passOptions.map((count) => {
                            const selected = currentPassCount === count;
                            return (
                              <label
                                key={count}
                                className={`flex-1 min-w-[84px] flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-sm border cursor-pointer transition-colors ${
                                  selected
                                    ? 'border-burgundy bg-burgundy text-cream'
                                    : 'border-divider bg-card/85 text-espresso hover:border-espresso/40'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="pasesSeleccionados"
                                  value={count}
                                  checked={selected}
                                  onChange={() => handlePassCountChange(count)}
                                  className="sr-only"
                                />
                                <span className="font-display text-lg font-medium tabular-nums">
                                  {count}
                                </span>
                                <span className="text-[11px] uppercase tracking-[0.16em] font-sans">
                                  {count === 1 ? 'pase' : 'pases'}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>
                    ) : (
                      <div>
                        <label
                          htmlFor={passCountSelectId}
                          className="block text-[11px] uppercase tracking-[0.24em] text-espresso font-sans font-medium mb-1.5"
                        >
                          ¿Cuántos pases utilizarán? (Máximo{' '}
                          {guest.pasesAsignados})
                        </label>
                        <select
                          id={passCountSelectId}
                          name="pasesSeleccionados"
                          value={currentPassCount}
                          onChange={(event) =>
                            handlePassCountChange(Number(event.target.value))
                          }
                          className="w-full min-h-[48px] px-1 py-2.5 rounded-none border-0 border-b border-muted bg-transparent text-base text-espresso font-sans focus:border-burgundy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
                        >
                          {passOptions.map((count) => (
                            <option key={count} value={count}>
                              {count} {count === 1 ? 'pase' : 'pases'}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}

                  {/* Lista Nominal Obligatoria ("Cero Platos Fantasma") */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-[11px] uppercase tracking-[0.24em] text-espresso font-sans font-medium">
                        Nombre y apellido de cada asistente
                      </h3>
                      <p className="mt-1 font-sans text-xs text-moka tracking-wide">
                        Cada pase debe estar asignado a una persona real (nombre y apellido completos).
                      </p>
                    </div>

                    <div className="space-y-4">
                      {fields.map((field, index) => {
                        const fieldError =
                          errors.asistentes?.[index]?.nombreCompleto;
                        const inputId = `rsvp-attendee-name-${index}`;
                        const errorId = `rsvp-attendee-error-${index}`;
                        const civilCheckboxId = `rsvp-attendee-civil-${index}`;

                        return (
                          <div
                            key={field.id}
                            className="py-4 border-b border-divider/80 space-y-3"
                          >
                            <div>
                              <label
                                htmlFor={inputId}
                                className="block text-[11px] uppercase tracking-[0.2em] text-espresso font-sans font-medium mb-1"
                              >
                                Asistente {index + 1} · Nombre y apellido{' '}
                                <span aria-hidden="true" className="text-burgundy">
                                  *
                                </span>
                              </label>
                              <input
                                id={inputId}
                                type="text"
                                autoComplete="name"
                                enterKeyHint="next"
                                placeholder="Ej. Mariana Martínez Vélez"
                                aria-invalid={fieldError ? 'true' : 'false'}
                                aria-describedby={
                                  fieldError ? errorId : undefined
                                }
                                {...register(
                                  `asistentes.${index}.nombreCompleto`,
                                )}
                                className={`w-full min-h-[48px] px-1 py-2.5 rounded-none border-0 border-b bg-transparent text-base text-espresso font-sans tracking-wide placeholder:text-muted focus:border-burgundy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy ${
                                  fieldError
                                    ? 'border-burgundy'
                                    : 'border-muted'
                                }`}
                              />
                              {fieldError?.message && (
                                <p
                                  id={errorId}
                                  data-testid={`attendee-error-${index}`}
                                  className="mt-1.5 font-sans text-xs text-burgundy leading-relaxed"
                                >
                                  {fieldError.message}
                                </p>
                              )}
                            </div>

                            {/* Bloque exclusivo Tier A: Ceremonia Civil Viernes 16 de Julio */}
                            {guest.tier === 'A' && (
                              <div
                                data-testid={`tier-a-civil-toggle-${index}`}
                                className="pt-2 border-t border-divider/70"
                              >
                                <label
                                  htmlFor={civilCheckboxId}
                                  className="inline-flex items-start gap-2.5 cursor-pointer"
                                >
                                  <input
                                    id={civilCheckboxId}
                                    type="checkbox"
                                    {...register(
                                      `asistentes.${index}.asisteCivil`,
                                    )}
                                    className="mt-0.5 w-4 h-4 accent-olive rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive"
                                  />
                                  <span className="font-sans text-xs sm:text-[13px] text-espresso tracking-wide leading-snug">
                                    Asiste también a la Ceremonia Civil y Brindis{' '}
                                    <span className="text-olive font-medium">
                                      (Viernes 16 de Julio · 18:00 hrs)
                                    </span>
                                  </span>
                                </label>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Restricciones Dietéticas / Alergias */}
                  <div>
                    <label
                      htmlFor={dietaryFieldId}
                      className="block text-[11px] uppercase tracking-[0.22em] text-espresso font-sans font-medium mb-1.5"
                    >
                      Restricciones dietéticas o alergias (opcional)
                    </label>
                    <input
                      id={dietaryFieldId}
                      type="text"
                      maxLength={280}
                      placeholder="Ej. Vegetariano, sin gluten, alergia a mariscos"
                      aria-invalid={
                        errors.restriccionesDieteticasGenerales
                          ? 'true'
                          : 'false'
                      }
                      aria-describedby={
                        errors.restriccionesDieteticasGenerales
                          ? dietaryErrorId
                          : undefined
                      }
                      {...register('restriccionesDieteticasGenerales')}
                      className={`w-full min-h-[48px] px-1 py-2.5 rounded-none border-0 border-b bg-transparent text-base text-espresso font-sans tracking-wide placeholder:text-muted focus:border-burgundy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy ${
                        errors.restriccionesDieteticasGenerales
                          ? 'border-burgundy'
                          : 'border-muted'
                      }`}
                    />
                    {errors.restriccionesDieteticasGenerales?.message && (
                      <p
                        id={dietaryErrorId}
                        className="mt-1.5 font-sans text-xs text-burgundy"
                      >
                        {errors.restriccionesDieteticasGenerales.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Dedicatoria Opcional para los Novios */}
              <div>
                <label
                  htmlFor={messageFieldId}
                  className="block text-[11px] uppercase tracking-[0.22em] text-espresso font-sans font-medium mb-1.5"
                >
                  Mensaje para Montse &amp; Gerardo (opcional)
                </label>
                <textarea
                  id={messageFieldId}
                  rows={3}
                  maxLength={400}
                  placeholder="Comparte tus buenos deseos con los novios..."
                  aria-invalid={errors.mensajeNovios ? 'true' : 'false'}
                  aria-describedby={
                    errors.mensajeNovios ? messageErrorId : undefined
                  }
                  {...register('mensajeNovios')}
                  className={`w-full min-h-[96px] px-1 py-2.5 rounded-none border-0 border-b bg-transparent text-base text-espresso font-sans tracking-wide placeholder:text-muted resize-y focus:border-burgundy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy ${
                    errors.mensajeNovios ? 'border-burgundy' : 'border-muted'
                  }`}
                />
                {errors.mensajeNovios?.message && (
                  <p
                    id={messageErrorId}
                    className="mt-1.5 font-sans text-xs text-burgundy"
                  >
                    {errors.mensajeNovios.message}
                  </p>
                )}
              </div>

              {/* Botón Principal de Envío (Deep Burgundy #4F141C) */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  data-testid="rsvp-submit-button"
                  className="w-full inline-flex items-center justify-center px-6 py-3.5 min-h-[48px] rounded-sm bg-burgundy text-cream hover:bg-burgundy-hover transition-colors text-[11px] uppercase tracking-[0.24em] font-sans font-medium shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy disabled:opacity-65 disabled:cursor-wait"
                >
                  <span>
                    {isPending
                      ? 'Confirmando…'
                      : asistenciaRecepcion
                        ? 'Confirmar asistencia'
                        : 'Enviar respuesta'}
                  </span>
                </button>

                {isEditing && guest.estatusWeb !== 'pendiente' && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="w-full sm:w-auto shrink-0 px-5 py-3.5 min-h-[48px] rounded-sm border border-divider bg-cream/70 text-moka hover:text-espresso transition-colors text-[11px] uppercase tracking-[0.2em] font-sans font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-espresso"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}
        </EditorialSurface>
      </motion.div>
    </EditorialSurface>
  );
};
