import type { Metadata } from 'next';
import { getTranslations } from '@/i18n';
import { CoffeeContent } from './coffee-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('coffee.metadata', locale);
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function CoffeePage() {
  return <CoffeeContent />;
}
