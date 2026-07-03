'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Share2, Download, Eye } from 'lucide-react';
import Link from 'next/link';

import { usePattern } from '../hooks/usePatterns';
import { PatternAdminActions } from './PatternAdminActions';

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
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-gray-500">Chargement du pattern...</p>
        </div>
      </div>
    );
  }

  if (error || !pattern) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <p className="mb-4 font-semibold text-red-600">Erreur de chargement</p>
          <Link href="/patternsDashboard" className="text-blue-600 hover:underline">
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Back Button */}
      <Link
        href="/patternsDashboard"
        className="inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft size={20} />
        Retour
      </Link>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-xl border border-gray-200 bg-linear-to-br from-gray-50 to-white shadow-sm"
      >
        <div className="grid gap-8 p-8 md:grid-cols-2">
          {/* Image */}
          <div className="flex items-center justify-center">
            {pattern.imgUrl ? (
              <img
                src={pattern.imgUrl}
                alt={pattern.name}
                className="h-auto max-h-96 w-full rounded-lg object-cover shadow-md"
              />
            ) : (
              <div className="flex h-96 w-full items-center justify-center rounded-lg bg-linear-to-br from-purple-400 to-pink-400">
                <span className="text-6xl text-white">✨</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900">
                {pattern.name || pattern.localName}
              </h1>
              <p className="text-lg text-gray-600">{pattern.summary}</p>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-sm text-gray-500">Type</p>
                <p className="font-semibold text-gray-900">{pattern.type}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-gray-500">Origine</p>
                <div className="flex items-center gap-1">
                  <MapPin size={16} className="text-gray-600" />
                  <p className="font-semibold text-gray-900">{pattern.origin?.country || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm text-gray-500">Ère</p>
                <p className="font-semibold text-gray-900">{pattern.era || 'N/A'}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-gray-500">Licence</p>
                <p className="font-semibold text-gray-900">{pattern.license || 'N/A'}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{pattern.views || 0}</p>
                <p className="flex items-center justify-center gap-1 text-sm text-gray-500">
                  <Eye size={14} /> Vues
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{pattern.downloads || 0}</p>
                <p className="flex items-center justify-center gap-1 text-sm text-gray-500">
                  <Download size={14} /> Téléchargements
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-gray-500">Mis à jour</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(pattern.updatedAt || new Date()).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700">
                <Share2 size={18} />
                Partager
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50">
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
      <div className="grid gap-8 md:grid-cols-2">
        {/* History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-xl font-bold text-gray-900">Histoire</h2>
          <p className="leading-relaxed text-gray-600">{pattern.history}</p>
        </motion.div>

        {/* Technique */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-xl font-bold text-gray-900">Technique</h2>
          <p className="leading-relaxed text-gray-600">{pattern.technique}</p>
        </motion.div>
      </div>

      {/* Symbolism & Ceremonial */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Symbolism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-xl font-bold text-gray-900">Symbolisme</h2>

          <p className="mb-4 leading-relaxed text-gray-600">{pattern.symbolism?.meaning}</p>

          <div className="flex flex-wrap gap-2">
            {pattern.symbolism?.keywords?.map((k: string) => (
              <span key={k} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                {k}
              </span>
            ))}
          </div>

          <p className="mt-4 leading-relaxed text-gray-600">{pattern.symbolism?.usage}</p>
        </motion.div>

        {/* Ceremonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-xl font-bold text-gray-900">Cérémoniel</h2>

          <p className="leading-relaxed text-gray-600">{pattern.ceremonial}</p>
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
          <h2 className="mb-6 text-xl font-bold text-gray-900">Couleurs</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {pattern.colors.map((color: any) => (
              <div key={color?.id} className="space-y-3">
                <div
                  className="h-24 rounded-lg border-2 border-gray-200 shadow-sm"
                  style={{ backgroundColor: color?.hex }}
                />
                <div>
                  <p className="font-semibold text-gray-900">{color?.name}</p>
                  <p className="font-mono text-xs text-gray-500">{color?.hex}</p>
                  {color?.meaning && <p className="mt-1 text-xs text-gray-600">{color.meaning}</p>}
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
          <h2 className="mb-6 text-xl font-bold text-gray-900">Symboles</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {pattern.symbols.map((symbol: any) => (
              <div key={symbol?.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-start gap-4">
                  {symbol?.imageUrl && (
                    <img
                      src={symbol.imageUrl}
                      alt={symbol.name}
                      className="h-16 w-16 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{symbol?.name}</h3>
                    {symbol?.meaning && (
                      <p className="mt-1 text-sm text-gray-600">{symbol.meaning}</p>
                    )}
                    {symbol?.usage && <p className="mt-2 text-xs text-gray-500">{symbol.usage}</p>}
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
          className="rounded-xl border border-gray-200 bg-linear-to-br from-blue-50 to-indigo-50 p-8 italic shadow-sm"
        >
          <p className="mb-4 text-lg text-gray-900">"{pattern.artisanQuote.text}"</p>
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
          <h2 className="mb-4 text-xl font-bold text-gray-900">Sources</h2>
          <ul className="space-y-2">
            {pattern.sources.map((source, idx) => (
              <li key={idx}>
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm break-all text-blue-600 hover:underline"
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
