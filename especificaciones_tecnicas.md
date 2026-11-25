# ESPECIFICACIONES TÉCNICAS FORMALES
## Plataforma de Invitaciones Digitales de Alta Gama: Montse & Gerardo (2027)

---

### 1. Resumen Ejecutivo y Objetivos del Proyecto

El objetivo es diseñar y construir una **Single Page Application (SPA)** de experiencia editorial inmersiva (*Scrollytelling*) para la boda de **Montse & Gerardo**, con fechas programadas para:
* **Boda Civil:** Viernes 16 de Julio de 2027.
* **Boda Religiosa y Recepción:** Sábado 17 de Julio de 2027.

#### Objetivos Clave:
1. **Impacto Estético y Emocional:** Diseño editorial de alta costura inspirado en el moodboard aprobado por los novios, con protagonismo equilibrado de **Warm Cream (`#F2ECE1`)**, **Deep Burgundy (`#4F141C`)** y **Olive Green (`#555F36` / `#3C4224`)**, reservando `#2D231E` exclusivamente para lectura de texto sobre papel crema.
2. **Cero Fugas de Información (Tier Isolation):** Segmentación estricta entre invitados de fin de semana completo (Tier A) e invitados del día principal (Tier B). El usuario nunca debe inferir la existencia de eventos a los que no fue convocado.
3. **RSVP "Cero Platos Fantasma":** Validación estricta y blindada del número de asistentes asignados, captura nominal de comensales, restricciones dietéticas y despacho dual (Base de Datos + WhatsApp prellenado).
4. **Resilencia y Accesibilidad Móvil:** Carga ultrarrápida (Core Web Vitals óptimos: LCP < 1.2s, INP < 100ms, CLS = 0), compatible con Safari iOS y Android Chrome, garantizando la reproducción de audio bajo políticas de *polite autoplay*.

---

### 2. Stack Tecnológico y Arquitectura del Sistema

| Capa | Tecnología | Justificación Técnica |
| :--- | :--- | :--- |
| **Core UI** | React 19 + TypeScript | Uso de transiciones modernas, `useActionState`, tipado estricto de datos y renderizado concurrente sin overhead. |
| **Tooling & Bundler** | Vite 6 | Tiempos de arranque instantáneos (HMR), optimización de assets estáticos y generación de bundles eficientes. |
| **Base de Datos & Realtime** | Cloud Firestore | Almacén NoSQL distribuido en tiempo real para consulta por ID de invitado y actualizaciones instantáneas con latencia mínima. |
| **Backoffice / Master Sheet** | Google Sheets + Google Apps Script | Interfaz no-code para los novios con sincronización bidireccional automática hacia/desde Firestore. |
| **Motor de Estilos** | Tailwind CSS v3.4 / v4 | Design tokens mapeados a variables CSS con utility classes, garantizando cero CSS muerto y máxima consistencia. |
| **Animación & Motion** | Framer Motion | Animaciones declarativas coordinadas con el scroll (`useScroll`, `useTransform`), transiciones de presencia física y modales. |
| **Iconografía** | Lucide React | Iconos SVG vectoriales ultra ligeros con trazo consistente (1.25px / 1.5px stroke width). |
| **Manejo de Formularios** | React Hook Form + Zod | Validación de esquemas en tiempo de compilación y ejecución, previniendo inyecciones de datos no autorizadas. |
| **Servicio de Correo** | Resend (Transactional API) | Envío de correos HTML estilizados de confirmación y recordatorios programados sin costo por conversación de WhatsApp. |
| **Audio Engine** | HTML5 Audio API + Howler.js | Manejo de desbloqueo de audio context en primer gesto del usuario, loop sin pausas y control de volumen gradual. |

#### 2.1. Compatibilidad de Navegadores y Resiliencia Móvil (`browserslist`)
* **Línea Base de Producción (`package.json` → `browserslist.production`):** Definida explícitamente en la raíz del repositorio (`>0.2%`, `not dead`, `not op_mini all`, `iOS >= 14`, `Safari >= 14`) para garantizar compatibilidad moderna en el tráfico móvil prioritario (Safari iOS y Chrome Android vía WhatsApp) y acotar la resolución de herramientas como `@vitejs/plugin-react` / Babel y Autoprefixer dentro del proyecto.
* **Línea Base de Desarrollo (`browserslist.development`):** Última versión de Chrome, Firefox y Safari (`last 1 chrome/firefox/safari version`) para agilizar la transformación en desarrollo local.

#### 2.2. Infraestructura y Despliegue Continuo (GitHub Pages y Firebase Hosting)
* **Ruta Base Dinámica (`vite.config.ts`):** Configurada mediante `base: process.env.VITE_BASE_PATH || '/'`, manteniendo intacta la compatibilidad en raíz (`/`) para desarrollo local y despliegues en **Firebase Hosting**, al tiempo que habilita despliegues en subcarpeta sin romper referencias a assets estáticos.
* **Despliegue Continuo en GitHub Pages (`.github/workflows/deploy-pages.yml`):** Workflow de GitHub Actions activado automáticamente en cada `push` a `main` (y manualmente vía `workflow_dispatch`). Ejecuta `npm ci`, `npx tsc --noEmit` y `npm run build` con `VITE_BASE_PATH=/invitacion/`, publicando el artefacto generado desde `./dist` mediante `actions/upload-pages-artifact@v3` y `actions/deploy-pages@v4` sin versionar `dist/` en la rama `main` (permanece en `.gitignore`).

---

### 3. Sistema de Diseño (Design Tokens & UI Foundation)

