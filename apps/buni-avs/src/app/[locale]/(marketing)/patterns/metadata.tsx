import { Metadata } from 'next';

export function generatePatternMetadata(pattern: any): Metadata {
  const imageUrl = pattern.imgUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/og-pattern.png`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/patterns?pattern=${pattern.id}`;

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
