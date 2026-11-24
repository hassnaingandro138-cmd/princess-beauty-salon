import React from 'react';
import {
  NailGemId,
  NailPatternId,
  NailState,
  PrincessPreset,
} from '../types/salon';

interface NailStudioCanvasProps {
  princess: PrincessPreset;
  nails: NailState;
  activeTool: 'care' | 'polish' | 'pattern' | 'gem';
  onNailInteract: (index: number, clientX: number, clientY: number) => void;
}

const FINGER_COORDS = [
  { x: 96, y: 215, w: 22, h: 30, rot: -26, label: 'Thumb' },
  { x: 146, y: 92, w: 21, h: 32, rot: -8, label: 'Index' },
  { x: 196, y: 74, w: 22, h: 34, rot: 0, label: 'Middle' },
  { x: 248, y: 95, w: 21, h: 31, rot: 8, label: 'Ring' },
  { x: 292, y: 140, w: 19, h: 27, rot: 16, label: 'Pinky' },
];

const TOE_COORDS = [
  { x: 146, y: 120, w: 34, h: 30, rot: -6, label: 'Big Toe' },
  { x: 192, y: 124, w: 22, h: 24, rot: 0, label: '2nd Toe' },
  { x: 224, y: 136, w: 20, h: 21, rot: 4, label: '3rd Toe' },
  { x: 252, y: 152, w: 18, h: 19, rot: 8, label: '4th Toe' },
  { x: 277, y: 173, w: 16, h: 17, rot: 12, label: 'Little Toe' },
];

function renderPatternOverlay(
  pattern: NailPatternId,
  w: number,
  h: number,
  baseColor: string
) {
  const hw = w / 2;
  const hh = h / 2;

  switch (pattern) {
    case 'french':
      return (
        <path
          d={`M ${-hw + 2} ${-hh + 9} Q 0 ${-hh + 3} ${hw - 2} ${-hh + 9} Q 0 ${-hh - 2} ${-hw + 2} ${-hh + 9} Z`}
          fill="#FFFFFF"
          opacity="0.92"
        />
      );
    case 'dots':
      return (
        <g fill="#FFFFFF" opacity="0.88">
          <circle cx={-hw * 0.35} cy={-hh * 0.35} r="2.2" />
          <circle cx={hw * 0.35} cy={-hh * 0.25} r="2.2" />
          <circle cx="0" cy={hh * 0.1} r="2.4" />
          <circle cx={-hw * 0.3} cy={hh * 0.45} r="2" />
          <circle cx={hw * 0.35} cy={hh * 0.45} r="2" />
        </g>
      );
    case 'glitter':
      return (
        <g fill="#FEF08A" opacity="0.9">
          <circle cx={-hw * 0.35} cy={-hh * 0.45} r="1.6" />
          <circle cx={hw * 0.3} cy={-hh * 0.3} r="1.8" />
          <circle cx="0" cy={-hh * 0.15} r="1.4" />
          <circle cx={-hw * 0.2} cy={hh * 0.2} r="1.5" />
          <circle cx={hw * 0.35} cy={hh * 0.35} r="1.2" />
          <circle cx="0" cy={hh * 0.55} r="1.1" />
        </g>
      );
    case 'hearts':
      return (
        <path
          d="M0,4 C-5,0 -5,-5 -2,-5 C0,-5 0,-2.5 0,-2.5 C0,-2.5 0,-5 2,-5 C5,-5 5,0 0,4 Z"
          fill={baseColor === '#FAF5FF' ? '#EC4899' : '#FFFFFF'}
          opacity="0.9"
        />
      );
    case 'stripes':
      return (
        <g stroke="#FFFFFF" strokeWidth="2.2" opacity="0.75">
          <line x1={-hw + 3} y1={-hh * 0.3} x2={hw - 3} y2={-hh * 0.3} />
          <line x1={-hw + 3} y1={hh * 0.2} x2={hw - 3} y2={hh * 0.2} />
        </g>
      );
    default:
      return null;
  }
}

