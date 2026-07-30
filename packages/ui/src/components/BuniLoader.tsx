'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

type LoaderVariant = 'fill-spin' | 'spin' | 'fill';
type LoaderTheme = 'dark' | 'light';

interface BuniLoaderProps {
  size?: number;
  showText?: boolean;
  variant?: LoaderVariant;
  theme?: LoaderTheme;
}

const LEFT_PATH =
  'M 44 6 L 44 34 C 20 36, 8 50, 8 70 C 8 90, 20 104, 44 106 L 44 134 C 12 132, 6 108, 6 70 C 6 32, 12 8, 44 6 Z';
const RIGHT_PATH =
  'M 76 6 L 76 34 C 100 36, 112 50, 112 70 C 112 90, 100 104, 76 106 L 76 134 C 108 132, 114 108, 114 70 C 114 32, 108 8, 76 6 Z';

// La forme tient dans un rectangle ~108x128 centré sur (60,70).
// Demi-diagonale ≈ 84 → il faut un viewBox carré d'au moins 170x170
// centré au même point pour que la rotation ne clippe jamais les coins.
const VIEWBOX = '-25 -15 170 170';

export const BuniLoader: React.FC<BuniLoaderProps> = ({
  size = 120,
  showText = true,
  variant = 'fill-spin',
  theme = 'dark',
}) => {
  const uid = React.useId().replace(/:/g, '');
  const clipLeft = `buni-clip-left-${uid}`;
  const clipRight = `buni-clip-right-${uid}`;

  // Couleurs selon le thème
  const colors = theme === 'dark'
    ? {
        track: 'var(--avs-loader-track, #2A2A28)',
        beige: 'var(--avs-loader-beige, #E4D8C7)',
        rust: 'var(--avs-loader-rust, #C0573E)',
        textAccent: 'var(--avs-loader-text-accent, #E4D8C7)',
        textPrimary: 'var(--avs-loader-text-primary, #C0573E)',
      }
    : {
        track: 'var(--avs-loader-track, #EFE9DE)',
        beige: 'var(--avs-loader-beige, #A8452E)',
        rust: 'var(--avs-loader-rust, #1D1D1B)',
        textAccent: 'var(--avs-loader-text-accent, #1D1D1B)',
        textPrimary: 'var(--avs-loader-text-primary, #A8452E)',
      };

  const trackColor = colors.track;
  const beige = colors.beige;
  const rust = colors.rust;

  const showFill = variant === 'fill-spin' || variant === 'fill';
  const isSpin = variant === 'spin';
  const isFillSpin = variant === 'fill-spin';

  const fillTransition = isFillSpin
    ? { duration: 3, times: [0, 0.35, 0.85, 0.86, 1], repeat: Infinity, ease: 'easeInOut' as const }
    : { duration: 1.8, times: [0, 0.5, 1], repeat: Infinity, ease: 'easeInOut' as const };

  const fillAnimate = isFillSpin
    ? { y: [140, 0, 0, 140, 140] }
    : { y: [140, 0, 140] };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* conteneur carré, plus de contrainte 120x140 */}
      <div className="relative" style={{ width: size, height: size }}>
        <motion.svg
          viewBox={VIEWBOX}
          width={size}
          height={size}
          style={{ overflow: 'visible' }}
          animate={isSpin ? { rotate: 360 } : undefined}
          transition={
            isSpin
              ? { duration: 1.6, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }
              : undefined
          }
        >
          <defs>
            <clipPath id={clipLeft}>
              <path d={LEFT_PATH} />
            </clipPath>
            <clipPath id={clipRight}>
              <path d={RIGHT_PATH} />
            </clipPath>
          </defs>

          <motion.g
            style={{ transformOrigin: '60px 70px' }}
            animate={isFillSpin ? { rotate: [0, 0, 360, 360] } : undefined}
            transition={
              isFillSpin
                ? { duration: 3, times: [0, 0.35, 0.85, 1], repeat: Infinity, ease: 'linear' }
                : undefined
            }
          >
            <path d={LEFT_PATH} fill={trackColor} />
            <path d={RIGHT_PATH} fill={trackColor} />

            {showFill && (
              <>
                <g clipPath={`url(#${clipLeft})`}>
                  <motion.rect
                    x={0}
                    width={60}
                    height={140}
                    fill={beige}
                    animate={fillAnimate}
                    transition={fillTransition}
                  />
                </g>
                <g clipPath={`url(#${clipRight})`}>
                  <motion.rect
                    x={60}
                    width={60}
                    height={140}
                    fill={beige}
                    animate={fillAnimate}
                    transition={{ ...fillTransition, delay: isFillSpin ? 0 : 0.15 }}
                  />
                </g>
              </>
            )}
          </motion.g>
        </motion.svg>

        <motion.div
          className="absolute left-1/2 top-1/2 rounded-md"
          style={{ width: 22, height: 22, marginLeft: -11, marginTop: -11, background: rust }}
          animate={{ scale: [0.85, 1.25, 0.85], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: isFillSpin ? 3 : 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {showText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <span className="font-display text-xl font-bold tracking-[0.2em]" style={{ color: colors.textAccent }}>
            BUNI
          </span>
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[10px] uppercase tracking-[0.3em] font-semibold"
            style={{ color: colors.textPrimary }}
          >
            Heritage. Code. Future.
          </motion.span>
        </motion.div>
      )}
    </div>
  );
};