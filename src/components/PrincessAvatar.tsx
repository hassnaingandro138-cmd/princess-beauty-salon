import React, { useRef } from 'react';
import {
  PrincessMakeoverState,
  PrincessPreset,
  SpaToolId,
  StationId,
} from '../types/salon';

interface PrincessAvatarProps {
  princess: PrincessPreset;
  state: PrincessMakeoverState;
  viewMode: 'portrait' | 'full';
  isBeforeMode?: boolean;
  activeStation?: StationId;
  activeSpaTool?: SpaToolId;
  onSpaInteract?: (clientX: number, clientY: number, kind: 'rub' | 'click') => void;
  onBlemishClick?: (index: number, clientX: number, clientY: number) => void;
  onEyePadsClick?: (clientX: number, clientY: number) => void;
  onHairBrush?: (clientX: number, clientY: number) => void;
  onMakeupZoneClick?: (zone: 'eyes' | 'cheeks' | 'lips', clientX: number, clientY: number) => void;
  className?: string;
}

function adjustHex(hex: string, amount: number): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return hex;
  const num = parseInt(clean, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export const PrincessAvatar: React.FC<PrincessAvatarProps> = ({
  princess,
  state,
  viewMode,
  isBeforeMode = false,
  activeStation,
  activeSpaTool,
  onSpaInteract,
  onBlemishClick,
  onEyePadsClick,
  onHairBrush,
  onMakeupZoneClick,
  className = '',
}) => {
  const isPointerDown = useRef(false);
  const uid = React.useId().replace(/:/g, '');

  const hairStyle = isBeforeMode ? princess.starterHairStyle : state.hair.styleId;
  const hairColor = isBeforeMode ? princess.starterHairColor : state.hair.color;
  const hairDark = adjustHex(hairColor, -34);
  const hairLight = adjustHex(hairColor, 34);
  const highlightColor = state.hair.highlightColor;
  const hasHighlights = !isBeforeMode && state.hair.hasHighlights;
  const hairShine = isBeforeMode ? 0.08 : 0.12 + (state.hair.shineLevel / 100) * 0.45;

  const spa = state.spa;
  const skinGlow = isBeforeMode
    ? 0
    : (spa.cleansedProgress > 70 && spa.rinsed ? 0.35 : 0) +
      (spa.maskRinsed ? 0.4 : 0) +
      (spa.eyeDarknessCleared ? 0.25 : 0);

  const showDullUnderEyes = isBeforeMode || !spa.eyeDarknessCleared;
  const showMessyBrows = isBeforeMode || !spa.browsTidied;
  const showMask = !isBeforeMode && spa.activeMask !== null && !spa.maskRinsed && spa.maskAppliedProgress > 10;
  const showFoam = !isBeforeMode && spa.cleansedProgress > 10 && !spa.rinsed;
  const showEyePads = !isBeforeMode && spa.eyePadsOn;

  const makeup = state.makeup;
  const boutique = state.boutique;

  const dressId = isBeforeMode ? 'starter_lounge' : boutique.dressId;
  const dressPrimary = isBeforeMode ? '#E2D4EA' : boutique.dressPrimaryColor;
  const dressAccent = isBeforeMode ? '#F9EEF9' : boutique.dressAccentColor;
  const dressDark = adjustHex(dressPrimary, -36);

  const shoeId = isBeforeMode ? 'barefoot' : boutique.shoeId;
  const crownId = isBeforeMode ? 'none' : boutique.crownId;
  const necklaceId = isBeforeMode ? 'none' : boutique.necklaceId;
  const earringId = isBeforeMode ? 'none' : boutique.earringId;
  const accessoryId = isBeforeMode ? 'none' : boutique.accessoryId;

  const maskColors: Record<'rose' | 'lavender' | 'berry', string> = {
    rose: '#F9A8D4',
    lavender: '#D8B4FE',
    berry: '#F472B6',
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    isPointerDown.current = true;
    if (activeStation === 'SPA' && onSpaInteract) {
      onSpaInteract(e.clientX, e.clientY, 'click');
    } else if (activeStation === 'HAIR' && onHairBrush) {
      onHairBrush(e.clientX, e.clientY);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isPointerDown.current) return;
    if (activeStation === 'SPA' && onSpaInteract) {
      onSpaInteract(e.clientX, e.clientY, 'rub');
    } else if (activeStation === 'HAIR' && onHairBrush) {
      onHairBrush(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = () => {
    isPointerDown.current = false;
  };

  const viewBox = viewMode === 'portrait' ? '48 22 304 300' : '0 10 400 620';

  const hasGloves = accessoryId === 'gloves';

  return (
    <svg
      viewBox={viewBox}
      className={`select-none touch-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      role="img"
      aria-label={`${princess.name} avatar`}
    >
      <defs>
        <radialGradient id={`skinGrad-${uid}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={princess.skinHighlight} />
          <stop offset="65%" stopColor={princess.skinTone} />
          <stop offset="100%" stopColor={princess.skinShadow} />
        </radialGradient>
        <linearGradient id={`hairGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={hairLight} />
          <stop offset="55%" stopColor={hairColor} />
          <stop offset="100%" stopColor={hairDark} />
        </linearGradient>
        <linearGradient id={`dressGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={dressPrimary} />
          <stop offset="100%" stopColor={dressDark} />
        </linearGradient>
        <linearGradient id={`goldGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id={`silverGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
        <filter id={`softBlur-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id={`glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ==================== BACK HAIR LAYER ==================== */}
      <g className={activeStation === 'HAIR' ? 'cursor-pointer' : ''}>
        {hairStyle === 'messy_starter' && (
          <g>
            <path
              d="M126,155 C106,195 104,265 118,308 C134,295 142,275 148,255 L252,255 C258,275 266,295 282,308 C296,265 294,195 274,155 Z"
              fill={`url(#hairGrad-${uid})`}
            />
            <path d="M114,220 Q96,240 108,262 Q122,248 126,232 Z" fill={hairDark} />
            <path d="M286,220 Q304,240 292,262 Q278,248 274,232 Z" fill={hairDark} />
          </g>
        )}

        {hairStyle === 'princess_curls' && (
          <g>
            <path
              d="M124,142 C90,190 88,280 106,355 C124,370 144,358 148,330 C138,305 146,278 152,255 L248,255 C254,278 262,305 252,330 C256,358 276,370 294,355 C312,280 310,190 276,142 Z"
              fill={`url(#hairGrad-${uid})`}
            />
            <path
              d="M108,245 C92,272 95,305 112,325 C124,310 124,282 132,260"
              fill="none"
              stroke={hairDark}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M292,245 C308,272 305,305 288,325 C276,310 276,282 268,260"
              fill="none"
              stroke={hairDark}
              strokeWidth="6"
              strokeLinecap="round"
            />
            {hasHighlights && (
              <>
                <path
                  d="M114,210 C102,250 105,310 118,345"
                  fill="none"
                  stroke={highlightColor}
                  strokeWidth="7"
                  strokeLinecap="round"
                  opacity="0.7"
                />
                <path
                  d="M286,210 C298,250 295,310 282,345"
                  fill="none"
                  stroke={highlightColor}
                  strokeWidth="7"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </>
            )}
          </g>
        )}

        {hairStyle === 'royal_updo' && (
          <g>
            <circle cx="200" cy="86" r="42" fill={`url(#hairGrad-${uid})`} />
            <path
              d="M168,80 Q200,58 232,80"
              fill="none"
              stroke={hairDark}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {hasHighlights && (
              <path
                d="M174,72 Q200,56 226,72"
                fill="none"
                stroke={highlightColor}
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.75"
              />
            )}
            <path
              d="M132,148 C124,180 128,218 142,240 L258,240 C272,218 276,180 268,148 Z"
              fill={hairDark}
            />
          </g>
        )}

        {hairStyle === 'braided_crown' && (
          <g>
            <path
              d="M128,150 C114,195 115,270 132,330 L268,330 C285,270 286,195 272,150 Z"
              fill={`url(#hairGrad-${uid})`}
            />
            {/* Side braid */}
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse
                key={i}
                cx={128}
                cy={245 + i * 20}
                rx="13"
                ry="11"
                fill={i % 2 === 0 ? hairColor : hairDark}
                stroke={hairDark}
                strokeWidth="1.5"
              />
            ))}
            {hasHighlights &&
              [0, 1, 2].map((i) => (
                <ellipse
                  key={i}
                  cx={128}
                  cy={255 + i * 38}
                  rx="8"
                  ry="6"
                  fill={highlightColor}
                  opacity="0.75"
                />
              ))}
          </g>
        )}

        {hairStyle === 'high_ponytail' && (
          <g>
            <path
              d="M210,82 C268,75 305,135 296,238 C292,285 276,330 260,348 C254,315 262,272 254,225 C248,185 232,142 200,115 Z"
              fill={`url(#hairGrad-${uid})`}
            />
            {hasHighlights && (
              <path
                d="M226,95 C270,110 285,185 274,295"
                fill="none"
                stroke={highlightColor}
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.72"
              />
            )}
            <ellipse cx="212" cy="96" rx="14" ry="8" fill="#EC4899" />
          </g>
        )}

        {hairStyle === 'sleek_bob' && (
          <g>
            <path
              d="M126,142 C110,175 112,248 134,274 C150,276 154,262 152,242 L248,242 C246,262 250,276 266,274 C288,248 290,175 274,142 Z"
              fill={`url(#hairGrad-${uid})`}
            />
            {hasHighlights && (
              <>
                <path
                  d="M125,215 Q122,250 135,270"
                  fill="none"
                  stroke={highlightColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <path
                  d="M275,215 Q278,250 265,270"
                  fill="none"
                  stroke={highlightColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </>
            )}
          </g>
        )}

        {hairStyle === 'twin_ribbons' && (
          <g>
            {/* Left & Right Pigtails */}
            <path
              d="M124,160 C82,175 78,255 96,315 C112,322 126,304 128,275 C130,245 135,205 138,175 Z"
              fill={`url(#hairGrad-${uid})`}
            />
            <path
              d="M276,160 C318,175 322,255 304,315 C288,322 274,304 272,275 C270,245 265,205 262,175 Z"
              fill={`url(#hairGrad-${uid})`}
            />
            {hasHighlights && (
              <>
                <path
                  d="M105,195 C92,235 94,280 105,305"
                  fill="none"
                  stroke={highlightColor}
                  strokeWidth="7"
                  strokeLinecap="round"
                  opacity="0.75"
                />
                <path
                  d="M295,195 C308,235 306,280 295,305"
                  fill="none"
                  stroke={highlightColor}
                  strokeWidth="7"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              </>
            )}
            {/* Cute pink bows */}
            <circle cx="128" cy="166" r="8" fill="#EC4899" />
            <path d="M128,166 L112,154 L112,178 Z" fill="#F472B6" />
            <circle cx="272" cy="166" r="8" fill="#EC4899" />
            <path d="M272,166 L288,154 L288,178 Z" fill="#F472B6" />
          </g>
        )}

        {hairStyle === 'fairy_waves' && (
          <g>
            <path
              d="M124,145 C92,195 92,285 115,358 C142,368 158,348 158,318 L242,318 C242,348 258,368 285,358 C308,285 308,195 276,145 Z"
              fill={`url(#hairGrad-${uid})`}
            />
            {hasHighlights && (
              <path
                d="M116,240 C105,290 112,330 126,355 M284,240 C295,290 288,330 274,355"
                fill="none"
                stroke={highlightColor}
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.7"
              />
            )}
          </g>
        )}

        {hairStyle === 'voluminous_puffs' && (
          <g>
            <circle cx="132" cy="118" r="40" fill={`url(#hairGrad-${uid})`} />
            <circle cx="268" cy="118" r="40" fill={`url(#hairGrad-${uid})`} />
            {hasHighlights && (
              <>
                <circle cx="122" cy="108" r="14" fill={highlightColor} opacity="0.55" />
                <circle cx="278" cy="108" r="14" fill={highlightColor} opacity="0.55" />
              </>
            )}
            <path d="M132,140 L268,140 L260,245 L140,245 Z" fill={hairDark} />
          </g>
        )}
      </g>

      {/* ==================== FULL BODY (BOUTIQUE / REVEAL) ==================== */}
      {viewMode === 'full' && (
        <g>
          {/* Legs & Feet */}
          <path d="M174,515 L170,588 L184,592 L190,515 Z" fill={princess.skinTone} />
          <path d="M226,515 L230,588 L216,592 L210,515 Z" fill={princess.skinTone} />

          {/* Shoes */}
          {shoeId === 'barefoot' && (
            <g>
              <ellipse cx="174" cy="596" rx="13" ry="7" fill={princess.skinTone} />
              <ellipse cx="226" cy="596" rx="13" ry="7" fill={princess.skinTone} />
            </g>
          )}
          {shoeId === 'glass_slippers' && (
            <g>
              <path
                d="M160,596 Q165,582 184,586 L186,601 Q172,605 160,596 Z"
                fill="#E0F2FE"
                stroke="#BAE6FD"
                strokeWidth="1.5"
                opacity="0.9"
              />
              <path
                d="M240,596 Q235,582 216,586 L214,601 Q228,605 240,596 Z"
                fill="#E0F2FE"
                stroke="#BAE6FD"
                strokeWidth="1.5"
                opacity="0.9"
              />
              <circle cx="170" cy="591" r="2.5" fill="#FFFFFF" />
              <circle cx="230" cy="591" r="2.5" fill="#FFFFFF" />
            </g>
          )}
          {shoeId === 'pink_heels' && (
            <g>
              <path d="M158,598 Q166,582 185,585 L186,602 L180,602 L180,595 Q168,604 158,598 Z" fill="#EC4899" />
              <path d="M242,598 Q234,582 215,585 L214,602 L220,602 L220,595 Q232,604 242,598 Z" fill="#EC4899" />
              <circle cx="168" cy="592" r="2.5" fill="#FBCFE8" />
              <circle cx="232" cy="592" r="2.5" fill="#FBCFE8" />
            </g>
          )}
          {shoeId === 'purple_pumps' && (
            <g>
              <path d="M158,598 Q166,582 185,585 L186,602 L180,602 L180,595 Q168,604 158,598 Z" fill="#7E22CE" />
              <path d="M242,598 Q234,582 215,585 L214,602 L220,602 L220,595 Q232,604 242,598 Z" fill="#7E22CE" />
              <polygon points="168,588 171,592 168,596 165,592" fill="#E9D5FF" />
              <polygon points="232,588 235,592 232,596 229,592" fill="#E9D5FF" />
            </g>
          )}
          {shoeId === 'gold_sandals' && (
            <g>
              <ellipse cx="173" cy="597" rx="14" ry="6" fill={`url(#goldGrad-${uid})`} />
              <ellipse cx="227" cy="597" rx="14" ry="6" fill={`url(#goldGrad-${uid})`} />
              <path d="M167,593 L182,584 M167,587 L183,590" stroke="#F59E0B" strokeWidth="2" />
              <path d="M233,593 L218,584 M233,587 L217,590" stroke="#F59E0B" strokeWidth="2" />
            </g>
          )}
          {shoeId === 'ribbon_flats' && (
            <g>
              <ellipse cx="173" cy="596" rx="14" ry="7" fill="#F472B6" />
              <ellipse cx="227" cy="596" rx="14" ry="7" fill="#F472B6" />
              <path d="M170,588 Q174,581 178,588" fill="none" stroke="#FBCFE8" strokeWidth="2" />
              <path d="M222,588 Q226,581 230,588" fill="none" stroke="#FBCFE8" strokeWidth="2" />
            </g>
          )}
          {shoeId === 'crystal_boots' && (
            <g>
              <path d="M162,566 L186,566 L187,600 L158,600 Q162,585 162,566 Z" fill="#C084FC" />
              <path d="M214,566 L238,566 Q238,585 242,600 L213,600 Z" fill="#C084FC" />
              <path d="M162,566 L186,566" stroke="#FAF5FF" strokeWidth="3" />
              <path d="M214,566 L238,566" stroke="#FAF5FF" strokeWidth="3" />
            </g>
          )}

          {/* Arms */}
          <path
            d="M156,304 C132,328 118,378 122,428 C124,438 134,438 136,426 C136,386 146,350 162,325 Z"
            fill={hasGloves ? '#FFF1F7' : princess.skinTone}
          />
          <path
            d="M244,304 C268,328 282,378 278,428 C276,438 266,438 264,426 C264,386 254,350 238,325 Z"
            fill={hasGloves ? '#FFF1F7' : princess.skinTone}
          />
          {hasGloves && (
            <>
              <path d="M142,326 L156,336" stroke="#FBCFE8" strokeWidth="2.5" />
              <path d="M258,326 L244,336" stroke="#FBCFE8" strokeWidth="2.5" />
            </>
          )}

          {/* Princess Dresses */}
          {dressId === 'starter_lounge' && (
            <g>
              <path d="M158,295 L242,295 L236,385 L164,385 Z" fill="#E9D5FF" />
              <path d="M164,385 L236,385 L268,520 Q200,535 132,520 Z" fill="#F3E8FF" />
              <path d="M170,295 Q200,315 230,295" fill="none" stroke="#C084FC" strokeWidth="3" />
            </g>
          )}

          {dressId !== 'starter_lounge' && (
            <g>
              {/* Off-shoulder sleeves for romantic dresses */}
              {(dressId === 'rose_ballgown' || dressId === 'lavender_tulle' || dressId === 'pearl_tiered') && (
                <>
                  <ellipse cx="152" cy="310" rx="16" ry="9" fill={dressAccent} transform="rotate(-18 152 310)" />
                  <ellipse cx="248" cy="310" rx="16" ry="9" fill={dressAccent} transform="rotate(18 248 310)" />
                </>
              )}

              {/* Bodice */}
              <path
                d="M158,295 Q200,316 242,295 L234,382 L166,382 Z"
                fill={`url(#dressGrad-${uid})`}
              />
              {/* Bodice sweetheart trim */}
              <path
                d="M160,298 Q180,318 200,308 Q220,318 240,298"
                fill="none"
                stroke={dressAccent}
                strokeWidth="3.5"
              />
              <path d="M176,320 L200,375 L224,320" fill="none" stroke={dressAccent} strokeWidth="1.5" opacity="0.6" />

              {/* Skirt silhouettes */}
              {dressId === 'fairy_petal' ? (
                <g>
                  <path
                    d="M166,380 L234,380 C278,430 305,495 312,556 Q275,538 248,566 Q200,540 152,566 Q125,538 88,556 C95,495 122,430 166,380 Z"
                    fill={`url(#dressGrad-${uid})`}
                  />
                  <path
                    d="M166,380 Q135,445 102,492 Q145,480 166,515 Q200,482 234,515 Q255,480 298,492 Q265,445 234,380 Z"
                    fill={dressAccent}
                    opacity="0.6"
                  />
                </g>
              ) : dressId === 'pearl_tiered' ? (
                <g>
                  <path
                    d="M166,380 L234,380 C276,435 304,515 312,568 Q200,594 88,568 C96,515 124,435 166,380 Z"
                    fill={`url(#dressGrad-${uid})`}
                  />
                  <path d="M135,445 Q200,472 265,445" fill="none" stroke={dressAccent} strokeWidth="6" strokeLinecap="round" />
                  <path d="M110,505 Q200,536 290,505" fill="none" stroke={dressAccent} strokeWidth="6" strokeLinecap="round" />
                  <path d="M92,560 Q200,588 308,560" fill="none" stroke={dressAccent} strokeWidth="5" strokeLinecap="round" />
                </g>
              ) : (
                <g>
                  {/* Classic Grand Ballgown Skirt */}
                  <path
                    d="M166,380 L234,380 C282,432 312,510 322,572 Q200,598 78,572 C88,510 118,432 166,380 Z"
                    fill={`url(#dressGrad-${uid})`}
                  />
                  {/* Draped overskirt */}
                  <path
                    d="M166,380 C150,430 130,468 106,492 Q155,498 200,460 Q245,498 294,492 C270,468 250,430 234,380 Z"
                    fill={dressAccent}
                    opacity="0.58"
                  />
                  {/* Subtle pleated fold lines */}
                  <path d="M180,390 L142,574 M200,390 L200,582 M220,390 L258,574" stroke={dressDark} strokeWidth="1.5" opacity="0.25" />
                </g>
              )}

              {/* Waist Sash & Bow */}
              <path d="M164,376 Q200,388 236,376 L236,387 Q200,398 164,387 Z" fill={dressAccent} />
              <circle cx="200" cy="384" r="6" fill={dressAccent} stroke={dressPrimary} strokeWidth="1.5" />

              {/* Starlight Sparkles on Starlight / Sunburst / Velvet dresses */}
              {(dressId === 'amethyst_starlight' || dressId === 'golden_sunburst' || dressId === 'velvet_plum') && (
                <g fill="#FFFBEB" opacity="0.85">
                  <circle cx="150" cy="495" r="2.2" />
                  <circle cx="178" cy="532" r="2.8" />
                  <circle cx="222" cy="518" r="2.4" />
                  <circle cx="255" cy="488" r="2.2" />
                  <circle cx="202" cy="480" r="3" />
                </g>
              )}
            </g>
          )}

          {/* Accessories held in hand */}
          {accessoryId === 'scepter' && (
            <g transform="translate(110, 355) rotate(-14)">
              <rect x="10" y="25" width="5" height="120" rx="2.5" fill={`url(#goldGrad-${uid})`} />
              <polygon
                points="12,0 17,12 29,12 19,19 23,31 12,24 1,31 5,19 -5,12 7,12"
                fill={`url(#goldGrad-${uid})`}
                stroke="#FDE68A"
                strokeWidth="1"
              />
              <circle cx="12" cy="17" r="4" fill="#EC4899" />
            </g>
          )}
          {accessoryId === 'fan' && (
            <g transform="translate(260, 385) rotate(12)">
              <path d="M15,45 L-14,10 Q15,-6 44,10 Z" fill="#FBCFE8" stroke="#EC4899" strokeWidth="1.5" />
              <path d="M15,45 L0,6 M15,45 L15,3 M15,45 L30,6" stroke="#DB2777" strokeWidth="1" opacity="0.6" />
              <circle cx="15" cy="45" r="3.5" fill="#F59E0B" />
            </g>
          )}
          {accessoryId === 'bouquet' && (
            <g transform="translate(256, 396)">
              <path d="M8,22 L20,48 L32,22 Z" fill="#F5D0FE" />
              <circle cx="12" cy="14" r="8" fill="#EC4899" />
              <circle cx="26" cy="12" r="8" fill="#A855F7" />
              <circle cx="19" cy="4" r="8" fill="#F472B6" />
              <circle cx="19" cy="20" r="7" fill="#FBCFE8" />
            </g>
          )}
          {accessoryId === 'purse' && (
            <g transform="translate(106, 422)">
              <path d="M8,10 Q20,-4 32,10" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
              <path
                d="M20,34 C6,24 4,10 13,10 C17,10 20,14 20,14 C20,14 23,10 27,10 C36,10 34,24 20,34 Z"
                fill="#DB2777"
                stroke="#FBCFE8"
                strokeWidth="1.5"
              />
            </g>
          )}
        </g>
      )}

      {/* ==================== NECK, SHOULDERS & NECKLACE ==================== */}
      <g>
        {/* Neck & Upper Chest */}
        <path
          d="M182,252 L182,292 Q156,298 148,318 L252,318 Q244,298 218,292 L218,252 Z"
          fill={princess.skinTone}
        />
        <path d="M182,258 Q200,274 218,258" fill={princess.skinShadow} opacity="0.5" />

        {/* Portrait-only subtle dress collar */}
        {viewMode === 'portrait' && (
          <path
            d="M148,310 Q200,328 252,310 L268,350 L132,350 Z"
            fill={`url(#dressGrad-${uid})`}
          />
        )}

        {/* Necklaces */}
        {necklaceId === 'pearl_choker' && (
          <g>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const t = i / 6;
              const x = 181 + t * 38;
              const y = 278 + Math.sin(t * Math.PI) * 8;
              return <circle key={i} cx={x} cy={y} r="3.6" fill="#FFFDF9" stroke="#E2E8F0" strokeWidth="0.8" />;
            })}
          </g>
        )}
        {necklaceId === 'heart_pendant' && (
          <g>
            <path d="M180,274 Q200,295 220,274" fill="none" stroke="#F59E0B" strokeWidth="2" />
            <path
              d="M200,298 C192,292 191,284 196,284 C198,284 200,287 200,287 C200,287 202,284 204,284 C209,284 208,292 200,298 Z"
              fill="#EC4899"
              stroke="#FDE68A"
              strokeWidth="1"
            />
          </g>
        )}
        {necklaceId === 'diamond_collar' && (
          <g>
            <path d="M176,276 Q200,298 224,276" fill="none" stroke="#E0F2FE" strokeWidth="3" />
            {[184, 192, 200, 208, 216].map((x, idx) => (
              <polygon
                key={x}
                points={`${x},${283 + (idx === 2 ? 4 : 0)} ${x + 3},${288 + (idx === 2 ? 4 : 0)} ${x},${293 + (idx === 2 ? 4 : 0)} ${x - 3},${288 + (idx === 2 ? 4 : 0)}`}
                fill="#FFFFFF"
                stroke="#7DD3FC"
                strokeWidth="0.8"
              />
            ))}
          </g>
        )}
        {necklaceId === 'amethyst_drop' && (
          <g>
            <path d="M180,274 Q200,294 220,274" fill="none" stroke="#E2E8F0" strokeWidth="2" />
            <polygon points="200,283 206,291 200,301 194,291" fill="#9333EA" stroke="#E9D5FF" strokeWidth="1" />
          </g>
        )}
        {necklaceId === 'gold_chain' && (
          <g>
            <path d="M178,274 Q200,302 222,274" fill="none" stroke={`url(#goldGrad-${uid})`} strokeWidth="2.5" />
            <circle cx="200" cy="293" r="6" fill={`url(#goldGrad-${uid})`} stroke="#FEF3C7" strokeWidth="1" />
          </g>
        )}
      </g>

      {/* ==================== EARS & EARRINGS ==================== */}
      <g>
        <ellipse cx="134" cy="192" rx="9" ry="15" fill={princess.skinShadow} />
        <ellipse cx="266" cy="192" rx="9" ry="15" fill={princess.skinShadow} />

        {earringId === 'pearl_drops' && (
          <g>
            <circle cx="133" cy="208" r="4.5" fill="#FFFDF9" stroke="#CBD5E1" strokeWidth="0.8" />
            <circle cx="267" cy="208" r="4.5" fill="#FFFDF9" stroke="#CBD5E1" strokeWidth="0.8" />
          </g>
        )}
        {earringId === 'crystal_stars' && (
          <g fill="#E0F2FE" stroke="#7DD3FC" strokeWidth="0.8">
            <polygon points="133,202 135,208 140,208 136,211 137,216 133,213 129,216 130,211 126,208 131,208" />
            <polygon points="267,202 269,208 274,208 270,211 271,216 267,213 263,216 264,211 260,208 265,208" />
          </g>
        )}
        {earringId === 'pink_hearts' && (
          <g fill="#EC4899">
            <path d="M133,215 C127,210 127,204 130,204 C132,204 133,206 133,206 C133,206 134,204 136,204 C139,204 139,210 133,215 Z" />
            <path d="M267,215 C261,210 261,204 264,204 C266,204 267,206 267,206 C267,206 268,204 270,204 C273,204 273,210 267,215 Z" />
          </g>
        )}
        {earringId === 'royal_hoops' && (
          <g fill="none" stroke={`url(#goldGrad-${uid})`} strokeWidth="2.5">
            <circle cx="132" cy="210" r="6" />
            <circle cx="268" cy="210" r="6" />
          </g>
        )}
      </g>

      {/* ==================== FACE BASE ==================== */}
      <g>
        <path
          d="M136,162 C136,115 162,98 200,98 C238,98 264,115 264,162 C264,212 242,262 200,264 C158,262 136,212 136,162 Z"
          fill={`url(#skinGrad-${uid})`}
        />

        {/* Dewy Radiant Skin Glow after Spa */}
        {skinGlow > 0 && (
          <g opacity={skinGlow}>
            <ellipse cx="164" cy="204" rx="16" ry="9" fill="#FFFFFF" filter={`url(#softBlur-${uid})`} />
            <ellipse cx="236" cy="204" rx="16" ry="9" fill="#FFFFFF" filter={`url(#softBlur-${uid})`} />
            <ellipse cx="200" cy="136" rx="22" ry="8" fill="#FFFFFF" filter={`url(#softBlur-${uid})`} />
          </g>
        )}

        {/* Tired Under-Eye Circles (Before Spa) */}
        {showDullUnderEyes && (
          <g opacity="0.34" fill="#6B21A8">
            <path d="M155,193 Q171,203 186,193 Q171,199 155,193 Z" />
            <path d="M214,193 Q229,203 245,193 Q229,199 214,193 Z" />
          </g>
        )}

        {/* Blush */}
        {!isBeforeMode && makeup.blushColor && (
          <g
            opacity={makeup.blushIntensity}
            className={activeStation === 'MAKEUP' ? 'cursor-pointer' : ''}
            onClick={(e) => {
              if (activeStation === 'MAKEUP' && onMakeupZoneClick) {
                e.stopPropagation();
                onMakeupZoneClick('cheeks', e.clientX, e.clientY);
              }
            }}
          >
            <ellipse
              cx="157"
              cy="208"
              rx="18"
              ry="10"
              fill={makeup.blushColor}
              filter={`url(#softBlur-${uid})`}
            />
            <ellipse
              cx="243"
              cy="208"
              rx="18"
              ry="10"
              fill={makeup.blushColor}
              filter={`url(#softBlur-${uid})`}
            />
          </g>
        )}

        {/* Makeup Cheek Click Zones (even when blush is null) */}
        {activeStation === 'MAKEUP' && !isBeforeMode && (
          <g
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onMakeupZoneClick?.('cheeks', e.clientX, e.clientY);
            }}
          >
            <ellipse cx="157" cy="208" rx="20" ry="12" fill="transparent" />
            <ellipse cx="243" cy="208" rx="20" ry="12" fill="transparent" />
          </g>
        )}

        {/* Cheek Gem / Sticker */}
        {!isBeforeMode && makeup.cheekGem !== 'none' && (
          <g transform="translate(245, 200)">
            {makeup.cheekGem === 'star' && (
              <polygon
                points="0,-6 2,-2 6,-2 3,1 4,5 0,3 -4,5 -3,1 -6,-2 -2,-2"
                fill="#FDE047"
                stroke="#F59E0B"
                strokeWidth="0.7"
              />
            )}
            {makeup.cheekGem === 'heart' && (
              <path
                d="M0,5 C-5,1 -5,-4 -2,-4 C0,-4 0,-2 0,-2 C0,-2 0,-4 2,-4 C5,-4 5,1 0,5 Z"
                fill="#EC4899"
              />
            )}
            {makeup.cheekGem === 'crystal' && (
              <polygon points="0,-6 5,0 0,6 -5,0" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="0.8" />
            )}
          </g>
        )}

        {/* Delicate Nose */}
        <path
          d="M197,198 Q200,208 205,205"
          fill="none"
          stroke={princess.skinShadow}
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* ==================== EYES, SHADOW & LASHES ==================== */}
        <g
          className={activeStation === 'MAKEUP' ? 'cursor-pointer' : ''}
          onClick={(e) => {
            if (activeStation === 'MAKEUP' && onMakeupZoneClick) {
              e.stopPropagation();
              onMakeupZoneClick('eyes', e.clientX, e.clientY);
            }
          }}
        >
          {/* Eyeshadow */}
          {!isBeforeMode && makeup.eyeshadowColor && (
            <g opacity={makeup.eyeshadowIntensity}>
              <path
                d="M153,180 C158,166 184,166 188,180 C180,174 162,174 153,180 Z"
                fill={makeup.eyeshadowColor}
              />
              <path
                d="M212,180 C216,166 242,166 247,180 C238,174 220,174 212,180 Z"
                fill={makeup.eyeshadowColor}
              />
            </g>
          )}

          {/* Eye Whites */}
          <ellipse cx="171" cy="182" rx="15" ry="10.5" fill="#FFFFFF" />
          <ellipse cx="229" cy="182" rx="15" ry="10.5" fill="#FFFFFF" />

          {/* Irises */}
          <circle cx="172" cy="182" r="7.8" fill={princess.eyeColor} />
          <circle cx="228" cy="182" r="7.8" fill={princess.eyeColor} />
          {/* Pupils */}
          <circle cx="172" cy="182" r="3.9" fill="#1E1B2E" />
          <circle cx="228" cy="182" r="3.9" fill="#1E1B2E" />
          {/* Eye Catchlights */}
          <circle cx="174.5" cy="179.5" r="2.2" fill="#FFFFFF" />
          <circle cx="230.5" cy="179.5" r="2.2" fill="#FFFFFF" />
          <circle cx="169" cy="185" r="1" fill="#FFFFFF" opacity="0.8" />
          <circle cx="225" cy="185" r="1" fill="#FFFFFF" opacity="0.8" />

          {/* Upper Lash Line & Eyeliner */}
          <path
            d={
              !isBeforeMode && makeup.eyelinerStyle === 'winged'
                ? 'M151,176 Q171,168 187,181'
                : 'M155,180 Q171,169 187,181'
            }
            fill="none"
            stroke={!isBeforeMode && makeup.eyelinerStyle === 'shimmer' ? '#7E22CE' : '#1E1B2E'}
            strokeWidth={!isBeforeMode && makeup.eyelinerStyle !== 'none' ? '3' : '2'}
            strokeLinecap="round"
          />
          <path
            d={
              !isBeforeMode && makeup.eyelinerStyle === 'winged'
                ? 'M213,181 Q229,168 249,176'
                : 'M213,181 Q229,169 245,180'
            }
            fill="none"
            stroke={!isBeforeMode && makeup.eyelinerStyle === 'shimmer' ? '#7E22CE' : '#1E1B2E'}
            strokeWidth={!isBeforeMode && makeup.eyelinerStyle !== 'none' ? '3' : '2'}
            strokeLinecap="round"
          />

          {/* Mascara Lashes */}
          {!isBeforeMode && makeup.mascara && (
            <g stroke="#1E1B2E" strokeWidth="1.6" strokeLinecap="round">
              <path d="M157,177 L151,171 M164,174 L160,168 M172,172 L171,166 M180,174 L182,168" />
              <path d="M243,177 L249,171 M236,174 L240,168 M228,172 L229,166 M220,174 L218,168" />
            </g>
          )}
        </g>

        {/* Eyebrows */}
        <g>
          <path
            d="M154,162 Q171,154 187,161"
            fill="none"
            stroke={hairDark}
            strokeWidth={showMessyBrows ? '4.2' : '2.8'}
            strokeLinecap="round"
          />
          <path
            d="M213,161 Q229,154 246,162"
            fill="none"
            stroke={hairDark}
            strokeWidth={showMessyBrows ? '4.2' : '2.8'}
            strokeLinecap="round"
          />
          {showMessyBrows && (
            <g stroke={hairDark} strokeWidth="1.2" opacity="0.7">
              <path d="M160,155 L163,151 M175,153 L177,149 M225,153 L223,149 M240,155 L237,151" />
            </g>
          )}
        </g>

        {/* ==================== LIPS ==================== */}
        <g
          className={activeStation === 'MAKEUP' ? 'cursor-pointer' : ''}
          onClick={(e) => {
            if (activeStation === 'MAKEUP' && onMakeupZoneClick) {
              e.stopPropagation();
              onMakeupZoneClick('lips', e.clientX, e.clientY);
            }
          }}
        >
          {(() => {
            const lip = !isBeforeMode && makeup.lipstickColor ? makeup.lipstickColor : princess.naturalLipColor;
            const lipTop = adjustHex(lip, -18);
            return (
              <g>
                <path
                  d="M182,230 Q191,223 200,227 Q209,223 218,230 Q200,235 182,230 Z"
                  fill={lipTop}
                />
                <path
                  d="M182,230 Q200,245 218,230 Q200,234 182,230 Z"
                  fill={lip}
                />
                {!isBeforeMode && makeup.lipGloss && (
                  <ellipse cx="198" cy="235" rx="6" ry="1.8" fill="#FFFFFF" opacity="0.75" />
                )}
              </g>
            );
          })()}
        </g>

        {/* ==================== SPA OVERLAYS (BLEMISHES, FOAM, MASK, EYE PADS) ==================== */}
        {/* Blemishes to clear */}
        {!isBeforeMode
          ? princess.blemishCoords.map(
              (pt, idx) =>
                !spa.blemishesCleared[idx] && (
                  <g
                    key={idx}
                    className={
                      activeStation === 'SPA' && activeSpaTool === 'tweezers'
                        ? 'cursor-pointer'
                        : ''
                    }
                    onClick={(e) => {
                      if (activeStation === 'SPA' && onBlemishClick) {
                        e.stopPropagation();
                        onBlemishClick(idx, e.clientX, e.clientY);
                      }
                    }}
                  >
                    <circle cx={pt.x} cy={pt.y} r="6.5" fill="transparent" />
                    <circle cx={pt.x} cy={pt.y} r="3.4" fill="#E11D48" opacity="0.45" />
                    <circle cx={pt.x} cy={pt.y} r="1.5" fill="#BE123C" opacity="0.65" />
                  </g>
                )
            )
          : princess.blemishCoords.map((pt, idx) => (
              <circle key={idx} cx={pt.x} cy={pt.y} r="3.2" fill="#E11D48" opacity="0.42" />
            ))}

        {/* Hydrating Face Mask */}
        {showMask && spa.activeMask && (
          <path
            d="M144,158 C144,132 168,120 200,120 C232,120 256,132 256,158 C256,204 236,248 200,250 C164,248 144,204 144,158 Z M155,180 A16,12 0 1,0 187,180 A16,12 0 1,0 155,180 Z M213,180 A16,12 0 1,0 245,180 A16,12 0 1,0 213,180 Z M180,230 Q200,244 220,230 Q200,221 180,230 Z"
            fill={maskColors[spa.activeMask]}
            fillRule="evenodd"
            opacity={0.35 + (spa.maskAppliedProgress / 100) * 0.45}
          />
        )}

        {/* Rose Cleanser Foam Bubbles */}
        {showFoam && (
          <g opacity={Math.min(1, spa.cleansedProgress / 65)}>
            {[
              { x: 165, y: 155, r: 10 },
              { x: 185, y: 146, r: 12 },
              { x: 215, y: 148, r: 11 },
              { x: 234, y: 162, r: 9 },
              { x: 155, y: 205, r: 12 },
              { x: 174, y: 218, r: 10 },
              { x: 226, y: 214, r: 12 },
              { x: 244, y: 202, r: 9 },
              { x: 200, y: 244, r: 9 },
            ].map((b, idx) => (
              <g key={idx}>
                <circle cx={b.x} cy={b.y} r={b.r} fill="#FFFFFF" opacity="0.82" />
                <circle cx={b.x - b.r * 0.3} cy={b.y - b.r * 0.3} r={b.r * 0.28} fill="#FBCFE8" />
              </g>
            ))}
          </g>
        )}

        {/* Soothing Cucumber / Rose-Quartz Eye Pads */}
        {showEyePads && (
          <g
            className={activeStation === 'SPA' ? 'cursor-pointer' : ''}
            onClick={(e) => {
              if (activeStation === 'SPA' && onEyePadsClick) {
                e.stopPropagation();
                onEyePadsClick(e.clientX, e.clientY);
              }
            }}
          >
            <circle cx="171" cy="182" r="17" fill="#A7F3D0" stroke="#34D399" strokeWidth="2" />
            <circle cx="171" cy="182" r="11" fill="#D1FAE5" />
            <circle cx="229" cy="182" r="17" fill="#A7F3D0" stroke="#34D399" strokeWidth="2" />
            <circle cx="229" cy="182" r="11" fill="#D1FAE5" />
          </g>
        )}
      </g>

      {/* ==================== FRONT HAIR & BANGS LAYER ==================== */}
      <g className={activeStation === 'HAIR' ? 'cursor-pointer' : ''}>
        {hairStyle === 'messy_starter' ? (
          <g>
            <path
              d="M132,165 C132,102 164,84 200,84 C236,84 268,102 268,165 C255,134 235,120 212,126 C192,132 172,118 148,136 Z"
              fill={`url(#hairGrad-${uid})`}
            />
            <path d="M188,86 Q196,68 212,82" fill="none" stroke={hairColor} strokeWidth="5" strokeLinecap="round" />
            <path d="M168,94 Q154,78 142,96" fill="none" stroke={hairDark} strokeWidth="4" strokeLinecap="round" />
          </g>
        ) : hairStyle === 'sleek_bob' ? (
          <g>
            <path
              d="M128,168 C128,100 164,84 200,84 C236,84 272,100 272,168 C258,136 248,134 248,134 L152,134 C152,134 142,136 128,168 Z"
              fill={`url(#hairGrad-${uid})`}
            />
            {/* Sleek fringe bangs */}
            <path d="M148,118 Q200,128 252,118 L248,144 Q200,136 152,144 Z" fill={hairColor} />
          </g>
        ) : (
          <g>
            {/* Swept Princess Parted Front Hair */}
            <path
              d="M128,168 C128,98 164,84 200,84 C236,84 272,98 272,168 C256,134 232,114 200,118 C168,114 144,134 128,168 Z"
              fill={`url(#hairGrad-${uid})`}
            />
            <path
              d="M138,135 Q168,104 200,118"
              fill="none"
              stroke={hairLight}
              strokeWidth="4"
              strokeLinecap="round"
              opacity={hairShine}
            />
            <path
              d="M262,135 Q232,104 200,118"
              fill="none"
              stroke={hairLight}
              strokeWidth="4"
              strokeLinecap="round"
              opacity={hairShine}
            />
            {hasHighlights && (
              <>
                <path
                  d="M136,150 Q160,112 194,116"
                  fill="none"
                  stroke={highlightColor}
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  opacity="0.7"
                />
                <path
                  d="M264,150 Q240,112 206,116"
                  fill="none"
                  stroke={highlightColor}
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </>
            )}
          </g>
        )}

        {/* Hair Gloss / Shine Arc */}
        {!isBeforeMode && state.hair.shineLevel > 40 && (
          <path
            d="M158,104 Q200,90 242,104"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity={hairShine}
          />
        )}
      </g>

      {/* ==================== CROWNS & TIARAS ==================== */}
      <g filter={`url(#glow-${uid})`}>
        {crownId === 'diamond_heart' && (
          <g transform="translate(200, 88)">
            <path
              d="M-42,10 Q0,0 42,10 L32,-8 L16,2 L0,-22 L-16,2 L-32,-8 Z"
              fill={`url(#silverGrad-${uid})`}
              stroke="#CBD5E1"
              strokeWidth="1.2"
            />
            <path
              d="M0,-4 C-6,-9 -6,-14 -2,-14 C0,-14 0,-11 0,-11 C0,-11 0,-14 2,-14 C6,-14 6,-9 0,-4 Z"
              fill="#EC4899"
            />
            <circle cx="-22" cy="-2" r="2.8" fill="#E0F2FE" />
            <circle cx="22" cy="-2" r="2.8" fill="#E0F2FE" />
          </g>
        )}

        {crownId === 'amethyst_royal' && (
          <g transform="translate(200, 88)">
            <path
              d="M-44,10 Q0,-2 44,10 L38,-14 L20,0 L0,-24 L-20,0 L-38,-14 Z"
              fill={`url(#goldGrad-${uid})`}
              stroke="#B45309"
              strokeWidth="1.2"
            />
            <polygon points="0,-19 6,-9 0,0 -6,-9" fill="#9333EA" stroke="#E9D5FF" strokeWidth="1" />
            <circle cx="-25" cy="-4" r="3" fill="#C084FC" />
            <circle cx="25" cy="-4" r="3" fill="#C084FC" />
          </g>
        )}

        {crownId === 'rose_pearl' && (
          <g transform="translate(200, 90)">
            <path d="M-40,10 Q0,-8 40,10" fill="none" stroke="#F472B6" strokeWidth="4" />
            {[-28, -14, 0, 14, 28].map((x, idx) => (
              <circle
                key={x}
                cx={x}
                cy={idx === 2 ? -6 : Math.abs(idx - 2) === 1 ? -1 : 4}
                r={idx === 2 ? 5.5 : 4}
                fill="#FFFDF9"
                stroke="#FBCFE8"
                strokeWidth="1"
              />
            ))}
          </g>
        )}

        {crownId === 'gold_starburst' && (
          <g transform="translate(200, 88)">
            <path d="M-40,10 Q0,2 40,10" fill="none" stroke={`url(#goldGrad-${uid})`} strokeWidth="4" />
            <polygon
              points="0,-24 4,-12 16,-12 6,-5 10,7 0,0 -10,7 -6,-5 -16,-12 -4,-12"
              fill="#FDE047"
              stroke="#D97706"
              strokeWidth="1"
            />
            <polygon points="-24,-10 -21,-3 -15,-3 -20,1 -18,7 -24,3 -30,7 -28,1 -33,-3 -27,-3" fill="#FDE047" />
            <polygon points="24,-10 27,-3 33,-3 28,1 30,7 24,3 18,7 20,1 15,-3 21,-3" fill="#FDE047" />
          </g>
        )}

        {crownId === 'fairy_circlet' && (
          <g transform="translate(200, 96)">
            <path d="M-46,12 Q0,-12 46,12" fill="none" stroke="#34D399" strokeWidth="3.5" />
            <circle cx="-26" cy="2" r="6" fill="#F472B6" />
            <circle cx="-26" cy="2" r="2.2" fill="#FEF08A" />
            <circle cx="0" cy="-4" r="7" fill="#C084FC" />
            <circle cx="0" cy="-4" r="2.5" fill="#FEF08A" />
            <circle cx="26" cy="2" r="6" fill="#F472B6" />
            <circle cx="26" cy="2" r="2.2" fill="#FEF08A" />
          </g>
        )}

        {crownId === 'crystal_halo' && (
          <g transform="translate(200, 90)">
            <path d="M-46,12 Q0,-14 46,12" fill="none" stroke="#E0F2FE" strokeWidth="3" />
            {[-30, -18, -9, 0, 9, 18, 30].map((x, idx) => {
              const h = 16 - Math.abs(idx - 3) * 3;
              return (
                <polygon
                  key={x}
                  points={`${x},${4 - h} ${x + 3},4 ${x - 3},4`}
                  fill="#FFFFFF"
                  stroke="#BAE6FD"
                  strokeWidth="0.8"
                />
              );
            })}
          </g>
        )}
      </g>
    </svg>
  );
};
