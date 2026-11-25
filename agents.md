# REGLAS MAESTRAS DE DESARROLLO Y CONVENCIONES PARA AGENTES DE IA (agents.md)
## Proyecto: Boda Montse & Gerardo (Plataforma de Invitaciones Digitales de Alta Gama)

> **Este documento establece las directrices inquebrantables, arquitectura técnica y estándares de diseño que cualquier agente de IA o desarrollador debe seguir rigurosamente al trabajar en este repositorio.**

---

### 1. Rol y Principios Rectores del Agente

Actúas como un **Tech Lead y Arquitecto Frontend Senior**. Tus decisiones priorizan:
1. **Perfección Visual y Sensibilidad Editorial:** Cada píxel, margen, peso tipográfico y transición debe transmitir la elegancia de una revista de bodas de alta costura.
2. **Robustez y Cero Fugas (Zero Information Leak):** Garantizar la estricta separación de privilegios entre invitados de fin de semana (Tier A) e invitados del día principal (Tier B).
3. **Control Riguroso de Asistencia ("Cero Platos Fantasma"):** El sistema de RSVP no tolera ambigüedades; cada pase debe estar asociado a una persona real o ser liberado explícitamente.
4. **Rendimiento Impecable en Dispositivos Móviles:** Más del 95% de los invitados abrirán el enlace en Safari iOS o Google Chrome en Android vía WhatsApp. Cero *layout shifts* (CLS = 0), carga ultrarrápida de imágenes y audio fluido.

---

### 2. Restricciones Técnicas Inquebrantables

* **Lenguaje & Tipado:** TypeScript en modo estricto. Queda estrictamente prohibido el uso de `any`. Si una estructura es dinámica, usa `unknown` con *type guards* o genéricos debidamente restringidos.
* **Versión de Framework:** React 19. Utiliza patrones modernos (`useActionState`, `useTransition`, Server/Client component conventions si aplica).
* **Gestión de Estilos:** Únicamente Tailwind CSS complementado con variables semánticas en CSS. No uses estilos en línea (`style={{...}}`) salvo para valores calculados dinámicamente en tiempo real (por ejemplo, coordenadas de Framer Motion).
* **Manejo de Formularios y Validación:** Todas las entradas de datos en el RSVP deben validarse mediante esquemas declarativos con **Zod**.
* **Audio en Navegadores Móviles:** Respeta las políticas de *Autoplay* de Apple y Google. Nunca fuerces la reproducción automática con sonido sin un gesto explícito o un diálogo elegante de activación.

---

### 3. Reglas de Diseño e Implementación Visual

#### 3.1. Paleta Editorial Protagonista (Moodboard Aprobado)
La identidad visual adopta una paleta cálida, orgánica y editorial donde **Warm Cream**, **Deep Burgundy** y **Olive Green** son protagonistas estructurales de la experiencia:
* **Warm Cream (`#F2ECE1` / `#E6DEC8`):** Papel lino crema cálido (`--bg-primary`) como lienzo principal, `#E6DEC8` (`--bg-surface` / `cream-deep`) para superficies secundarias sutiles, tarjetas *letterpress* en `rgba(250, 247, 241, 0.90)` (`#FAF7F1` con `backdrop-blur`) y filetes de `1px` en `#D8CEBC` (`--border-subtle`).
* **Deep Burgundy (`#4F141C` / hover `#3E0E15`):** Protagonista de bandas editoriales oscuras (`relief-dark`: Cuenta Regresiva, Medallón `ScratchCameo` y `<footer>`), sello de cera 3D en C00, botón principal de confirmación (RSVP), estados activos cruciales y monograma `M & G`.
* **Olive Green (`#555F36` / `#454E2B` y `#3C4224`):** Protagonista de la portada táctil del sobre de bienvenida C00 (`#555F36` con sombreado de pliegue en `#454E2B`) y olivo profundo (`#3C4224`) para insignias de confirmación exitosa, etiquetas de etiqueta/dress code y microacentos botánicos sobre papel crema.
* **Espresso (`#2D231E`) y Mocha (`#5C4D44`) / Muted (`#78685E`):** Reservados **exclusivamente para tipografía y lectura** sobre papel crema (`#F2ECE1` / `#E6DEC8` / `#FAF7F1`), garantizando contraste WCAG AA (`>= 4.5:1` en texto normal y `>= 3:1` en texto grande). Queda prohibido usar `#2D231E` para bandas oscuras.

