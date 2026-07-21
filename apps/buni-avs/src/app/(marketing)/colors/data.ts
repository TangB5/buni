// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type Role = 'primary' | 'secondary' | 'accent' | 'neutral';

export interface ComboColor {
  role:    Role;
  name:    string;
  hex:     string;
  meaning: string;
  origin:  string;
  css:     string;
}

export interface Combo {
  id:          string;
  name:        string;
  origin:      string;
  description: string;
  patternCSS:  string;
  colors:      ComboColor[];
  accentClass: string;
  accentHex:   string;
  region?:     string;
  culture?:    string;
  theme?:      string;
}

export type ExportFormat = 'css' | 'json' | 'tailwind';
export type FilterType = 'region' | 'culture' | 'theme';
export type FilterValue = string;

// ─────────────────────────────────────────────────────────────────────────────
// DATA — combinaisons de couleurs africaines, prêtes à l'emploi
// ─────────────────────────────────────────────────────────────────────────────

export const COMBOS: Combo[] = [
  {
    id: 'avs-core', name: 'AVS Core', origin: 'Standard AVS',
    accentClass: 'text-avs-primary', accentHex: '#C0573E',
    description: 'La combinaison officielle du standard African Visual Standard — terracotta, lin naturel et obsidienne.',
    patternCSS: 'avs-pattern-wax-dakar',
    region: 'Afrique de l\'Ouest', culture: 'Yoruba', theme: 'Standard',
    colors: [
      { role: 'primary',   name: 'avs-primary',   hex: '#C0573E', meaning: 'Terre brûlée — chaleur, énergie, identité', origin: 'Poterie Yoruba',    css: '--avs-primary'   },
      { role: 'secondary', name: 'avs-secondary', hex: '#F5EBE0', meaning: 'Lin naturel — repos, clarté, neutralité',   origin: 'Tissu Fulani',      css: '--avs-secondary' },
      { role: 'accent',    name: 'avs-accent',    hex: '#1D1D1B', meaning: 'Obsidienne — profondeur, autorité, nuit',   origin: 'Basalte Kenya',     css: '--avs-accent'    },
      { role: 'neutral',   name: 'avs-mist',      hex: '#B0C4C8', meaning: 'Brume lagunaire — sérénité, horizon',       origin: 'Lagune de Cotonou', css: '--avs-mist'      },
    ],
  },
  {
    id: 'kente', name: 'Kente Asante', origin: 'Ghana',
    accentClass: 'text-avs-kente', accentHex: '#D4A017',
    description: 'Combo extraite du tissu royal Akan — or royal, noir sacré, rouge du sacrifice.',
    patternCSS: 'avs-pattern-kente-royale',
    region: 'Afrique de l\'Ouest', culture: 'Akan', theme: 'Royal',
    colors: [
      { role: 'primary',   name: 'kente-gold',  hex: '#D4A017', meaning: 'Or royal — richesse, royauté, soleil',      origin: 'Fil de soie Asante', css: '--avs-kente'     },
      { role: 'secondary', name: 'kente-ivory',  hex: '#F5EBE0', meaning: 'Ivoire — pureté rituelle, lumière douce',   origin: 'Coton blanchi',      css: '--avs-secondary' },
      { role: 'accent',    name: 'kente-black',  hex: '#1D1D1B', meaning: 'Noir maturité — sagesse, énergie cosmique', origin: 'Encre de charbon',   css: '--avs-accent'    },
      { role: 'neutral',   name: 'kente-red',    hex: '#C0573E', meaning: 'Rouge sang — sacrifice, courage, ancêtres', origin: 'Ocre ferrugineux',   css: '--avs-primary'   },
    ],
  },
  {
    id: 'ndop', name: 'Ndop Bamoum', origin: 'Cameroun',
    accentClass: 'text-avs-indigo', accentHex: '#2A4A6B',
    description: 'Teintes profondes du tissu sacré Bamoum — indigo cosmos, or raphia, ivoire rituel.',
    patternCSS: 'avs-pattern-ndop-sultan',
    region: 'Afrique Centrale', culture: 'Bamoum', theme: 'Sacrée',
    colors: [
      { role: 'primary',   name: 'ndop-indigo', hex: '#0D2340', meaning: 'Indigo cosmos — eaux primordiales, infini', origin: 'Indigo de Foumban',   css: '--ndop-indigo'  },
      { role: 'secondary', name: 'ndop-ivory',  hex: '#F5EBE0', meaning: 'Ivoire — pureté, paix, ancêtres',           origin: 'Ivoire végétal',      css: '--avs-secondary'},
      { role: 'accent',    name: 'ndop-raffia', hex: '#C8A96E', meaning: 'Or raphia — richesse naturelle, soleil',    origin: 'Fibre de palmier',    css: '--avs-raffia'   },
      { role: 'neutral',   name: 'ndop-nile',   hex: '#A8CCCC', meaning: 'Eau du Nil — apaisement, fluidité, vie',    origin: 'Pigment de Foumban',  css: '--avs-nile'     },
    ],
  },
  {
    id: 'earth', name: "Terres d'Afrique", origin: 'Pan-Africain',
    accentClass: 'text-avs-earth', accentHex: '#8B4513',
    description: 'Ocres, siennas et terres minérales extraits des pigments naturels du continent.',
    patternCSS: 'avs-pattern-bogolan-fanga',
    region: 'Pan-Africain', culture: 'Traditionnel', theme: 'Nature',
    colors: [
      { role: 'primary',   name: 'earth-sienna', hex: '#8B4513', meaning: 'Sienna brûlée — sol fertile, ancrage',      origin: 'Argile du Sahel',    css: '--avs-earth'    },
      { role: 'secondary', name: 'earth-sand',   hex: '#E8C99A', meaning: 'Sable doré — Sahara, voyage, ouverture',    origin: 'Dunes sahariennes',  css: '--earth-sand'   },
      { role: 'accent',    name: 'earth-baobab', hex: '#5C3317', meaning: 'Écorce de baobab — durée, mémoire',        origin: 'Bois de baobab',     css: '--earth-baobab' },
      { role: 'neutral',   name: 'earth-clay',   hex: '#D4A882', meaning: 'Argile pâle — douceur, construction, foyer',origin: 'Latérite du Sahel',  css: '--earth-clay'   },
    ],
  },
  {
    id: 'mali-mud', name: 'Bogolan Mali', origin: 'Mali',
    accentClass: 'text-avs-mud', accentHex: '#8B7355',
    description: 'Teintes de la terre du Bogolan — argile brune, noir végétal, ocre jaune, blanc kaolin.',
    patternCSS: 'avs-pattern-bogolan-fanga',
    region: 'Afrique de l\'Ouest', culture: 'Bambara', theme: 'Textile',
    colors: [
      { role: 'primary',   name: 'mud-clay',    hex: '#8B7355', meaning: 'Argile brute — authenticité, tradition',     origin: 'Boue du Niger',     css: '--avs-mud-clay'   },
      { role: 'secondary', name: 'mud-kaolin',  hex: '#F5EBE0', meaning: 'Kaolin — pureté, protection spirituelle',   origin: 'Argile blanche',    css: '--avs-secondary'  },
      { role: 'accent',    name: 'mud-black',   hex: '#2C2C2C', meaning: 'Noir végétal — mystère, ancestralité',      origin: 'Feuilles de néré',  css: '--avs-mud-black'  },
      { role: 'neutral',   name: 'mud-ochre',   hex: '#C8821A', meaning: 'Ocre jaune — soleil, prospérité',           origin: 'Terre du Sahel',    css: '--avs-mud-ochre'  },
    ],
  },
  {
    id: 'ethiopia', name: 'Éthiopie Ancienne', origin: 'Éthiopie',
    accentClass: 'text-avs-ethiopia', accentHex: '#FFD700',
    description: 'Couleurs de l\'Éthiopie historique — or impérial, vert de la terre, rouge du courage.',
    patternCSS: 'avs-pattern-wax-dakar',
    region: 'Afrique de l\'Est', culture: 'Abyssinie', theme: 'Historique',
    colors: [
      { role: 'primary',   name: 'ethiopia-gold', hex: '#FFD700', meaning: 'Or impérial — richesse, divinité',          origin: 'Couronne de Salomon', css: '--avs-ethiopia-gold' },
      { role: 'secondary', name: 'ethiopia-green',hex: '#228B22', meaning: 'Vert terre — fertilité, espérance',         origin: 'Terre fertile',       css: '--avs-ethiopia-green'},
      { role: 'accent',    name: 'ethiopia-red',  hex: '#DC143C', meaning: 'Rouge courage — sacrifice, force',         origin: 'Sang des martyrs',    css: '--avs-ethiopia-red'  },
      { role: 'neutral',   name: 'ethiopia-cream',hex: '#F5F5DC', meaning: 'Crème — paix, lumière',                   origin: 'Calcaire naturel',    css: '--avs-ethiopia-cream'},
    ],
  },
  {
    id: 'zulu-beads', name: 'Perles Zoulou', origin: 'Afrique du Sud',
    accentClass: 'text-avs-zulu', accentHex: '#1E90FF',
    description: 'Palette des perles Zoulou traditionnelles — bleu communication, rouge amour, noir mariage.',
    patternCSS: 'avs-pattern-ndop-sultan',
    region: 'Afrique Australe', culture: 'Zoulou', theme: 'Artisanat',
    colors: [
      { role: 'primary',   name: 'zulu-blue',   hex: '#1E90FF', meaning: 'Bleu ciel — communication, loyauté',       origin: 'Perles de verre',    css: '--avs-zulu-blue'   },
      { role: 'secondary', name: 'zulu-white',  hex: '#F5EBE0', meaning: 'Blanc pure — spiritualité, clarté',        origin: 'Coquillage',         css: '--avs-secondary'   },
      { role: 'accent',    name: 'zulu-red',    hex: '#DC143C', meaning: 'Rouge passion — amour, intensité',         origin: 'Ocre rouge',         css: '--avs-zulu-red'    },
      { role: 'neutral',   name: 'zulu-black',  hex: '#1D1D1B', meaning: 'Noir union — engagement, mariage',         origin: 'Charbon bois',       css: '--avs-accent'      },
    ],
  },
  {
    id: 'sahara-sunset', name: 'Coucher de Soleil Saharien', origin: 'Sahara',
    accentClass: 'text-avs-sunset', accentHex: '#FF6B35',
    description: 'Les couleurs dorées du désert au crépuscule — orange brûlé, ocre, sable, violet nuit.',
    patternCSS: 'avs-pattern-bogolan-fanga',
    region: 'Afrique du Nord', culture: 'Touareg', theme: 'Nature',
    colors: [
      { role: 'primary',   name: 'sunset-orange', hex: '#FF6B35', meaning: 'Orange brûlé — feu, passion, désert',     origin: 'Sable au soleil',    css: '--avs-sunset-orange'},
      { role: 'secondary', name: 'sunset-sand',   hex: '#E8C99A', meaning: 'Sable doré — dunes, voyage, infini',     origin: 'Erg du Sahara',      css: '--earth-sand'      },
      { role: 'accent',    name: 'sunset-purple', hex: '#4A2C6B', meaning: 'Violet nuit — mystère, étoiles',         origin: 'Ciel nocturne',      css: '--avs-sunset-purple'},
      { role: 'neutral',   name: 'sunset-ochre',  hex: '#C8821A', meaning: 'Ocre chaud — terre, ancrage',           origin: 'Pigment naturel',    css: '--avs-mud-ochre'   },
    ],
  },
  {
    id: 'congo-river', name: 'Fleuve Congo', origin: 'RD Congo',
    accentClass: 'text-avs-congo', accentHex: '#0066CC',
    description: 'Les eaux profondes du fleuve Congo — bleu intense, vert forêt, terre humide, mousse.',
    patternCSS: 'avs-pattern-ndop-sultan',
    region: 'Afrique Centrale', culture: 'Kongo', theme: 'Nature',
    colors: [
      { role: 'primary',   name: 'congo-blue',  hex: '#0066CC', meaning: 'Bleu profond — eaux puissantes',           origin: 'Fleuve Congo',       css: '--avs-congo-blue'  },
      { role: 'secondary', name: 'congo-green', hex: '#2E8B57', meaning: 'Vert forêt — biodiversité, vie',           origin: 'Forêt équatoriale',  css: '--avs-congo-green' },
      { role: 'accent',    name: 'congo-brown', hex: '#8B4513', meaning: 'Terre humide — richesse du sol',           origin: 'Berge du fleuve',    css: '--avs-earth'       },
      { role: 'neutral',   name: 'congo-moss',  hex: '#6B8E23', meaning: 'Mousse — croissance, fraîcheur',          origin: 'Sous-bois',         css: '--avs-congo-moss'  },
    ],
  },
  {
    id: 'masai-red', name: 'Rouge Maasai', origin: 'Kenya/Tanzanie',
    accentClass: 'text-avs-masai', accentHex: '#CC0000',
    description: 'La couleur emblématique des Maasai — rouge ochre, blanc lait, noir cendre, terre brûle.',
    patternCSS: 'avs-pattern-wax-dakar',
    region: 'Afrique de l\'Est', culture: 'Maasai', theme: 'Culturel',
    colors: [
      { role: 'primary',   name: 'masai-red',    hex: '#CC0000', meaning: 'Rouge ochre — courage, protection',       origin: 'Ocre naturelle',     css: '--avs-masai-red'   },
      { role: 'secondary', name: 'masai-white',  hex: '#F5EBE0', meaning: 'Blanc lait — paix, lait, prospérité',      origin: 'Lait de vache',      css: '--avs-secondary'   },
      { role: 'accent',    name: 'masai-black',  hex: '#1D1D1B', meaning: 'Noir cendre — résilience, force',         origin: 'Cendre de feu',      css: '--avs-accent'      },
      { role: 'neutral',   name: 'masai-earth',  hex: '#8B4513', meaning: 'Terre brûlée — connexion ancestrale',    origin: 'Savane sèche',       css: '--avs-earth'       },
    ],
  },
  {
    id: 'nubian-gold', name: 'Or Nubien', origin: 'Soudan',
    accentClass: 'text-avs-nubian', accentHex: '#DAA520',
    description: 'L\'héritage doré de la Nubie antique — or royal, bleu lapis-lazuli, noir obsidienne, ivoire.',
    patternCSS: 'avs-pattern-kente-royale',
    region: 'Afrique du Nord', culture: 'Nubien', theme: 'Historique',
    colors: [
      { role: 'primary',   name: 'nubian-gold',  hex: '#DAA520', meaning: 'Or royal — splendeur, divinité',          origin: 'Mines de Nubie',     css: '--avs-nubian-gold' },
      { role: 'secondary', name: 'nubian-lapis', hex: '#26619C', meaning: 'Lapis-lazuli — sagesse, ciel',            origin: 'Afghanistan antique',css: '--avs-nubian-lapis'},
      { role: 'accent',    name: 'nubian-black', hex: '#1D1D1B', meaning: 'Obsidienne — éternité, mystère',          origin: 'Volcan',             css: '--avs-accent'      },
      { role: 'neutral',   name: 'nubian-ivory', hex: '#F5EBE0', meaning: 'Ivoire — pureté, luxe',                  origin: 'Éléphant',           css: '--avs-secondary'   },
    ],
  },
  {
    id: 'senegal-wax', name: 'Wax Sénégalais', origin: 'Sénégal',
    accentClass: 'text-avs-wax', accentHex: '#FF4500',
    description: 'Les couleurs vibrantes du tissu Wax sénégalais — orange électrique, turquoise, jaune citron, blanc.',
    patternCSS: 'avs-pattern-wax-dakar',
    region: 'Afrique de l\'Ouest', culture: 'Moderne', theme: 'Textile',
    colors: [
      { role: 'primary',   name: 'wax-orange',  hex: '#FF4500', meaning: 'Orange électrique — énergie, joie',        origin: 'Teinture industrielle',css: '--avs-wax-orange' },
      { role: 'secondary', name: 'wax-turquoise',hex: '#40E0D0', meaning: 'Turquoise — fraîcheur, océan',           origin: 'Pigment synthétique', css: '--avs-wax-turquoise'},
      { role: 'accent',    name: 'wax-yellow',  hex: '#FFD700', meaning: 'Jaune citron — soleil, vitalité',         origin: 'Curcuma',            css: '--avs-wax-yellow'  },
      { role: 'neutral',   name: 'wax-white',   hex: '#F5EBE0', meaning: 'Blanc pur — clarté, modernité',           origin: 'Coton',              css: '--avs-secondary'   },
    ],
  },
  {
    id: 'ivory-coast', name: 'Côte d\'Ivoire', origin: 'Côte d\'Ivoire',
    accentClass: 'text-avs-ivory', accentHex: '#FF8C00',
    description: 'Les couleurs de la Côte d\'Ivoire — orange, blanc, vert, symboles nationaux.',
    patternCSS: 'avs-pattern-wax-dakar',
    region: 'Afrique de l\'Ouest', culture: 'Moderne', theme: 'National',
    colors: [
      { role: 'primary',   name: 'ivory-orange', hex: '#FF8C00', meaning: 'Orange national — richesse, terre',         origin: 'Drapeau national',   css: '--avs-ivory-orange'},
      { role: 'secondary', name: 'ivory-white',  hex: '#F5EBE0', meaning: 'Blanc paix — harmonie, pureté',           origin: 'Drapeau national',   css: '--avs-secondary'   },
      { role: 'accent',    name: 'ivory-green',  hex: '#228B22', meaning: 'Vert espérance — avenir, croissance',      origin: 'Drapeau national',   css: '--avs-ivory-green' },
      { role: 'neutral',   name: 'ivory-gold',   hex: '#DAA520', meaning: 'Or prospérité — économie, abondance',      origin: 'Ressources naturelles',css: '--avs-nubian-gold'},
    ],
  },
  {
    id: 'ghana-adinkra', name: 'Adinkra Ghana', origin: 'Ghana',
    accentClass: 'text-avs-adinkra', accentHex: '#000000',
    description: 'Symboles Adinkra sur tissu noir — noir profond, rouge sang, blanc kaolin, or royal.',
    patternCSS: 'avs-pattern-kente-royale',
    region: 'Afrique de l\'Ouest', culture: 'Akan', theme: 'Symbolique',
    colors: [
      { role: 'primary',   name: 'adinkra-black', hex: '#000000', meaning: 'Noir profond — sagesse, ancêtres',        origin: 'Écorce de badie',    css: '--avs-accent'      },
      { role: 'secondary', name: 'adinkra-red',   hex: '#8B0000', meaning: 'Rouge sang — sacrifice, courage',         origin: 'Ocre rouge',         css: '--avs-adinkra-red' },
      { role: 'accent',    name: 'adinkra-gold',  hex: '#FFD700', meaning: 'Or royal — richesse, royauté',           origin: 'Dust gold',          css: '--avs-wax-yellow'  },
      { role: 'neutral',   name: 'adinkra-white', hex: '#F5EBE0', meaning: 'Blanc kaolin — pureté, spiritualité',   origin: 'Argile blanche',     css: '--avs-secondary'   },
    ],
  },
  {
    id: 'namibia-desert', name: 'Désert Namibien', origin: 'Namibie',
    accentClass: 'text-avs-namibia', accentHex: '#DEB887',
    description: 'Les teintes du désert du Namib — ocre sable, rose veld, violet montagne, bleu ciel.',
    patternCSS: 'avs-pattern-bogolan-fanga',
    region: 'Afrique Australe', culture: 'San', theme: 'Nature',
    colors: [
      { role: 'primary',   name: 'namib-sand',    hex: '#DEB887', meaning: 'Sable doré — dunes, éternité',            origin: 'Désert du Namib',    css: '--avs-namib-sand'   },
      { role: 'secondary', name: 'namib-pink',    hex: '#E9967A', meaning: 'Rose veld — couchers de soleil',          origin: 'Veld fleuri',       css: '--avs-namib-pink'   },
      { role: 'accent',    name: 'namib-purple',  hex: '#6A5ACD', meaning: 'Violet montagne — profondeur, mystère',   origin: 'Montagnes',         css: '--avs-namib-purple' },
      { role: 'neutral',   name: 'namib-sky',     hex: '#87CEEB', meaning: 'Bleu ciel — horizon, infini',             origin: 'Ciel désertique',   css: '--avs-namib-sky'    },
    ],
  },
  {
    id: 'madagascar-spice', name: 'Épices de Madagascar', origin: 'Madagascar',
    accentClass: 'text-avs-spice', accentHex: '#CD853F',
    description: 'Les couleurs des épices malgaches — cannelle, vanille, poivre, clou de girofle.',
    patternCSS: 'avs-pattern-ndop-sultan',
    region: 'Afrique de l\'Est', culture: 'Malgache', theme: 'Nature',
    colors: [
      { role: 'primary',   name: 'spice-cinnamon', hex: '#CD853F', meaning: 'Cannelle — chaleur, confort',            origin: 'Écorce de cannelle', css: '--avs-spice-cinnamon'},
      { role: 'secondary', name: 'spice-vanilla',  hex: '#F5EBE0', meaning: 'Vanille — douceur, luxe',                origin: 'Gousse de vanille',  css: '--avs-secondary'    },
      { role: 'accent',    name: 'spice-pepper',   hex: '#2F4F4F', meaning: 'Poivre noir — intensité, caractère',     origin: 'Poivre noir',        css: '--avs-spice-pepper'  },
      { role: 'neutral',   name: 'spice-clove',    hex: '#8B4513', meaning: 'Clou de girofle — richesse, arôme',      origin: 'Clou de girofle',    css: '--avs-earth'         },
    ],
  },
  {
    id: 'seigensha-warm', name: 'Contraste Chaud', origin: 'Seigensha · Combinaisons',
    accentClass: 'text-avs-etruscan', accentHex: '#B84A36',
    description: 'Harmonie chaude tirée du Dictionnaire de combinaisons de couleurs — rouge étrusque, bleu Nil, or sulfin.',
    patternCSS: 'avs-pattern-wax-dakar',
    region: 'International', culture: 'Moderne', theme: 'Design',
    colors: [
      { role: 'primary',   name: 'sg-etruscan',  hex: '#B84A36', meaning: 'Rouge étrusque — force, feu, caractère',    origin: 'Dict. comb. #025', css: '--avs-etruscan'  },
      { role: 'secondary', name: 'sg-nile-blue', hex: '#BDD8DC', meaning: 'Bleu Nil — repos, eau, horizon serein',     origin: 'Dict. comb. #025', css: '--avs-nile-blue' },
      { role: 'accent',    name: 'sg-golden',    hex: '#D4881A', meaning: 'Jaune doré — lumière, chaleur, récolte',    origin: 'Dict. comb. #026', css: '--avs-golden'    },
      { role: 'neutral',   name: 'sg-sulphine',  hex: '#C8B020', meaning: 'Jaune sulfin — éclat, vitalité, savane',    origin: 'Dict. comb. #065', css: '--avs-sulphine'  },
    ],
  },
  {
    id: 'seigensha-deep', name: 'Profondeur & Contraste', origin: 'Seigensha · Combinaisons',
    accentClass: 'text-avs-olive', accentHex: '#5A6320',
    description: 'Profondeur tonale du Dictionnaire Seigensha — olive sacré, violet nuit, ocre jaune, chartreuse.',
    patternCSS: 'avs-pattern-ndop-sultan',
    region: 'International', culture: 'Moderne', theme: 'Design',
    colors: [
      { role: 'primary',   name: 'sg-olive',       hex: '#5A6320', meaning: 'Vert olive — maturité, ancrage, équilibre',  origin: 'Dict. comb. #066', css: '--avs-olive'      },
      { role: 'secondary', name: 'sg-ocher',       hex: '#C8A020', meaning: 'Ocre olive — chaleur sèche, steppe, soleil', origin: 'Dict. comb. #066', css: '--avs-ocher'      },
      { role: 'accent',    name: 'sg-violet-nuit', hex: '#1A1440', meaning: 'Violet nuit — cosmos, mystère, infini',      origin: 'Dict. comb. #106', css: '--avs-violet-nuit'},
      { role: 'neutral',   name: 'sg-chartreuse',  hex: '#B8C018', meaning: 'Vert chartreuse — fraîcheur, nature, espoir',origin: 'Dict. comb. #289', css: '--avs-chartreuse' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CULTURAL CONTEXT — informations sur la région et la culture
// ─────────────────────────────────────────────────────────────────────────────

export const CULTURAL_CONTEXT: Record<string, { description: string; significance: string }> = {
  'Afrique de l\'Ouest': {
    description: 'Région riche en traditions textiles, de la poterie Yoruba au tissu Kente des Akan.',
    significance: 'Berceau de civilisations anciennes, connue pour ses textiles symboliques et ses pigments naturels.',
  },
  'Afrique Centrale': {
    description: 'Terre des royaumes Bamoum et Kongo, avec des teintures à l\'indigo et des tissus sacrés.',
    significance: 'Région de spiritualité profonde, où les couleurs portent des significations rituelles et ancestrales.',
  },
  'Afrique de l\'Est': {
    description: 'De l\'Éthiopie impériale aux cultures Maasai, palette de terres rouges et d\'or historique.',
    significance: 'Carrefour de civilisations anciennes, avec des traditions artistiques millénaires.',
  },
  'Afrique Australe': {
    description: 'Art San, perles Zoulou, et teintes du désert du Namib — expressions artistiques uniques.',
    significance: 'Région de diversité culturelle extraordinaire, avec l\'art rupestre le plus ancien au monde.',
  },
  'Afrique du Nord': {
    description: 'Déserts sahariens, cultures Touareg et Nubienne — or, lapis-lazuli, et teintes du sable.',
    significance: 'Terre de caravanes et de civilisations berbères, avec un héritage artistique riche.',
  },
  'Pan-Africain': {
    description: 'Couleurs transcendant les frontières, unissant le continent par des pigments naturels partagés.',
    significance: 'Expression de l\'unité africaine à travers des teintes universelles du continent.',
  },
  'International': {
    description: 'Combinaisons modernes inspirées par la palette africaine, adaptées au design contemporain.',
    significance: 'Fusion entre l\'héritage africain et les standards de design international.',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SWATCH LIBRARY — bibliothèque curatée pour choisir rapidement une couleur
// ─────────────────────────────────────────────────────────────────────────────

export interface SwatchFamily {
  id:     string;
  label:  string;
  swatches: { name: string; hex: string; meaning: string }[];
}

export const SWATCH_LIBRARY: SwatchFamily[] = [
  {
    id: 'terre', label: 'Terre & Ocre',
    swatches: [
      { name: 'Terracotta',   hex: '#C0573E', meaning: 'Terre brûlée, chaleur' },
      { name: 'Sienna',       hex: '#8B4513', meaning: 'Sol fertile, ancrage' },
      { name: 'Ocre',         hex: '#C8821A', meaning: 'Lumière rasante' },
      { name: 'Baobab',       hex: '#5C3317', meaning: 'Écorce, durée' },
      { name: 'Sable',        hex: '#E8C99A', meaning: 'Sahara, ouverture' },
      { name: 'Argile',       hex: '#D4A882', meaning: 'Douceur, foyer' },
    ],
  },
  {
    id: 'indigo', label: 'Indigo & Bleu',
    swatches: [
      { name: 'Indigo cosmos',hex: '#0D2340', meaning: 'Eaux primordiales' },
      { name: 'Bleu royal',   hex: '#2A4A6B', meaning: 'Autorité, ciel' },
      { name: 'Bleu Nil',     hex: '#BDD8DC', meaning: 'Repos, horizon' },
      { name: 'Antwarp',      hex: '#2070B8', meaning: 'Clarté, confiance' },
      { name: 'Mist lagune',  hex: '#B0C4C8', meaning: 'Sérénité' },
    ],
  },
  {
    id: 'or', label: 'Or & Jaune',
    swatches: [
      { name: 'Or royal',     hex: '#D4A017', meaning: 'Richesse, royauté' },
      { name: 'Raphia',       hex: '#C8A96E', meaning: 'Richesse naturelle' },
      { name: 'Jaune doré',   hex: '#D4881A', meaning: 'Lumière, récolte' },
      { name: 'Sulfin',       hex: '#C8B020', meaning: 'Éclat, savane' },
      { name: 'Ocre olive',   hex: '#C8A020', meaning: 'Chaleur sèche' },
    ],
  },
  {
    id: 'vert', label: 'Vert',
    swatches: [
      { name: 'Vert forêt',   hex: '#4A6741', meaning: 'Croissance, vie' },
      { name: 'Olive',        hex: '#5A6320', meaning: 'Maturité, équilibre' },
      { name: 'Chartreuse',   hex: '#B8C018', meaning: 'Fraîcheur, espoir' },
    ],
  },
  {
    id: 'neutre', label: 'Neutres',
    swatches: [
      { name: 'Obsidienne',   hex: '#1D1D1B', meaning: 'Profondeur, autorité' },
      { name: 'Lin naturel',  hex: '#F5EBE0', meaning: 'Repos, clarté' },
      { name: 'Violet nuit',  hex: '#1A1440', meaning: 'Cosmos, mystère' },
      { name: 'Étrusque',     hex: '#B84A36', meaning: 'Force, caractère' },
    ],
  },
];
