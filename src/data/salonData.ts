import {
  AccessoryId,
  CrownId,
  DressId,
  EarringId,
  EyelinerStyle,
  HairStyleId,
  NailGemId,
  NailPatternId,
  NecklaceId,
  PrincessMakeoverState,
  PrincessPreset,
  ShoeId,
} from '../types/salon';

export const SALON_IMAGES = {
  homeHero: '/src/assets/images/home_princess_hero_1795518672899.jpg',
  vanityBackdrop: '/src/assets/images/salon_backdrop_vanity_1795518673835.jpg',
  ballroomBackdrop: '/src/assets/images/salon_backdrop_ballroom_1795518675195.jpg',
};

export const PRINCESSES: PrincessPreset[] = [
  {
    id: 'aurora',
    name: 'Princess Aurora',
    title: 'Rose Garden Royal',
    bio: 'Loves shimmering rose-gold curls, pearl jewelry, and classic ballgowns.',
    skinTone: '#FCD5C4',
    skinShadow: '#EBB09A',
    skinHighlight: '#FFE8DD',
    eyeColor: '#3B82F6',
    naturalLipColor: '#DF8B97',
    starterHairColor: '#E5B869',
    starterHairStyle: 'messy_starter',
    signatureColor: '#EC4899',
    blemishCoords: [
      { x: 162, y: 215 },
      { x: 238, y: 205 },
      { x: 185, y: 248 },
    ],
  },
  {
    id: 'jasmine',
    name: 'Princess Jasmine',
    title: 'Starlight Palace Royal',
    bio: 'Adores amethyst purple tones, dramatic winged liner, and sparkling tiaras.',
    skinTone: '#D69974',
    skinShadow: '#B97852',
    skinHighlight: '#EBB594',
    eyeColor: '#059669',
    naturalLipColor: '#B8646C',
    starterHairColor: '#1E1B2E',
    starterHairStyle: 'messy_starter',
    signatureColor: '#9333EA',
    blemishCoords: [
      { x: 158, y: 208 },
      { x: 242, y: 222 },
      { x: 215, y: 252 },
    ],
  },
  {
    id: 'sofia',
    name: 'Princess Sofia',
    title: 'Velvet Blossom Royal',
    bio: 'Shines in berry-plum couture, luminous highlighter, and crystal nail art.',
    skinTone: '#8C5239',
    skinShadow: '#6D3B26',
    skinHighlight: '#A96B4F',
    eyeColor: '#7C3AED',
    naturalLipColor: '#924455',
    starterHairColor: '#2A1814',
    starterHairStyle: 'messy_starter',
    signatureColor: '#C026D3',
    blemishCoords: [
      { x: 166, y: 222 },
      { x: 232, y: 210 },
      { x: 196, y: 174 },
    ],
  },
  {
    id: 'celeste',
    name: 'Princess Celeste',
    title: 'Moonbeam Fairy Royal',
    bio: 'Dreams of pastel lavender hair, petal skirts, and shimmering silver accessories.',
    skinTone: '#F7C9BE',
    skinShadow: '#DF9F91',
    skinHighlight: '#FFE3DC',
    eyeColor: '#6366F1',
    naturalLipColor: '#D67B8C',
    starterHairColor: '#A94438',
    starterHairStyle: 'messy_starter',
    signatureColor: '#A855F7',
    blemishCoords: [
      { x: 172, y: 212 },
      { x: 236, y: 218 },
      { x: 208, y: 248 },
    ],
  },
];

export function createInitialMakeoverState(princess: PrincessPreset): PrincessMakeoverState {
  return {
    spa: {
      cleansedProgress: 0,
      rinsed: false,
      blemishesCleared: princess.blemishCoords.map(() => false),
      browsTidied: false,
      activeMask: null,
      maskAppliedProgress: 0,
      maskRinsed: false,
      eyePadsOn: false,
      eyeDarknessCleared: false,
    },
    hair: {
      styleId: princess.starterHairStyle,
      color: princess.starterHairColor,
      highlightColor: '#F472B6',
      hasHighlights: false,
      shineLevel: 20,
    },
    makeup: {
      eyeshadowColor: null,
      eyeshadowIntensity: 0.65,
      eyelinerStyle: 'none',
      mascara: false,
      blushColor: null,
      blushIntensity: 0.55,
      lipstickColor: null,
      lipGloss: false,
      cheekGem: 'none',
    },
    nails: {
      mode: 'manicure',
      handCared: [false, false, false, false, false],
      footCared: [false, false, false, false, false],
      handPolish: [null, null, null, null, null],
      footPolish: [null, null, null, null, null],
      handPattern: ['solid', 'solid', 'solid', 'solid', 'solid'],
      footPattern: ['solid', 'solid', 'solid', 'solid', 'solid'],
      handGem: ['none', 'none', 'none', 'none', 'none'],
      footGem: ['none', 'none', 'none', 'none', 'none'],
      ringId: 'none',
      braceletId: 'none',
      ankletId: 'none',
    },
    boutique: {
      dressId: 'starter_lounge',
      dressPrimaryColor: '#F472B6',
      dressAccentColor: '#C084FC',
      shoeId: 'barefoot',
      crownId: 'none',
      necklaceId: 'none',
      earringId: 'none',
      accessoryId: 'none',
    },
    studioBackdrop: 'vanity',
  };
}