**Protocolo de Nombres y Monograma:** En todos los títulos, copy visible, metadatos y `aria-label` se utiliza estrictamente el orden **Montse & Gerardo** (**Montse y Gerardo** en frases corridas) y el monograma **`M & G`** (`MonogramMG`).

**Texturas Táctiles y Fotografía Editorial Raster Activas:** Los 9 assets `.webp` optimizados (`0 B` EXIF, bajo `targetMaxSizeKb`, cero SVG clipart) residen en `src/assets/images/`: `envelope-texture.webp`, `envelope-lining-olive.webp`, `wax-seal-burgundy.webp`, `vellum-overlay.webp`, `hero-couple-bw.webp`, `countdown-relief-bg.webp`, `couple-cameo-photo.webp`, `editorial-divider-bw.webp` y `botanical-card-frame.webp`, mientras las 5 claves ilustrativas opcionales (`heroFrameOrnament`, `venueEngraving`, `itineraryCurtains`, `dressCodeSketch`, `logisticsStamp`) mantienen fallbacks editoriales limpios CSS/SVG.

#### 3.2. Convención Editorial "Cero Chrome de Sitio Web" y Jerarquía Tipográfica
* **Títulos de Sección y Nombres de los Novios:** Caligrafía clásica expresiva (`Pinyon Script`, `text-5xl md:text-6xl font-normal`) acompañada de filetes verticales finos (`w-px h-10 bg-divider`), eliminando badges ovalados estilo SaaS y encabezados genéricos de app.
* **Subtítulos, Fechas y Nombres de Recintos:** Serif editorial (`Cormorant Garamond` o `Playfair Display`), pesos entre 400 y 600.
* **Cuerpo de Texto, Horarios y Formularios:** Sans-serif geométrica limpia (`Plus Jakarta Sans` o `Inter`), con `tracking-wide` / `tracking-wider`. En `ItinerarySection`, las horas se orientan verticalmente (`.editorial-vertical-time`) a la izquierda de un filete vertical `1px`.
* **Navegación Invisible y Enlaces Subrayados `1px`:** Queda prohibida la barra de navegación horizontal fija superior; `EditorialNav` opera como un único botón minimalista en la esquina superior derecha (`top-4 right-4`) que despliega un índice editorial limpio. En secciones informativas (`VenueSection`, `LodgingSection`, `GiftsSection`), las acciones secundarias se presentan exclusivamente como **enlaces editoriales subrayados (`1px`, `border-b`, `min-h-[44px]`)**, sin botones cuadrados ni íconos decorativos redundantes. El botón sólido en **Deep Burgundy (`bg-burgundy text-cream hover:bg-burgundy-hover`)** se reserva estrictamente para las acciones primarias de confirmación en `RsvpSection` y `GuestLookupModal`. Los campos de formulario emplean líneas inferiores minimalistas (`border-0 border-b border-muted bg-transparent`) preservando accesibilidad (`text-base`, `min-h-[48px]`, `:focus-visible`, `aria-invalid`).

#### 3.3. Animaciones con Framer Motion
* Las animaciones deben ser sutiles (*ease-out*, duración de 0.5s a 0.8s). Evitar animaciones elásticas o caricaturescas (*bouncy*).
* Toda animación de scroll debe respetar la directiva `@media (prefers-reduced-motion: reduce)`.

