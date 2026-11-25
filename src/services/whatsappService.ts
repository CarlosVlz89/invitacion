import { EVENT_DETAILS } from '../config/eventDetails';
import { Asistente, Guest, RSVPStatus } from '../types/guest';
import { sanitizeMultilineText, sanitizeText } from '../utils/sanitize';

export interface RsvpWhatsAppPayload {
  readonly estatusWeb: RSVPStatus;
  readonly asistentesConfirmados: readonly Asistente[];
  readonly restriccionesDieteticas?: string;
  readonly statusCivil?: RSVPStatus;
  readonly mensajeNovios?: string;
}

function getWhatsAppBaseUrl(): string {
  const digitsOnlyPhone = EVENT_DETAILS.whatsapp.contactPhone.replace(/\D/g, '');
  return `https://wa.me/${digitsOnlyPhone}`;
}

export function buildRsvpWhatsAppUrl(
  guest: Guest,
  payload: RsvpWhatsAppPayload,
): string {
  const baseUrl = getWhatsAppBaseUrl();

  if (payload.estatusWeb === 'declinado') {
    const lines: string[] = [
      '¡Hola Montse y Gerardo! Lamentablemente no podremos acompañarlos en su boda:',
      `Invitado: ${guest.nombreInvitacion}`,
      'Estatus: No podremos asistir',
    ];

    const cleanMessage = sanitizeMultilineText(payload.mensajeNovios ?? '', 400);
    if (cleanMessage.length > 0) {
      lines.push(`Mensaje: ${cleanMessage}`);
    }

    lines.push(`Folio: ${guest.id}`);
    return `${baseUrl}?text=${encodeURIComponent(lines.join('\n'))}`;
  }

  const confirmedCount = payload.asistentesConfirmados.length;
  const attendeeNames = payload.asistentesConfirmados
    .map((person) => sanitizeText(person.nombreCompleto, 100))
    .filter((name) => name.length > 0)
    .join(', ');

  const cleanDietary = sanitizeMultilineText(
    payload.restriccionesDieteticas ?? '',
    280,
  );
  const dietaryText = cleanDietary.length > 0 ? cleanDietary : 'Ninguna';

  const lines: string[] = [
    '¡Hola Montse y Gerardo! Confirmo con mucho gusto nuestra asistencia a su boda:',
    `Invitado: ${guest.nombreInvitacion}`,
    `Pases confirmados: ${confirmedCount} de ${guest.pasesAsignados}`,
    `Asistentes: ${attendeeNames}`,
    `Restricciones dietéticas: ${dietaryText}`,
  ];

  // Aislamiento estricto: jamás mencionar Ceremonia Civil ni Viernes 16 a invitados Tier B
  if (guest.tier === 'A') {
    const anyCivilConfirmed =
      payload.statusCivil === 'confirmado' ||
      payload.asistentesConfirmados.some((person) => person.asisteCivil === true);
    lines.push(
      `Ceremonia Civil (Viernes 16): ${anyCivilConfirmed ? 'Sí' : 'No'}`,
    );
  }

  lines.push(`Folio: ${guest.id}`);

  return `${baseUrl}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function buildGuestHelpWhatsAppUrl(nombreSolicitante?: string): string {
  const baseUrl = getWhatsAppBaseUrl();
  const cleanName = sanitizeText(nombreSolicitante ?? '', 100);

  const message =
    cleanName.length > 0
      ? `¡Hola Montse y Gerardo! Soy ${cleanName} y me encantaría recibir mi enlace personalizado para confirmar asistencia a su boda.`
      : '¡Hola Montse y Gerardo! Me encantaría recibir mi enlace personalizado para confirmar asistencia a su boda.';

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