export const HAIR_STYLES: Array<{ id: HairStyleId; name: string }> = [
  { id: 'royal_updo', name: 'Royal Updo Bun' },
  { id: 'princess_curls', name: 'Cascading Curls' },
  { id: 'braided_crown', name: 'Braided Crown' },
  { id: 'high_ponytail', name: 'High Ponytail' },
  { id: 'sleek_bob', name: 'Sleek Chic Bob' },
  { id: 'twin_ribbons', name: 'Ribbon Pigtails' },
  { id: 'fairy_waves', name: 'Fairy Half-Up' },
  { id: 'voluminous_puffs', name: 'Royal Crown Puffs' },
];

export const HAIR_COLORS: Array<{ name: string; hex: string }> = [
  { name: 'Champagne Blonde', hex: '#E8BE6D' },
  { name: 'Golden Honey', hex: '#D18F3B' },
  { name: 'Copper Rose', hex: '#B84A39' },
  { name: 'Chestnut Brown', hex: '#6D412C' },
  { name: 'Midnight Raven', hex: '#1E1A2D' },
  { name: 'Platinum Pearl', hex: '#EDE8F5' },
  { name: 'Cotton Candy Pink', hex: '#F472B6' },
  { name: 'Bubblegum Rose', hex: '#EC4899' },
  { name: 'Royal Lavender', hex: '#A855F7' },
  { name: 'Deep Amethyst', hex: '#6D28D9' },
  { name: 'Ice Sky Blue', hex: '#60A5FA' },
  { name: 'Emerald Mint', hex: '#34D399' },
];

export const EYESHADOW_SHADES = [
  { name: 'Rose Quartz', hex: '#F472B6' },
  { name: 'Royal Plum', hex: '#9333EA' },
  { name: 'Lilac Mist', hex: '#C084FC' },
  { name: 'Champagne Gold', hex: '#FBBF24' },
  { name: 'Sunset Coral', hex: '#FB7185' },
  { name: 'Starlight Teal', hex: '#2DD4BF' },
  { name: 'Berry Velvet', hex: '#BE185D' },
  { name: 'Pearl Shimmer', hex: '#F3E8FF' },
];

export const EYELINER_STYLES: Array<{ id: EyelinerStyle; name: string }> = [
  { id: 'none', name: 'Natural' },
  { id: 'classic', name: 'Classic' },
  { id: 'winged', name: 'Royal Wing' },
  { id: 'shimmer', name: 'Violet Shimmer' },
];

export const BLUSH_SHADES = [
  { name: 'Petal Pink', hex: '#F472B6' },
  { name: 'Peachy Glow', hex: '#FB923C' },
  { name: 'Berry Flush', hex: '#DB2777' },
  { name: 'Lavender Pop', hex: '#C084FC' },
  { name: 'Rose Bronze', hex: '#E11D48' },
  { name: 'Soft Apricot', hex: '#FDA4AF' },
];

export const LIPSTICK_SHADES = [
  { name: 'Royal Rose', hex: '#EC4899' },
  { name: 'Berry Crush', hex: '#9D174D' },
  { name: 'Plum Wine', hex: '#701A75' },
  { name: 'Ruby Velvet', hex: '#E11D48' },
  { name: 'Coral Kiss', hex: '#F43F5E' },
  { name: 'Lavender Glaze', hex: '#A855F7' },
  { name: 'Peach Nectar', hex: '#FB7185' },
  { name: 'Shimmer Pink', hex: '#F9A8D4' },
];

export const NAIL_POLISH_COLORS = [
  { name: 'Bubblegum Pink', hex: '#F472B6' },
  { name: 'Royal Purple', hex: '#9333EA' },
  { name: 'Magenta Pop', hex: '#DB2777' },
  { name: 'Lavender Pastel', hex: '#C084FC' },
  { name: 'Pearl White', hex: '#FAF5FF' },
  { name: 'Gold Foil', hex: '#F59E0B' },
  { name: 'Rose Gold', hex: '#FB7185' },
  { name: 'Ruby Red', hex: '#E11D48' },
  { name: 'Mint Breeze', hex: '#34D399' },
  { name: 'Sky Blue', hex: '#60A5FA' },
  { name: 'Berry Sparkle', hex: '#86198F' },
  { name: 'Midnight Violet', hex: '#4C1D95' },
];

export const NAIL_PATTERNS: Array<{ id: NailPatternId; name: string }> = [
  { id: 'solid', name: 'Glossy Solid' },
  { id: 'french', name: 'French Tip' },
  { id: 'dots', name: 'Polka Dots' },
  { id: 'glitter', name: 'Glitter Ombre' },
  { id: 'hearts', name: 'Sweet Hearts' },
  { id: 'stripes', name: 'Royal Stripes' },
];

