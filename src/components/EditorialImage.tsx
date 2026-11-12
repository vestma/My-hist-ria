import React, { useState } from 'react';
import { Compass } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  aspectClass?: string;
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  src,
  alt,
  caption,
  className = '',
  aspectClass = 'aspect-[16/9]',
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <figure className={className}>
      <div
        className={`relative overflow-hidden bg-[#EBE8E1] border border-[#E5E2DC] rounded-lg ${aspectClass}`}
      >
        {!hasError ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#F1EFEA] to-[#E5E2DC] text-[#57534E]">
            <Compass className="w-8 h-8 mb-3 stroke-[1.5] text-[#1E3A8A]" />
            <p className="font-editorial text-base text-[#1C1917] max-w-xs">{alt}</p>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-xs text-[#57534E] font-editorial italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
