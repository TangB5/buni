import { DocPageTemplate, type DocTocEntry } from '../../doc-page-template';
import { CodeBlock } from '../../doc-primitives';

const TOC: DocTocEntry[] = [
  { id: 'choisir', label: 'Choisir un combo', level: 2 },
  { id: 'tokens', label: 'Tokens de couleur', level: 2 },
  { id: 'variantes', label: 'Variantes', level: 2 },
  { id: 'composants', label: 'Composants', level: 2 },
  { id: 'documentation', label: 'Documentation', level: 2 },
];

export default function DesignSystemPage() {
  return (
    <DocPageTemplate
      space={{ label: 'Couleurs', color: '#C0573E', icon: 'palette' }}
      title="Créer un Design System"
      summary="Transformez les combos AVS en un design system cohérent pour votre application."
      
      why={
        <p className="text-avs-accent/70 leading-relaxed">
          Un design system basé sur les couleurs AVS garantit une cohérence visuelle tout en respectant l&apos;héritage culturel africain. Suivez ces étapes pour créer votre propre système.
        </p>
      }

      explanation={
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold text-avs-accent mb-3" id="choisir">Étape 1 : Choisir un Combo Principal</h3>
            <p className="text-avs-accent/70 leading-relaxed">
              Sélectionnez un combo qui correspond à l'identité de votre marque. Par exemple, <strong>AVS Core</strong> pour une identité standard, ou <strong>Kente Asante</strong> pour une touche royale.
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-avs-accent mb-3" id="tokens">Étape 2 : Définir les Tokens de Couleur</h3>
            <p className="text-avs-accent/70 leading-relaxed mb-4">
              Créez des tokens sémantiques basés sur les rôles :
            </p>
            <CodeBlock 
              id="color-tokens" 
              lang="css" 
              title="globals.css"
              code={`:root {
  /* Brand Colors */
  --color-brand-primary: var(--avs-primary);
  --color-brand-secondary: var(--avs-secondary);
  
  /* UI Colors */
  --color-action-primary: var(--avs-primary);
  --color-action-secondary: var(--avs-secondary);
  --color-action-accent: var(--avs-accent);
  
  /* Feedback Colors */
  --color-success: var(--avs-primary);
  --color-warning: var(--avs-accent);
  --color-info: var(--avs-mist);
}`}
            />
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-avs-accent mb-3" id="variantes">Étape 3 : Créer des Variantes</h3>
            <p className="text-avs-accent/70 leading-relaxed mb-4">
              Générez des variantes de luminosité pour chaque couleur :
            </p>
            <CodeBlock 
              id="color-variants" 
              lang="css" 
              title="globals.css"
              code={`:root {
  --avs-primary-50: #F5EBE0;
  --avs-primary-100: #E8D5C9;
  --avs-primary-200: #D4B8A6;
  --avs-primary-300: #C09B83;
  --avs-primary-400: #C0573E;  /* base */
  --avs-primary-500: #A84632;
  --avs-primary-600: #8B3A2A;
  --avs-primary-700: #6E2E22;
  --avs-primary-800: #522218;
  --avs-primary-900: #35160E;
}`}
            />
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-avs-accent mb-3" id="composants">Étape 4 : Appliquer aux Composants</h3>
            <p className="text-avs-accent/70 leading-relaxed mb-4">
              Utilisez les tokens dans vos composants :
            </p>
            <CodeBlock 
              id="component-usage" 
              lang="css" 
              title="components.css"
              code={`/* Button Component */
.btn-primary {
  background: var(--color-action-primary);
  color: var(--avs-secondary);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
}

.btn-primary:hover {
  background: var(--avs-primary-600);
}

/* Card Component */
.card {
  background: var(--avs-secondary);
  border: 1px solid var(--avs-primary-200);
  border-radius: 1rem;
}

.card-header {
  color: var(--avs-accent);
}`}
            />
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-avs-accent mb-3" id="documentation">Étape 5 : Documentation et Maintenance</h3>
            <p className="text-avs-accent/70 leading-relaxed">
              Documentez vos choix de couleurs avec leurs significations culturelles. Cela aide les nouveaux développeurs à comprendre le contexte et maintient la cohérence du design system.
            </p>
          </div>
        </div>
      }

      toc={TOC}
      prev={{ href: '/documentation/couleurs/integration', title: 'Intégration' }}
      next={{ href: '/documentation/couleurs/palette-principale', title: 'Palette Principale' }}
    />
  );
}
