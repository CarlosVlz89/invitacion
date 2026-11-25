import { z } from 'zod';
import { TierType } from './guest';
import { normalizeForComparison, sanitizeMultilineText, sanitizeText } from '../utils/sanitize';

const FORBIDDEN_GENERIC_PHRASES: readonly string[] = [
  'acompanante',
  'invitado',
  'invitada',
  'persona',
  'huesped',
  'asistente',
  'guest',
  'plus one',
  'plusone',
  'pareja',
  'familia',
  'amigo',
  'amiga',
  'n/a',
  'na',
  'ninguno',
  'ninguna',
  'sin nombre',
  'pendiente',
  'por confirmar',
  'test',
  'prueba',
  'usuario',
  'anonimo',
  'desconocido',
  'xxx',
  'asdf',
  'qwerty',
];

const FORBIDDEN_GENERIC_TOKENS = new Set<string>([
  'acompanante',
  'acompanantes',
  'invitado',
  'invitada',
  'invitados',
  'persona',
  'personas',
  'guest',
  'guests',
  'test',
  'prueba',
  'na',
  'ninguno',
  'ninguna',
  'pendiente',
  'anonimo',
  'desconocido',
  'xxx',
  'asdf',
  'qwerty',
]);

const ALPHABETIC_WORD_REGEX = /^\p{L}+(?:['’-]\p{L}+)*$/u;
const HAS_DIGIT_REGEX = /\d/;

export interface NominalValidationResult {
  readonly valid: boolean;
  readonly reason?: string;
}

export function validateRealFullName(rawName: string): NominalValidationResult {
  const cleaned = sanitizeText(rawName, 100);
  if (cleaned.length === 0) {
    return {
      valid: false,
      reason: 'Ingresa nombre y apellido completos.',
    };
  }

  if (HAS_DIGIT_REGEX.test(cleaned)) {
    return {
      valid: false,
      reason:
        'Ingresa un nombre y apellido reales, sin números ni textos genéricos.',
    };
  }

  const normalized = normalizeForComparison(cleaned);
  for (const phrase of FORBIDDEN_GENERIC_PHRASES) {
    if (
      normalized === phrase ||
      normalized.startsWith(`${phrase} `) ||
      normalized.endsWith(` ${phrase}`)
    ) {
      return {
        valid: false,
        reason:
          'Por favor escribe el nombre y apellido reales (no se permiten nombres genéricos como "Acompañante").',
      };
    }
  }

  const rawWords = cleaned.split(' ').filter((word) => word.length > 0);
  if (rawWords.length < 2) {
    return {
      valid: false,
      reason: 'Incluye nombre y apellido completos (mínimo 2 palabras).',
    };
  }

  const normalizedWords = normalized.split(' ').filter((word) => word.length > 0);
  for (const token of normalizedWords) {
    if (FORBIDDEN_GENERIC_TOKENS.has(token)) {
      return {
        valid: false,
        reason:
          'Por favor escribe el nombre y apellido reales (evita textos genéricos como "Acompañante" o "Invitado").',
      };
    }
  }

  const validSubstantiveWords = rawWords.filter(
    (word) => ALPHABETIC_WORD_REGEX.test(word) && word.replace(/['’-]/g, '').length >= 2,
  );

  if (validSubstantiveWords.length < 2) {
    return {
      valid: false,
      reason:
        'Cada asistente debe tener al menos nombre y apellido de 2 letras o más.',
    };
  }

  return { valid: true };
}

const attendeeInputSchema = z.object({
  nombreCompleto: z.string(),
  asisteCivil: z.boolean().optional(),
  asisteReligiosa: z.boolean(),
  restriccionesDieteticas: z.string().optional(),
});

export function createRsvpSchema(maxPases: number, tier: TierType) {
  const safeMaxPases = Math.max(1, Math.floor(maxPases));

  return z
    .object({
      asistenciaRecepcion: z.boolean(),
      asistenciaCivil: z.boolean().optional(),
      asistentes: z.array(attendeeInputSchema),
      restriccionesDieteticasGenerales: z
        .string()
        .optional()
        .refine(
          (val) => sanitizeMultilineText(val ?? '').length <= 280,
          'Máximo 280 caracteres en restricciones dietéticas.',
        ),
      mensajeNovios: z
        .string()
        .optional()
        .refine(
          (val) => sanitizeMultilineText(val ?? '').length <= 400,
          'Máximo 400 caracteres en tu dedicatoria.',
        ),
    })
    .superRefine((data, ctx) => {
      if (!data.asistenciaRecepcion) {
        return;
      }

      if (data.asistentes.length < 1) {
        ctx.addIssue({
          code: 'custom',
          path: ['asistentes'],
          message: 'Debes registrar al menos 1 asistente con nombre y apellido.',
        });
        return;
      }

      if (data.asistentes.length > safeMaxPases) {
        ctx.addIssue({
          code: 'custom',
          path: ['asistentes'],
          message: `El máximo permitido para tu invitación es de ${safeMaxPases} ${
            safeMaxPases === 1 ? 'pase' : 'pases'
          }.`,
        });
      }

      data.asistentes.forEach((attendee, index) => {
        const result = validateRealFullName(attendee.nombreCompleto);
        if (!result.valid) {
          ctx.addIssue({
            code: 'custom',
            path: ['asistentes', index, 'nombreCompleto'],
            message:
              result.reason ?? 'Ingresa nombre y apellido completos.',
          });
        }

        if (tier !== 'A' && attendee.asisteCivil) {
          ctx.addIssue({
            code: 'custom',
            path: ['asistentes', index, 'asisteCivil'],
            message: 'Opción no disponible para esta invitación.',
          });
        }
      });
    });
}

export type RsvpSchema = ReturnType<typeof createRsvpSchema>;
export type RsvpFormValues = z.infer<RsvpSchema>;
export type RsvpAttendeeFormValues = RsvpFormValues['asistentes'][number];
