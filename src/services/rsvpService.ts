import { Asistente, Guest, RSVPFormData, RSVPStatus, SyncOrigin } from '../types/guest';
import { createRsvpSchema } from '../types/rsvp';
import { sanitizeMultilineText, sanitizeText } from '../utils/sanitize';
import { buildRsvpWhatsAppUrl } from './whatsappService';

// [TEMP FASE 2B - REEMPLAZAR CON FIRESTORE EN FASE 3]
const DEV_RSVP_STORAGE_PREFIX = 'gm_rsvp_dev_';
const SIMULATED_NETWORK_DELAY_MS = 400;

/**
 * Subconjunto estricto de campos propiedad de la Web (Soberanía de Datos).
 * Jamás muta metadatos de Google Sheets (id, nombreInvitacion, pasesAsignados, tier, email, telefono).
 */
export interface GuestRsvpUpdate {
  readonly estatusWeb: RSVPStatus;
  readonly asistentesConfirmados: Asistente[];
  readonly restriccionesDieteticas: string;
  readonly fechaConfirmacion: string;
  readonly statusCivil?: RSVPStatus;
  readonly statusRecepcion: RSVPStatus;
  readonly mensajeNovios: string;
  readonly updatedAt: string;
  readonly syncOrigin: SyncOrigin;
}

export interface RsvpSubmissionResult extends GuestRsvpUpdate {
  readonly whatsappUrl: string;
}

export interface SubmitRsvpOptions {
  readonly simulateNetworkError?: boolean;
}

function isDevErrorFlagActive(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('rsvpTestError') === '1';
  } catch {
    return false;
  }
}

function isValidStoredRsvpUpdate(value: unknown): value is GuestRsvpUpdate {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    (record.estatusWeb === 'pendiente' ||
      record.estatusWeb === 'confirmado' ||
      record.estatusWeb === 'declinado') &&
    Array.isArray(record.asistentesConfirmados) &&
    typeof record.fechaConfirmacion === 'string'
  );
}

// [TEMP FASE 2B - REEMPLAZAR CON FIRESTORE EN FASE 3]
export function loadStoredDevRsvp(guestId: string): GuestRsvpUpdate | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(`${DEV_RSVP_STORAGE_PREFIX}${guestId}`);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidStoredRsvpUpdate(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// [TEMP FASE 2B - REEMPLAZAR CON FIRESTORE EN FASE 3]
export function saveStoredDevRsvp(guestId: string, update: GuestRsvpUpdate): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(
      `${DEV_RSVP_STORAGE_PREFIX}${guestId}`,
      JSON.stringify(update),
    );
  } catch {
    // Ignorar restricciones de sessionStorage en navegación privada
  }
}

export function buildOptimisticRsvpPreview(
  guest: Guest,
  formData: RSVPFormData,
): RsvpSubmissionResult {
  const nowIso = new Date().toISOString();
  const isConfirmed = formData.asistenciaRecepcion;

  const cleanDietary = sanitizeMultilineText(
    formData.restriccionesDieteticasGenerales ?? '',
    280,
  );
  const cleanMessage = sanitizeMultilineText(formData.mensajeNovios ?? '', 400);

  const sanitizedAttendees: Asistente[] = isConfirmed
    ? formData.asistentes.slice(0, guest.pasesAsignados).map((attendee) => {
        const base: Asistente = {
          nombreCompleto: sanitizeText(attendee.nombreCompleto, 100),
          asisteReligiosa: true,
        };

        if (attendee.restriccionesDieteticas) {
          const cleanItemDiet = sanitizeText(attendee.restriccionesDieteticas, 140);
          if (cleanItemDiet.length > 0) {
            base.restriccionesDieteticas = cleanItemDiet;
          }
        }

        // Blindaje Tier B: jamás persistir ni adjuntar asisteCivil para Tier B
        if (guest.tier === 'A') {
          base.asisteCivil = Boolean(attendee.asisteCivil);
        }

        return base;
      })
    : [];

  const estatusWeb: RSVPStatus = isConfirmed ? 'confirmado' : 'declinado';
  const statusRecepcion: RSVPStatus = estatusWeb;

  let statusCivil: RSVPStatus | undefined;
  if (guest.tier === 'A') {
    if (!isConfirmed) {
      statusCivil = 'declinado';
    } else {
      const anyCivil =
        Boolean(formData.asistenciaCivil) ||
        sanitizedAttendees.some((person) => person.asisteCivil === true);
      statusCivil = anyCivil ? 'confirmado' : 'declinado';
    }
  }

  const update: GuestRsvpUpdate = {
    estatusWeb,
    asistentesConfirmados: sanitizedAttendees,
    restriccionesDieteticas: isConfirmed ? cleanDietary : '',
    fechaConfirmacion: nowIso,
    statusRecepcion,
    mensajeNovios: cleanMessage,
    updatedAt: nowIso,
    syncOrigin: 'web',
    ...(guest.tier === 'A' ? { statusCivil } : {}),
  };

  const whatsappUrl = buildRsvpWhatsAppUrl(guest, update);

  return {
    ...update,
    whatsappUrl,
  };
}

