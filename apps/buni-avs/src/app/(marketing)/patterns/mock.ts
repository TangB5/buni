import { Pattern, PatternType } from '@buni/patterns';

/**
 * SVG PATTERNS DATA
 * 
 * Add new patterns here with their documentation.
 * This file is separate from the component for easy maintenance.
 * 
 * Structure:
 * - id: unique identifier
 * - slug: URL slug
 * - nameFr: French name
 * - localName: Local name
 * - type: Pattern type (NDOP, KENTE, etc.)
 * - svgPattern: CSS class for the SVG pattern (e.g., 'avs-svg-pattern-ndop6')
 * - origin: Geographic and cultural origin
 * - era: Time period
 * - colors: Color palette with meanings
 * - summary: Brief description
 * - history: Historical background
 * - technique: How it's made
 * - symbolism: Symbolic meanings
 * - ceremonial: When/how it's used
 * - symbols: Individual pattern symbols
 * - artisanQuote: Quote from an artisan
 * - sources: References and sources
 */

export interface PatternSymbol {
  name: string;
  nameFr: string;
  cssPreview: string;
  meaning: string;
  usage: string;
  sacred: boolean;
  imageUrl?: string;
}


export const PATTERNS_DOCS: Pattern[] = [ 
  {
    id: 'kente-asante',
    slug: 'kente-asante',
    name: 'Kente Asante',
    localName: 'Kente (Nwentom)',
    type: 'KENTE',
    cssClass: 'avs-pattern-kente-royale',
    origin: {
      people: 'Peuple Akan — Ashanti',
      region: 'Région Ashanti',
      country: 'Ghana',
      flag: '🇬🇭',
      coords: [6.6885, -1.6244],
    },
    era: 'XVIIe siècle — présent',
    license: 'cc-by',
    colors: [
      { hex: '#D4A017', name: 'Or (Sikye)', meaning: 'Royauté, richesse, statut élevé' },
      {
        hex: '#1D1D1B',
        name: 'Noir (Kuntunkuni)',
        meaning: 'Maturité, intensification spirituelle',
      },
      {
        hex: '#C0573E',
        name: 'Rouge (Oyokoman)',
        meaning: 'Sacrifices politiques, bravoure au combat',
      },
      { hex: '#4A6741', name: 'Vert (Akyem)', meaning: 'Croissance, renouveau, prospérité' },
    ],
    summary: 'Le Kente est le tissu le plus emblématique du peuple Akan du Ghana. Tissé en bandelettes entrelacées, chaque combinaison de couleurs et de motifs constitue un langage visuel codé, lisible par les initiés.',
    history: 'Selon la tradition orale Ashanti, le Kente a été inventé au XVIIe siècle par les tisserands Oti Kraban et Kwaku Ameyaw, qui auraient appris l\'art du tissage en observant une araignée tisser sa toile. Le mot "Kente" dérive du terme "kenten" (panier), référence à la structure entrelacée du tissu. Réservé initialement aux cérémonies royales, le Kente s\'est progressivement démocratisé tout en conservant son caractère symbolique fort.',
    technique: 'Le Kente est tissé sur un métier horizontal étroit (environ 10 cm) en bandelettes séparées qui sont ensuite assemblées latéralement. Les fils de chaîne et de trame créent des motifs géométriques précis. La soie était utilisée pour les pièces royales, le coton pour les pièces courantes. Chaque tisserand mémorise des centaines de séquences de motifs traditionnels.',
    symbolism: 'Chaque motif Kente porte un nom et une signification précise. Le motif "Oyokoman Adwinasa" symbolise l\'excellence et la complétude. Le motif "Emaa Da" ("jamais vu avant") célèbre l\'innovation. La lecture du Kente est un acte de décodage culturel : porter un mauvais motif dans le mauvais contexte est une faute sociale grave.',
    ceremonial: "Mariages, funérailles royales, intronisations de chefs, graduations universitaires, réceptions d'État. Le Kente porté aux funérailles diffère de celui des mariages par sa palette — plus sombre, dominant le noir et le rouge.",
    symbols: [
      {
        name: 'Oyokoman',
        nameFr: 'Motif Royal',
        cssPreview: '#D4A017',
        meaning: 'Symbole du clan royal Oyoko — excellence, complétude, perfection artistique',
        usage: "Exclusivement porté par les membres de la famille royale Ashanti lors des cérémonies d'État",
        sacred: true,
      },
      {
        name: 'Emaa Da',
        nameFr: 'Jamais vu avant',
        cssPreview: '#C0573E',
        meaning: 'Célèbre l\'innovation et la créativité — "ce qui n\'a jamais existé auparavant"',
        usage: "Remis lors de premières académiques, de découvertes, d'accomplissements sans précédent",
        sacred: false,
      },
      {
        name: 'Adweneasa',
        nameFr: 'Mes pensées sont épuisées',
        cssPreview: '#4A6741',
        meaning: "Représente la totalité de l'art du tisserand — il n'y a plus rien à ajouter",
        usage: 'Porté par les maîtres artisans, les chefs ayant atteint la sagesse suprême',
        sacred: true,
      },
      {
        name: 'Sika Futuro',
        nameFr: "Pépites d'or",
        cssPreview: '#D4A017',
        meaning: 'Symbolise la richesse matérielle et la prospérité gagnée par le labeur',
        usage: 'Cadeaux pour célébrer un succès commercial, une bonne récolte, une promotion',
        sacred: false,
      },
      {
        name: 'Fathia Fata Nkrumah',
        nameFr: 'Fathia convient à Nkrumah',
        cssPreview: '#1D1D1B',
        meaning: 'Créé pour le mariage de Kwame Nkrumah — union, alliance politique, amour transculturel',
        usage: "Mariages interethniques, alliances diplomatiques, célébrations de l'unité africaine",
        sacred: false,
      },
    ],
    artisanQuote: {
      text: 'Le Kente ne se porte pas, il se lit. Chaque fil est une lettre, chaque rangée une phrase, chaque bande un poème de notre histoire.',
      author: 'Kwame Agyemang',
      role: 'Maître tisserand Kente — 4ème génération',
      country: '🇬🇭 Bonwire, Ghana',
    },
    sources: [
      'Rattray, R.S. (1927). Religion and Art in Ashanti.',
      'Doran H. Ross (1998). Wrapped in Pride.',
      'National Museum of Ghana — Archives ethnographiques 2019',
    ],
    downloads: 4820,
    views: 28400,
    published: false,
    featured: false
  },



  
  {
    id: 'ndop-bamoum',
    slug: 'ndop-bamoum',
    name: 'Ndop Bamoum',
    localName: 'Ndop (Ndoup)',
    type: 'NDOP',
    cssClass: 'avs-pattern-ndop-sultan',
    origin: {
      people: 'Peuple Bamoum (Bamum)',
      region: 'Sultanat de Foumban',
      country: 'Cameroun',
      flag: '🇨🇲',
      coords: [5.7239, 10.9055],
    },
    era: 'XVe siècle — présent',
    license: 'cc-by',
    colors: [
      {
        hex: '#0D2340',
        name: 'Indigo (Nkap)',
        meaning: 'Ciel nocturne, monde spirituel, royauté céleste',
      },
      { hex: '#C8A96E', name: 'Raphia (Nkoo)', meaning: 'Fil de vie, connexion ancêtres-vivants' },
      {
        hex: '#F5EBE0',
        name: 'Ivoire (Mfon)',
        meaning: 'Pureté spirituelle, communication divine',
      },
    ],
    summary: "Le Ndop est un tissu sacré du Sultanat Bamoum, tissé exclusivement pour la royauté et les cérémonies rituelles. Son fond indigo profond et ses motifs géométriques en fil de raphia doré constituent l'un des systèmes symboliques les plus complexes d'Afrique centrale.",
    history: "Le Ndop remonte au règne du Sultan Nshare Yen (XVe siècle), fondateur du Sultanat Bamoum. Le Sultan Ibrahim Njoya (1886-1931), célèbre pour avoir inventé l'écriture Bamum (Shu-mom), a codifié et élargi le catalogue des motifs Ndop, documentant leur signification dans des manuscrits aujourd'hui conservés au Musée des Arts et Traditions Bamoum.",
    technique: "Le Ndop est tissé sur un métier horizontal à pédales, avec un fond de coton teint à l'indigo naturel (Indigofera tinctoria). Les motifs sont créés par résistance (ligature des fils avant teinture) ou par broderie au fil de raphia après tissage.",
    symbolism: "Le Ndop fonctionne comme un texte sacré. Chaque motif géométrique — carré, losange, spirale, croix — est un idéogramme qui encode l'histoire dynastique, les attributs royaux et les forces spirituelles.",
    ceremonial: "Intronisation des sultans et notables, funérailles royales, rituels de guérison, fêtes annuelles du Nguon. Le Ndop n'est jamais lavé à l'eau — considéré comme un être vivant.",
    symbols: [
      {
        name: 'Nkap-Nkap',
        nameFr: 'Le carré royal',
        cssPreview: '#C8A96E',
        meaning: "Symbole de l'autorité sultanale — les quatre côtés représentent les quatre points cardinaux sous contrôle du Sultan",
        usage: 'Présent sur tous les Ndop royaux, interdit sur les pièces destinées aux non-nobles',
        sacred: true,
      },
      {
        name: 'Mfon-Ntoung',
        nameFr: "L'œil du léopard",
        cssPreview: '#0D2340',
        meaning: "Le léopard est l'animal totem du Sultan — vision pénétrante, puissance, maîtrise du territoire",
        usage: 'Porté lors des jugements royaux et des décisions politiques importantes',
        sacred: true,
      },
      {
        name: 'Nkaa-Wou',
        nameFr: 'La spirale ancestrale',
        cssPreview: '#C8A96E',
        meaning: 'Connexion entre le monde des vivants et celui des ancêtres — continuité dynastique sans interruption',
        usage: 'Cérémonies funéraires royales, rituels de consultation des ancêtres',
        sacred: true,
      },
      {
        name: 'Mbeum',
        nameFr: 'Le losange de fécondité',
        cssPreview: '#F5EBE0',
        meaning: 'Fertilité, abondance des récoltes, prospérité du royaume',
        usage: 'Offert aux femmes enceintes de la famille royale, porté lors des semailles',
        sacred: false,
      },
    ],
    artisanQuote: {
      text: "Un Ndop contient la mémoire de tout le Sultanat. Tisser un motif Nkap-Nkap sans y être initié, c'est voler l'histoire d'un peuple.",
      author: 'Mfon Njoya Hamidou',
      role: 'Tisserand officiel du Palais des Rois Bamoum',
      country: '🇨🇲 Foumban, Cameroun',
    },
    sources: [
      "Claude, H. (1976). L'art Bamum.",
      'Geary, C. (1983). Things of the Palace.',
      'Musée des Arts et Traditions Bamoum — Foumban',
    ],
    downloads: 3140,
    views: 19800,
    published: false,
    featured: false
  },
  {
    id: 'bogolan-malien',
    slug: 'bogolan-malien',
    name: 'Bogolan Malien',
    localName: 'Bògòlanfini',
    type: 'BOGOLAN',
    cssClass: 'avs-pattern-bogolan-fanga',
    origin: {
      people: 'Peuples Bamana, Mandé',
      region: 'Région de Ségou',
      country: 'Mali',
      flag: '🇲🇱',
      coords: [13.46, -6.27],
    },
    era: 'XIIe siècle — présent',
    license: 'cc-by',
    colors: [
      { hex: '#8B4513', name: 'Terre (Bogo)', meaning: 'Boue fermentée — lien avec la terre-mère' },
      { hex: '#5C2E0E', name: 'Brun profond (Nogo)', meaning: 'Nuit, mystère, puissance occulte' },
      { hex: '#F5EBE0', name: 'Écru naturel', meaning: 'Espace vide — le silence entre les mots' },
    ],
    summary: "Le Bogolan (Bògòlanfini) est un tissu de boue fermentée, teint à partir de terre argileuse et de feuilles d'arbre. Chaque motif géométrique encode un proverbe, une leçon de vie ou un fait historique transmis de génération en génération par les femmes Bamana.",
    history: "Le Bogolan est attesté depuis le XIIe siècle dans les sources orales Mandé. Traditionnellement, sa production était exclusivement féminine. En 1960, le créateur de mode Chris Seydou a internationalisé le Bogolan en l'intégrant dans la haute couture parisienne.",
    technique: 'La fabrication du Bogolan est un processus en 4 étapes : 1) Teinture au décoction de feuilles de Nté. 2) Application de la boue fermentée. 3) Décoloration des zones à éclaircir. 4) Séchage au soleil. Un tissu Bogolan peut nécessiter 4 à 8 semaines.',
    symbolism: "Contrairement au Kente ou au Ndop, le Bogolan n'a pas de système symbolique unique — chaque famille, village et artisane possède son propre répertoire. Le Bogolan est fondamentalement un langage de femmes.",
    ceremonial: "Initiation des jeunes filles, mariages, retour des chasseurs, cérémonies de maternité. Aujourd'hui, le Bogolan est aussi un puissant symbole d'identité culturelle et de résistance.",
    symbols: [
      {
        name: 'Bolo Kolon',
        nameFr: 'La main vide',
        cssPreview: '#8B4513',
        meaning: "Ce que l'on possède naît du travail des mains — l'oisiveté est la mère de la misère",
        usage: "Offert lors des remises de diplômes, célébrations d'accomplissements personnels",
        sacred: false,
      },
      {
        name: 'Kono Tigi',
        nameFr: 'Le maître oiseau',
        cssPreview: '#5C2E0E',
        meaning: "La liberté de l'esprit qui transcende les limites terrestres — vision d'ensemble",
        usage: 'Porté par les guérisseurs et devins lors des rituels de clairvoyance',
        sacred: true,
      },
      {
        name: 'Fanga',
        nameFr: 'La puissance masculine',
        cssPreview: '#8B4513',
        meaning: 'Force brute, courage au combat, virilité — le motif des guerriers Bamana',
        usage: 'Exclusivement porté par les hommes, notamment avant les épreuves physiques',
        sacred: true,
      },
      {
        name: 'Jeli',
        nameFr: 'Le griot',
        cssPreview: '#F5EBE0',
        meaning: 'Gardien de la mémoire collective — celui qui relie le passé au présent',
        usage: 'Offert aux griots lors de grandes cérémonies, aux personnes qui perpétuent la tradition orale',
        sacred: false,
      },
    ],
    artisanQuote: {
      text: "Ma mère m'a appris que chaque motif porte une voix. Quand je tisonne la boue dans le coton, ce sont les voix de nos aïeules qui parlent.",
      author: 'Mariam Coulibaly',
      role: 'Artisane Bogolan — Ségou',
      country: '🇲🇱 Ségou, Mali',
    },
    sources: [
      'Imperato, P.J. & Shamir, M. (1970). Bogolanfini.',
      'Brett-Smith, S.C. (1982). Symbolic Blood.',
      'Musée National du Mali — Documentation ethnographique',
    ],
    downloads: 2890,
    views: 16200,
    published: false,
    featured: false
  },
  {
    id: 'adinkra-akan',
    slug: 'adinkra-akan',
    name: 'Adinkra Akan',
    localName: 'Adinkra',
    type: 'ADINKRA',
    cssClass: 'avs-pattern-adinkra-sankofa',
    origin: {
      people: 'Peuple Akan — Gyaman',
      region: 'Brong-Ahafo',
      country: "Ghana / Côte d'Ivoire",
      flag: '🇬🇭',
      coords: [7.496, -2.7942],
    },
    era: 'XVIIIe siècle — présent',
    license: 'cc-by',
    colors: [
      {
        hex: '#1A0F00',
        name: "Noir d'encre",
        meaning: 'Deuil, sagesse des ancêtres, profondeur spirituelle',
      },
      { hex: '#D4A017', name: 'Ocre doré', meaning: 'Mémoire précieuse, savoir transmis' },
      { hex: '#C0573E', name: 'Rouge terre', meaning: 'Force vitale, sang des ancêtres' },
    ],
    summary: "Les Adinkra sont des symboles philosophiques imprimés sur tissu, chacun exprimant un concept, un proverbe ou une valeur morale du peuple Akan. Initialement utilisés pour les cérémonies de deuil, ils sont aujourd'hui gravés sur tout — textiles, bijoux, architecture, logos.",
    history: 'Selon la tradition, les Adinkra ont été créés par Nana Kofi Adinkra, roi du royaume Gyaman, après sa défaite face au roi Ashanti Osei Bonsu en 1817. Le nom "Adinkra" signifie "au revoir" en langue Twi. Les premiers symboles ont été documentés par Thomas Edward Bowdich en 1817.',
    technique: "L'impression Adinkra traditionnelle utilise une encre noire appelée \"Adinkra aduru\", obtenue par ébullition d'écorce d'arbre Badie. Les tampons (prismes de calebasse sculptés) sont trempés dans cette encre et imprimés manuellement sur le tissu.",
    symbolism: "Chaque Adinkra est une phrase philosophique condensée en image. Ils couvrent les thèmes universels : le pouvoir, l'amour, l'unité, la sagesse, la résilience, la dualité du bien et du mal.",
    ceremonial: "Deuil et funérailles, cérémonies royales, cadeaux diplomatiques, vêtements de graduation. Aujourd'hui, les Adinkra décorent les bâtiments officiels du Ghana et les billets de banque.",
    symbols: [
      {
        name: 'Sankofa',
        nameFr: 'Revenir en arrière pour avancer',
        cssPreview: '#D4A017',
        meaning: '"Se se wo were fi na wosankofa a yenkyi" — Il n\'est pas interdit de revenir en arrière pour prendre ce que tu as oublié.',
        usage: 'Porté lors des cérémonies de transmission du savoir, offert aux aînés et enseignants',
        sacred: false,
      },
      {
        name: 'Gye Nyame',
        nameFr: 'Sauf Dieu',
        cssPreview: '#1A0F00',
        meaning: '"Sauf Dieu, je ne crains rien" — Omnipotence divine, humilité face à l\'infini.',
        usage: 'Présent partout — architecture, bijoux, textiles — comme protection universelle',
        sacred: true,
      },
      {
        name: 'Nkyinkyin',
        nameFr: 'Adaptabilité',
        cssPreview: '#C0573E',
        meaning: "La capacité à s'adapter aux changements, à plier sans se briser.",
        usage: 'Porté lors des transitions de vie, offert à ceux qui traversent des périodes difficiles',
        sacred: false,
      },
      {
        name: 'Aya',
        nameFr: 'La fougère',
        cssPreview: '#4A6741',
        meaning: 'Endurance et résilience — la fougère pousse même dans les sols les plus difficiles.',
        usage: 'Porté par ceux qui ont surmonté des obstacles majeurs, offert comme encouragement',
        sacred: false,
      },
      {
        name: 'Dwennimmen',
        nameFr: 'Les cornes du bélier',
        cssPreview: '#D4A017',
        meaning: "Humilité dans la force — le bélier se bat avec les cornes mais s'agenouille pour boire.",
        usage: 'Offert aux leaders comme rappel de la responsabilité du pouvoir',
        sacred: false,
      },
      {
        name: 'Osram Ne Nsoromma',
        nameFr: "La lune et l'étoile",
        cssPreview: '#1A0F00',
        meaning: 'Amour, fidélité, harmonie — la lune et son étoile fidèle, inséparables.',
        usage: 'Cadeaux de mariage, symbole des unions, présent sur les textiles nuptiaux',
        sacred: false,
      },
    ],
    artisanQuote: {
      text: "Un Adinkra sans connaissance de sa signification est un mot sans sens. L'image est le corps, mais la philosophie est l'âme.",
      author: 'Nana Owusu Sarpong',
      role: 'Maître imprimeur Adinkra — Ntonso',
      country: '🇬🇭 Ntonso, Ghana',
    },
    sources: [
      'Willis, W.B. (1998). The Adinkra Dictionary.',
      'Bowdich, T.E. (1817). Mission from Cape Coast Castle to Ashantee.',
      'Centre for National Culture — Kumasi, Ghana',
    ],
    downloads: 5640,
    views: 34100,
    published: false,
    featured: false
  },
];