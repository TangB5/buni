import type { Metadata } from 'next';
import { AboutContent } from './about-content';
 
export const metadata: Metadata = {
  title: 'À propos — AVS',
  description: "La mission, les valeurs et l'équipe derrière le standard visuel africain.",
};
 
export default function AboutPage() {
  return <AboutContent />;
}