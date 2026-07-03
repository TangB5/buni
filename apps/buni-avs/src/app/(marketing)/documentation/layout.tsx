import type { Metadata } from 'next';
import 'primeicons/primeicons.css';
import { DocsShell } from './docs-shell';


export const metadata: Metadata = {
  title: { default: 'Documentation — AVS', template: '%s — Documentation AVS' },
  description: 'Motifs, design tokens, composants et études culturelles du standard visuel africain.',
};

export default function DocumentationLayout({ children }: { children: React.ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}