/**
 * Envío desacoplado de RSVP preparado para conectar Cloud Firestore
 * y webhook de Google Apps Script (doPost) en Fase 3.
 */
export async function submitRsvp(
  guest: Guest,
  formData: RSVPFormData,
  options?: SubmitRsvpOptions,
): Promise<RsvpSubmissionResult> {
  // Defensa en profundidad: sanitización y re-validación contra esquema Zod
  const sanitizedInput = {
    asistenciaRecepcion: formData.asistenciaRecepcion,
    asistenciaCivil:
      guest.tier === 'A' ? Boolean(formData.asistenciaCivil) : undefined,
    asistentes: formData.asistenciaRecepcion
      ? formData.asistentes.map((attendee) => ({
          nombreCompleto: sanitizeText(attendee.nombreCompleto, 100),
          asisteReligiosa: true,
          asisteCivil:
            guest.tier === 'A' ? Boolean(attendee.asisteCivil) : undefined,
          restriccionesDieteticas: attendee.restriccionesDieteticas
            ? sanitizeText(attendee.restriccionesDieteticas, 140)
            : undefined,
        }))
      : [],
    restriccionesDieteticasGenerales: sanitizeMultilineText(
      formData.restriccionesDieteticasGenerales ?? '',
      280,
    ),
    mensajeNovios: sanitizeMultilineText(formData.mensajeNovios ?? '', 400),
  };

  const schema = createRsvpSchema(guest.pasesAsignados, guest.tier);
  const parsed = schema.safeParse(sanitizedInput);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    throw new Error(
      firstIssue?.message ??
        'Los datos de confirmación no cumplen con los requisitos de la invitación.',
    );
  }

  // [TEMP FASE 2B - REEMPLAZAR CON FIRESTORE + WEBHOOK APPS SCRIPT EN FASE 3]
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, SIMULATED_NETWORK_DELAY_MS);
  });

  if (options?.simulateNetworkError || isDevErrorFlagActive()) {
    throw new Error(
      'No pudimos registrar tu confirmación en este momento. Verifica tu conexión e intenta nuevamente.',
    );
  }

  const normalizedFormData: RSVPFormData = {
    guestId: guest.id,
    asistenciaRecepcion: parsed.data.asistenciaRecepcion,
    asistenciaCivil:
      guest.tier === 'A' ? parsed.data.asistenciaCivil : undefined,
    asistentes: parsed.data.asistenciaRecepcion ? parsed.data.asistentes : [],
    restriccionesDieteticasGenerales:
      parsed.data.restriccionesDieteticasGenerales,
    mensajeNovios: parsed.data.mensajeNovios,
  };

  const result = buildOptimisticRsvpPreview(guest, normalizedFormData);
  saveStoredDevRsvp(guest.id, result);

  return result;
}
