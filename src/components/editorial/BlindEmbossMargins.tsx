import React, { useState } from 'react';
import { getEditorialAsset } from '../../config/editorialAssets';

export const BlindEmbossMargins: React.FC = () => {
  const [imageFailed, setImageFailed] = useState(false);
  const embossAsset = getEditorialAsset('botanicalEmbossBranch');
  const embossSrc = !imageFailed ? embossAsset.resolvedSrc : null;

  if (!embossSrc) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden z-[2]"
    >
      <img
        src={embossSrc}
        alt=""
        aria-hidden="true"
        width={embossAsset.recommendedDimensions.width}
        height={embossAsset.recommendedDimensions.height}
        loading="lazy"
        decoding="async"
        onError={() => setImageFailed(true)}
        className="pointer-events-none select-none absolute left-0 top-6 md:top-1/2 md:-translate-y-1/2 w-20 sm:w-32 md:w-44 h-auto opacity-70 md:opacity-85"
      />
      <img
        src={embossSrc}
        alt=""
        aria-hidden="true"
        width={embossAsset.recommendedDimensions.width}
        height={embossAsset.recommendedDimensions.height}
        loading="lazy"
        decoding="async"
        onError={() => setImageFailed(true)}
        className="pointer-events-none select-none absolute right-0 top-6 md:top-1/2 md:-translate-y-1/2 w-20 sm:w-32 md:w-44 h-auto -scale-x-100 opacity-70 md:opacity-85"
      />
    </div>
  );
};
