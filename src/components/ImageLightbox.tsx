import React, { useEffect, useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export const ImageLightbox: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');

  useEffect(() => {
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && target.closest('.photos_projets figure')) {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImage((target as HTMLImageElement).src);
        setOpen(true);
      }
    };

    // Use event delegation on the document body
    document.body.addEventListener('click', handleImageClick, true);
    
    return () => {
      document.body.removeEventListener('click', handleImageClick, true);
    };
  }, []);

  return (
    <Lightbox
      open={open}
      close={() => setOpen(false)}
      slides={[{ src: currentImage }]}
      carousel={{ finite: true }}
      animation={{ fade: 400 }}
      controller={{ closeOnBackdropClick: true }}
      styles={{
        container: { backgroundColor: 'rgba(0, 0, 0, .9)' },
      }}
      render={{
        buttonPrev: () => null,
        buttonNext: () => null,
      }}
    />
  );
};