#### 3.4. Reglas para la Capa de Bienvenida (C00), Papelería Táctil y Canvas Interactivo
* **Gestión de Estado en Memoria y Ciclo de Vida de Audio:** El estado de apertura (`isOpened`, `isOpening`) y el audio (`isPlaying`, `audioUnlocked`) deben gestionarse únicamente en estado de React en memoria dentro del contexto global (`GuestContext`). `isOpened` persiste durante la sesión activa de la página (sin reiniciarse al navegar por anclas, abrir modales, enviar el RSVP o redimensionar la ventana), pero **nunca se guarda en `sessionStorage`**, permitiendo revivir la apertura del sobre al recargar (`F5`) y desbloquear el audio en el nuevo ciclo de documento. Mientras `isOpened` sea falso, el contenido principal `<main>` y `<footer>` deben permanecer `inert`. **Invariante de Audio tras Recarga:** `audioUnlocked` e `isPlaying` deben iniciar **siempre en `false`** al montar la aplicación y jamás hidratarse como `true` desde almacenamiento persistente, pues los navegadores móviles reinician el permiso del `AudioContext` al recargar.
* **Aceleración por Hardware & Rendimiento Móvil:** Las animaciones multicapa en 2 tiempos (solapa 3D `rotateX` + doble hoja *vellum* horizontal en `WaxSealEntrance`) deben utilizar aceleración por GPU (`transform-gpu`, `will-change-transform`, `backface-visibility: hidden`) y degradar a un `fade-out` de `0.35s` bajo `prefers-reduced-motion: reduce`.
* **Desbloqueo Limpio de Audio, Pista Maestra (`wedding-theme.mp3`) y Ciclo de Vida Móvil:** La pista ambiental provisional (`src/assets/audio/wedding-theme.mp3`, MP3 `128 kbps`, `44.1 kHz` estéreo, `90s` en loop orgánico con *fade-in* de `2s` y *fade-out* de `2.5s`, `1.37 MiB`, `0` metadatos ID3) se importa estáticamente vía Vite en `GuestContext` usando HTML5 `Audio` nativo (sin instalar `howler`) con `preload="metadata"` para proteger el `LCP < 1.2s`. La invocación de `unlockAndPlayAudio()` se ejecuta sincrónicamente dentro del manejador de clic/toque del sello de cera (`WaxSealEntrance`) y del reproductor flotante (`FloatingAudioPlayer`, con `aria-pressed` y sincronización nativa `play`/`pause`/`ended`), aplicando un *fade-in* gradual de volumen (`0 -> 0.45` en `~1.2s`, seguro ante `audio.volume` de solo lectura en iOS Safari) y pausa automática en `visibilitychange` (`document.hidden === true`) y `pagehide`.
* **Primitivas de Papelería (`EditorialSurface`), Sobre Full-Bleed (C00), Modales de Papelería y Assets Raster (`src/assets/images/`):** Todas las secciones táctiles (`paper-ivory` en `#F2ECE1`, `relief-dark` en Deep Burgundy `#4F141C` y `letterpress-card` en `#FAF7F1/90`) se construyen sobre bandas *full-bleed* con columna editorial contenida (`max-w-3xl`) y filetes finos `1px` (`border-divider`). El sobre C00 (`WaxSealEntrance`) ocupa el `100vw × 100dvh` en papel algodón fino Verde Olivo (`envelope-texture.webp`, `#555F36` / `#454E2B`) con solapa superior triangular en V (`0%–47%`, sombra proyectada realista) sobre un bolsillo inferior limpio (sin líneas diagonales en "X"), forro interior botánico (`envelope-lining-olive.webp`), tipografía en crema `#F2ECE1` y sello de cera artesanal realista transparente (`wax-seal-burgundy.webp`) con monograma `M & G` en bajorrelieve sobre el vértice. Todos los modales (`EditorialModal`, `GuestLookupModal` y Transferencia Bancaria) adoptan la misma estética de tarjeta de papelería botánica (`botanical-card-frame.webp`, doble filete `1px`, título `<h1>` en `Pinyon Script` y botón de cierre minimalista `X` sin círculo pesado). Los botones primarios en Deep Burgundy de `RsvpSection` y `GuestLookupModal` son estrictamente tipográficos (**cero íconos de software** como llaves o sobres). `FloatingAudioPlayer` utiliza `bg-cream/95` con texto `text-espresso` para garantizar contraste `>= 10:1` sobre bandas Deep Burgundy y Warm Cream. La carpeta `src/assets/images/` acepta exclusivamente assets raster optimizados de producción (prioridad `.avif` > `.webp` > `.jpg` > `.jpeg` > `.png`, cero SVG clipart), resueltos dinámicamente desde `src/config/editorialAssets.ts` con `fetchPriority="high"` acotado a un máximo de 2 recursos críticos de entrada (`envelopeTexture`, `vellumOverlay`), `loading="lazy" decoding="async"` bajo el pliegue y `width`/`height` explícitos (`CLS = 0`).
* **Rendimiento Táctil y Accesibilidad en Canvas (`ScratchCameo`):** En superficies interactivas HTML5 `<canvas>` (`destination-out`), aplicar `touch-action: none` (`touch-none`) **exclusivamente** sobre el elemento `<canvas>` para permitir raspar en iOS Safari y Android Chrome sin secuestrar el scroll de la página, muestrear píxeles con *throttling* ligero para sostener 60fps, y proporcionar siempre un botón accesible de revelado directo (*"Revelar fotografía"*) + revelado inmediato bajo `prefers-reduced-motion: reduce`.

