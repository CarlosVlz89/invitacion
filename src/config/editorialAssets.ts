export type EditorialAssetKey =
  | 'envelopeTexture'
  | 'envelopeLiningOlive'
  | 'waxSealBurgundy'
  | 'vellumOverlay'
  | 'heroCoupleBw'
  | 'editorialDividerBw'
  | 'heroFrameOrnament'
  | 'countdownReliefBg'
  | 'coupleCameoPhoto'
  | 'venueEngraving'
  | 'itineraryCurtains'
  | 'dressCodeSketch'
  | 'logisticsStamp'
  | 'botanicalCardFrame';

export interface RecommendedDimensions {
  readonly width: number;
  readonly height: number;
}

export interface EditorialAssetSpec {
  readonly key: EditorialAssetKey;
  readonly path: string;
  readonly resolvedSrc: string | null;
  readonly alt: string;
  readonly isDecorative: boolean;
  readonly aspectRatio: string;
  readonly recommendedDimensions: RecommendedDimensions;
  readonly targetMaxSizeKb: number;
  readonly hasFallback: boolean;
  readonly loadingPriority: 'eager' | 'lazy';
  readonly fetchPriority?: 'high';
  readonly phase: 1 | 2;
}

/**
 * Resuelve exclusivamente archivos raster de producción en `src/assets/images/`.
 * Si la carpeta está vacía o solo contiene algunos archivos (ej. `couple-cameo-photo.webp`),
 * el diccionario queda parcial sin producir errores de compilación ni en ejecución.
 */
const bundledEditorialImages = import.meta.glob<string>(
  '../assets/images/*.{avif,webp,jpg,jpeg,png,AVIF,WEBP,JPG,JPEG,PNG}',
  {
    eager: true,
    import: 'default',
  },
);

const RASTER_EXTENSION_PRIORITY = ['avif', 'webp', 'jpg', 'jpeg', 'png'] as const;

function resolveBundledAsset(baseName: string): string | null {
  for (const ext of RASTER_EXTENSION_PRIORITY) {
    const lowerCandidate = `../assets/images/${baseName}.${ext}`;
    const upperCandidate = `../assets/images/${baseName}.${ext.toUpperCase()}`;
    const match =
      bundledEditorialImages[lowerCandidate] ??
      bundledEditorialImages[upperCandidate];
    if (typeof match === 'string' && match.length > 0) {
      return match;
    }
  }

  return null;
}