#### 3.1. Paleta Cromática y Tokens Semánticos
```css
:root {
  /* Fondos y Papelería Editorial (Warm Cream) */
  --bg-primary: #F2ECE1;                 /* Papel lino crema cálido */
  --bg-surface: #E6DEC8;                 /* Crema profundo para acentos de papel */
  --bg-card: rgba(250, 247, 241, 0.90);  /* Superficie clara armonizada con backdrop-blur */

  /* Bordes y Filetes 1px */
  --border-subtle: #D8CEBC;              /* Delimitador de 1px cálido */
  --border-divider: #D8CEBC;

  /* Tipografía sobre Papel Crema */
  --text-primary: #2D231E;               /* Café espresso exclusivo para lectura sobre crema */
  --text-secondary: #5C4D44;             /* Mocha de alto contraste WCAG AA (>= 6.0:1) */
  --text-muted: #78685E;                 /* Detalles y placeholders secundarios */

  /* Protagonistas del Moodboard: Deep Burgundy & Olive Green */
  --accent-burgundy: #4F141C;            /* Bandas oscuras, sello de cera, CTA RSVP y monograma M & G */
  --accent-burgundy-hover: #3E0E15;      /* Estado hover / velo de contraste */
  --accent-olive: #3C4224;               /* Estatus confirmados, badges y detalles botánicos */
  --surface-olive-envelope: #555F36;     /* Cuerpo y solapa del sobre de entrada C00 */
  --surface-olive-envelope-dark: #454E2B;/* Sombra de pliegue y relieve del sobre C00 */

  /* Canales RGB para opacidad nativa en Tailwind CSS v3 */
  --bg-cream-rgb: 242 236 225;
  --bg-cream-deep-rgb: 230 222 200;
  --bg-card-rgb: 250 247 241;
  --border-divider-rgb: 216 206 188;
  --text-espresso-rgb: 45 35 30;
  --text-mocha-rgb: 92 77 68;
  --text-muted-rgb: 120 104 94;
  --accent-burgundy-rgb: 79 20 28;
  --accent-burgundy-hover-rgb: 62 14 21;
  --accent-olive-rgb: 60 66 36;
  --surface-olive-envelope-rgb: 85 95 54;
  --surface-olive-envelope-dark-rgb: 69 78 43;
}
```

#### 3.2. Tipografía Editorial
* **Display / Títulos:** `Cormorant Garamond` / `Playfair Display` (Serif editorial, font-weight 400/500, letter-spacing ligero).
* **Acentos de Firma y Fechas:** `Pinyon Script` / `Alex Brush` (Caligrafía clásica, uso dosificado en nombres y fechas clave).
* **Cuerpo y Datos Operativos:** `Plus Jakarta Sans` / `Inter` (Sans-serif funcional, `tracking-wider`, alta legibilidad en móviles).

#### 3.3. Layout Editorial de Revista, Fotografía y Assets Raster (`src/assets/images/`)
* **Layout Editorial de Revista (Desktop + Mobile):** Cada sección emplea bandas *full-bleed* sobre **Warm Cream (`#F2ECE1`)** o **Deep Burgundy (`#4F141C`)** con una columna editorial interior contenida (`max-w-3xl` / `768px`), ritmo vertical generoso (`py-20 md:py-28`) y filetes finos `1px` (`#D8CEBC`), evitando grillas pesadas tipo SaaS en favor de directorios apilados (`divide-y divide-divider`) y líneas de tiempo centradas.
* Fotografía blanco y negro / sepia cálido con contraste editorial y grano sutil (`object-cover object-center`, sin deformaciones por `object-fill`).
* Monograma vectorial estilizado `M & G` en SVG puro escalable (`MonogramMG`).
* **Resolución Raster Exclusiva (`src/config/editorialAssets.ts`):** El manifiesto utiliza `import.meta.glob` sobre `src/assets/images/*.{avif,webp,jpg,jpeg,png}` respetando el orden de prioridad `.avif` > `.webp` > `.jpg` > `.jpeg` > `.png`. Si la carpeta está vacía o solo contiene algunos archivos (por ejemplo, `couple-cameo-photo.webp`), los componentes degradan limpiamente a un acabado tipográfico editorial con filetes `1px`, doble marco CSS y monograma `M & G` (omitiendo contenedores de ilustración vacíos hasta recibir el archivo real).
* **Assets Activos Actuales (9 raster `.webp` optimizados, `0 B` EXIF, todos bajo `targetMaxSizeKb`, cero SVG clipart):**
  1. `src/assets/images/envelope-texture.webp` (`envelopeTexture`, `840×630` / `4:3`, `23.81 KB` <= `75 KB`) — Papel algodón fino mate Verde Olivo (`#555F36`) en el bolsillo y solapa de `WaxSealEntrance` (`eager`, `sync`, `fetchPriority="high"`).
  2. `src/assets/images/envelope-lining-olive.webp` (`envelopeLiningOlive`, `1200×900` / `4:3`, `78.28 KB` <= `85 KB`) — Forro interior botánico tono sobre tono en Verde Olivo (peonías y olivo acuarelado) revelado al desplegar la solapa superior 3D (`eager`, `sync`).
  3. `src/assets/images/wax-seal-burgundy.webp` (`waxSealBurgundy`, `320×320` / `1:1` RGBA transparente, `15.21 KB` <= `45 KB`) — Sello de cera artesanal orgánico Deep Burgundy con borde irregular y centro liso para superposición del monograma tipográfico `M & G` en `WaxSealEntrance` (`eager`, `sync`).
  4. `src/assets/images/vellum-overlay.webp` (`vellumOverlay`, `800×1400` / `4:7`, `20.24 KB` <= `70 KB`) — Papel vegetal translúcido Warm Cream (`#F2ECE1`) en las hojas simétricas de `WaxSealEntrance` (`eager`, `sync`, `fetchPriority="high"`).
  5. `src/assets/images/hero-couple-bw.webp` (`heroCoupleBw`, `1080×1350` / `4:5`, `117.83 KB` <= `140 KB`) — Retrato vertical B&N de Montse y Gerardo a sangre en móvil y en lámina izquierda 50/50 en Desktop dentro de `HeroSection` (`eager`, `sync`, `object-cover object-top`).
  6. `src/assets/images/countdown-relief-bg.webp` (`countdownReliefBg`, `1440×1200` / `6:5`, `57.01 KB` <= `120 KB`) — Papel algodón Deep Burgundy (`#4F141C`) con velo `bg-burgundy/30` en `CountdownBand` y `<footer>` (`lazy`, `async`).
  7. `src/assets/images/couple-cameo-photo.webp` (`coupleCameoPhoto`, `720×960` / `3:4`, `38.54 KB` <= `130 KB`) — Retrato editorial B&N cálido de Montse y Gerardo en `ScratchCameo` (`lazy`, `async`, `object-cover object-center`).
  8. `src/assets/images/editorial-divider-bw.webp` (`editorialDividerBw`, `1440×900` / `16:10`, `89.07 KB` <= `140 KB`) — Intermedio fotográfico B&N a sangre (`EditorialPhotoDivider`) insertado entre `ItinerarySection` y `DressCodeSection` (`lazy`, `async`, `object-cover object-[50%_32%]`).
  9. `src/assets/images/botanical-card-frame.webp` (`botanicalCardFrame`, `1000×1200` / `5:6`, `19.07 KB` <= `95 KB`) — Papel algodón Warm Cream con esquinas botánicas olivo y velo `bg-card/30` en `RsvpSection` y `EditorialModal` (`lazy`, `async`).
  * Las 5 claves opcionales restantes (`heroFrameOrnament`, `venueEngraving`, `itineraryCurtains`, `dressCodeSketch`, `logisticsStamp`) operan con fallbacks tipográficos/CSS/SVG minimalistas sin contenedores vacíos.
