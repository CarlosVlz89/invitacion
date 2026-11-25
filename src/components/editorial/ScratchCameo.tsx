import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { getEditorialAsset } from '../../config/editorialAssets';
import { MonogramMG } from './MonogramMG';

const CANVAS_WIDTH = 520;
const CANVAS_HEIGHT = 694;
const BRUSH_RADIUS = 38;
const REVEAL_THRESHOLD = 0.55;
const SAMPLE_THROTTLE_MS = 140;

interface CanvasPoint {
  x: number;
  y: number;
}

function paintScratchFoil(ctx: CanvasRenderingContext2D): void {
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Fondo cálido en papel artesanal crema (#F2ECE1 / #E6DEC8)
  const baseGradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  baseGradient.addColorStop(0, '#F2ECE1');
  baseGradient.addColorStop(0.45, '#E6DEC8');
  baseGradient.addColorStop(0.75, '#DCD1B9');
  baseGradient.addColorStop(1, '#EDE5D5');
  ctx.fillStyle = baseGradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Destello sedoso diagonal sutil
  const sheenGradient = ctx.createRadialGradient(
    CANVAS_WIDTH * 0.3,
    CANVAS_HEIGHT * 0.25,
    20,
    CANVAS_WIDTH * 0.45,
    CANVAS_HEIGHT * 0.4,
    CANVAS_HEIGHT * 0.72,
  );
  sheenGradient.addColorStop(0, 'rgba(250, 247, 241, 0.48)');
  sheenGradient.addColorStop(0.55, 'rgba(242, 236, 225, 0.08)');
  sheenGradient.addColorStop(1, 'rgba(45, 35, 30, 0.1)');
  ctx.fillStyle = sheenGradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Trama de lino / papel fino (determinista, sin random en cada render)
  ctx.strokeStyle = 'rgba(45, 35, 30, 0.045)';
  ctx.lineWidth = 1;
  for (let y = 8; y < CANVAS_HEIGHT; y += 12) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(250, 247, 241, 0.2)';
  for (let x = 8; x < CANVAS_WIDTH; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
  }

  // Filigrana ovalada interior grabada en Deep Burgundy (#4F141C)
  ctx.strokeStyle = 'rgba(79, 20, 28, 0.34)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.ellipse(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    CANVAS_WIDTH / 2 - 22,
    CANVAS_HEIGHT / 2 - 22,
    0,
    0,
    Math.PI * 2,
  );
  ctx.stroke();

  ctx.strokeStyle = 'rgba(45, 35, 30, 0.18)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.ellipse(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    CANVAS_WIDTH / 2 - 34,
    CANVAS_HEIGHT / 2 - 34,
    0,
    0,
    Math.PI * 2,
  );
  ctx.stroke();
  ctx.setLineDash([]);

  // Emblema central e indicación táctil con contraste WCAG AA en Espresso (#2D231E)
  ctx.fillStyle = 'rgba(79, 20, 28, 0.88)';
  ctx.font = '500 32px "Cormorant Garamond", "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('M & G', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 22);

  ctx.fillStyle = 'rgba(45, 35, 30, 0.88)';
  ctx.font = '500 18px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.fillText('DESLIZA PARA', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 24);
  ctx.fillText('DESCUBRIR', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);

  ctx.restore();
}

function measureOvalClearedRatio(ctx: CanvasRenderingContext2D): number {
  const { data } = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  const cx = CANVAS_WIDTH / 2;
  const cy = CANVAS_HEIGHT / 2;
  const rx = CANVAS_WIDTH / 2;
  const ry = CANVAS_HEIGHT / 2;

  const stride = 6;
  let totalOvalSamples = 0;
  let transparentSamples = 0;

  for (let y = 0; y < CANVAS_HEIGHT; y += stride) {
    const ny = (y - cy) / ry;
    const nySq = ny * ny;

    for (let x = 0; x < CANVAS_WIDTH; x += stride) {
      const nx = (x - cx) / rx;
      if (nx * nx + nySq > 1) {
        continue;
      }

      totalOvalSamples += 1;
      const alphaIndex = (y * CANVAS_WIDTH + x) * 4 + 3;
      if (data[alphaIndex] < 128) {
        transparentSamples += 1;
      }
    }
  }

  if (totalOvalSamples === 0) return 0;
  return transparentSamples / totalOvalSamples;
}