export const EDITORIAL_ASSETS: Readonly<Record<EditorialAssetKey, EditorialAssetSpec>> = {
  envelopeTexture: {
    key: 'envelopeTexture',
    path: 'src/assets/images/envelope-texture.webp',
    resolvedSrc: resolveBundledAsset('envelope-texture'),
    alt: '',
    isDecorative: true,
    aspectRatio: '4 / 3',
    recommendedDimensions: { width: 840, height: 630 },
    targetMaxSizeKb: 75,
    hasFallback: true,
    loadingPriority: 'eager',
    fetchPriority: 'high',
    phase: 1,
  },
  envelopeLiningOlive: {
    key: 'envelopeLiningOlive',
    path: 'src/assets/images/envelope-lining-olive.webp',
    resolvedSrc: resolveBundledAsset('envelope-lining-olive'),
    alt: '',
    isDecorative: true,
    aspectRatio: '4 / 3',
    recommendedDimensions: { width: 1200, height: 900 },
    targetMaxSizeKb: 85,
    hasFallback: true,
    loadingPriority: 'eager',
    phase: 1,
  },
  waxSealBurgundy: {
    key: 'waxSealBurgundy',
    path: 'src/assets/images/wax-seal-burgundy.webp',
    resolvedSrc: resolveBundledAsset('wax-seal-burgundy'),
    alt: '',
    isDecorative: true,
    aspectRatio: '1 / 1',
    recommendedDimensions: { width: 320, height: 320 },
    targetMaxSizeKb: 45,
    hasFallback: true,
    loadingPriority: 'eager',
    phase: 1,
  },
  vellumOverlay: {
    key: 'vellumOverlay',
    path: 'src/assets/images/vellum-overlay.webp',
    resolvedSrc: resolveBundledAsset('vellum-overlay'),
    alt: '',
    isDecorative: true,
    aspectRatio: '4 / 7',
    recommendedDimensions: { width: 800, height: 1400 },
    targetMaxSizeKb: 70,
    hasFallback: true,
    loadingPriority: 'eager',
    fetchPriority: 'high',
    phase: 1,
  },
  heroCoupleBw: {
    key: 'heroCoupleBw',
    path: 'src/assets/images/hero-couple-bw.webp',
    resolvedSrc: resolveBundledAsset('hero-couple-bw'),
    alt: 'Retrato editorial en blanco y negro de Montse y Gerardo',
    isDecorative: false,
    aspectRatio: '4 / 5',
    recommendedDimensions: { width: 1080, height: 1350 },
    targetMaxSizeKb: 140,
    hasFallback: true,
    loadingPriority: 'eager',
    phase: 1,
  },
  editorialDividerBw: {
    key: 'editorialDividerBw',
    path: 'src/assets/images/editorial-divider-bw.webp',
    resolvedSrc: resolveBundledAsset('editorial-divider-bw'),
    alt: 'Montse y Gerardo sonriendo en retrato editorial en blanco y negro',
    isDecorative: false,
    aspectRatio: '16 / 10',
    recommendedDimensions: { width: 1440, height: 900 },
    targetMaxSizeKb: 140,
    hasFallback: true,
    loadingPriority: 'lazy',
    phase: 1,
  },
  heroFrameOrnament: {
    key: 'heroFrameOrnament',
    path: 'src/assets/images/hero-frame-ornament.webp',
    resolvedSrc: resolveBundledAsset('hero-frame-ornament'),
    alt: '',
    isDecorative: true,
    aspectRatio: '5 / 7',
    recommendedDimensions: { width: 1000, height: 1400 },
    targetMaxSizeKb: 110,
    hasFallback: true,
    loadingPriority: 'eager',
    fetchPriority: 'high',
    phase: 1,
  },
  countdownReliefBg: {
    key: 'countdownReliefBg',
    path: 'src/assets/images/countdown-relief-bg.webp',
    resolvedSrc: resolveBundledAsset('countdown-relief-bg'),
    alt: '',
    isDecorative: true,
    aspectRatio: '6 / 5',
    recommendedDimensions: { width: 1440, height: 1200 },
    targetMaxSizeKb: 120,
    hasFallback: true,
    loadingPriority: 'lazy',
    phase: 1,
  },
  coupleCameoPhoto: {
    key: 'coupleCameoPhoto',
    path: 'src/assets/images/couple-cameo-photo.webp',
    resolvedSrc: resolveBundledAsset('couple-cameo-photo'),
    alt: 'Retrato editorial en blanco y negro cálido de Montse y Gerardo',
    isDecorative: false,
    aspectRatio: '3 / 4',
    recommendedDimensions: { width: 720, height: 960 },
    targetMaxSizeKb: 130,
    hasFallback: true,
    loadingPriority: 'lazy',
    phase: 1,
  },
  venueEngraving: {
    key: 'venueEngraving',
    path: 'src/assets/images/venue-engraving.webp',
    resolvedSrc: resolveBundledAsset('venue-engraving'),
    alt: 'Grabado arquitectónico clásico del recinto de la boda',
    isDecorative: false,
    aspectRatio: '4 / 3',
    recommendedDimensions: { width: 1200, height: 900 },
    targetMaxSizeKb: 110,
    hasFallback: true,
    loadingPriority: 'lazy',
    phase: 2,
  },
  itineraryCurtains: {
    key: 'itineraryCurtains',
    path: 'src/assets/images/itinerary-curtains.webp',
    resolvedSrc: resolveBundledAsset('itinerary-curtains'),
    alt: '',
    isDecorative: true,
    aspectRatio: '3 / 4',
    recommendedDimensions: { width: 1200, height: 1600 },
    targetMaxSizeKb: 80,
    hasFallback: true,
    loadingPriority: 'lazy',
    phase: 2,
  },
  dressCodeSketch: {
    key: 'dressCodeSketch',
    path: 'src/assets/images/dress-code-sketch.webp',
    resolvedSrc: resolveBundledAsset('dress-code-sketch'),
    alt: 'Ilustración editorial de etiqueta formal para la boda',
    isDecorative: false,
    aspectRatio: '4 / 5',
    recommendedDimensions: { width: 800, height: 1000 },
    targetMaxSizeKb: 85,
    hasFallback: true,
    loadingPriority: 'lazy',
    phase: 2,
  },
  logisticsStamp: {
    key: 'logisticsStamp',
    path: 'src/assets/images/logistics-stamp.webp',
    resolvedSrc: resolveBundledAsset('logistics-stamp'),
    alt: '',
    isDecorative: true,
    aspectRatio: '1 / 1',
    recommendedDimensions: { width: 480, height: 480 },
    targetMaxSizeKb: 45,
    hasFallback: true,
    loadingPriority: 'lazy',
    phase: 2,
  },
  botanicalCardFrame: {
    key: 'botanicalCardFrame',
    path: 'src/assets/images/botanical-card-frame.webp',
    resolvedSrc: resolveBundledAsset('botanical-card-frame'),
    alt: '',
    isDecorative: true,
    aspectRatio: '5 / 6',
    recommendedDimensions: { width: 1000, height: 1200 },
    targetMaxSizeKb: 95,
    hasFallback: true,
    loadingPriority: 'lazy',
    phase: 2,
  },
};

export function getEditorialAsset(key: EditorialAssetKey): EditorialAssetSpec {
  return EDITORIAL_ASSETS[key];
}
