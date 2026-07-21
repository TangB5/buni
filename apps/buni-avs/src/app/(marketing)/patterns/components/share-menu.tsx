'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@buni/ui';

interface ShareMenuProps {
  pattern: any;
}

const SHARE_PLATFORMS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: 'pi-whatsapp',
    color: '#25D366',
    hoverColor: '#128C7E',
    isDirect: true,
    getShareUrl: (url: string, pattern: any) => {
      const message = `*${pattern.name}*\n\n${pattern.summary}\n\n ${pattern.origin.country} - ${pattern.origin.people}\n\n Découvrir ce motif: ${url}\n\n Image: ${pattern.imgUrl || url}`;
      return `https://wa.me/?text=${encodeURIComponent(message)}`;
    },
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'pi-facebook',
    color: '#1877F2',
    hoverColor: '#0D65D9',
    isDirect: true,
    getShareUrl: (url: string, pattern: any) => {
      // Facebook utilise les métadonnées Open Graph de la page pour l'image
      // Mais on peut ajouter un paramètre pour forcer le rafraîchissement du cache
      const cacheBuster = `?fb_refresh=${Date.now()}`;
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url + cacheBuster)}&quote=${encodeURIComponent(`Découvrez ${pattern.name}, un magnifique motif ${pattern.origin.country}`)}`;
    },
  },
  {
    id: 'x',
    name: 'X',
    icon: 'pi-twitter',
    color: '#000000',
    hoverColor: '#333333',
    isDirect: true,
    getShareUrl: (url: string, pattern: any) => {
      const hashtags = '#ArtAfricain #Culture #Patrimoine #TextileTraditionnel';
      const text = `${pattern.name} - ${pattern.origin.country} ${pattern.origin.flag} ${hashtags}`;
      // X utilise les métadonnées Twitter Card de la page pour l'image
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    },
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'pi-instagram',
    color: '#E4405F',
    hoverColor: '#C13584',
    getShareUrl: () => null,
    isDirect: false,
  },
] as const;

export function ShareMenu({ pattern }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { add: addToast } = useToast();
  const menuRef = useRef<HTMLDivElement>(null);

  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/pattern/${pattern.id}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleShare = async (platform: typeof SHARE_PLATFORMS[number]) => {
    if (platform.isDirect === false) {
      addToast({
        variant: 'info',
        message: `Pour partager sur ${platform.name}, téléchargez l'image et utilisez l'application. Image: ${pattern.imgUrl}`,
      });
      setIsOpen(false);
      return;
    }

    const shareUrl = platform.getShareUrl(url, pattern);
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      addToast({ variant: 'success', message: 'Lien copié !' });
      setIsOpen(false);
    } catch (err) {
      console.error('Copy error:', err);
      addToast({ variant: 'error', message: 'Erreur lors de la copie' });
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-avs-primary/10 text-avs-primary hover:bg-avs-primary/20 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-200"
        title="Partager ce motif"
      >
        <i className="pi pi-share-alt" style={{ fontSize: '11px' }} /> Partager
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-avs-accent/10 bg-avs-secondary shadow-avs-lg"
          >
            <div className="border-avs-accent/10 border-b px-4 py-3">
              <p className="text-avs-accent font-mono text-[9px] font-bold tracking-[0.16em] uppercase">
                Partager sur
              </p>
            </div>

            <div className="p-2">
              {SHARE_PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handleShare(platform)}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 hover:bg-avs-secondary-dark"
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: platform.color }}
                  >
                    <i
                      className={`pi ${platform.icon} text-white`}
                      style={{ fontSize: '13px' }}
                    />
                  </div>
                  <span className="text-avs-accent text-xs font-semibold group-hover:text-avs-primary">
                    {platform.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="border-avs-accent/10 border-t p-2">
              <button
                onClick={handleCopyLink}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 hover:bg-avs-secondary-dark"
              >
                <div className="bg-avs-accent/10 text-avs-accent flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 group-hover:bg-avs-primary group-hover:text-avs-secondary">
                  <i className="pi pi-link" style={{ fontSize: '13px' }} />
                </div>
                <span className="text-avs-accent text-xs font-semibold group-hover:text-avs-primary">
                  Copier le lien
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
