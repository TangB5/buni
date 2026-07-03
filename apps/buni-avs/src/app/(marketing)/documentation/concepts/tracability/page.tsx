import type { Metadata } from 'next';
import { DocPageTemplate, type DocTocEntry } from '../../doc-page-template';
import { PropTable } from '../../doc-primitives';

export const metadata: Metadata = { title: 'Traçabilité', description: 'Comment chaque ressource AVS reste traçable jusqu\u2019à sa source.' };

const TOC: DocTocEntry[] = [{ id: 'explication', label: 'Le modèle de traçabilité', level: 2 }, { id: 'cas-usage', label: "Cas d'utilisation", level: 2 }];

export default function TracabilitePage() {
  return (
    <DocPageTemplate
      space={{ label: 'Concepts fondamentaux', color: '#2A4A6B', icon: 'compass' }}
      title="Traçabilité"
      summary="Chaque motif, couleur et token porte des métadonnées de provenance consultables à tout moment."
      explanation={
        <PropTable
          rows={[
            ['source_ethnie', 'string', '—', "Groupe ethnique d'origine"],
            ['source_pays', 'string', '—', 'Pays documenté'],
            ['artisan_verifie', 'boolean', 'false', 'Validation par un artisan de terrain'],
            ['licence', 'string', "'CC BY 4.0'", 'Licence applicable à la ressource'],
          ]}
        />
      }
      useCases={<p>Afficher un crédit automatique dans une interface, générer une bibliographie de projet, auditer l&apos;usage d&apos;un motif.</p>}
      toc={TOC}
      prev={{ href: '/documentation/concepts/philosophie', title: 'Philosophie' }}
      next={{ href: '/documentation/motifs/ndop-bamoum', title: 'Motifs' }}
    />
  );
}