function renderGem(gem: NailGemId, yOffset: number) {
  switch (gem) {
    case 'diamond':
      return (
        <polygon
          points={`0,${yOffset - 5} 4,${yOffset} 0,${yOffset + 5} -4,${yOffset}`}
          fill="#E0F2FE"
          stroke="#38BDF8"
          strokeWidth="0.9"
        />
      );
    case 'pearl':
      return (
        <circle
          cx="0"
          cy={yOffset}
          r="3.8"
          fill="#FFFDF9"
          stroke="#CBD5E1"
          strokeWidth="0.8"
        />
      );
    case 'star':
      return (
        <polygon
          points={`0,${yOffset - 5} 1.5,${yOffset - 1.5} 5,${yOffset - 1.5} 2,${yOffset + 1} 3,${yOffset + 4.5} 0,${yOffset + 2.5} -3,${yOffset + 4.5} -2,${yOffset + 1} -5,${yOffset - 1.5} -1.5,${yOffset - 1.5}`}
          fill="#FDE047"
          stroke="#D97706"
          strokeWidth="0.6"
        />
      );
    case 'heart':
      return (
        <path
          d={`M0,${yOffset + 4} C-4.5,${yOffset} -4.5,${yOffset - 4} -2,${yOffset - 4} C0,${yOffset - 4} 0,${yOffset - 2} 0,${yOffset - 2} C0,${yOffset - 2} 0,${yOffset - 4} 2,${yOffset - 4} C4.5,${yOffset - 4} 4.5,${yOffset} 0,${yOffset + 4} Z`}
          fill="#F472B6"
          stroke="#FFFFFF"
          strokeWidth="0.6"
        />
      );
    default:
      return null;
  }
}