export const ScratchCameo: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isRevealed, setIsRevealed] = useState<boolean>(() =>
    Boolean(prefersReducedMotion),
  );
  const [photoFailed, setPhotoFailed] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isScratchingRef = useRef<boolean>(false);
  const lastPointRef = useRef<CanvasPoint | null>(null);
  const lastSampleTimeRef = useRef<number>(0);

  const cameoAsset = getEditorialAsset('coupleCameoPhoto');
  const cameoSrc = !photoFailed ? cameoAsset.resolvedSrc : null;

  // Si el usuario tiene prefers-reduced-motion activo, revelar la fotografía directamente
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsRevealed(true);
    }
  }, [prefersReducedMotion]);

  // Inicializar lámina texturizada del canvas una vez montado
  useEffect(() => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    paintScratchFoil(ctx);
  }, [isRevealed]);

  const toCanvasCoordinates = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>): CanvasPoint | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;

      return {
        x: ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
        y: ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
      };
    },
    [],
  );

  const drawEraseStroke = useCallback(
    (from: CanvasPoint, to: CanvasPoint) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = BRUSH_RADIUS * 2;
      ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(to.x, to.y, BRUSH_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
    [],
  );

  const evaluateProgress = useCallback((force = false) => {
    if (isRevealed) return;

    const now = performance.now();
    if (!force && now - lastSampleTimeRef.current < SAMPLE_THROTTLE_MS) {
      return;
    }
    lastSampleTimeRef.current = now;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const clearedRatio = measureOvalClearedRatio(ctx);
    if (clearedRatio >= REVEAL_THRESHOLD) {
      isScratchingRef.current = false;
      lastPointRef.current = null;
      setIsRevealed(true);
    }
  }, [isRevealed]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    const point = toCanvasCoordinates(event);
    if (!point) return;

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Algunos navegadores sintéticos no requieren captura explícita
    }

    isScratchingRef.current = true;
    lastPointRef.current = point;
    drawEraseStroke(point, point);
    evaluateProgress(false);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratchingRef.current || isRevealed) return;
    const point = toCanvasCoordinates(event);
    if (!point) return;

    const previous = lastPointRef.current ?? point;
    drawEraseStroke(previous, point);
    lastPointRef.current = point;
    evaluateProgress(false);
  };

  const finishStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratchingRef.current) return;

    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Ignorar si ya fue liberado
    }

    isScratchingRef.current = false;
    lastPointRef.current = null;
    evaluateProgress(true);
  };

  const handleRevealDirectly = () => {
    isScratchingRef.current = false;
    lastPointRef.current = null;
    setIsRevealed(true);
  };

  return (
    <div className="flex flex-col items-center text-center">
      {/* Marco Ovalado Cameo con proporción fija (CLS = 0) */}
      <div className="relative p-2 rounded-[50%] border border-cream/25 bg-cream/[0.04] shadow-[0_20px_48px_-16px_rgba(0,0,0,0.55)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-2 rounded-[50%] border border-cream/10"
        />

        <div className="relative w-[228px] sm:w-[252px] aspect-[3/4] rounded-[50%] overflow-hidden border border-cream/35 bg-burgundy-hover">
          {/* Capa Inferior: Fotografía Editorial B&N Cálido o Placeholder Editorial */}
          {cameoSrc ? (
            <img
              src={cameoSrc}
              alt={cameoAsset.alt}
              width={cameoAsset.recommendedDimensions.width}
              height={cameoAsset.recommendedDimensions.height}
              loading="lazy"
              decoding="async"
              onError={() => setPhotoFailed(true)}
              className="w-full h-full object-cover object-center select-none"
            />
          ) : (
            <figure className="w-full h-full editorial-cameo-placeholder flex flex-col items-center justify-center px-6 py-8 text-espresso relative select-none">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 rounded-[50%] border border-espresso/20"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-5 rounded-[50%] border border-espresso/10"
              />
              <MonogramMG
                className="w-20 h-20 text-burgundy mb-3"
                decorative
              />
              <figcaption className="space-y-1">
                <span className="block font-script text-3xl text-espresso leading-none">
                  Montse &amp; Gerardo
                </span>
                <span className="block text-[10px] uppercase tracking-[0.26em] text-moka font-sans pt-1">
                  Julio · 2027
                </span>
              </figcaption>
            </figure>
          )}

          {/* Viñeta editorial sutil sobre la fotografía */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[50%] shadow-[inset_0_0_28px_rgba(45,35,30,0.32)]"
          />

          {/* Capa Superior Interactiva: Canvas HTML5 Scratch-to-Reveal */}
          <motion.canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            aria-hidden="true"
            data-testid="scratch-cameo-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishStroke}
            onPointerCancel={finishStroke}
            initial={false}
            animate={isRevealed ? { opacity: 0 } : { opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0.15 : 0.6,
              ease: 'easeOut',
            }}
            className={`absolute inset-0 w-full h-full rounded-[50%] touch-none select-none ${
              isRevealed ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'
            }`}
          />
        </div>
      </div>

      {/* Control Accesible Obligatorio y Región Live para Lectores de Pantalla */}
      <div className="mt-6 min-h-[44px] flex flex-col items-center justify-center">
        {!isRevealed ? (
          <button
            type="button"
            onClick={handleRevealDirectly}
            aria-label="Revelar fotografía de Montse y Gerardo"
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[36px] rounded-full border border-cream/35 bg-cream/[0.08] text-cream text-[11px] uppercase tracking-[0.22em] font-sans font-medium hover:bg-cream/[0.16] hover:border-cream/60 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
          >
            <Sparkles aria-hidden="true" className="w-3.5 h-3.5 text-cream/85" />
            <span>Revelar fotografía</span>
          </button>
        ) : (
          <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-cream/90 font-sans">
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full bg-cream/75"
            />
            <span>Montse &amp; Gerardo · Retrato Editorial</span>
          </p>
        )}

        <p className="sr-only" aria-live="polite">
          {isRevealed
            ? 'Fotografía de Montse y Gerardo revelada.'
            : 'Medallón interactivo cubierto. Usa el botón Revelar fotografía para descubrir el retrato.'}
        </p>
      </div>
    </div>
  );
};