* **Priorización de Carga (`LCP < 1.2s`, `CLS = 0`):** `fetchPriority="high"` se restringe estrictamente a los 2 recursos críticos de entrada (`envelopeTexture`, `vellumOverlay`); `envelopeLiningOlive`, `waxSealBurgundy` y `heroCoupleBw` cargan `eager`/`sync` sin saturar prioridad de red; el resto utiliza `loading="lazy"` y `decoding="async"` omitiendo `fetchPriority`, todos con dimensiones `width`/`height` y `aspect-ratio` explícitos.

---

### 4. Modelo de Datos y Validación (TypeScript & Schemas)

#### 4.1. Definición de Entidades (`src/types/guest.ts`)

El modelo refleja de manera unívoca la correspondencia con las columnas de Google Sheets y agrega los campos operativos de auditoría y sincronización:

```typescript
export type TierType = 'A' | 'B';
export type RSVPStatus = 'pendiente' | 'confirmado' | 'declinado';
export type SyncOrigin = 'sheets' | 'web';

export interface Asistente {
  nombreCompleto: string;
  asisteCivil?: boolean;      // Relevante únicamente para Tier A
  asisteReligiosa: boolean;
  restriccionesDieteticas?: string;
}

export interface Guest {
  // --- Metadatos (Propiedad de los Novios / Google Sheets) ---
  id: string;                       // Columna: "ID (Único)" (ej. "GM-001")
  slug?: string;                    // Alias URL-safe opcional (ej. "martinez-velez")
  nombreInvitacion: string;         // Columna: "Nombre Invitación" (ej. "Familia Martínez Vélez")
  pasesAsignados: number;           // Columna: "Pases Asignados" (Límite inquebrantable)
  tier: TierType;                   // Columna: "Tier (A/B)"
  email?: string;                   // Columna: "Email"
  telefono?: string;                // Columna: "Teléfono"

  // --- Asistencia & RSVP (Propiedad de la Web / Firestore) ---
  estatusWeb: RSVPStatus;           // Columna: "Estatus Web"
  asistentesConfirmados: Asistente[]; // Columna: "Asistentes Confirmados"
  restriccionesDieteticas?: string; // Columna: "Restricciones Dietéticas / Alergias"
  fechaConfirmacion?: string;       // Columna: "Fecha de Confirmación" (ISO 8601)

  // --- Campos Operativos y Auditoría de Sincronización ---
  pasesCivil?: number;              // Cupo específico civil (solo Tier A)
  statusCivil?: RSVPStatus;         // Estatus civil independiente
  statusRecepcion?: RSVPStatus;      // Estatus recepción
  mensajeNovios?: string;           // Dedicatoria opcional
  updatedAt?: string;               // Timestamp última mutación
  lastSyncedAt?: string;            // Timestamp última sincronización Sheets ⇄ Firestore
  syncOrigin?: SyncOrigin;          // Origen de la última actualización ('sheets' | 'web')
}

export interface RSVPFormData {
  guestId: string;
  asistentes: Asistente[];
  asistenciaCivil?: boolean;
  asistenciaRecepcion: boolean;
  mensajeNovios?: string;
  restriccionesDieteticasGenerales?: string;
}
```

#### 4.2. Validación de Cero Platos Fantasma (`src/types/rsvp.ts` y `src/utils/sanitize.ts`)
* **Sanitización Anti-XSS (`src/utils/sanitize.ts`):** Todas las cadenas ingresadas (nombres, restricciones dietéticas, dedicatorias y códigos de búsqueda) se limpian mediante `sanitizeText` / `sanitizeMultilineText` eliminando etiquetas HTML, caracteres de control y espacios redundantes antes de validar y persistir.
* **Fábrica Declarativa Zod (`createRsvpSchema(maxPases, tier)`):**
  * `asistentes.length` DEBE estar en $[1, \text{guest.pasesAsignados}]$ cuando `asistenciaRecepcion === true`.
  * Cada `nombreCompleto` exige mínimo 2 palabras alfabéticas de al menos 2 caracteres (soporta acentos/Unicode) y rechaza explícitamente dígitos y placeholders genéricos (`"Acompañante"`, `"Acompañante 1"`, `"Invitado"`, `"Persona"`, `"N/A"`, `"Test"`, etc., sin distinguir mayúsculas ni acentos).
  * Si `asistenciaRecepcion` es falsa, `asistentesConfirmados` se normaliza como lista vacía `[]` y `estatusWeb` pasa a `'declinado'`.
  * `asistenciaCivil` / `asisteCivil` se validan y persisten estrictamente cuando `guest.tier === 'A'`.

