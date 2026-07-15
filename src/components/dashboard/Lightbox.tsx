import React, { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const XIcon = FiX as React.FC<{ className?: string; onClick?: () => void }>;
const LeftIcon = FiChevronLeft as React.FC<{ className?: string; onClick?: () => void }>;
const RightIcon = FiChevronRight as React.FC<{ className?: string; onClick?: () => void }>;

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, currentIndex, onClose }) => {
  const [index, setIndex] = useState(currentIndex);

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>
        <XIcon />
      </button>

      {images.length > 1 && (
        <>
          <button className="lightbox-nav left" onClick={goPrev}>
            <LeftIcon />
          </button>
          <button className="lightbox-nav right" onClick={goNext}>
            <RightIcon />
          </button>
        </>
      )}

      <div className="lightbox-image-container" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[index]}
          alt={`Full view ${index + 1}`}
          className="lightbox-image"
        />
      </div>

      <div className="lightbox-counter">
        {index + 1} / {images.length}
      </div>
    </div>
  );
};

export default Lightbox;