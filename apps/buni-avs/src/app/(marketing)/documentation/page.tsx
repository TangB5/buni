import type { Metadata } from 'next';
import { DocumentationHome } from './documentation-home';


export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Le point de départ pour explorer le standard visuel africain : motifs, tokens, composants, API et études culturelles.',
};

export default function DocumentationHomePage() {
  return <DocumentationHome />;
}