---

### 5. Arquitectura de Sincronización Bidireccional (Google Sheets ⇄ Firestore)

Los novios administran la lista de invitados en Google Sheets sin interactuar con consolas de bases de datos. La aplicación web opera sobre Cloud Firestore con latencia sub-segundo. Para garantizar la integridad de datos y eliminar condiciones de carrera (*race conditions*), se establece un protocolo de soberanía estricta de columnas y sincronización asíncrona.

```
       [GOOGLE SHEETS (Master)]
         ▲              │
         │ (Webhook)    │ (Apps Script Menu:
         │              │  "Actualizar Invitaciones en Web")
         │              ▼
    [doPost(e)]   [Firestore Batch Write: merge=true]
         ▲              │
         │              ▼
   [rsvpService] ──► [CLOUD FIRESTORE (Colección 'guests')]
         ▲              │
         │ (Optimistic  │ (Listener / Fetch)
         │  RSVP)       ▼
       [WEB APP (React 19 Frontend)]
```

#### 5.1. Soberanía de Datos y Columnas (Google Sheets)

| Columna en Sheets | Tipo de Dato | Propiedad / Autoridad | Regla de Permisos y Protección |
| :--- | :--- | :--- | :--- |
| **ID (Único)** | `String` (ej. `GM-001`) | Novios (Sheets) | Llave primaria inmutable. No editable una vez emitido. |
| **Nombre Invitación** | `String` | Novios (Sheets) | Lectura para la Web. Modificable por los novios. |
| **Pases Asignados** | `Number` ($\ge 1$) | Novios (Sheets) | Lectura para la Web. Define el tope absoluto de RSVP. |
| **Tier (A/B)** | `Enum ('A', 'B')` | Novios (Sheets) | Lectura para la Web. Define eventos visibles. |
| **Email** | `String` (opcional) | Novios (Sheets) | Destino de recordatorios transaccionales (Resend). |
| **Teléfono** | `String` (opcional) | Novios (Sheets) | Respaldo para contacto / WhatsApp. |
| **Estatus Web** | `Enum ('Pendiente', 'Confirmado', 'Declinado')` | **Web (Firestore)** | **Bloqueada en Sheets:** Modificada exclusivamente por la web. |
| **Asistentes Confirmados** | `String` (Lista delimitada) | **Web (Firestore)** | **Bloqueada en Sheets:** Modificada exclusivamente por la web. |
| **Restricciones Dietéticas / Alergias** | `String` | **Web (Firestore)** | **Bloqueada en Sheets:** Modificada exclusivamente por la web. |
| **Fecha de Confirmación** | `ISO Date / String` | **Web (Firestore)** | **Bloqueada en Sheets:** Modificada exclusivamente por la web. |

> [!IMPORTANT]
> **Principio de No-Invasión:** Las celdas de asistencia en Google Sheets se configuran con *Protección de Rango* para evitar ediciones manuales accidentales por parte de los novios.

#### 5.2. Flujo Sheets ➔ Firestore (Alta y Edición de Invitados)
* **Ubicación del Código:** `/scripts/apps-script/sheetsSync.js`.
* **Activador:** Menú personalizado en la hoja de cálculo: `Invitaciones ➔ Actualizar Invitaciones en Web`.
* **Mecanismo de Ejecución:**
  1. Lectura en bloque de la hoja mediante `sheet.getDataRange().getValues()`.
  2. Parseo y tipado de metadatos (ignora filas vacías o sin ID).
  3. Despacho en lotes (*batch writes* de hasta 500 operaciones por lote) hacia la colección `guests` de Firestore vía REST API o conector de servicio.
  4. **Directiva de Fusión:** `batch.set(docRef, guestPayload, { merge: true })`.
  5. **Invariante Crítica:** El payload emitido desde Sheets **no incluye** los campos de asistencia si en Firestore ya existe un estatus `confirmado` o `declinado`. Solo actualiza metadatos (`nombreInvitacion`, `pasesAsignados`, `tier`, `email`, `telefono`), previniendo sobreescrituras destructivas.

#### 5.3. Flujo Web / Firestore ➔ Sheets (Confirmación RSVP en Tiempo Real)
* **Ubicación del Servicio:** `src/services/rsvpService.ts`.
* **Experiencia de Usuario (UI Optimista en React 19):**
  1. El usuario completa el formulario y presiona "Confirmar Asistencia".
  2. El frontend aplica inmediatamente un estado optimista (`useOptimistic` / `useTransition`): la interfaz muestra de inmediato el estado de confirmación, insignia en verde Olive y botón de WhatsApp listo, brindando percepción de latencia cero.
  3. En segundo plano, `rsvpService.confirmarRSVP()` ejecuta:
     * **Paso A (Firestore):** Actualización atómica del documento con `estatusWeb: 'confirmado'`, `asistentesConfirmados`, `restriccionesDieteticas`, `fechaConfirmacion: new Date().toISOString()`, `syncOrigin: 'web'`.
     * **Paso B (Webhook a Sheets):** Invocación HTTP asíncrona hacia el endpoint de Google Apps Script (`doPost(e)` desplegado como Web App con acceso anónimo autorizado vía clave secreta en headers/params).
* **Lógica del Webhook (`doPost` en Apps Script):**
  1. Recibe el payload `{ guestId, estatusWeb, asistentesConfirmados, restriccionesDieteticas, fechaConfirmacion }`.
  2. Localiza la fila en Sheets evaluando la columna `ID (Único)`.
  3. Escribe únicamente en las celdas de las columnas de Asistencia.
  4. Aplica formato visual condicional: resalta la fila completa con fondo verde sutil (`#E8F0E6`) y texto en verde olivo (`#3C4224`) para confirmados, o ámbar claro para declinados.
