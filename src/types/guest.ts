export type TierType = 'A' | 'B';
export type RSVPStatus = 'pendiente' | 'confirmado' | 'declinado';
export type SyncOrigin = 'sheets' | 'web';

export interface Asistente {
  nombreCompleto: string;
  asisteCivil?: boolean; // Relevante únicamente para Tier A
  asisteReligiosa: boolean;
  restriccionesDieteticas?: string;
}

export interface Guest {
  // --- Metadatos (Propiedad de los Novios / Google Sheets) ---
  id: string; // Columna: "ID (Único)" (ej. "GM-001")
  slug?: string; // Alias URL-safe opcional (ej. "martinez-velez")
  nombreInvitacion: string; // Columna: "Nombre Invitación" (ej. "Familia Martínez Vélez")
  pasesAsignados: number; // Columna: "Pases Asignados" (Límite inquebrantable)
  tier: TierType; // Columna: "Tier (A/B)"
  email?: string; // Columna: "Email"
  telefono?: string; // Columna: "Teléfono"

  // --- Asistencia & RSVP (Propiedad de la Web / Firestore) ---
  estatusWeb: RSVPStatus; // Columna: "Estatus Web"
  asistentesConfirmados: Asistente[]; // Columna: "Asistentes Confirmados"
  restriccionesDieteticas?: string; // Columna: "Restricciones Dietéticas / Alergias"
  fechaConfirmacion?: string; // Columna: "Fecha de Confirmación" (ISO 8601)

  // --- Campos Operativos y Auditoría de Sincronización ---
  pasesCivil?: number; // Cupo específico civil (solo Tier A)
  statusCivil?: RSVPStatus; // Estatus civil independiente
  statusRecepcion?: RSVPStatus; // Estatus recepción
  mensajeNovios?: string; // Dedicatoria opcional
  updatedAt?: string; // Timestamp última mutación
  lastSyncedAt?: string; // Timestamp última sincronización Sheets ⇄ Firestore
  syncOrigin?: SyncOrigin; // Origen de la última actualización ('sheets' | 'web')
}

export interface RSVPFormData {
  guestId: string;
  asistentes: Asistente[];
  asistenciaCivil?: boolean;
  asistenciaRecepcion: boolean;
  mensajeNovios?: string;
  restriccionesDieteticasGenerales?: string;
}