---

### 4. Protocolo de Aislamiento de Tier (Seguridad Anti-Fugas)

```typescript
// INVARIANTE ARQUITECTÓNICA:
// Un invitado Tier B jamás debe recibir, renderizar ni sospechar la existencia de eventos del Viernes.
```

1. **Aislamiento Condicional Limpio:**
   * Cuando `guest.tier === 'B'`, el cronograma y el hospedaje deben renderizarse sin espacios residuales, separadores flotantes ni saltos de contenido.
   * Queda prohibido ocultar elementos con `display: none` o clases CSS como `hidden` si los datos del Viernes quedan presentes en el DOM HTML inspeccionable. El componente debe condicionarse a nivel React:
     `{guest.tier === 'A' && <EventoCivilCard />}`.
2. **Blindaje de Textos:**
   * Para Tier A: "Fin de semana de celebración — 16 y 17 de Julio, 2027".
   * Para Tier B: "Nuestra Boda — Sábado 17 de Julio, 2027".
3. **Manejo de Invitados No Identificados o URLs Genéricas:**
   * Si la URL no contiene `?guest=ID` o el ID es inexistente, el sistema debe presentar una vista predeterminada elegante (Tier B genérico) con un modal para ingresar nombre o contactar a los novios, sin romper la aplicación.

---

### 5. Protocolo de RSVP "Cero Platos Fantasma"

1. **Tope Absoluto de Pases:**
   * La UI debe mostrar claramente: *"Hemos reservado X pases para tu familia"*.
   * El selector de asistentes no puede superar numéricamente `guest.pasesAsignados`.
2. **Identificación Nominal Obligatoria y Sanitización Anti-XSS:**
   * Implementada activamente en `src/types/rsvp.ts` (`createRsvpSchema` + `validateRealFullName`) y `src/utils/sanitize.ts` (`sanitizeText`, `sanitizeMultilineText`).
   * Cada pase utilizado exige nombre y apellido reales (mínimo 2 palabras alfabéticas de `>= 2` caracteres), rechazando dígitos y placeholders genéricos (`"Acompañante"`, `"Acompañante 1"`, `"Invitado"`, `"Persona"`, `"N/A"`, `"Test"`, etc., insensible a mayúsculas y acentos).
   * Toda entrada libre (nombres, restricciones dietéticas, dedicatorias y código de invitación) se sanitiza contra HTML/XSS antes de validar y persistir.
3. **Despacho Dual Atómico:**
   * **Paso 1:** Envío de payload a Firestore y sincronización a Google Sheets vía `rsvpService.ts`.
   * **Paso 2:** Generación del mensaje de WhatsApp estandarizado y codificado:
     ```
     ¡Hola Montse y Gerardo! Confirmo con mucho gusto nuestra asistencia a su boda:
     Invitado: [Nombre de Familia]
     Pases confirmados: [X de Y]
     Asistentes: [Nombre 1], [Nombre 2]
     Restricciones dietéticas: [Restricción o Ninguna]
     Folio: [ID_INVITADO]
     ```
   * **Paso 3:** Disparo de notificación vía Resend API si existe correo electrónico asociado.

