import type { Metadata } from 'next';
import { AboutContent } from './about-content';
import { getTranslations } from '@/i18n';
 
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('about.metadata', locale);
  
  return {
    title: t('title'),
    description: t('description'),
  };
}
 
export default function AboutPage() {
  return <AboutContent />;
}