* **Compatibilidad de Infraestructura:** Esta arquitectura mediante Web App `doPost(e)` funciona al 100% en el **Plan Gratuito Spark de Firebase**, ya que el cliente web (o el backend) invoca el webhook directamente sin requerir outbound networking de pago en Cloud Functions. Si el proyecto migra a Blaze, puede alternarse con un trigger `onDocumentUpdated` de Firebase Functions.

#### 5.4. Prevención de Condiciones de Carrera (Race Conditions)
1. **Separación de Campos Mutables:** Sheets nunca escribe en campos de asistencia y la Web nunca altera el ID, pases asignados ni el Tier del invitado.
2. **Control de Marcas de Tiempo:** Cada documento cuenta con `updatedAt` y `lastSyncedAt`. Si un lote de Sheets se ejecuta mientras un invitado confirma, el merge granular a nivel de campo en Firestore garantiza que ambas operaciones coexistan armónicamente sin pérdida de datos.

---

### 6. Arquitectura de Módulos y Flujos de Usuario

```
[Acceso por URL: /?guest=ID]
        │
        ▼
[C00: Experiencia de Entrada (Sobre Virtual & Sello de Cera)]
        │ (Tap en Sello: Unlock Audio + Apertura 3D)
        ▼
[Auth & Segmentación Context] ──(ID Inválido)──► [Vista Invitación General / Buscador]
        │
        ├─────────────────────────────┬─────────────────────────────┐
        ▼                             ▼                             ▼
[Tier A: Fin de Semana]      [Tier B: Día Principal]       [Módulos Universales]
- Civil: Viernes 16 Jul       - Religiosa: Sábado 17 Jul    - Hero con Monograma & Countdown
- Hospedaje: Hotel Sede (QR)  - Hospedaje: Convenios        - Audio Controller Flotante
- RSVP: Dual (Civil + Sábado) - RSVP: Sábado Exclusivo      - Dress Code & Guía Estilo
                                                            - Mesa Regalos & CLABE
                                                            - Despacho Dual RSVP (DB + WhatsApp)
```

#### 6.1. C00: Experiencia de Entrada Full-Bleed (Sobre de Algodón Fino Verde Olivo + Solapa en V + Sello de Cera Orgánico `.webp`)
* **Sobre Físico a Pantalla Completa (`100vw × 100dvh`) y Ciclo de Vida en Memoria:** Bloqueo inicial de borde a borde (`fixed inset-0 z-50 w-screen h-[100dvh]`, `role="dialog"`, `aria-modal="true"`) mientras `<main>` y `<footer>` permanecen `inert`. El estado `isOpened` vive exclusivamente en memoria dentro de `GuestContext` (sin persistencia en `sessionStorage`), reapareciendo al recargar (`F5`). Construido con una solapa superior triangular en V suavizada (`0%–47%`, `.editorial-envelope-flap` con sombra proyectada realista) cayendo sobre un bolsillo inferior limpio de papel algodón fino Verde Olivo (`.editorial-envelope-pocket` + `envelope-texture.webp`, sin líneas diagonales en "X", con filete interior sutil `border-cream/15`), revelando al abrir el forro interior botánico `envelope-lining-olive.webp`, destinatario personalizado (`Para: [Nombre]`) en la zona superior y fecha blindada por Tier en **Warm Cream (`#F2ECE1`, contraste `>= 6:1`)** en la zona inferior despejada.
* **Sello de Cera Artesanal Realista (`wax-seal-burgundy.webp`):** Botón nativo interactivo posicionado exactamente en el vértice de la solapa en V (`top-[47%]`), renderizando el sello de cera Deep Burgundy con transparencia alfa (`320×320`, `15.21 KB`, borde orgánico irregular y `drop-shadow` natural) y monograma tipográfico `'M & G'` centrado en bajorrelieve en `text-cream/90`.
* **Desbloqueo Síncrono de Audio ("Polite Autoplay Resolution"):** El toque/clic sobre el sello dispara sincrónicamente `unlockAndPlayAudio()` dentro del mismo evento de usuario antes de iniciar la transición visual.
* **Secuencia de Apertura Multicapa en 2 Tiempos (GPU-Accelerated):**
  1. **Tiempo 1 (`0.0s – 0.68s`, `ease-out`):** El sello de cera se atenúa mientras la solapa superior triangular rota hacia arriba (`rotateX: -174deg`, `perspective: 1000px`, `origin-top`, `transform-gpu`, `will-change-transform`, `backface-visibility: hidden`) exhibiendo el forro interior botánico olivo.
  2. **Tiempo 2 (`0.48s – 1.15s`, `ease-out`):** Dos hojas simétricas translúcidas de papel vegetal (`vellum-overlay.webp` sobre `bg-cream/90` con `backdrop-blur-md`) se separan horizontalmente revelando el Hero fotográfico B&N debajo sin saltos de scroll (`CLS = 0`).
* **Accesibilidad:** Bajo `prefers-reduced-motion: reduce`, la coreografía 3D degrada a un `fade-out` suave de `0.35s`.

