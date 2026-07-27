import { redirect } from 'next/navigation';
import { PATTERNS_DOCS } from '../../patterns/mock';
import { patternRepository } from '@/features/patterns/repositories/pattern.repository';

interface PatternPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PatternPageProps) {
  const patternId = params.id;
  
  // Try to find pattern in mocks or backend
  let pattern = PATTERNS_DOCS.find((p) => p.id === patternId);
  
  if (!pattern) {
    try {
      const backendPatterns = await patternRepository.findAll();
      pattern = backendPatterns.find((p) => p.id === patternId);
    } catch (error) {
      console.error('Error loading pattern from backend:', error);
    }
  }

  if (!pattern) {
    return {
      title: 'Motif non trouvé | Buni',
    };
  }

  const imageUrl = pattern.imgUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/og-pattern.png`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/pattern/${patternId}`;

  return {
    title: `${pattern.name} - ${pattern.origin.country} | Encyclopédie des Motifs Africains`,
    description: pattern.summary,
    openGraph: {
      title: `${pattern.name} - ${pattern.origin.country} ${pattern.origin.flag}`,
      description: pattern.summary,
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: pattern.name,
        },
      ],
      type: 'website',
      locale: 'fr_FR',
      siteName: 'Buni - Encyclopédie des Motifs Africains',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pattern.name} - ${pattern.origin.country}`,
      description: pattern.summary,
      images: [imageUrl],
    },
  };
}

export default async function PatternPage({ params }: PatternPageProps) {
  // Redirect to the main patterns page with the pattern selected
  redirect(`/patterns?pattern=${params.id}`);
}
