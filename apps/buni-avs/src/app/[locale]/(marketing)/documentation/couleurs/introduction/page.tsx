import { DocPageTemplate, type DocTocEntry } from '../../doc-page-template';

const TOC: DocTocEntry[] = [
  { id: 'pourquoi', label: 'Pourquoi', level: 2 },
  { id: 'concept', label: 'Concept', level: 2 },
];

export default function IntroductionPage() {
  return (
    <DocPageTemplate
      space={{ label: 'Couleurs', color: '#C0573E', icon: 'palette' }}
      title="Introduction aux Couleurs AVS"
      summary="Découvrez le système de couleurs African Visual Standard, inspiré des textiles traditionnels et pigments naturels africains."
      
      why={
        <p className="text-avs-accent/70 leading-relaxed">
          Les couleurs africaines portent une histoire et une symbolique profondes. Le système AVS permet de créer des interfaces qui résonnent avec l&apos;identité visuelle du continent tout en maintenant une cohérence sémantique.
        </p>
      }

      explanation={
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold text-avs-accent mb-3">Concept des Combos</h3>
            <p className="text-avs-accent/70 leading-relaxed mb-4">
              Chaque combo est une combinaison de 4 couleurs organisées par rôles sémantiques :
            </p>
            <ul className="space-y-2 text-avs-accent/70">
              <li><strong>Primary</strong> — Couleur dominante pour l&apos;identité</li>
              <li><strong>Secondary</strong> — Couleur d&apos;accompagnement pour les fonds</li>
              <li><strong>Accent</strong> — Couleur de contraste pour les interactions</li>
              <li><strong>Neutral</strong> — Couleur de support pour les états</li>
            </ul>
          </div>
        </div>
      }

      toc={TOC}
      prev={{ href: '/documentation', title: 'Documentation' }}
      next={{ href: '/documentation/couleurs/color-picker', title: 'Color Picker' }}
    />
  );
}
