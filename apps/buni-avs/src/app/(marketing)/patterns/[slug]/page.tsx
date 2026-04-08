import type { Metadata, Route } from 'next';
import Link from 'next/link';
import { ArrowLeft, Download, Share2, MapPin, Eye, Globe, Tag } from 'lucide-react';
import { fetchPatternBySlug } from 'apps/buni-avs/src/lib/api';


// ── Metadata dynamique ────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const response = await fetchPatternBySlug(slug);
    const pattern = response.data.props;
    return {
      title: `${pattern.nameFr} — AVS`,
      description: pattern.descFr.slice(0, 160),
    };
  } catch {
    return { title: 'Motif introuvable' };
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function PatternDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const response = await fetchPatternBySlug(slug);
  const pattern = response.data.props;

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
          <span className="text-avs-accent">{pattern.nameFr}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* ── Colonne principale ──────────────────────────────────────────── */}
          <div className="space-y-10">
            {/* Visuel hero du motif */}
            <div
              className="rounded-avs-lg border-avs-accent/10 relative h-72 overflow-hidden border bg-gradient-to-br sm:h-96"
              style={{
                backgroundImage: `linear-gradient(to bottom right, ${pattern.colors.primary}, ${pattern.colors.secondary})`,
              }}
            >
              <div className="from-avs-accent/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-avs-primary text-xs font-bold tracking-widest uppercase">
                  {pattern.patternType.toUpperCase()}
                </p>
                <h1 className="font-display text-avs-secondary text-3xl font-bold">
                  {pattern.nameFr}
                </h1>
              </div>
              <div className="absolute top-6 right-6 flex gap-2">
                <button
                  aria-label="Partager"
                  className="rounded-avs bg-avs-secondary/20 text-avs-secondary hover:bg-avs-secondary/30 flex h-9 w-9 items-center justify-center backdrop-blur-sm transition-colors"
                >
                  <Share2 size={15} />
                </button>
                <button
                  aria-label="Télécharger"
                  className="rounded-avs bg-avs-primary text-avs-secondary shadow-avs flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all hover:-translate-y-0.5"
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
              <p className="text-avs-accent/70 leading-relaxed">{pattern.descFr}</p>
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
                    hex: pattern.colors.primary,
                    name: 'Couleur Primaire',
                    meaning: 'Teinte dominante du motif',
                  },
                  {
                    hex: pattern.colors.secondary,
                    name: 'Couleur Secondaire',
                    meaning: 'Teinte contrastante',
                  },
                  ...(pattern.colors.accent
                    ? [
                        {
                          hex: pattern.colors.accent,
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
                  { icon: MapPin, label: 'Pays', value: pattern.country },
                  {
                    icon: Globe,
                    label: 'Région',
                    value: pattern.region.replace(/-/g, ' ').toUpperCase(),
                  },
                  {
                    icon: Tag,
                    label: 'Type',
                    value:
                      pattern.patternType.charAt(0).toUpperCase() + pattern.patternType.slice(1),
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
              {[{ value: pattern.viewCount.toLocaleString(), label: 'Vues', icon: Eye }].map(
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
            <button className="rounded-avs-lg bg-avs-primary text-avs-secondary shadow-avs-md hover:shadow-avs-lg flex w-full items-center justify-center gap-2 py-4 text-sm font-bold transition-all hover:-translate-y-0.5">
              <Download size={16} aria-hidden />
              Télécharger (SVG · PNG · JSON)
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
