'use client';

import { motion } from 'framer-motion';

interface BuniLoaderProps {
  size?: number;
  showText?: boolean;
}

export function BuniLoader({ size = 80, showText = true }: BuniLoaderProps) {
  // Couleurs AVS
  const primary = '#C0573E';   // Terre rouge
  const accent = '#1D1D1B';    // Ébène

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <motion.svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial="hidden"
          animate="visible"
          className="w-full h-full"
        >
          {/* Forme de la graine / Grain BUNI - Moitié Gauche */}
          <motion.path
            d="M50 10 C25 10 10 40 10 60 C10 85 35 90 50 90 L50 10Z"
            stroke={accent}
            strokeWidth="2"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { 
                pathLength: 1, 
                opacity: 1,
                transition: { duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
              }
            }}
          />

          {/* Forme de la graine / Grain BUNI - Moitié Droite */}
          <motion.path
            d="M50 10 C75 10 90 40 90 60 C90 85 65 90 50 90 L50 10Z"
            stroke={primary}
            strokeWidth="2"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { 
                pathLength: 1, 
                opacity: 1,
                transition: { duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.5 }
              }
            }}
          />

          {/* Motifs internes (Géométrie Ndop/Wax) */}
          <motion.path
            d="M30 40 L45 40 M25 55 L45 55 M35 70 L45 70"
            stroke={accent}
            strokeWidth="3"
            strokeLinecap="round"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: [0, 1, 0], transition: { duration: 1.5, repeat: Infinity } }
            }}
          />
          
          <motion.path
            d="M70 45 L55 45 M75 60 L55 60 M65 75 L55 75"
            stroke={primary}
            strokeWidth="3"
            strokeLinecap="round"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: [0, 1, 0], transition: { duration: 1.5, repeat: Infinity, delay: 0.75 } }
            }}
          />

          {/* Point central (Le Standard) */}
          <motion.circle
            cx="50"
            cy="50"
            r="4"
            fill={primary}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.svg>
      </div>

      {/* Texte Animé */}
      {showText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <span className="font-display text-xl font-bold tracking-[0.2em] text-avs-accent">
            BUNI
          </span>
          <motion.span 
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[10px] uppercase tracking-[0.3em] text-avs-primary font-semibold"
          >
            African Visual Standard
          </motion.span>
        </motion.div>
      )}
    </div>
  );
}