---

### 6. Protocolo de Sincronización Bidireccional (Google Sheets ⇄ Firestore)

```typescript
// INVARIANTE DE SOBERANÍA DE DATOS:
// La Web NUNCA sobreescribe metadatos de Sheets (Nombre, Pases, Tier).
// Google Sheets NUNCA sobreescribe la confirmación de la Web si ya existe un estatus confirmado/declinado.
```

1. **División Estricta de Columnas:**
   * **Propiedad de los Novios (Google Sheets):** `ID (Único)`, `Nombre Invitación`, `Pases Asignados`, `Tier (A/B)`, `Email`, `Teléfono`. La web trata estos datos como estrictamente de solo lectura.
   * **Propiedad de la Web (Firestore / RSVP):** `Estatus Web`, `Asistentes Confirmados`, `Restricciones Dietéticas / Alergias`, `Fecha de Confirmación`. En Google Sheets estas columnas están protegidas contra edición manual accidental.
2. **Reglas para Google Apps Script (`/scripts/apps-script/sheetsSync.js`):**
   * El menú "Invitaciones ➔ Actualizar Invitaciones en Web" realiza escrituras por lotes (`batch.set(docRef, data, { merge: true })`).
   * **Regla Anti-Sobreescritura:** Antes de hacer merge, el script debe respetar cualquier documento existente en Firestore donde `estatusWeb !== 'pendiente'`. No debe resetear campos de asistencia a vacío ni pisar nombres de acompañantes confirmados.
3. **Pautas de Estado Optimista en React 19 (`src/services/rsvpService.ts`):**
   * Implementar `useOptimistic` o `startTransition` en el formulario de confirmación.
   * La UI debe transicionar de inmediato al estado de éxito (insignia verde olivo `#3C4224`, botón wa.me habilitado) sin bloquear al usuario con pantallas de carga opacas.
   * En caso de error de red con Firestore o el webhook, la interfaz debe revertir ordenadamente el estado optimista (*safe rollback*) y alertar al usuario con un Toast de reintento.
4. **Webhook de Sincronización a Sheets (`doPost(e)`):**
   * Al confirmar en la Web, se notifica asíncronamente al endpoint de Apps Script con el payload `{ guestId, estatusWeb, asistentesConfirmados, restriccionesDieteticas, fechaConfirmacion }`.
   * El script busca la fila por `guestId` (Columna A), actualiza únicamente las columnas de asistencia y aplica fondo verde sutil (`#E8F0E6`) a la fila completa.
   * Esta arquitectura opera con cero costos sobre el **Plan Spark de Firebase**, al delegar el webhook a una Web App gratuita de Google Apps Script.

---

### 7. Estructura de Directorios Recomendada

