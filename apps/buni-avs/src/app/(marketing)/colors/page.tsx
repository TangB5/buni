import { ColorsContent } from './colors-content';

export const metadata = {
  title: 'Color Picker Africain | Buni',
  description: 'Combinaisons de couleurs africaines inspirées de textiles et pigments traditionnels. Filtrez par région, culture et thème.',
  openGraph: {
    title: 'Color Picker Africain | Buni',
    description: 'Combinaisons de couleurs africaines inspirées de textiles et pigments traditionnels.',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Color Picker Africain | Buni',
    description: 'Combinaisons de couleurs africaines inspirées de textiles et pigments traditionnels.',
  },
};

export default function ColorsPage() {
  return <ColorsContent />;
}
