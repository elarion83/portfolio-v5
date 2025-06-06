import React, { useEffect, useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export const ImageLightbox: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');

  useEffect(() => {
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && target.closest('.photos_projets')) {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImage((target as HTMLImageElement).src);
        setOpen(true);
      }
    };

    const initializeLightbox = () => {
      // Retirer l'ancien écouteur s'il existe
      document.body.removeEventListener('click', handleImageClick);
      // Ajouter le nouvel écouteur
      document.body.addEventListener('click', handleImageClick);
    };

    // Observer les changements dans le DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          // Si des nœuds ont été ajoutés, réinitialiser la lightbox
          initializeLightbox();
        }
      });
    });

    // Configurer l'observer pour surveiller les changements dans le corps du document
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initialisation initiale
    initializeLightbox();
    
    return () => {
      document.body.removeEventListener('click', handleImageClick);
      observer.disconnect();
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