#### 6.2. Portada Hero Fotográfica A Sangre, Banda Countdown en Deep Burgundy y Medallón `ScratchCameo`
* **Portada Editorial Fotográfica (`HeroSection`):** Presenta `hero-couple-bw.webp` en B&N con encuadre limpio (`object-cover object-top`): en móvil (`< 768px`) a sangre completa (`100dvh`) con velos degradados suaves solo en bordes superior e inferior para garantizar contraste WCAG AA en `Montse & Gerardo` (`Pinyon Script`, `text-cream`), fecha blindada por Tier y línea vertical de scroll; en Desktop (`>= 768px`) como pliego asimétrico editorial 50/50 (fotografía vertical íntegra a la izquierda + portada tipográfica sobre Warm Cream `#F2ECE1` con `MonogramMG`, `Montse & Gerardo`, pases reservados sin badges SaaS y fecha blindada a la derecha).
* **Banda Oscura de Cuenta Regresiva (`CountdownBand`):** Construida sobre `EditorialSurface` variante `relief-dark` (**Deep Burgundy `#4F141C`**, contraste WCAG AA `12.32:1` con texto `#F2ECE1`), muestra Días, Horas, Minutos y Segundos con `tabular-nums` apuntando al 17 de Julio de 2027 sin filtrar datos del Viernes a invitados Tier B.
* **Medallón Interactivo *Scratch-to-Reveal* (`ScratchCameo`):** Integrado dentro de la banda Deep Burgundy con marco ovalado `border-cream/35` de proporción fija (`aspect-[3/4]`, `CLS = 0`):
  * **Capa Inferior:** Fotografía editorial `editorialAssets.coupleCameoPhoto` (`couple-cameo-photo.webp` en B&N cálido, con fallback editorial crema y monograma `M & G`).
  * **Capa Interactiva HTML5 `<canvas>`:** Acabado de papel artesanal en crema cálido (`#F2ECE1` / `#E6DEC8`) con monograma `'M & G'` en Deep Burgundy (`#4F141C`), pista *"Desliza para descubrir"* en Café Espresso (`#2D231E`), trazos circulares suaves mediante `PointerEvent` y `globalCompositeOperation = 'destination-out'`, y `touch-action: none` acotado exclusivamente al `<canvas>` para preservar el scroll vertical nativo en móviles.
  * **Auto-revelado Eficiente (60fps):** Muestreo alfa con *throttling* dentro de la máscara elíptica del medallón; al superar el `55%` descubierto ejecuta un `fade-out` suave para exhibir la fotografía íntegra.
  * **Accesibilidad Obligatoria:** Botón accesible *"Revelar fotografía"* (`aria-label="Revelar fotografía de Montse y Gerardo"`) con región `aria-live="polite"`; tanto al pulsarlo como cuando `prefers-reduced-motion: reduce` está activo, se revela la fotografía directamente.

#### 6.3. Audio Ambiental Maestro (`wedding-theme.mp3`), Reproductor Flotante (*Polite Autoplay*) y Ciclo de Vida Móvil
* **Pista Ambiental Provisional Optimizada:** `src/assets/audio/wedding-theme.mp3` (instrumental piano + cello, MP3 `128 kbps`, `44.1 kHz` estéreo, segmento representativo de `90s` con *fade-in* de `2s` y *fade-out* de `2.5s`, `1,407.39 KB` / `1.37 MiB`, sin metadatos ID3 ni carátulas), importada estáticamente vía Vite en `GuestContext.tsx` sobre `HTMLAudioElement` nativo (sin dependencias externas extra como `howler`).
* **Protección de LCP y Desbloqueo Síncrono:** Configurada con `loop = true` y `preload = 'metadata'` para evitar la descarga completa del MP3 antes de la interacción del usuario. Al tocar el sello de cera (o `FloatingAudioPlayer`), `unlockAndPlayAudio()` ejecuta `audio.play()` sincrónicamente dentro del gesto del usuario y realiza un *fade-in* gradual de volumen (`0 -> 0.45` en `~1.2s`, con resguardo `try/catch` para Safari iOS donde `audio.volume` es de solo lectura).
* **Ciclo de Vida Móvil y Resiliencia:** Escucha `visibilitychange` (`document.hidden === true`) y `pagehide` para pausar limpiamente el audio cuando el invitado minimiza el navegador o vuelve a WhatsApp; sincroniza `isPlaying` con eventos nativos `play`, `pause` y `ended`, y captura cualquier rechazo de promesa de `audio.play()` manteniendo `isPlaying = false` sin errores en consola.
* **Invariante tras Recarga:** Dado que los navegadores móviles reinician el permiso del `AudioContext` al recargar la página, `audioUnlocked` e `isPlaying` **siempre inician en `false`** al montar la aplicación y **nunca se restauran desde `sessionStorage`**, evitando falsos estados activos.
* **Control Accesible (`FloatingAudioPlayer`):** Botón flotante inferior derecho (`bg-cream/95 text-espresso`, `aria-pressed={isPlaying}`, `aria-label` dinámico y ecualizador respetuoso de `prefers-reduced-motion`) que permite pausar o reanudar en cualquier momento conforme a WCAG 1.4.2.

#### 6.4. Configuración Centralizada (`src/config/eventDetails.ts`) y Secciones Editoriales Táctiles
* **Fuente Única Editable (`src/config/eventDetails.ts`):** Centraliza de forma fuertemente tipada recintos, horarios, hitos de itinerario (Viernes Tier A y Sábado Universal), guía de vestimenta, hospedaje segmentado, enlaces de mesa de regalos, datos bancarios/CLABE y teléfono de WhatsApp, permitiendo sustituir datos provisionales (`// [POR CONFIRMAR]`) sin modificar componentes.
* **Infraestructura Común y Dirección Editorial sin Chrome Web (`src/components/common/` y `src/utils/clipboard.ts`):**
  * `EditorialNav`: Sin barra horizontal fija superior; un único botón minimalista flotante en la esquina superior derecha (`top-4 right-4`, píldora `bg-cream/90` con `backdrop-blur-md`, `border-divider/80`, `M & G | Índice`) que despliega un índice vertical limpio y accesible (cierre con `Escape`, clic fuera o al navegar).
  * `EditorialModal`: Modal reutilizable de tarjeta de papelería editorial sobre `<dialog>` nativo (`showModal()`, `closedby="any"` + fallback Safari, `overscroll-behavior: contain`, `returnValue = ''`) revestido con `botanical-card-frame.webp`, doble filete `1px`, encabezado centrado con `<h1>` en `Pinyon Script`, filete vertical fino y botón de cierre `X` minimalista (`min-w-[44px] min-h-[44px]`), heredado por `GuestLookupModal` y el modal de Transferencia Bancaria/CLABE.
  * `ToastProvider`: Notificaciones editoriales accesibles (`role="status"`, `aria-live="polite"`, pausa de auto-cierre bajo foco/hover y promoción al *Top Layer* mediante `popover="manual"`).
  * `copyToClipboard` (`src/utils/clipboard.ts`): Copiado seguro con `navigator.clipboard.writeText` y fallback compatible con Safari iOS.