```
.
├── scripts/
│   └── apps-script/
│       └── sheetsSync.js    # Script de Apps Script vinculado a Google Sheets (Menú + doPost)
├── src/
│   ├── assets/              # Tipografías locales, monograma SVG, audio y fotografías
│   │   ├── audio/           # Pista ambiental provisional wedding-theme.mp3 (128 kbps, 44.1 kHz estéreo, 90s, 1.37 MiB, sin ID3)
│   │   ├── fonts/           # Fuentes web optizadas (WOFF2)
│   │   └── images/          # 9 assets .webp activos (envelope-texture, envelope-lining-olive, wax-seal-burgundy, vellum-overlay, hero-couple-bw, countdown-relief-bg, couple-cameo-photo, editorial-divider-bw, botanical-card-frame) + 5 fallbacks CSS/SVG
│   ├── components/
│   │   ├── editorial/       # EditorialSurface, WaxSealEntrance, HeroSection, CountdownBand, ScratchCameo, EditorialPhotoDivider, MonogramMG
│   │   ├── itinerary/       # ItinerarySection (cronograma dinámico segmentado Viernes/Sábado)
│   │   ├── logistics/       # VenueSection y LodgingSection (ubicaciones, mapas y hospedaje QR / Convenios)
│   │   ├── dresscode/       # DressCodeSection (guía de etiqueta formal y paleta sugerida)
│   │   ├── rsvp/            # RsvpSection (formulario blindado, UI optimista) y GuestLookupModal (invitado genérico)
│   │   ├── gifts/           # GiftsSection (mesa de regalos y modal CLABE)
│   │   └── common/          # FloatingAudioPlayer, ToastProvider, EditorialModal, EditorialNav
│   ├── config/
│   │   ├── editorialAssets.ts # Manifiesto tipado de assets táctiles/ilustraciones (Fase 1 y 2) y fallbacks
│   │   └── eventDetails.ts    # Configuración centralizada editable de recintos, horarios, hospedaje y regalos
│   ├── context/
│   │   └── GuestContext.tsx   # Contexto global de invitado, resolución por código, sobre C00 y ciclo de vida de audio
│   ├── data/
│   │   └── mockGuests.ts      # Mocks temporales de desarrollo (reemplazados por Firestore en Fase 3)
│   ├── hooks/
│   │   └── useCountdown.ts    # Hook de cuenta regresiva a Julio 2027
│   ├── services/
│   │   ├── firebase.ts      # Cliente inicializado de Cloud Firestore (Fase 3)
│   │   ├── rsvpService.ts   # Envío RSVP desacoplado, validación Zod y adaptador temporal (Firestore + Sheets en Fase 3)
│   │   ├── resendService.ts # API client para recordatorios transaccionales (Fase 3)
│   │   └── whatsappService.ts # Constructor y codificador de enlaces wa.me (confirmación, declinación y contacto)
│   ├── types/
│   │   ├── guest.ts         # Modelos de datos TypeScript (Guest, Asistente, RSVPFormData, Soberanía de campos)
│   │   └── rsvp.ts          # Esquemas Zod (createRsvpSchema) y validación nominal "Cero Platos Fantasma"
│   └── utils/
│       ├── clipboard.ts     # Utilidad segura copyToClipboard con fallback Safari iOS
│       └── sanitize.ts      # Sanitización anti-XSS y normalización de entradas RSVP
├── agents.md                # Reglas maestras para agentes de IA
└── especificaciones_tecnicas.md # Especificaciones formales del proyecto
```

---

### 8. Convenciones de Código y Buenas Prácticas

1. **Nombres de Componentes y Archivos:** PascalCase para componentes (`HeroSection.tsx`), camelCase para utilidades y hooks (`useAudioPlayer.ts`).
2. **Manejo de Errores y UI Optimista:** Todos los llamados asíncronos (copiado al portapapeles, mutaciones de Firestore, webhook a Sheets) deben implementar rollback y feedback visual claro mediante Toasts sobrios con la paleta editorial.
3. **Accesibilidad (A11y):**
   * Botones con `aria-label` descriptivos.
   * Modales con control de foco accesible (`Dialog` accesible).
   * Contraste de texto en cumplimiento con WCAG AA (mínimo ratio 4.5:1 para texto normal y 3:1 para texto grande sobre `#F2ECE1`, `#E6DEC8`, `#4F141C` y `#555F36`).

---

### 9. Criterios de Aceptación para Tareas Agénticas

Antes de dar por concluida cualquier tarea o entrega de código, el agente debe verificar:
1. `npm run build` o compilación TypeScript sin errores ni advertencias de tipo (`tsc --noEmit`).
2. Cero componentes huérfanos o importaciones no utilizadas.
3. Validación en tres anchos de pantalla: Móvil (390px - iPhone), Tablet (768px - iPad) y Desktop (1440px).
4. Aislamiento absoluto de datos entre Tier A y Tier B verificado en escenarios de prueba.
5. Invariante de soberanía de datos comprobada: una actualización en Sheets nunca pisa una confirmación existente en Firestore, y una confirmación web actualiza únicamente las columnas de asistencia en Sheets.