export const NailStudioCanvas: React.FC<NailStudioCanvasProps> = ({
  princess,
  nails,
  activeTool,
  onNailInteract,
}) => {
  const isHand = nails.mode === 'manicure';
  const coords = isHand ? FINGER_COORDS : TOE_COORDS;
  const caredList = isHand ? nails.handCared : nails.footCared;
  const polishList = isHand ? nails.handPolish : nails.footPolish;
  const patternList = isHand ? nails.handPattern : nails.footPattern;
  const gemList = isHand ? nails.handGem : nails.footGem;

  return (
    <svg
      viewBox="0 0 400 410"
      className="w-full h-full max-h-[420px] select-none"
      role="img"
      aria-label={`${princess.name} ${nails.mode} studio`}
    >
      <defs>
        <radialGradient id="pillowGrad" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#FDF2F8" />
          <stop offset="65%" stopColor="#F5D0FE" />
          <stop offset="100%" stopColor="#E9D5FF" />
        </radialGradient>
        <linearGradient id="handSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={princess.skinHighlight} />
          <stop offset="65%" stopColor={princess.skinTone} />
          <stop offset="100%" stopColor={princess.skinShadow} />
        </linearGradient>
      </defs>

      {/* Velvet Spa Cushion */}
      <ellipse
        cx="200"
        cy="300"
        rx="168"
        ry="86"
        fill="url(#pillowGrad)"
        stroke="#F472B6"
        strokeWidth="2.5"
        opacity="0.92"
      />
      <ellipse
        cx="200"
        cy="300"
        rx="145"
        ry="68"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeDasharray="6 6"
        opacity="0.7"
      />

      {isHand ? (
        <g>
          {/* Wrist & Forearm */}
          <path
            d="M154,325 L146,408 L266,408 L252,325 Z"
            fill="url(#handSkinGrad)"
          />
          {/* Palm */}
          <path
            d="M136,245 C132,295 148,342 200,342 C252,342 268,295 264,245 C262,210 240,192 200,192 C160,192 138,210 136,245 Z"
            fill="url(#handSkinGrad)"
          />
          {/* Thumb */}
          <path
            d="M142,276 C122,262 102,240 90,214 C84,200 104,190 116,204 C128,220 142,238 154,248 Z"
            fill="url(#handSkinGrad)"
          />
          {/* Index */}
          <path
            d="M138,215 L134,94 C134,76 158,76 160,94 L166,205 Z"
            fill="url(#handSkinGrad)"
          />
          {/* Middle */}
          <path
            d="M180,202 L183,76 C183,58 209,58 209,76 L212,202 Z"
            fill="url(#handSkinGrad)"
          />
          {/* Ring */}
          <path
            d="M224,205 L234,96 C235,78 260,80 258,98 L250,215 Z"
            fill="url(#handSkinGrad)"
          />
          {/* Pinky */}
          <path
            d="M254,225 L278,142 C282,126 304,132 299,148 L272,244 Z"
            fill="url(#handSkinGrad)"
          />

          {/* Ring Jewelry on Ring Finger */}
          {nails.ringId !== 'none' && (
            <g transform="translate(242, 162) rotate(7)">
              <rect x="-12" y="-3" width="24" height="6" rx="3" fill="#FBBF24" stroke="#B45309" strokeWidth="0.8" />
              {nails.ringId === 'diamond' && (
                <polygon points="0,-10 5,-3 0,4 -5,-3" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="0.8" />
              )}
              {nails.ringId === 'ruby' && (
                <circle cx="0" cy="-3" r="5" fill="#E11D48" stroke="#FDE68A" strokeWidth="1" />
              )}
              {nails.ringId === 'amethyst' && (
                <polygon points="0,-10 5,-3 0,4 -5,-3" fill="#9333EA" stroke="#E9D5FF" strokeWidth="0.9" />
              )}
              {nails.ringId === 'gold_bow' && (
                <g fill="#F472B6">
                  <path d="M0,-3 L-7,-8 L-7,2 Z" />
                  <path d="M0,-3 L7,-8 L7,2 Z" />
                  <circle cx="0" cy="-3" r="2.5" fill="#FDE047" />
                </g>
              )}
            </g>
          )}

          {/* Bracelet on Wrist */}
          {nails.braceletId === 'pearl' && (
            <g>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <circle
                  key={i}
                  cx={157 + i * 13.5}
                  cy={352 + Math.sin((i / 7) * Math.PI) * 8}
                  r="5.5"
                  fill="#FFFDF9"
                  stroke="#CBD5E1"
                  strokeWidth="0.9"
                />
              ))}
            </g>
          )}
          {nails.braceletId === 'charm' && (
            <g>
              <path d="M150,350 Q204,368 258,350" fill="none" stroke="#F59E0B" strokeWidth="3.5" />
              <circle cx="182" cy="364" r="5.5" fill="#EC4899" />
              <polygon points="204,358 208,366 200,366" fill="#FDE047" />
              <circle cx="226" cy="364" r="5.5" fill="#9333EA" />
            </g>
          )}
          {nails.braceletId === 'crystal' && (
            <g>
              <path d="M150,350 Q204,366 258,350" fill="none" stroke="#BAE6FD" strokeWidth="4" />
              {[164, 184, 204, 224, 244].map((cx, i) => (
                <polygon
                  key={i}
                  points={`${cx},352 ${cx + 4},357 ${cx},362 ${cx - 4},357`}
                  fill="#FFFFFF"
                  stroke="#38BDF8"
                  strokeWidth="0.8"
                />
              ))}
            </g>
          )}
        </g>
      ) : (
        <g>
          {/* Ankle & Foot */}
          <path
            d="M158,315 L154,406 L258,406 L252,315 Z"
            fill="url(#handSkinGrad)"
          />
          <path
            d="M132,162 C132,138 158,128 205,135 C255,142 292,175 288,218 C282,265 262,330 205,335 C152,338 134,270 132,162 Z"
            fill="url(#handSkinGrad)"
          />
          {/* Individual Toe Contours */}
          <ellipse cx="147" cy="134" rx="22" ry="26" fill="url(#handSkinGrad)" />
          <ellipse cx="192" cy="138" rx="14" ry="22" fill="url(#handSkinGrad)" />
          <ellipse cx="224" cy="148" rx="12" ry="19" fill="url(#handSkinGrad)" />
          <ellipse cx="252" cy="164" rx="11" ry="17" fill="url(#handSkinGrad)" />
          <ellipse cx="276" cy="182" rx="10" ry="15" fill="url(#handSkinGrad)" />

          {/* Anklet */}
          {nails.ankletId === 'gold_chain' && (
            <g>
              <path d="M155,342 Q205,358 256,342" fill="none" stroke="#F59E0B" strokeWidth="3.5" />
              <circle cx="205" cy="355" r="5" fill="#FDE047" stroke="#B45309" strokeWidth="1" />
            </g>
          )}
          {nails.ankletId === 'pearl_anklet' && (
            <g>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <circle
                  key={i}
                  cx={161 + i * 14.5}
                  cy={342 + Math.sin((i / 6) * Math.PI) * 8}
                  r="5"
                  fill="#FFFDF9"
                  stroke="#CBD5E1"
                  strokeWidth="0.9"
                />
              ))}
            </g>
          )}
          {nails.ankletId === 'flower_band' && (
            <g>
              <path d="M155,342 Q205,358 256,342" fill="none" stroke="#F472B6" strokeWidth="3.5" />
              <circle cx="205" cy="351" r="6" fill="#EC4899" />
              <circle cx="205" cy="351" r="2.2" fill="#FEF08A" />
            </g>
          )}
        </g>
      )}

      {/* ==================== INTERACTIVE NAILS ==================== */}
      {coords.map((nail, idx) => {
        const isCared = caredList[idx];
        const polish = polishList[idx];
        const pattern = patternList[idx];
        const gem = gemList[idx];
        const baseFill = polish || (isCared ? '#FFF1F7' : '#FDE8E8');

        return (
          <g
            key={idx}
            transform={`translate(${nail.x}, ${nail.y}) rotate(${nail.rot})`}
            className="cursor-pointer group"
            onClick={(e) => onNailInteract(idx, e.clientX, e.clientY)}
          >
            {/* Larger transparent touch/click hitbox */}
            <rect
              x={-nail.w / 2 - 8}
              y={-nail.h / 2 - 8}
              width={nail.w + 16}
              height={nail.h + 16}
              rx="12"
              fill="transparent"
            />
            {/* Nail Shape */}
            <rect
              x={-nail.w / 2}
              y={-nail.h / 2}
              width={nail.w}
              height={nail.h}
              rx={nail.w / 2.2}
              fill={baseFill}
              stroke={
                activeTool === 'care' && !isCared
                  ? '#D946EF'
                  : polish
                  ? 'rgba(255,255,255,0.6)'
                  : '#E2A8B8'
              }
              strokeWidth={activeTool === 'care' && !isCared ? '2' : '1.4'}
              strokeDasharray={activeTool === 'care' && !isCared ? '3 2' : undefined}
            />

            {/* Unfiled Rough Lines before Care */}
            {!isCared && !polish && (
              <g stroke="#CB8C9E" strokeWidth="1" opacity="0.7">
                <line x1={-nail.w * 0.25} y1={-nail.h * 0.2} x2={nail.w * 0.25} y2={-nail.h * 0.1} />
                <line x1={-nail.w * 0.2} y1={nail.h * 0.1} x2={nail.w * 0.25} y2={nail.h * 0.2} />
              </g>
            )}

            {/* Pattern Overlay */}
            {polish && renderPatternOverlay(pattern, nail.w, nail.h, polish)}

            {/* Gloss Highlight */}
            {(isCared || polish) && (
              <ellipse
                cx={-nail.w * 0.2}
                cy={-nail.h * 0.12}
                rx={nail.w * 0.11}
                ry={nail.h * 0.28}
                fill="#FFFFFF"
                opacity="0.55"
              />
            )}

            {/* Nail Gem Sticker */}
            {renderGem(gem, nail.h * 0.16)}
          </g>
        );
      })}
    </svg>
  );
};
