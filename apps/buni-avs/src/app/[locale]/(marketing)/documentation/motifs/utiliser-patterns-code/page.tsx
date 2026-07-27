import { DocPageTemplate } from "../../doc-page-template";
import { CodeBlock } from "../../doc-primitives";

export default function UtiliserPatternsCode() {
  return (
    <DocPageTemplate
      space={{ label: 'Motifs', color: '#D4A017', icon: 'th-large' }}
      title="Utiliser les patterns dans votre code"
      summary="Deux méthodes simples pour intégrer les patterns africains AVS : via l'URL directe ou avec le package @buni/patterns. Personnalisez facilement couleur, opacité et plus avec Tailwind CSS."
      explanation={
        <div>
          <p className="mb-6">
            Intégrer les patterns AVS dans votre projet est simple. Choisissez l'une des deux méthodes selon vos besoins.
          </p>

          <h3 className="mb-3 text-lg font-bold">Méthode 1 — URL directe</h3>
          <p className="mb-4">La méthode la plus simple : utilisez directement l'URL du SVG depuis Supabase.</p>
          
          <CodeBlock 
            id="url-method" 
            lang="tsx" 
            code={`// Dans votre composant React
<section className="relative overflow-hidden">
  <img 
    src="https://zexnfalycvlfsyrtdqxu.supabase.co/storage/v1/object/public/patterns/52e38432-9af3-4dcd-9ce2-eb472fb4f01d-ndop6.svg"
    alt="Pattern Ndop"
    className="absolute inset-0 w-full h-full object-cover opacity-20"
  />
  <div className="relative z-10">
    {/* Votre contenu */}
  </div>
</section>`}
          />

          <div className="bg-avs-kente/5 border border-avs-kente/20 rounded-xl p-6 my-6">
            <h4 className="text-avs-kente mb-4">Personnalisation avec Tailwind</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Opacité :</strong> <code>opacity-10</code>, <code>opacity-20</code>, etc.</li>
              <li><strong>Mix-blend-mode :</strong> <code>mix-blend-multiply</code>, <code>mix-blend-overlay</code></li>
              <li><strong>Filtres :</strong> <code>grayscale</code>, <code>sepia</code>, <code>hue-rotate</code></li>
            </ul>
          </div>

          <h3 className="mb-3 text-lg font-bold">Méthode 2 — Package @buni/patterns</h3>
          <p className="mb-4">Pour une intégration complète avec typage TypeScript et composants React.</p>
          
          <CodeBlock 
            id="install-patterns" 
            lang="bash" 
            title="Installation"
            code={`npm install @buni/patterns
# ou
yarn add @buni/patterns
# ou
pnpm add @buni/patterns`}
          />

          <CodeBlock 
            id="import-patterns" 
            lang="tsx" 
            code={`import { Pattern } from '@buni/patterns';

// Utilisation avec contrôle total
<Pattern 
  slug="ndop-sultan"
  className="opacity-30"
  color="text-avs-kente"
>
  <div className="relative z-10">
    {/* Votre contenu */}
  </div>
</Pattern>`}
          />

          <div className="bg-avs-kente/5 border border-avs-kente/20 rounded-xl p-6 my-6">
            <h4 className="text-avs-kente mb-4">Props disponibles</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>slug :</strong> Identifiant du pattern (ex: "ndop-sultan", "kente-royale")</li>
              <li><strong>className :</strong> Classes Tailwind pour le style</li>
              <li><strong>color :</strong> Classe de couleur (ex: "text-avs-kente", "text-avs-primary")</li>
              <li><strong>opacity :</strong> Opacité du pattern (0-100)</li>
              <li><strong>children :</strong> Contenu à afficher par-dessus le pattern</li>
            </ul>
          </div>

          <h3 className="mb-3 text-lg font-bold">Exemples de personnalisation Tailwind</h3>
          
          <CodeBlock 
            id="tailwind-examples" 
            lang="tsx" 
            code={`// Pattern subtil en fond
<Pattern slug="bogolan-fanga" className="opacity-10" />

// Pattern coloré avec blend mode
<Pattern 
  slug="kente-royale" 
  className="opacity-20 mix-blend-multiply"
  color="text-avs-kente"
/>

// Pattern animé
<Pattern 
  slug="ndop-bamoum" 
  className="opacity-15 animate-pulse"
  color="text-avs-primary"
/>

// Pattern avec filtres
<Pattern 
  slug="wax-pan-africain"
  className="opacity-25 grayscale hover:grayscale-0 transition-all"
/>`}
          />
        </div>
      }
      bestPractices={
        <div>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Performance :</strong> Utilisez <code>opacity-10</code> à <code>opacity-30</code> pour un effet subtil sans impacter les performances</li>
            <li><strong>Accessibilité :</strong> Ajoutez toujours un fond de couleur solide en fallback</li>
            <li><strong>Mobile :</strong> Sur mobile, réduisez l'opacité ou désactivez les patterns pour améliorer la lisibilité</li>
            <li><strong>Lazy loading :</strong> Pour les patterns en dessous du pli, utilisez <code>loading="lazy"</code> sur les images</li>
            <li><strong>Contraste :</strong> Vérifiez toujours que le texte reste lisible par-dessus le pattern</li>
          </ul>
        </div>
      }
      interactive={
        <div>
          <h4 className="mb-4 text-lg font-bold">Exemple complet avec @buni/patterns</h4>
          <CodeBlock 
            id="complete-example" 
            lang="tsx" 
            code={`import { Pattern } from '@buni/patterns';

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-avs-secondary">
      {/* Pattern de fond */}
      <Pattern 
        slug="ndop-sultan"
        className="absolute inset-0 opacity-15"
        color="text-avs-kente"
      >
        {/* Overlay sombre pour améliorer le contraste */}
        <div className="absolute inset-0 bg-avs-accent/10" />
        
        {/* Contenu */}
        <div className="relative z-10 px-6 py-24">
          <h1 className="font-display text-5xl font-bold text-avs-accent">
            Titre de votre section
          </h1>
          <p className="mt-4 text-xl text-avs-accent/70">
            Votre contenu ici
          </p>
          <button className="mt-8 bg-avs-primary text-avs-secondary px-6 py-3 rounded-lg">
            Bouton d'action
          </button>
        </div>
      </Pattern>
    </section>
  );
}`}
          />
        </div>
      }
      prev={{ href: '/documentation/motifs/intro', title: 'Introduction' }}
      next={{ href: '/documentation/motifs/ndop-bamoum', title: 'Ndop Bamoum' }}
    />
  );
}