export const NAIL_GEMS: Array<{ id: NailGemId; name: string }> = [
  { id: 'none', name: 'None' },
  { id: 'diamond', name: 'Diamond' },
  { id: 'pearl', name: 'Pearl' },
  { id: 'star', name: 'Gold Star' },
  { id: 'heart', name: 'Pink Heart' },
];

export const DRESSES: Array<{
  id: DressId;
  name: string;
  defaultPrimary: string;
  defaultAccent: string;
}> = [
  { id: 'rose_ballgown', name: 'Rose Silk Ballgown', defaultPrimary: '#EC4899', defaultAccent: '#FBCFE8' },
  { id: 'amethyst_starlight', name: 'Amethyst Starlight', defaultPrimary: '#7E22CE', defaultAccent: '#E9D5FF' },
  { id: 'lavender_tulle', name: 'Lavender Tulle Gown', defaultPrimary: '#A855F7', defaultAccent: '#F5D0FE' },
  { id: 'fairy_petal', name: 'Fairy Petal Dress', defaultPrimary: '#DB2777', defaultAccent: '#C084FC' },
  { id: 'golden_sunburst', name: 'Royal Gold Gown', defaultPrimary: '#D97706', defaultAccent: '#FDE68A' },
  { id: 'velvet_plum', name: 'Velvet Plum Couture', defaultPrimary: '#581C87', defaultAccent: '#F472B6' },
  { id: 'pearl_tiered', name: 'Pearl Tiered Gown', defaultPrimary: '#F9A8D4', defaultAccent: '#FFFFFF' },
];

export const DRESS_COLOR_THEMES = [
  { name: 'Royal Pink', primary: '#EC4899', accent: '#FBCFE8' },
  { name: 'Amethyst Purple', primary: '#7E22CE', accent: '#E9D5FF' },
  { name: 'Magenta Orchid', primary: '#C026D3', accent: '#F5D0FE' },
  { name: 'Blush Pearl', primary: '#F472B6', accent: '#FFF1F2' },
  { name: 'Sapphire Sky', primary: '#2563EB', accent: '#DBEAFE' },
  { name: 'Golden Honey', primary: '#D97706', accent: '#FEF3C7' },
  { name: 'Emerald Mint', primary: '#059669', accent: '#D1FAE5' },
  { name: 'Crimson Velvet', primary: '#BE123C', accent: '#FFE4E6' },
];

export const SHOES: Array<{ id: ShoeId; name: string }> = [
  { id: 'glass_slippers', name: 'Crystal Glass Slippers' },
  { id: 'pink_heels', name: 'Pink Satin Heels' },
  { id: 'purple_pumps', name: 'Amethyst Jeweled Pumps' },
  { id: 'gold_sandals', name: 'Gold Strappy Sandals' },
  { id: 'ribbon_flats', name: 'Ribbon Ballet Flats' },
  { id: 'crystal_boots', name: 'Royal Sparkle Boots' },
];

export const CROWNS: Array<{ id: CrownId; name: string }> = [
  { id: 'none', name: 'No Crown' },
  { id: 'diamond_heart', name: 'Diamond Heart Tiara' },
  { id: 'amethyst_royal', name: 'Amethyst Royal Crown' },
  { id: 'rose_pearl', name: 'Rose Pearl Diadem' },
  { id: 'gold_starburst', name: 'Gold Starburst Crown' },
  { id: 'fairy_circlet', name: 'Floral Fairy Circlet' },
  { id: 'crystal_halo', name: 'Crystal Halo Tiara' },
];

export const NECKLACES: Array<{ id: NecklaceId; name: string }> = [
  { id: 'none', name: 'None' },
  { id: 'pearl_choker', name: 'Pearl Choker' },
  { id: 'heart_pendant', name: 'Pink Heart Pendant' },
  { id: 'diamond_collar', name: 'Diamond Collar' },
  { id: 'amethyst_drop', name: 'Amethyst Drop' },
  { id: 'gold_chain', name: 'Royal Gold Locket' },
];

export const EARRINGS: Array<{ id: EarringId; name: string }> = [
  { id: 'none', name: 'None' },
  { id: 'pearl_drops', name: 'Pearl Drops' },
  { id: 'crystal_stars', name: 'Crystal Stars' },
  { id: 'pink_hearts', name: 'Pink Hearts' },
  { id: 'royal_hoops', name: 'Gold Hoops' },
];

export const ACCESSORIES: Array<{ id: AccessoryId; name: string }> = [
  { id: 'none', name: 'None' },
  { id: 'scepter', name: 'Royal Star Scepter' },
  { id: 'gloves', name: 'Silk Opera Gloves' },
  { id: 'fan', name: 'Lace Princess Fan' },
  { id: 'bouquet', name: 'Rose & Lavender Bouquet' },
  { id: 'purse', name: 'Heart Velvet Clutch' },
];
