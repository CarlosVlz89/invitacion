import React, { useState } from 'react';
import { getEditorialAsset } from '../../config/editorialAssets';

export const EditorialPhotoDivider: React.FC = () => {
  const [imageFailed, setImageFailed] = useState(false);
  const dividerAsset = getEditorialAsset('editorialDividerBw');
  const src = !imageFailed ? dividerAsset.resolvedSrc : null;

  if (!src) {
    return null;
  }

  return (
    <section
      aria-label="Retrato editorial de Montse y Gerardo"
      className="w-full border-y border-divider bg-cream-deep/40 overflow-hidden"
    >
      <figure className="w-full aspect-[4/3] md:aspect-auto md:h-[440px] lg:h-[520px] overflow-hidden">
        <img
          src={src}
          alt={dividerAsset.alt}
          width={dividerAsset.recommendedDimensions.width}
          height={dividerAsset.recommendedDimensions.height}
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
          className="w-full h-full object-cover object-[50%_32%] select-none"
        />
      </figure>
    </section>
  );
};
