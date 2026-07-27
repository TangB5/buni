import { DocPageTemplate, type DocTocEntry } from '../../doc-page-template';
import { CodeBlock } from '../../doc-primitives';

const TOC: DocTocEntry[] = [
  { id: 'css', label: 'Variables CSS', level: 2 },
  { id: 'tailwind', label: 'Tailwind v4', level: 2 },
  { id: 'json', label: 'JSON', level: 2 },
];

export default function IntegrationPage() {
  return (
    <DocPageTemplate
      space={{ label: 'Couleurs', color: '#C0573E', icon: 'palette' }}
      title="Intégration des Couleurs"
      summary="Le color picker AVS offre trois formats d'export pour intégrer facilement les couleurs dans votre projet."
      
      why={
        <p className="text-avs-accent/70 leading-relaxed">
          Que vous utilisiez des variables CSS natives, Tailwind CSS v4, ou JavaScript/TypeScript, le color picker AVS vous fournit le format adapté à votre workflow.
        </p>
      }

      explanation={
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold text-avs-accent mb-3" id="css">Variables CSS</h3>
            <p className="text-avs-accent/70 leading-relaxed mb-4">
              Exportez en CSS pour utiliser les variables CSS natives :
            </p>
            <CodeBlock 
              id="css-variables" 
              lang="css" 
              title="globals.css"
              code={`:root {
  --avs-primary: #C0573E;   /* primary · avs-primary */
  --avs-secondary: #F5EBE0; /* secondary · avs-secondary */
  --avs-accent: #1D1D1B;    /* accent · avs-accent */
  --avs-mist: #B0C4C8;      /* neutral · avs-mist */
}

/* Utilisation */
.button {
  background: var(--avs-primary);
  color: var(--avs-secondary);
}`}
            />
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-avs-accent mb-3" id="tailwind">Tailwind CSS v4</h3>
            <p className="text-avs-accent/70 leading-relaxed mb-4">
              Avec Tailwind CSS v4, utilisez les variables CSS natives dans votre fichier CSS :
            </p>
            <CodeBlock 
              id="tailwind-v4-config" 
              lang="css" 
              title="app.css"
              code={`@import "tailwindcss";

@theme {
  --color-avs-primary: #C0573E;
  --color-avs-secondary: #F5EBE0;
  --color-avs-accent: #1D1D1B;
  --color-avs-mist: #B0C4C8;
}

/* Utilisation */
<button class="bg-avs-primary text-avs-secondary">
  Cliquez-moi
</button>`}
            />
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-avs-accent mb-3" id="json">JSON pour JavaScript/TypeScript</h3>
            <p className="text-avs-accent/70 leading-relaxed mb-4">
              Exportez en JSON pour utiliser dans votre code JS/TS :
            </p>
            <CodeBlock 
              id="json-export" 
              lang="json" 
              title="avs-colors.json"
              code={`{
  "primary": {
    "name": "avs-primary",
    "hex": "#C0573E",
    "css": "--avs-primary"
  },
  "secondary": {
    "name": "avs-secondary",
    "hex": "#F5EBE0",
    "css": "--avs-secondary"
  },
  "accent": {
    "name": "avs-accent",
    "hex": "#1D1D1B",
    "css": "--avs-accent"
  },
  "neutral": {
    "name": "avs-mist",
    "hex": "#B0C4C8",
    "css": "--avs-mist"
  }
}

// Utilisation
const colors = require('./avs-colors.json');
const primaryColor = colors.primary.hex;`}
            />
          </div>
        </div>
      }

      toc={TOC}
      prev={{ href: '/documentation/couleurs/color-picker', title: 'Color Picker' }}
      next={{ href: '/documentation/couleurs/design-system', title: 'Design System' }}
    />
  );
}
