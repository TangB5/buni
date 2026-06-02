'use client';

import type { Metadata, Route } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Download, Share2, MapPin, Eye, Globe, Tag, Loader2, AlertCircle } from 'lucide-react';
import type { Pattern } from 'apps/buni-avs/src/features/patterns/types';
import { useToast } from '@buni/ui';
import { patternService } from 'apps/buni-avs/src/features/patterns/services/pattern.service';
import { mapPatternDtoToModel } from 'apps/buni-avs/src/features/patterns/mappers/pattern.mapper';

// ── Pattern Detail Page ────────────────────────────────────────────────────────
export default function PatternDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState('');
  const [pattern, setPattern] = useState<Pattern | null >(null);
  const [similarPatterns, setSimilarPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { add: addToast } = useToast();

  // Fetch pattern par slug
  useEffect(() => {
    (async () => {
      try {
        const resolved = await params;
        setSlug(resolved.slug);

        // Fetch le motif principal
        const responce = await patternService.bySlug(resolved.slug);

        const patternRes = mapPatternDtoToModel(responce.data);

        

        setPattern(patternRes);

        
        if (patternRes.type) {
          const similarRes = await patternService.list({
            type: patternRes.type,
            perPage: 4,
          });
          
           const similar = similarRes.data.data.map(mapPatternDtoToModel);

        setSimilarPatterns(
          similar.filter(p => p.id !== patternRes.id).slice(0, 3)
        );
      }


        // Track la vue
        // patternService.trackView(patternRes.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);

  // Download SVG
  const handleDownloadSvg = async () => {
    if (!pattern?.svgUrl) return;
    try {
      const response = await fetch(pattern.svgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pattern.slug}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      addToast({ variant: 'success', message: 'SVG téléchargé !' });
    } catch (err) {
      addToast({ variant: 'error', message: 'Erreur de téléchargement' });
    }
  };

  // Share
  const handleShare = async () => {
    if (!pattern) return;
    const url = `${window.location.origin}/patterns/${slug}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: pattern.name,
          text: pattern.summary,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        addToast({ variant: 'success', message: 'Lien copié !' });
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-avs-secondary">
        <Loader2 size={32} className="text-avs-primary animate-spin" />
      </div>
    );
  }

  if (error || !pattern) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-avs-secondary">
        <div className="max-w-md text-center">
          <AlertCircle size={48} className="text-avs-primary mx-auto mb-4" />
          <h1 className="font-display text-avs-accent mb-2 text-2xl font-bold">
            Motif introuvable
          </h1>
          <p className="text-avs-accent/70 mb-6">{error || 'Le motif demandé n\'existe pas'}</p>
          <Link
            href="/patterns"
            className="text-avs-primary hover:underline font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            Retour aux motifs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-avs-secondary min-h-screen">
      {/* ── Breadcrumb + retour ─────────────────────────────────────────────── */}
      <div className="border-avs-accent/10 bg-avs-secondary border-b px-4 py-4 sm:px-6 lg:px-8">
        <div className="text-avs-accent/50 mx-auto flex max-w-7xl items-center gap-2 text-sm">
          <Link
            href={"/patterns" as Route}
            className="text-avs-primary flex items-center gap-1.5 font-medium hover:underline"
          >
            <ArrowLeft size={14} aria-hidden />
            Motifs
          </Link>
          <span>/</span>
          <span className="text-avs-accent">{pattern?.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* ── Colonne principale ──────────────────────────────────────────── */}
          <div className="space-y-10">
            {/* Visuel hero du motif */}
            <div
              className="rounded-avs-lg border-avs-accent/10 relative h-72 overflow-hidden border bg-linear-to-br sm:h-96"
              style={{
                backgroundImage: `linear-gradient(to bottom right, ${pattern?.colors?.[0]?.hex}, ${pattern?.colors?.[1]?.hex})`,
              }}
            >
              <div className="from-avs-accent/80 absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-avs-primary text-xs font-bold tracking-widest uppercase">
                  {pattern?.type?.toUpperCase()}
                </p>
                <h1 className="font-display text-avs-secondary text-3xl font-bold">
                  {pattern?.name}
                </h1>
              </div>
              <div className="absolute top-6 right-6 flex gap-2">
                <button
                  onClick={handleShare}
                  aria-label="Partager"
                  className="rounded-avs bg-avs-secondary/20 text-avs-secondary hover:bg-avs-secondary/30 flex h-9 w-9 items-center justify-center backdrop-blur-sm transition-colors"
                >
                  <Share2 size={15} />
                </button>
                <button
                  onClick={handleDownloadSvg}
                  disabled={!pattern?.svgUrl}
                  aria-label="Télécharger"
                  className="rounded-avs bg-avs-primary text-avs-secondary shadow-avs flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={13} aria-hidden />
                  SVG
                </button>
              </div>
            </div>

            {/* Description */}
            <section aria-labelledby="desc-title">
              <h2 id="desc-title" className="font-display text-avs-accent mb-3 text-xl font-bold">
                Description
              </h2>
              <p className="text-avs-accent/70 leading-relaxed">{pattern?.summary}</p>
            </section>

            {/* Histoire */}
            <section
              aria-labelledby="story-title"
              className="rounded-avs-lg border-avs-primary bg-avs-primary/5 border-l-4 px-6 py-5"
            >
              <h2 id="story-title" className="font-display text-avs-accent mb-2 text-lg font-bold">
                Histoire & Origine
              </h2>
              <p className="text-avs-accent/70 text-sm leading-relaxed">
                {pattern.symbolism.meaning}
              </p>
            </section>

            {/* Symbolisme */}
            <section aria-labelledby="symbol-title">
              <h2 id="symbol-title" className="font-display text-avs-accent mb-3 text-xl font-bold">
                Symbolisme
              </h2>
              <p className="text-avs-accent/70 leading-relaxed">{pattern.symbolism.meaning}</p>
            </section>

            {/* Palette de couleurs */}
            <section aria-labelledby="colors-title">
              <h2 id="colors-title" className="font-display text-avs-accent mb-4 text-xl font-bold">
                Palette Culturelle
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    hex: pattern.colors[0]?.hex,
                    name: 'Couleur Primaire',
                    meaning: 'Teinte dominante du motif',
                  },
                  {
                    hex: pattern.colors[1]?.hex,
                    name: 'Couleur Secondaire',
                    meaning: 'Teinte contrastante',
                  },
                  ...(pattern.colors[2]?.hex
                    ? [
                        {
                          hex: pattern.colors[2]?.hex,
                          name: 'Couleur Accent',
                          meaning: 'Teinte accentue',
                        },
                      ]
                    : []),
                ].map(({ hex, name, meaning }) => (
                  <div
                    key={hex}
                    className="rounded-avs-lg border-avs-accent/10 shadow-avs overflow-hidden border"
                  >
                    <div className="h-20 w-full" style={{ backgroundColor: hex }} aria-hidden />
                    <div className="bg-white p-4">
                      <p className="text-avs-accent/50 mb-0.5 font-mono text-xs">{hex}</p>
                      <p className="text-avs-accent text-sm font-semibold">{name}</p>
                      <p className="text-avs-accent/55 mt-1 text-xs leading-snug">{meaning}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Sidebar métadonnées ─────────────────────────────────────────── */}
          <aside className="space-y-5">
            {/* Infos clés */}
            <div className="rounded-avs-lg border-avs-accent/10 shadow-avs border bg-white p-6">
              <h2 className="font-display text-avs-accent mb-5 font-bold">Informations</h2>
              <dl className="space-y-4 text-sm">
                {[
                  { icon: MapPin, label: 'Pays', value: pattern.origin.country },
                  {
                    icon: Globe,
                    label: 'Région',
                    value: pattern.origin.region.replace(/-/g, ' ').toUpperCase(),
                  },
                  {
                    icon: Tag,
                    label: 'Type',
                    value:
                      pattern.type.charAt(0).toUpperCase() + pattern.type.slice(1),
                  },
                  {
                    icon: Eye,
                    label: 'Usage',
                    value:
                      pattern.symbolism.usage.charAt(0).toUpperCase() +
                      pattern.symbolism.usage.slice(1),
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon size={14} className="text-avs-primary mt-0.5 shrink-0" aria-hidden />
                    <div>
                      <dt className="text-avs-accent/40 text-xs tracking-wider uppercase">
                        {label}
                      </dt>
                      <dd className="text-avs-accent font-medium">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[{ value: pattern.views.toLocaleString(), label: 'Vues', icon: Eye }].map(
                ({ value, label, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-avs-lg border-avs-accent/10 shadow-avs border bg-white p-4 text-center"
                  >
                    <Icon size={16} className="text-avs-primary mx-auto mb-1" aria-hidden />
                    <p className="font-display text-avs-accent text-xl font-bold">{value}</p>
                    <p className="text-avs-accent/50 text-xs">{label}</p>
                  </div>
                ),
              )}
            </div>

            {/* Mots-clés */}
            <div className="rounded-avs-lg border-avs-accent/10 shadow-avs border bg-white p-5">
              <h3 className="text-avs-accent/40 mb-3 text-xs font-bold tracking-wider uppercase">
                Mots-clés
              </h3>
              <div className="flex flex-wrap gap-2">
                {pattern.symbolism.keywords &&
                  pattern.symbolism.keywords.length > 0 &&
                  pattern.symbolism.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-avs bg-avs-primary/10 text-avs-primary px-2.5 py-1 text-xs font-medium"
                    >
                      {kw}
                    </span>
                  ))}
              </div>
            </div>

            {/* Licence */}
            <div className="rounded-avs border-avs-accent/10 bg-avs-accent/5 text-avs-accent/60 border p-4 text-xs leading-relaxed">
              Usage libre avec attribution à AVS — African Visual Standard.
            </div>

            {/* CTA téléchargement */}
            <button
              onClick={handleDownloadSvg}
              disabled={!pattern?.svgUrl}
              className="rounded-avs-lg bg-avs-primary text-avs-secondary shadow-avs-md hover:shadow-avs-lg flex w-full items-center justify-center gap-2 py-4 text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} aria-hidden />
              Télécharger SVG
            </button>
          </aside>
        </div>

        {/* ── Motifs similaires ─────────────────────────────────────────────── */}
        {similarPatterns.length > 0 && (
          <section
            aria-labelledby="similar-title"
            className="border-avs-accent/10 mt-16 border-t pt-10"
          >
            <h2 id="similar-title" className="font-display text-avs-accent mb-6 text-2xl font-bold">
              Motifs Similaires
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarPatterns.map((similarPattern) => (
                <Link
                  key={similarPattern.id}
                  href={`/patterns/${similarPattern.slug}`}
                  className="group"
                >
                  <div
                    className="rounded-avs-lg border-avs-accent/10 shadow-avs relative overflow-hidden border bg-linear-to-br transition-all hover:shadow-avs-md"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${similarPattern.colors[0]?.hex}, ${similarPattern.colors[1]?.hex})`,
                    }}
                  >
                    <div className="from-avs-accent/60 absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
                    <div className="relative h-48 p-4 flex flex-col justify-end">
                      <p className="text-avs-secondary text-xs font-bold tracking-widest uppercase">
                        {similarPattern.type}
                      </p>
                      <h3 className="font-display text-avs-secondary text-lg font-bold group-hover:underline">
                        {similarPattern.name}
                      </h3>
                      <p className="text-avs-secondary/70 text-xs mt-1">
                        {similarPattern.origin.region.replace(/-/g, ' ')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

