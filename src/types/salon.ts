export type GameScreen = 'HOME' | 'CHARACTER_SELECT' | 'SALON' | 'REVEAL';

export type StationId = 'SPA' | 'HAIR' | 'MAKEUP' | 'NAILS' | 'BOUTIQUE';

export type SpaToolId = 'cleanser' | 'water' | 'tweezers' | 'mask' | 'eyepads';

export type HairStyleId =
  | 'messy_starter'
  | 'royal_updo'
  | 'princess_curls'
  | 'braided_crown'
  | 'high_ponytail'
  | 'sleek_bob'
  | 'twin_ribbons'
  | 'fairy_waves'
  | 'voluminous_puffs';

export type EyelinerStyle = 'none' | 'classic' | 'winged' | 'shimmer';
export type CheekGemId = 'none' | 'star' | 'heart' | 'crystal';

export type NailMode = 'manicure' | 'pedicure';
export type NailPatternId = 'solid' | 'french' | 'dots' | 'glitter' | 'hearts' | 'stripes';
export type NailGemId = 'none' | 'diamond' | 'pearl' | 'star' | 'heart';

export type DressId =
  | 'starter_lounge'
  | 'rose_ballgown'
  | 'amethyst_starlight'
  | 'lavender_tulle'
  | 'fairy_petal'
  | 'golden_sunburst'
  | 'velvet_plum'
  | 'pearl_tiered';

export type ShoeId =
  | 'barefoot'
  | 'glass_slippers'
  | 'pink_heels'
  | 'purple_pumps'
  | 'gold_sandals'
  | 'ribbon_flats'
  | 'crystal_boots';

export type CrownId =
  | 'none'
  | 'diamond_heart'
  | 'amethyst_royal'
  | 'rose_pearl'
  | 'gold_starburst'
  | 'fairy_circlet'
  | 'crystal_halo';

export type NecklaceId = 'none' | 'pearl_choker' | 'heart_pendant' | 'diamond_collar' | 'amethyst_drop' | 'gold_chain';
export type EarringId = 'none' | 'pearl_drops' | 'crystal_stars' | 'pink_hearts' | 'royal_hoops';
export type AccessoryId = 'none' | 'scepter' | 'gloves' | 'fan' | 'bouquet' | 'purse';

export type StudioBackdropId = 'vanity' | 'ballroom';

export interface PrincessPreset {
  id: string;
  name: string;
  title: string;
  bio: string;
  skinTone: string;
  skinShadow: string;
  skinHighlight: string;
  eyeColor: string;
  naturalLipColor: string;
  starterHairColor: string;
  starterHairStyle: HairStyleId;
  signatureColor: string;
  blemishCoords: Array<{ x: number; y: number }>;
}

export interface SpaState {
  cleansedProgress: number; // 0 to 100
  rinsed: boolean;
  blemishesCleared: boolean[];
  browsTidied: boolean;
  activeMask: null | 'rose' | 'lavender' | 'berry';
  maskAppliedProgress: number; // 0 to 100
  maskRinsed: boolean;
  eyePadsOn: boolean;
  eyeDarknessCleared: boolean;
}

export interface HairState {
  styleId: HairStyleId;
  color: string;
  highlightColor: string;
  hasHighlights: boolean;
  shineLevel: number; // 0 to 100
}

export interface MakeupState {
  eyeshadowColor: string | null;
  eyeshadowIntensity: number; // 0.25 to 0.9
  eyelinerStyle: EyelinerStyle;
  mascara: boolean;
  blushColor: string | null;
  blushIntensity: number; // 0.2 to 0.85
  lipstickColor: string | null;
  lipGloss: boolean;
  cheekGem: CheekGemId;
}

export interface NailState {
  mode: NailMode;
  handCared: boolean[]; // length 5
  footCared: boolean[]; // length 5
  handPolish: Array<string | null>; // length 5
  footPolish: Array<string | null>; // length 5
  handPattern: NailPatternId[]; // length 5
  footPattern: NailPatternId[]; // length 5
  handGem: NailGemId[]; // length 5
  footGem: NailGemId[]; // length 5
  ringId: 'none' | 'diamond' | 'ruby' | 'amethyst' | 'gold_bow';
  braceletId: 'none' | 'pearl' | 'charm' | 'crystal';
  ankletId: 'none' | 'gold_chain' | 'pearl_anklet' | 'flower_band';
}

export interface BoutiqueState {
  dressId: DressId;
  dressPrimaryColor: string;
  dressAccentColor: string;
  shoeId: ShoeId;
  crownId: CrownId;
  necklaceId: NecklaceId;
  earringId: EarringId;
  accessoryId: AccessoryId;
}

export interface PrincessMakeoverState {
  spa: SpaState;
  hair: HairState;
  makeup: MakeupState;
  nails: NailState;
  boutique: BoutiqueState;
  studioBackdrop: StudioBackdropId;
}

export interface FloatingSparkle {
  id: number;
  x: number;
  y: number;
  kind: 'sparkle' | 'bubble' | 'droplet' | 'heart';
  color?: string;
}