* **Secciones de Revista (`VenueSection`, `ItinerarySection`, `EditorialPhotoDivider`, `DressCodeSection`, `LodgingSection`, `GiftsSection`):**
  * **Tipografía y Acciones sin Chrome:** Todos los títulos de sección emplean `Pinyon Script` (`text-5xl md:text-6xl`) con filete vertical fino `1px`, eliminando badges ovalados estilo SaaS. Las acciones en `VenueSection`, `LodgingSection` y `GiftsSection` son **enlaces editoriales subrayados (`1px`, `border-b`, `min-h-[44px]`)**, reservando el botón sólido en Deep Burgundy (`#4F141C`) exclusivamente para la confirmación en `RsvpSection` y `GuestLookupModal`.
  * **Itinerario con Horas Verticales (`ItinerarySection`):** Cada hito muestra la hora en orientación vertical (`.editorial-vertical-time`) a la izquierda de una línea divisoria `1px` y el título del momento en `Pinyon Script` a la derecha, respetando el aislamiento estricto Tier A (Viernes 16 + Sábado 17) vs Tier B (solo Sábado 17).
  * **Intermedio Fotográfico (`EditorialPhotoDivider`) y Muestras de Tela (`DressCodeSection`):** Franja fotográfica B&N a sangre (`editorial-divider-bw.webp`) entre Itinerario y Vestimenta; `DressCodeSection` en prosa centrada con tira horizontal de 5 muestras rectangulares de textura seda/lino (`Borgoña`, `Olivo`, `Salvia`, `Champagne`, `Espresso`).
  * **Hospedaje y Regalos (`LodgingSection`, `GiftsSection`):** Tier A con Hotel Sede + QR vectorial + enlace subrayado de copiado; Tier B sin referencias al Hotel Sede ni Viernes 16; `GiftsSection` con enlaces subrayados a Liverpool, El Palacio de Hierro y Amazon más modal `EditorialModal` con CLABE Interbancaria.
  * **Inputs Editoriales en `RsvpSection`:** Campos de línea inferior fina (`border-0 border-b border-muted bg-transparent`, `text-base`, `min-h-[48px]`) integrados sobre la tarjeta `botanical-card-frame.webp` manteniendo intactos validación Zod, `useOptimistic`, rollback y WhatsApp.

#### 6.5. Motor RSVP Blindado (`RsvpSection`), Flujo Genérico (`GuestLookupModal`) y Servicios Desacoplados
1. **Resolución de Invitado Genérico o ID Inválido (`GuestLookupModal.tsx`):**
   * Cuando la URL carece de `?guest=ID` o contiene un ID inexistente (`guestLookupError === true`), la vista permanece estrictamente en **Tier B genérico** sin errores ni fugas.
   * `GuestLookupModal` permite ingresar el código/folio exacto (`resolveGuestByCode` en `GuestContext.tsx`, actualizando la URL vía `history.replaceState` sin exponer jamás el catálogo de invitados) o solicitar el enlace personalizado a los novios por WhatsApp (`buildGuestHelpWhatsAppUrl`).
2. **Formulario Nominal Blindado (`RsvpSection.tsx` + React Hook Form + Zod):**
   * Muestra explícitamente el cupo reservado (`"Hemos reservado X pases para tu familia"`), acota el selector estrictamente entre `1` y `guest.pasesAsignados`, genera campos nominales sincronizados con `useFieldArray` y renderiza el selector de Ceremonia Civil (Viernes 16) **únicamente** cuando `guest.tier === 'A'`.
3. **UI Optimista React 19 y Servicios Desacoplados (`rsvpService.ts` y `whatsappService.ts`):**
   * Usa `useOptimistic` + `useTransition` para transicionar al instante al estado confirmado (insignia en Verde Olivo `#3C4224`, resumen de asistentes y enlace WhatsApp listo) o declinado, ejecutando *safe rollback* con Toast en Deep Burgundy `#4F141C` si ocurre un error de red.
   * `src/services/rsvpService.ts`: aplica sanitización y re-validación Zod en profundidad, respeta la soberanía de campos (solo muta campos propiedad de la Web) y opera actualmente sobre un adaptador local temporal en `sessionStorage` (`// [TEMP FASE 2B]`) con la firma asíncrona definitiva lista para conectar Cloud Firestore + webhook Apps Script en Fase 3.
   * `src/services/whatsappService.ts`: construye URLs `https://wa.me/...` codificadas con `encodeURIComponent` (`buildRsvpWhatsAppUrl` para confirmación/declinación respetando aislamiento Tier A/B y `buildGuestHelpWhatsAppUrl` para contacto).

---

### 7. Estrategia de Recordatorios y Mesa de Regalos

#### 7.1. Recordatorios Transaccionales (Resend)
* Plantillas de correo responsive con diseño editorial (mismos colores y tipografías).
* Envíos escalonados automatizados:
  * Recordatorio 1: 90 días antes del evento (Apertura formal de RSVP).
  * Recordatorio 2: 30 días antes del evento (Advertencia de fecha límite).
  * Recordatorio Final: 7 días antes de la fecha límite para evitar "platos fantasma".

