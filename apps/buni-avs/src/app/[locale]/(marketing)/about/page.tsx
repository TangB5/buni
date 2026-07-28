import type { Metadata } from 'next';
import { AboutContent } from './about-content';
import { getTranslations } from '@buni/i18n';
 
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about.metadata');
  
  return {
    title: t('title'),
    description: t('description'),
  };
}
 
export default function AboutPage() {
  return <AboutContent />;
}