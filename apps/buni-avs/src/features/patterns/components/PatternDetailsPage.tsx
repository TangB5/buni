'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Share2, Download, Eye } from 'lucide-react';
import Link from 'next/link';
import { usePattern } from '@/features/patterns/hooks/usePatterns';
import { PatternAdminActions } from '@/features/patterns/components/PatternAdminActions';
import type { Pattern } from '@/features/patterns/types';

interface PatternDetailsPageProps {
  slug: string;
}

/**
 * Page de détail d'un pattern
 * Affiche les infos complètes + permet les actions (publish, feature, etc)
 */
export default function PatternDetailsPage({ slug }: PatternDetailsPageProps) {
  const { data: pattern, isLoading, error } = usePattern(slug);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement du pattern...</p>
        </div>
      </div>
    );
  }

  if (error || !pattern) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">Erreur de chargement</p>
          <Link href="/patternsDashboard" className="text-blue-600 hover:underline">
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Back Button */}
      <Link
        href="/patternsDashboard"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <ArrowLeft size={20} />
        Retour
      </Link>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white overflow-hidden shadow-sm"
      >
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Image */}
          <div className="flex items-center justify-center">
            {pattern.imgUrl ? (
              <img
                src={pattern.imgUrl}
                alt={pattern.name}
                className="w-full h-auto rounded-lg shadow-md object-cover max-h-96"
              />
            ) : (
              <div className="w-full h-96 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <span className="text-white text-6xl">✨</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {pattern.name || pattern.nameLocal}
              </h1>
              <p className="text-lg text-gray-600">{pattern.summary}</p>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Type</p>
                <p className="font-semibold text-gray-900">{pattern.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Origine</p>
                <div className="flex items-center gap-1">
                  <MapPin size={16} className="text-gray-600" />
                  <p className="font-semibold text-gray-900">
                    {pattern.origin?.country || 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Ère</p>
                <p className="font-semibold text-gray-900">{pattern.era || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Licence</p>
                <p className="font-semibold text-gray-900">{pattern.license || 'N/A'}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{pattern.views || 0}</p>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  <Eye size={14} /> Vues
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{pattern.downloads || 0}</p>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  <Download size={14} /> Téléchargements
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Mis à jour</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(pattern.updatedAt || new Date()).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Share2 size={18} />
                Partager
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                <Download size={18} />
                Télécharger
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Admin Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <PatternAdminActions pattern={pattern as any} />
      </motion.div>

      {/* Content Sections */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Histoire</h2>
          <p className="text-gray-600 leading-relaxed">{pattern.history}</p>
        </motion.div>

        {/* Technique */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Technique</h2>
          <p className="text-gray-600 leading-relaxed">{pattern.technique}</p>
        </motion.div>
      </div>

      {/* Symbolism & Ceremonial */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Symbolism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Symbolisme</h2>
          <p className="text-gray-600 leading-relaxed">{pattern.symbolism}</p>
        </motion.div>

        {/* Ceremonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cérémoniel</h2>
          <p className="text-gray-600 leading-relaxed">{pattern.ceremonial}</p>
        </motion.div>
      </div>

      {/* Colors */}
      {pattern.colors && pattern.colors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Couleurs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pattern.colors.map((color: any) => (
              <div key={color.id} className="space-y-3">
                <div
                  className="h-24 rounded-lg border-2 border-gray-200 shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <p className="font-semibold text-gray-900">{color.name}</p>
                  <p className="text-xs text-gray-500 font-mono">{color.hex}</p>
                  <p className="text-xs text-gray-600 mt-1">{color.meaning}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Symbols */}
      {pattern.symbols && pattern.symbols.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Symboles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pattern.symbols.map((symbol: any) => (
              <div key={symbol.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  {symbol.imageUrl && (
                    <img
                      src={symbol.imageUrl}
                      alt={symbol.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{symbol.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{symbol.meaning}</p>
                    <p className="text-xs text-gray-500 mt-2">{symbol.usage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Artisan Quote */}
      {pattern.artisanQuote && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm italic"
        >
          <p className="text-lg text-gray-900 mb-4">"{pattern.artisanQuote.text}"</p>
          <div className="border-t border-gray-300 pt-4">
            <p className="font-semibold text-gray-900">{pattern.artisanQuote.author}</p>
            <p className="text-sm text-gray-600">
              {pattern.artisanQuote.role}, {pattern.artisanQuote.country}
            </p>
          </div>
        </motion.div>
      )}

      {/* Sources */}
      {pattern.sources && pattern.sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sources</h2>
          <ul className="space-y-2">
            {pattern.sources.map((source, idx) => (
              <li key={idx}>
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all text-sm"
                >
                  {source}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}