#### 7.2. Mesa de Regalos & Pagos Digitales
* Enlaces con tracking para **Liverpool**, **El Palacio de Hierro** y **Amazon**.
* Modal interactivo "Lluvia de Sobres / Transferencia Bancaria":
  * Presentación elegante del Banco, Beneficiario, Cuenta y CLABE Interbancaria (18 dígitos).
  * Botón interactivo "Copiar CLABE" con feedback visual háptico y notificación toast (*"CLABE copiada al portapapeles"*).

---

### 8. Seguridad y Privacidad

1. **Aislamiento de Datos de Invitados:** Los datos de la lista de invitados no se deben empaquetar por completo en el bundle estático del frontend. La resolución del ID se hará mediante Firestore por ID unívoco (reglas de seguridad que impiden listado indiscriminado `allow list: if false; allow get: if true;`).
2. **Sanitización de Entradas:** Sanitización estricta de nombres y notas personales para prevenir Cross-Site Scripting (XSS).
3. **Validación de Límites en Servidor:** Las reglas de seguridad de Firestore impiden escrituras donde el array de asistentes exceda `pasesAsignados` o se modifiquen campos reservados para los novios.

---

### 9. Estructura de Archivos y Servicios en el Repositorio

```
.
├── scripts/
│   └── apps-script/
│       └── sheetsSync.js             # Código Apps Script para Google Sheets (Menú + doPost Webhook)
├── src/
│   ├── assets/
│   │   ├── audio/
│   │   │   └── wedding-theme.mp3        # Pista ambiental provisional (128 kbps, 44.1 kHz estéreo, 90s, 1.37 MiB, sin ID3) — GuestContext (preload="metadata")
│   │   └── images/                      # 9 assets raster .webp optimizados (0 B EXIF, cero SVG clipart) + 5 fallbacks editoriales
│   │       ├── envelope-texture.webp        # Papel algodón fino mate Verde Olivo (840×630, 23.81 KB) — WaxSealEntrance (eager/high)
│   │       ├── envelope-lining-olive.webp   # Forro interior botánico olivo (1200×900, 78.28 KB) — WaxSealEntrance (eager)
│   │       ├── wax-seal-burgundy.webp       # Sello de cera orgánico Deep Burgundy RGBA (320×320, 15.21 KB) — WaxSealEntrance (eager)
│   │       ├── vellum-overlay.webp          # Papel vegetal Warm Cream (800×1400, 20.24 KB) — WaxSealEntrance (eager/high)
│   │       ├── hero-couple-bw.webp          # Retrato vertical B&N de portada (1080×1350, 117.83 KB) — HeroSection (eager)
│   │       ├── countdown-relief-bg.webp     # Papel algodón Deep Burgundy (1440×1200, 57.01 KB) — CountdownBand y Footer (lazy)
│   │       ├── couple-cameo-photo.webp      # Retrato B&N del medallón (720×960, 38.54 KB) — ScratchCameo (lazy)
│   │       ├── editorial-divider-bw.webp    # Intermedio fotográfico B&N (1440×900, 89.07 KB) — EditorialPhotoDivider (lazy)
│   │       └── botanical-card-frame.webp    # Marco botánico Warm Cream (1000×1200, 19.07 KB) — RsvpSection y EditorialModal (lazy)
│   ├── components/
│   │   ├── editorial/                   # EditorialSurface, WaxSealEntrance, HeroSection, CountdownBand, ScratchCameo, EditorialPhotoDivider, MonogramMG
│   │   ├── itinerary/                # ItinerarySection (cronograma segmentado Viernes/Sábado)
│   │   ├── logistics/                # VenueSection y LodgingSection (QR Hotel Sede / Convenios Tier B)
│   │   ├── dresscode/                # DressCodeSection (guía de etiqueta formal y paleta sugerida)
│   │   ├── rsvp/                     # RsvpSection (UI optimista React 19 + Zod) y GuestLookupModal (invitado genérico)
│   │   ├── gifts/                    # GiftsSection (Liverpool, Palacio, Amazon y modal CLABE)
│   │   └── common/                   # FloatingAudioPlayer, ToastProvider, EditorialModal, EditorialNav
│   ├── config/
│   │   ├── editorialAssets.ts        # Manifiesto tipado de texturas/ilustraciones (Fase 1 y 2) con resolución y fallbacks
│   │   └── eventDetails.ts           # Fuente única editable de recintos, horarios, hospedaje, regalos y datos bancarios
│   ├── context/
│   │   └── GuestContext.tsx          # Estado global de invitado, resolución por código, apertura C00 y ciclo de vida de audio
│   ├── data/
│   │   └── mockGuests.ts             # Mocks temporales de desarrollo (reemplazados por Firestore en Fase 3)
│   ├── hooks/
│   │   └── useCountdown.ts           # Hook de cuenta regresiva a Julio 2027
│   ├── services/
│   │   ├── firebase.ts               # Inicialización de Firebase SDK (Firestore — Fase 3)
│   │   ├── rsvpService.ts            # Envío RSVP con sanitización, defensa Zod y adaptador temporal (Firestore en Fase 3)
│   │   ├── resendService.ts          # Integración de correos recordatorios (Fase 3)
│   │   └── whatsappService.ts        # Constructor y codificador de enlaces wa.me (confirmación, declinación y ayuda)
│   ├── types/
│   │   ├── guest.ts                  # Tipos TypeScript de Guest, Asistente, RSVPFormData y Sincronización
│   │   └── rsvp.ts                   # Fábrica Zod createRsvpSchema y validación nominal "Cero Platos Fantasma"
│   └── utils/
│       ├── clipboard.ts              # Utilidad copyToClipboard con fallback para Safari iOS
│       └── sanitize.ts               # Sanitización anti-XSS y normalización de entradas de texto
├── agents.md                         # Reglas maestras para agentes de IA
├── especificaciones_tecnicas.md       # Documento formal de arquitectura y especificaciones
└── package.json
```
