import { Guest } from '../types/guest';

/**
 * DATOS TEMPORALES DE DESARROLLO (MOCKS).
 * Este módulo será reemplazado por consultas reales a Cloud Firestore
 * por ID unívoco en la Fase 3 (Integración Backend y Sincronización Sheets ⇄ Firestore).
 */
export const GENERIC_GUEST_ID = 'invitado-general';

export const mockGuests: Record<string, Guest> = {
  'martinez-velez': {
    id: 'GM-001',
    slug: 'martinez-velez',
    nombreInvitacion: 'Familia Martínez Vélez',
    pasesAsignados: 2,
    tier: 'A',
    email: 'contacto@martinezvelez.com',
    telefono: '+525500000001',
    estatusWeb: 'pendiente',
    asistentesConfirmados: [],
    restriccionesDieteticas: '',
    pasesCivil: 2,
    statusCivil: 'pendiente',
    statusRecepcion: 'pendiente',
    syncOrigin: 'sheets',
  },
  'invitado-b': {
    id: 'GM-002',
    slug: 'invitado-b',
    nombreInvitacion: 'Lic. Roberto Morales y Acompañante',
    pasesAsignados: 2,
    tier: 'B',
    email: 'roberto.morales@example.com',
    telefono: '+525500000002',
    estatusWeb: 'pendiente',
    asistentesConfirmados: [],
    restriccionesDieteticas: '',
    statusRecepcion: 'pendiente',
    syncOrigin: 'sheets',
  },
};

/**
 * Invitado genérico predeterminado (Tier B estricto para garantizar
 * cero fugas de información en URLs sin ?guest=ID o con ID desconocido).
 */
export const DEFAULT_GENERIC_GUEST: Guest = {
  id: GENERIC_GUEST_ID,
  slug: GENERIC_GUEST_ID,
  nombreInvitacion: 'Nuestros Queridos Invitados',
  pasesAsignados: 2,
  tier: 'B',
  estatusWeb: 'pendiente',
  asistentesConfirmados: [],
  restriccionesDieteticas: '',
  statusRecepcion: 'pendiente',
};
