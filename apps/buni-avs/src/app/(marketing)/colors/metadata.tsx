import { Metadata } from 'next';

export function generateColorMetadata(combo: any): Metadata {
  const imageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/og-colors.png`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/colors?combo=${combo.id}`;

  return {
    title: `${combo.name} - ${combo.origin} | Color Picker Africain | Buni`,
    description: combo.description,
    openGraph: {
      title: `${combo.name} - ${combo.origin}`,
      description: combo.description,
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: combo.name,
        },
      ],
      type: 'website',
      locale: 'fr_FR',
      siteName: 'Buni - Color Picker Africain',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${combo.name} - ${combo.origin}`,
      description: combo.description,
      images: [imageUrl],
    },
  };
}
