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
  sideDecoration?: React.ReactNode;
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
  sideDecoration,
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
      'relative bg-cream editorial-cotton-paper text-espresso border-y border-divider/80 overflow-hidden isolate',
    'relief-dark':
      'relative bg-burgundy text-cream border-y border-cream/20 overflow-hidden isolate',
    'letterpress-card':
      'relative bg-card/90 editorial-cotton-paper text-espresso border border-divider rounded-sm editorial-letterpress-shadow overflow-hidden isolate',
  };

  const Component = as;

  return (
    <Component
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`${variantContainerClasses[variant]} ${className}`}
    >
      {/* Capa decorativa base según variante (papel algodón continuo en variantes claras) */}
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

      {/* Capa opcional de textura raster real resuelta desde editorialAssets */}
      {resolvedTextureSrc && asset && variant === 'letterpress-card' ? (
        <>
          {/* Esquinas superiores e inferiores ancladas para evitar recorte en Desktop */}
          <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-x-2.5 sm:inset-x-4 top-2.5 sm:top-4 h-28 sm:h-40 md:h-44 overflow-hidden mix-blend-multiply editorial-botanical-fade-top"
          >
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
              className="w-full h-full object-cover object-top opacity-95"
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-x-2.5 sm:inset-x-4 bottom-2.5 sm:bottom-4 h-28 sm:h-40 md:h-44 overflow-hidden mix-blend-multiply editorial-botanical-fade-bottom"
          >
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
              className="w-full h-full object-cover object-bottom opacity-95"
            />
          </div>
        </>
      ) : (
        resolvedTextureSrc &&
        asset && (
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
                  : 'pointer-events-none select-none absolute inset-0 w-full h-full object-cover object-center opacity-20'
              }
            />
            {variant === 'relief-dark' && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-burgundy/30"
              />
            )}
            {variant === 'paper-ivory' && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-cream/20"
              />
            )}
          </>
        )
      )}

      {/* Ornamento lateral full-bleed opcional (ej. Blind Embossing botánico en márgenes) */}
      {sideDecoration}

      {/* Contenido real */}
      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </Component>
  );
};
