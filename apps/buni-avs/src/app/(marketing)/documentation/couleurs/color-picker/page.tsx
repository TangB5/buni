import { DocPageTemplate, type DocTocEntry } from '../../doc-page-template';
import { CodeBlock } from '../../doc-primitives';

const TOC: DocTocEntry[] = [
  { id: 'structure', label: 'Structure des données', level: 2 },
  { id: 'filtrage', label: 'Système de filtrage', level: 2 },
  { id: 'custom', label: 'Palette personnalisée', level: 2 },
];

export default function ColorPickerPage() {
  return (
    <DocPageTemplate
      space={{ label: 'Couleurs', color: '#C0573E', icon: 'palette' }}
      title="Color Picker AVS"
      summary="Le Color Picker AVS est un système complet de gestion de couleurs africaines basé sur des combinaisons (combos) prédéfinies et personnalisables."
      
      why={
        <p className="text-avs-accent/70 leading-relaxed">
          Le color picker permet d&apos;explorer, filtrer et créer des combinaisons de couleurs inspirées des textiles traditionnels africains, avec des fonctionnalités d&apos;export multi-format.
        </p>
      }

      explanation={
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold text-avs-accent mb-3" id="structure">Structure des Données</h3>
            <p className="text-avs-accent/70 leading-relaxed mb-4">
              Les combos sont stockés dans <code className="font-mono text-xs bg-avs-accent/10 px-1.5 py-0.5 rounded">data.ts</code> avec une structure TypeScript typée :
            </p>
            <CodeBlock 
              id="combo-structure" 
              lang="typescript" 
              title="data.ts"
              code={`interface Combo {
  id: string;           // Identifiant unique
  name: string;         // Nom du combo
  origin: string;       // Origine géographique
  description: string;  // Description culturelle
  patternCSS: string;   // Classe CSS du pattern
  colors: ComboColor[]; // Tableau de 4 couleurs
  accentClass: string;  // Classe Tailwind pour l'accent
  accentHex: string;    // Couleur hex de l'accent
  region?: string;      // Région (filtre)
  culture?: string;     // Culture (filtre)
  theme?: string;       // Thème (filtre)
}

interface ComboColor {
  role: 'primary' | 'secondary' | 'accent' | 'neutral';
  name: string;         // Nom de la couleur
  hex: string;          // Code HEX
  meaning: string;      // Signification culturelle
  origin: string;       // Source du pigment
  css: string;          // Variable CSS (--nom)
}`}
            />
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-avs-accent mb-3" id="filtrage">Système de Filtrage</h3>
            <p className="text-avs-accent/70 leading-relaxed mb-4">
              Le color picker permet de filtrer les combos par trois dimensions :
            </p>
            <ul className="space-y-2 text-avs-accent/70">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-avs-primary" />
                <strong>Région</strong> : Afrique de l'Ouest, Centrale, Est, Australe, du Nord, Pan-Africain
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-avs-primary" />
                <strong>Culture</strong> : Yoruba, Akan, Bamoum, Maasai, Zoulou, etc.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-avs-primary" />
                <strong>Thème</strong> : Standard, Royal, Nature, Textile, Historique, etc.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-avs-accent mb-3" id="custom">Créateur de Palette Personnalisée</h3>
            <p className="text-avs-accent/70 leading-relaxed">
              Le composant <code className="font-mono text-xs bg-avs-accent/10 px-1.5 py-0.5 rounded">CustomPaletteBuilder</code> permet de créer vos propres combos en sélectionnant des couleurs dans la bibliothèque de swatches organisée par familles (Terre & Ocre, Indigo & Bleu, Or & Jaune, Vert, Neutres).
            </p>
          </div>
        </div>
      }

      toc={TOC}
      prev={{ href: '/documentation/couleurs/introduction', title: 'Introduction' }}
      next={{ href: '/documentation/couleurs/integration', title: 'Intégration' }}
    />
  );
}
