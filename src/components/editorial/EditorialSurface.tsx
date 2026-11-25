import React, { useState } from 'react';
import {
  EditorialAssetKey,
  getEditorialAsset,
} from '../../config/editorialAssets';

export type EditorialSurfaceVariant =
  | 'paper-ivory'
  | 'relief-dark'
  | 'letterpress-card';

export type EditorialSurfaceElement = 'section' | 'div' | 'article' | 'header';

export interface EditorialSurfaceProps {
  as?: EditorialSurfaceElement;
  variant: EditorialSurfaceVariant;
  textureAssetKey?: EditorialAssetKey;
  id?: string;
  className?: string;
  contentClassName?: string;
  'aria-labelledby'?: string;
  children: React.ReactNode;
}

export const EditorialSurface: React.FC<EditorialSurfaceProps> = ({
  as = 'div',
  variant,
  textureAssetKey,
  id,
  className = '',
  contentClassName = '',
  'aria-labelledby': ariaLabelledBy,
  children,
}) => {
  const [textureFailed, setTextureFailed] = useState(false);

  const asset = textureAssetKey ? getEditorialAsset(textureAssetKey) : null;
  const resolvedTextureSrc =
    asset && !textureFailed ? asset.resolvedSrc : null;

  const variantContainerClasses: Record<EditorialSurfaceVariant, string> = {
    'paper-ivory':
      'relative bg-cream text-espresso border-y border-divider/80 overflow-hidden',
    'relief-dark':
      'relative bg-burgundy text-cream border-y border-cream/20 overflow-hidden',
    'letterpress-card':
      'relative bg-card/90 text-espresso border border-divider rounded-sm backdrop-blur-sm editorial-letterpress-shadow overflow-hidden',
  };

  const Component = as;

  return (
    <Component
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`${variantContainerClasses[variant]} ${className}`}
    >
      {/* Capa decorativa base según variante (acabado minimalista editorial sin clipart SVG) */}
      {variant === 'paper-ivory' && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 editorial-paper-grain"
        />
      )}

      {variant === 'relief-dark' && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 editorial-relief-dark-pattern"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cream/25 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cream/20 to-transparent"
          />
        </>
      )}

      {variant === 'letterpress-card' && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 editorial-paper-grain opacity-65"
          />
          {/* Doble marco fino 1px de papelería editorial */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 sm:inset-4 border border-divider/90 rounded-[2px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-3.5 sm:inset-5 border border-divider/45 rounded-[1px]"
          />
        </>
      )}

      {/* Capa opcional de textura raster real resuelta desde editorialAssets (sin object-fill) */}
      {resolvedTextureSrc && asset && (
        <>
          <img
            src={resolvedTextureSrc}
            alt=""
            aria-hidden="true"
            width={asset.recommendedDimensions.width}
            height={asset.recommendedDimensions.height}
            loading={asset.loadingPriority}
            decoding={asset.loadingPriority === 'eager' ? 'sync' : 'async'}
            fetchPriority={asset.fetchPriority}
            onError={() => setTextureFailed(true)}
            className={
              variant === 'relief-dark'
                ? 'pointer-events-none select-none absolute inset-0 w-full h-full object-cover object-center opacity-85'
                : variant === 'letterpress-card'
                  ? 'pointer-events-none select-none absolute inset-0 w-full h-full object-cover object-center opacity-75'
                  : 'pointer-events-none select-none absolute inset-0 w-full h-full object-cover object-center opacity-20'
            }
          />
          {variant === 'relief-dark' && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-burgundy/30"
            />
          )}
          {variant === 'letterpress-card' && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-card/30"
            />
          )}
          {variant === 'paper-ivory' && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-cream/35"
            />
          )}
        </>
      )}

      {/* Contenido real */}
      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </Component>
  );
};
