import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Crown,
  Droplets,
  Eye,
  Gem,
  Palette,
  RotateCcw,
  Scissors,
  Sparkles,
  UserCheck,
  Users,
  Volume2,
  VolumeX,
  Wand2,
} from 'lucide-react';
import {
  ACCESSORIES,
  BLUSH_SHADES,
  CROWNS,
  DRESS_COLOR_THEMES,
  DRESSES,
  EARRINGS,
  EYELINER_STYLES,
  EYESHADOW_SHADES,
  HAIR_COLORS,
  HAIR_STYLES,
  LIPSTICK_SHADES,
  NAIL_GEMS,
  NAIL_PATTERNS,
  NAIL_POLISH_COLORS,
  NECKLACES,
  SALON_IMAGES,
  SHOES,
} from '../data/salonData';
import {
  FloatingSparkle,
  NailGemId,
  NailPatternId,
  PrincessMakeoverState,
  PrincessPreset,
  SpaToolId,
  StationId,
} from '../types/salon';
import { soundFX } from '../utils/sound';
import { NailStudioCanvas } from './NailStudioCanvas';
import { PrincessAvatar } from './PrincessAvatar';

interface SalonWorkspaceProps {
  princess: PrincessPreset;
  state: PrincessMakeoverState;
  onUpdateState: (updater: (prev: PrincessMakeoverState) => PrincessMakeoverState) => void;
  onResetPrincess: () => void;
  onSwitchPrincess: () => void;
  onGoToReveal: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

const STATIONS: Array<{ id: StationId; label: string }> = [
  { id: 'SPA', label: 'Facial Spa' },
  { id: 'HAIR', label: 'Hair Studio' },
  { id: 'MAKEUP', label: 'Makeup' },
  { id: 'NAILS', label: 'Nail Art' },
  { id: 'BOUTIQUE', label: 'Boutique' },
];

export const SalonWorkspace: React.FC<SalonWorkspaceProps> = ({
  princess,
  state,
  onUpdateState,
  onResetPrincess,
  onSwitchPrincess,
  onGoToReveal,
  muted,
  onToggleMute,
}) => {
  const [activeStation, setActiveStation] = useState<StationId>('SPA');
  const [viewMode, setViewMode] = useState<'portrait' | 'full'>('portrait');
  const [peekBefore, setPeekBefore] = useState(false);
  const [backdropFailed, setBackdropFailed] = useState(false);

  // Station sub-states
  const [spaTool, setSpaTool] = useState<SpaToolId>('cleanser');
  const [makeupTab, setMakeupTab] = useState<'eyes' | 'liner' | 'blush' | 'lips' | 'gems'>('eyes');
  const [nailTool, setNailTool] = useState<'care' | 'polish' | 'pattern' | 'gem'>('care');
  const [selectedPolish, setSelectedPolish] = useState<string>(NAIL_POLISH_COLORS[0].hex);
  const [selectedPattern, setSelectedPattern] = useState<NailPatternId>('solid');
  const [selectedNailGem, setSelectedNailGem] = useState<NailGemId>('diamond');
  const [boutiqueTab, setBoutiqueTab] = useState<
    'dresses' | 'shoes' | 'crowns' | 'jewelry' | 'accessories'
  >('dresses');

  // Floating particles
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [particles, setParticles] = useState<FloatingSparkle[]>([]);
  const nextParticleId = useRef(1);

  const spawnParticle = useCallback(
    (clientX: number, clientY: number, kind: FloatingSparkle['kind'] = 'sparkle', color?: string) => {
      const box = stageRef.current?.getBoundingClientRect();
      if (!box) return;
      const x = clientX - box.left;
      const y = clientY - box.top;
      const id = nextParticleId.current++;
      setParticles((prev) => [...prev.slice(-14), { id, x, y, kind, color }]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 750);
    },
    []
  );

  const spawnStageCenterSparkle = useCallback(() => {
    const box = stageRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = box.left + box.width * (0.38 + Math.random() * 0.24);
    const y = box.top + box.height * (0.28 + Math.random() * 0.25);
    spawnParticle(x, y, 'sparkle');
  }, [spawnParticle]);

  // Auto-switch view framing cleanly per station
  useEffect(() => {
    if (activeStation === 'BOUTIQUE') {
      setViewMode('full');
    } else if (activeStation === 'SPA' || activeStation === 'MAKEUP' || activeStation === 'HAIR') {
      setViewMode('portrait');
    }
  }, [activeStation]);

  // Interactive Spa Handler
  const handleSpaInteract = (clientX: number, clientY: number, kind: 'rub' | 'click') => {
    if (spaTool === 'cleanser') {
      soundFX.playBubble();
      spawnParticle(clientX, clientY, 'bubble');
      onUpdateState((prev) => ({
        ...prev,
        spa: {
          ...prev.spa,
          rinsed: false,
          cleansedProgress: Math.min(100, prev.spa.cleansedProgress + (kind === 'click' ? 22 : 8)),
        },
      }));
    } else if (spaTool === 'water') {
      soundFX.playMist();
      spawnParticle(clientX, clientY, 'droplet');
      onUpdateState((prev) => ({
        ...prev,
        spa: {
          ...prev.spa,
          rinsed: prev.spa.cleansedProgress > 0 ? true : prev.spa.rinsed,
          maskRinsed: prev.spa.maskAppliedProgress > 0 ? true : prev.spa.maskRinsed,
        },
      }));
    } else if (spaTool === 'mask') {
      soundFX.playBrush();
      spawnParticle(clientX, clientY, 'sparkle');
      onUpdateState((prev) => ({
        ...prev,
        spa: {
          ...prev.spa,
          activeMask: prev.spa.activeMask || 'rose',
          maskRinsed: false,
          maskAppliedProgress: Math.min(
            100,
            prev.spa.maskAppliedProgress + (kind === 'click' ? 25 : 10)
          ),
        },
      }));
    } else if (spaTool === 'eyepads') {
      soundFX.playSparkle();
      spawnParticle(clientX, clientY, 'heart');
      onUpdateState((prev) => ({
        ...prev,
        spa: {
          ...prev.spa,
          eyePadsOn: !prev.spa.eyePadsOn,
          eyeDarknessCleared: true,
        },
      }));
    }
  };

  const handleBlemishClick = (index: number, clientX: number, clientY: number) => {
    soundFX.playSparkle();
    spawnParticle(clientX, clientY, 'sparkle');
    onUpdateState((prev) => {
      const nextBlemishes = [...prev.spa.blemishesCleared];
      nextBlemishes[index] = true;
      return {
        ...prev,
        spa: {
          ...prev.spa,
          blemishesCleared: nextBlemishes,
        },
      };
    });
  };

  const handleHairBrush = (clientX: number, clientY: number) => {
    soundFX.playBrush();
    spawnParticle(clientX, clientY, 'sparkle');
    onUpdateState((prev) => ({
      ...prev,
      hair: {
        ...prev.hair,
        shineLevel: Math.min(100, prev.hair.shineLevel + 10),
      },
    }));
  };

  const handleMakeupZoneClick = (
    zone: 'eyes' | 'cheeks' | 'lips',
    clientX: number,
    clientY: number
  ) => {
    soundFX.playSparkle();
    spawnParticle(clientX, clientY, 'sparkle');
    if (zone === 'eyes') {
      setMakeupTab('eyes');
      if (!state.makeup.eyeshadowColor) {
        onUpdateState((prev) => ({
          ...prev,
          makeup: { ...prev.makeup, eyeshadowColor: EYESHADOW_SHADES[0].hex },
        }));
      }
    } else if (zone === 'cheeks') {
      setMakeupTab('blush');
      if (!state.makeup.blushColor) {
        onUpdateState((prev) => ({
          ...prev,
          makeup: { ...prev.makeup, blushColor: BLUSH_SHADES[0].hex },
        }));
      }
    } else if (zone === 'lips') {
      setMakeupTab('lips');
      if (!state.makeup.lipstickColor) {
        onUpdateState((prev) => ({
          ...prev,
          makeup: { ...prev.makeup, lipstickColor: LIPSTICK_SHADES[0].hex },
        }));
      }
    }
  };

  const handleNailInteract = (index: number, clientX: number, clientY: number) => {
    const isHand = state.nails.mode === 'manicure';
    if (nailTool === 'care') {
      soundFX.playBrush();
      spawnParticle(clientX, clientY, 'sparkle');
      onUpdateState((prev) => {
        const nextCared = [...(isHand ? prev.nails.handCared : prev.nails.footCared)];
        nextCared[index] = true;
        return {
          ...prev,
          nails: isHand
            ? { ...prev.nails, handCared: nextCared }
            : { ...prev.nails, footCared: nextCared },
        };
      });
    } else if (nailTool === 'polish') {
      soundFX.playPolish();
      spawnParticle(clientX, clientY, 'sparkle', selectedPolish);
      onUpdateState((prev) => {
        const nextPolish = [...(isHand ? prev.nails.handPolish : prev.nails.footPolish)];
        const nextCared = [...(isHand ? prev.nails.handCared : prev.nails.footCared)];
        nextPolish[index] = selectedPolish;
        nextCared[index] = true;
        return {
          ...prev,
          nails: isHand
            ? { ...prev.nails, handPolish: nextPolish, handCared: nextCared }
            : { ...prev.nails, footPolish: nextPolish, footCared: nextCared },
        };
      });
    } else if (nailTool === 'pattern') {
      soundFX.playPolish();
      spawnParticle(clientX, clientY, 'sparkle');
      onUpdateState((prev) => {
        const nextPat = [...(isHand ? prev.nails.handPattern : prev.nails.footPattern)];
        const nextPolish = [...(isHand ? prev.nails.handPolish : prev.nails.footPolish)];
        if (!nextPolish[index]) nextPolish[index] = selectedPolish;
        nextPat[index] = selectedPattern;
        return {
          ...prev,
          nails: isHand
            ? { ...prev.nails, handPattern: nextPat, handPolish: nextPolish }
            : { ...prev.nails, footPattern: nextPat, footPolish: nextPolish },
        };
      });
    } else if (nailTool === 'gem') {
      soundFX.playSparkle();
      spawnParticle(clientX, clientY, 'heart');
      onUpdateState((prev) => {
        const nextGem = [...(isHand ? prev.nails.handGem : prev.nails.footGem)];
        nextGem[index] = selectedNailGem;
        return {
          ...prev,
          nails: isHand
            ? { ...prev.nails, handGem: nextGem }
            : { ...prev.nails, footGem: nextGem },
        };
      });
    }
  };

  const applyAllNails = () => {
    soundFX.playSparkle();
    spawnStageCenterSparkle();
    const isHand = state.nails.mode === 'manicure';
    onUpdateState((prev) => {
      if (nailTool === 'care') {
        const allTrue = [true, true, true, true, true];
        return {
          ...prev,
          nails: isHand
            ? { ...prev.nails, handCared: allTrue }
            : { ...prev.nails, footCared: allTrue },
        };
      }
      if (nailTool === 'polish') {
        const allPolish = [selectedPolish, selectedPolish, selectedPolish, selectedPolish, selectedPolish];
        const allTrue = [true, true, true, true, true];
        return {
          ...prev,
          nails: isHand
            ? { ...prev.nails, handPolish: allPolish, handCared: allTrue }
            : { ...prev.nails, footPolish: allPolish, footCared: allTrue },
        };
      }
      if (nailTool === 'pattern') {
        const allPat = [
          selectedPattern,
          selectedPattern,
          selectedPattern,
          selectedPattern,
          selectedPattern,
        ];
        const curPolish = isHand ? prev.nails.handPolish : prev.nails.footPolish;
        const filledPolish = curPolish.map((c) => c || selectedPolish);
        return {
          ...prev,
          nails: isHand
            ? { ...prev.nails, handPattern: allPat, handPolish: filledPolish }
            : { ...prev.nails, footPattern: allPat, footPolish: filledPolish },
        };
      }
      const allGem = [
        selectedNailGem,
        selectedNailGem,
        selectedNailGem,
        selectedNailGem,
        selectedNailGem,
      ];
      return {
        ...prev,
        nails: isHand
          ? { ...prev.nails, handGem: allGem }
          : { ...prev.nails, footGem: allGem },
      };
    });
  };

  const randomizeBoutique = () => {
    soundFX.playRevealFanfare();
    spawnStageCenterSparkle();
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const dress = pick(DRESSES);
    const theme = pick(DRESS_COLOR_THEMES);
    const crown = pick(CROWNS.filter((c) => c.id !== 'none'));
    const shoe = pick(SHOES);
    const neck = pick(NECKLACES.filter((n) => n.id !== 'none'));
    const ear = pick(EARRINGS.filter((e) => e.id !== 'none'));
    const acc = pick(ACCESSORIES);
    onUpdateState((prev) => ({
      ...prev,
      boutique: {
        dressId: dress.id,
        dressPrimaryColor: theme.primary,
        dressAccentColor: theme.accent,
        shoeId: shoe.id,
        crownId: crown.id,
        necklaceId: neck.id,
        earringId: ear.id,
        accessoryId: acc.id,
      },
    }));
  };

  // Contextual helper instruction
  const getInstructionText = (): string => {
    if (activeStation === 'SPA') {
      if (spaTool === 'cleanser') return 'Rub or tap her face to lather Rose Cleanser Foam.';
      if (spaTool === 'water') return 'Tap or swipe across her face to mist and rinse clean.';
      if (spaTool === 'tweezers') return 'Tap each blemish dot directly on her face to clear skin.';
      if (spaTool === 'mask') return 'Choose a mask below, swipe her face to coat, then rinse with Mist.';
      return 'Tap her eyes to place or remove soothing cooling eye pads.';
    }
    if (activeStation === 'HAIR') {
      return 'Pick a hairstyle, color, or highlights — brush across her hair for extra shine.';
    }
    if (activeStation === 'MAKEUP') {
      return 'Tap shades below or click her eyes, cheeks, and lips directly on the mirror.';
    }
    if (activeStation === 'NAILS') {
      return `Switch between Manicure & Pedicure, then tap any nail to ${
        nailTool === 'care'
          ? 'file and buff smooth'
          : nailTool === 'polish'
          ? 'paint with glossy polish'
          : nailTool === 'pattern'
          ? 'add nail art patterns'
          : 'place sparkling nail gems'
      }.`;
    }
    return 'Dress her in ballgowns, shoes, crowns, jewelry, and royal accessories.';
  };

  const backdropUrl =
    state.studioBackdrop === 'ballroom'
      ? SALON_IMAGES.ballroomBackdrop
      : SALON_IMAGES.vanityBackdrop;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF5FA] text-[#3B123A]">
      {/* Compact 3-Zone Top Navigation Bar */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-pink-200/80 px-4 sm:px-6 py-3 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Brand Title */}
          <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <Crown className="w-5 h-5 text-pink-600" aria-hidden="true" />
            <span className="font-display text-lg sm:text-xl font-bold text-[#4A1044]">
              Princess Beauty Salon
            </span>
          </div>

          {/* Zone 2: Station Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-pink-50/90 p-1 rounded-xl border border-pink-100">
            {STATIONS.map((st) => {
              const active = activeStation === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    soundFX.playTap();
                    setActiveStation(st.id);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm'
                      : 'text-[#6A2363] hover:text-[#4A1044] hover:bg-white/70'
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Switch Guest, Mute & Reveal CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                soundFX.playTap();
                onSwitchPrincess();
              }}
              title="Switch Princess"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-50 border border-pink-200 text-xs sm:text-sm font-semibold text-[#4A1044] hover:bg-pink-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
            >
              <Users className="w-4 h-4 text-purple-700" />
              <span className="hidden sm:inline">Switch Guest</span>
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
              className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-purple-800 hover:bg-pink-100 transition-colors cursor-pointer shrink-0"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.playRevealFanfare();
                onGoToReveal();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-pink-500/20 hover:brightness-105 transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
            >
              <span>Studio Reveal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Station Selector */}
      <div className="lg:hidden bg-white/95 border-b border-pink-100 px-3 py-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {STATIONS.map((st) => {
            const active = activeStation === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  soundFX.playTap();
                  setActiveStation(st.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] ${
                  active
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm'
                    : 'bg-pink-50 text-[#6A2363]'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Salon Studio */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT STAGE: Interactive Salon Mirror / Manicure Table */}
        <section className="lg:col-span-7 flex flex-col gap-3">
          {/* Interactive Instruction Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-white border border-pink-200/80 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-[#4A1044] font-medium">
              <Sparkles className="w-4 h-4 text-pink-600 shrink-0" />
              <span>{getInstructionText()}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {activeStation !== 'NAILS' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playTap();
                      setViewMode((v) => (v === 'portrait' ? 'full' : 'portrait'));
                    }}
                    className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-900 hover:bg-purple-100 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {viewMode === 'portrait' ? 'Full Gown View' : 'Close-Up View'}
                  </button>

                  <button
                    type="button"
                    onPointerDown={() => setPeekBefore(true)}
                    onPointerUp={() => setPeekBefore(false)}
                    onPointerLeave={() => setPeekBefore(false)}
                    onClick={() => setPeekBefore((b) => !b)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      peekBefore
                        ? 'bg-amber-100 border-amber-300 text-amber-900'
                        : 'bg-pink-50 border-pink-200 text-pink-900 hover:bg-pink-100'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {peekBefore ? 'Showing Before' : 'Peek Before'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Main Salon Viewport Stage */}
          <div
            ref={stageRef}
            className="relative flex-1 min-h-[430px] sm:min-h-[540px] rounded-3xl overflow-hidden border-2 border-white shadow-xl shadow-purple-900/10 bg-gradient-to-b from-pink-100 via-fuchsia-50 to-purple-100 flex items-center justify-center"
          >
            {/* Generated Salon Illustration Backdrop */}
            {!backdropFailed && (
              <img
                src={backdropUrl}
                alt="Princess Beauty Salon studio background"
                referrerPolicy="no-referrer"
                onError={() => setBackdropFailed(true)}
                className="absolute inset-0 w-full h-full object-cover opacity-55"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-pink-50/45 via-white/30 to-purple-100/65 backdrop-blur-[1px]" />

            {/* Princess Guest Title Overlay (Clean, unboxed) */}
            <div className="absolute top-4 left-5 z-10 pointer-events-none">
              <div className="font-display text-lg font-bold text-[#4A1044] drop-shadow-sm">
                {princess.name}
              </div>
              <div className="text-xs font-medium text-purple-900/80">
                {peekBefore ? 'Before Makeover' : princess.title}
              </div>
            </div>

            {/* Interactive Canvas */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-3 sm:p-6">
              {activeStation === 'NAILS' ? (
                <NailStudioCanvas
                  princess={princess}
                  nails={state.nails}
                  activeTool={nailTool}
                  onNailInteract={handleNailInteract}
                />
              ) : (
                <PrincessAvatar
                  princess={princess}
                  state={state}
                  viewMode={viewMode}
                  isBeforeMode={peekBefore}
                  activeStation={activeStation}
                  activeSpaTool={spaTool}
                  onSpaInteract={handleSpaInteract}
                  onBlemishClick={handleBlemishClick}
                  onEyePadsClick={(cx, cy) => {
                    soundFX.playSparkle();
                    spawnParticle(cx, cy, 'heart');
                    onUpdateState((prev) => ({
                      ...prev,
                      spa: {
                        ...prev.spa,
                        eyePadsOn: !prev.spa.eyePadsOn,
                        eyeDarknessCleared: true,
                      },
                    }));
                  }}
                  onHairBrush={handleHairBrush}
                  onMakeupZoneClick={handleMakeupZoneClick}
                  className="w-full h-full max-h-[500px]"
                />
              )}
            </div>

            {/* Floating Particle Effects */}
            <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
              {particles.map((p) => (
                <div
                  key={p.id}
                  style={{ left: p.x - 14, top: p.y - 14 }}
                  className={`absolute w-7 h-7 flex items-center justify-center ${
                    p.kind === 'bubble' ? 'animate-bubble-float' : 'animate-sparkle-burst'
                  }`}
                >
                  {p.kind === 'bubble' && (
                    <span className="w-5 h-5 rounded-full bg-white/80 border border-pink-300 shadow-sm" />
                  )}
                  {p.kind === 'droplet' && (
                    <Droplets className="w-5 h-5 text-sky-400 drop-shadow" />
                  )}
                  {p.kind === 'heart' && (
                    <span className="text-pink-500 text-lg leading-none drop-shadow">♥</span>
                  )}
                  {p.kind === 'sparkle' && (
                    <Sparkles
                      className="w-6 h-6 drop-shadow"
                      style={{ color: p.color || '#EC4899' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: Station Tools & Palettes */}
        <aside className="lg:col-span-5 flex flex-col bg-white/95 rounded-3xl border border-pink-200/80 shadow-lg shadow-purple-900/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-pink-100 flex items-center justify-between gap-2 bg-gradient-to-r from-pink-50/70 to-purple-50/70">
            <div>
              <h2 className="font-display text-xl font-bold text-[#4A1044]">
                {STATIONS.find((s) => s.id === activeStation)?.label}
              </h2>
              <p className="text-xs text-[#7B3573]">
                Customize every detail for {princess.name}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFX.playTap();
                onResetPrincess();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-pink-200 text-xs font-semibold text-[#6A2363] hover:bg-pink-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Look
            </button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto salon-scroll space-y-6 max-h-[560px]">
            {/* ==================== 1. FACIAL & SKINCARE SPA ==================== */}
            {activeStation === 'SPA' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-[#4A1044] mb-3">
                    Select Skincare Step
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'cleanser' as SpaToolId, label: 'Rose Cleanser', done: state.spa.cleansedProgress >= 75 },
                      { id: 'water' as SpaToolId, label: 'Mist Rinse', done: state.spa.rinsed && state.spa.cleansedProgress > 0 },
                      {
                        id: 'tweezers' as SpaToolId,
                        label: 'Clear Blemishes',
                        done: state.spa.blemishesCleared.every(Boolean),
                      },
                      { id: 'mask' as SpaToolId, label: 'Face Mask', done: state.spa.maskAppliedProgress >= 75 },
                      { id: 'eyepads' as SpaToolId, label: 'Eye Pads', done: state.spa.eyeDarknessCleared },
                    ].map((tool) => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => {
                          soundFX.playTap();
                          setSpaTool(tool.id);
                        }}
                        className={`px-3 py-3 rounded-2xl border text-left transition-all cursor-pointer min-h-[48px] ${
                          spaTool === tool.id
                            ? 'bg-gradient-to-br from-pink-600 to-purple-600 text-white border-transparent shadow-md'
                            : 'bg-pink-50/60 border-pink-200 text-[#4A1044] hover:bg-pink-100/70'
                        }`}
                      >
                        <div className="text-xs font-bold">{tool.label}</div>
                        <div
                          className={`text-[11px] mt-0.5 ${
                            spaTool === tool.id ? 'text-pink-100' : 'text-purple-700'
                          }`}
                        >
                          {tool.done ? 'Completed' : 'Ready'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contextual Quick Actions for current Spa tool */}
                {spaTool === 'cleanser' && (
                  <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#4A1044]">
                      <span>Foam Lather</span>
                      <span className="tabular-nums">{state.spa.cleansedProgress}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white overflow-hidden border border-pink-200">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-fuchsia-500 transition-all"
                        style={{ width: `${state.spa.cleansedProgress}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playBubble();
                        spawnStageCenterSparkle();
                        onUpdateState((prev) => ({
                          ...prev,
                          spa: { ...prev.spa, cleansedProgress: 100, rinsed: false },
                        }));
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-white border border-pink-300 text-xs font-bold text-pink-700 hover:bg-pink-100 transition-colors cursor-pointer"
                    >
                      Apply Full Rose Foam
                    </button>
                  </div>
                )}

                {spaTool === 'water' && (
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-3">
                    <p className="text-xs text-[#6A2363]">
                      Spray gentle floral mist across her face to wash away cleanser bubbles or face masks.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playMist();
                        spawnStageCenterSparkle();
                        onUpdateState((prev) => ({
                          ...prev,
                          spa: {
                            ...prev.spa,
                            rinsed: true,
                            maskRinsed: prev.spa.maskAppliedProgress > 0 ? true : prev.spa.maskRinsed,
                          },
                        }));
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-purple-500 text-white text-xs font-bold hover:brightness-105 transition-all cursor-pointer"
                    >
                      Spray Floral Mist Rinse
                    </button>
                  </div>
                )}

                {spaTool === 'tweezers' && (
                  <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100 space-y-3">
                    <p className="text-xs text-[#6A2363]">
                      Tap the small red blemishes directly on her face, and tidy her eyebrows for a polished arch.
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          soundFX.playSparkle();
                          spawnStageCenterSparkle();
                          onUpdateState((prev) => ({
                            ...prev,
                            spa: {
                              ...prev.spa,
                              blemishesCleared: prev.spa.blemishesCleared.map(() => true),
                            },
                          }));
                        }}
                        className="py-2.5 px-3 rounded-xl bg-white border border-pink-200 text-xs font-bold text-[#4A1044] hover:bg-pink-100 transition-colors cursor-pointer"
                      >
                        Clear All Blemishes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          soundFX.playSparkle();
                          spawnStageCenterSparkle();
                          onUpdateState((prev) => ({
                            ...prev,
                            spa: { ...prev.spa, browsTidied: true },
                          }));
                        }}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                          state.spa.browsTidied
                            ? 'bg-purple-600 text-white border-transparent'
                            : 'bg-white border-pink-200 text-[#4A1044] hover:bg-pink-100'
                        }`}
                      >
                        {state.spa.browsTidied ? 'Brows Tidied' : 'Tidy Eyebrows'}
                      </button>
                    </div>
                  </div>
                )}

                {spaTool === 'mask' && (
                  <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100 space-y-3">
                    <div className="text-xs font-bold text-[#4A1044]">Choose Face Mask Formula</div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'rose' as const, label: 'Rose Clay', swatch: '#F9A8D4' },
                        { id: 'lavender' as const, label: 'Lavender', swatch: '#D8B4FE' },
                        { id: 'berry' as const, label: 'Berry Gel', swatch: '#F472B6' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            soundFX.playTap();
                            onUpdateState((prev) => ({
                              ...prev,
                              spa: {
                                ...prev.spa,
                                activeMask: m.id,
                                maskRinsed: false,
                                maskAppliedProgress: Math.max(45, prev.spa.maskAppliedProgress),
                              },
                            }));
                          }}
                          className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                            state.spa.activeMask === m.id
                              ? 'bg-white border-pink-500 ring-2 ring-pink-200'
                              : 'bg-white/70 border-pink-200 hover:bg-white'
                          }`}
                        >
                          <span
                            className="w-6 h-6 rounded-full mx-auto block border border-white shadow-sm mb-1.5"
                            style={{ backgroundColor: m.swatch }}
                          />
                          <span className="text-[11px] font-semibold text-[#4A1044]">{m.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          soundFX.playBrush();
                          spawnStageCenterSparkle();
                          onUpdateState((prev) => ({
                            ...prev,
                            spa: {
                              ...prev.spa,
                              activeMask: prev.spa.activeMask || 'rose',
                              maskRinsed: false,
                              maskAppliedProgress: 100,
                            },
                          }));
                        }}
                        className="py-2.5 px-3 rounded-xl bg-white border border-pink-200 text-xs font-bold text-[#4A1044] hover:bg-pink-100 cursor-pointer"
                      >
                        Coat Full Mask
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          soundFX.playSparkle();
                          spawnStageCenterSparkle();
                          onUpdateState((prev) => ({
                            ...prev,
                            spa: { ...prev.spa, maskRinsed: true },
                          }));
                        }}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold hover:brightness-105 cursor-pointer"
                      >
                        Peel &amp; Glow
                      </button>
                    </div>
                  </div>
                )}

                {spaTool === 'eyepads' && (
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                    <p className="text-xs text-emerald-950">
                      Place cooling cucumber &amp; rose-quartz pads over tired eyes, then remove for bright, refreshed eyes.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playSparkle();
                        spawnStageCenterSparkle();
                        onUpdateState((prev) => ({
                          ...prev,
                          spa: {
                            ...prev.spa,
                            eyePadsOn: !prev.spa.eyePadsOn,
                            eyeDarknessCleared: true,
                          },
                        }));
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      {state.spa.eyePadsOn ? 'Remove Eye Pads & Refresh' : 'Place Cooling Eye Pads'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ==================== 2. HAIR STUDIO ==================== */}
            {activeStation === 'HAIR' && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-sm font-bold text-[#4A1044] flex items-center gap-1.5">
                      <Scissors className="w-4 h-4 text-pink-600" />
                      Hairstyles
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playSparkle();
                        spawnStageCenterSparkle();
                        onUpdateState((prev) => ({
                          ...prev,
                          hair: { ...prev.hair, shineLevel: 100 },
                        }));
                      }}
                      className="text-xs font-bold text-pink-600 hover:text-pink-700 cursor-pointer"
                    >
                      + Boost Gloss Shine
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {HAIR_STYLES.map((style) => {
                      const active = state.hair.styleId === style.id;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => {
                            soundFX.playBrush();
                            spawnStageCenterSparkle();
                            onUpdateState((prev) => ({
                              ...prev,
                              hair: { ...prev.hair, styleId: style.id },
                            }));
                          }}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer min-h-[42px] ${
                            active
                              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent shadow-sm'
                              : 'bg-pink-50/60 border-pink-200 text-[#4A1044] hover:bg-pink-100/70'
                          }`}
                        >
                          {style.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#4A1044] mb-2.5">Hair Dye Color</h3>
                  <div className="grid grid-cols-6 gap-2.5">
                    {HAIR_COLORS.map((c) => {
                      const active = state.hair.color === c.hex;
                      return (
                        <button
                          key={c.hex}
                          type="button"
                          title={c.name}
                          aria-label={c.name}
                          onClick={() => {
                            soundFX.playTap();
                            spawnStageCenterSparkle();
                            onUpdateState((prev) => ({
                              ...prev,
                              hair: { ...prev.hair, color: c.hex },
                            }));
                          }}
                          className={`w-10 h-10 rounded-full border-2 transition-transform cursor-pointer mx-auto ${
                            active
                              ? 'border-purple-900 scale-110 ring-2 ring-pink-300'
                              : 'border-white shadow hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#4A1044]">
                      Ombré Highlight Streaks
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playSparkle();
                        onUpdateState((prev) => ({
                          ...prev,
                          hair: { ...prev.hair, hasHighlights: !prev.hair.hasHighlights },
                        }));
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        state.hair.hasHighlights
                          ? 'bg-purple-600 text-white'
                          : 'bg-white border border-purple-200 text-purple-900'
                      }`}
                    >
                      {state.hair.hasHighlights ? 'Highlights On' : 'Add Highlights'}
                    </button>
                  </div>

                  {state.hair.hasHighlights && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {['#F472B6', '#C084FC', '#FDE047', '#60A5FA', '#34D399', '#FB7185'].map(
                        (hx) => (
                          <button
                            key={hx}
                            type="button"
                            aria-label={`Highlight color ${hx}`}
                            onClick={() => {
                              soundFX.playTap();
                              onUpdateState((prev) => ({
                                ...prev,
                                hair: { ...prev.hair, highlightColor: hx },
                              }));
                            }}
                            className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                              state.hair.highlightColor === hx
                                ? 'border-purple-900 scale-110'
                                : 'border-white shadow'
                            }`}
                            style={{ backgroundColor: hx }}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== 3. MAKEUP STUDIO ==================== */}
            {activeStation === 'MAKEUP' && (
              <div className="space-y-5">
                {/* Sub-tabs */}
                <div className="flex flex-wrap gap-1.5 p-1 bg-pink-50 rounded-xl border border-pink-100">
                  {[
                    { id: 'eyes' as const, label: 'Eyeshadow' },
                    { id: 'liner' as const, label: 'Liner & Lashes' },
                    { id: 'blush' as const, label: 'Blush' },
                    { id: 'lips' as const, label: 'Lipstick' },
                    { id: 'gems' as const, label: 'Face Gems' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        soundFX.playTap();
                        setMakeupTab(t.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        makeupTab === t.id
                          ? 'bg-white text-pink-700 shadow-sm'
                          : 'text-[#6A2363] hover:text-[#4A1044]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {makeupTab === 'eyes' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#4A1044]">Eyeshadow Shades</span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateState((prev) => ({
                            ...prev,
                            makeup: { ...prev.makeup, eyeshadowColor: null },
                          }))
                        }
                        className="text-xs text-purple-700 hover:underline cursor-pointer"
                      >
                        Clear Shadow
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2.5">
                      {EYESHADOW_SHADES.map((sh) => (
                        <button
                          key={sh.hex}
                          type="button"
                          onClick={() => {
                            soundFX.playBrush();
                            spawnStageCenterSparkle();
                            onUpdateState((prev) => ({
                              ...prev,
                              makeup: { ...prev.makeup, eyeshadowColor: sh.hex },
                            }));
                          }}
                          className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                            state.makeup.eyeshadowColor === sh.hex
                              ? 'border-pink-600 bg-pink-50 ring-2 ring-pink-200'
                              : 'border-pink-100 bg-white hover:bg-pink-50/50'
                          }`}
                        >
                          <span
                            className="w-8 h-8 rounded-full block mx-auto border border-white shadow"
                            style={{ backgroundColor: sh.hex }}
                          />
                          <span className="text-[11px] font-medium text-[#4A1044] mt-1 block truncate">
                            {sh.name}
                          </span>
                        </button>
                      ))}
                    </div>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-[#6A2363]">
                        Shimmer Intensity
                      </span>
                      <input
                        type="range"
                        min="0.25"
                        max="0.95"
                        step="0.05"
                        value={state.makeup.eyeshadowIntensity}
                        onChange={(e) =>
                          onUpdateState((prev) => ({
                            ...prev,
                            makeup: {
                              ...prev.makeup,
                              eyeshadowIntensity: parseFloat(e.target.value),
                            },
                          }))
                        }
                        className="w-full accent-pink-600 cursor-pointer"
                      />
                    </label>
                  </div>
                )}

                {makeupTab === 'liner' && (
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-[#4A1044]">Eyeliner Style</div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {EYELINER_STYLES.map((el) => (
                        <button
                          key={el.id}
                          type="button"
                          onClick={() => {
                            soundFX.playTap();
                            onUpdateState((prev) => ({
                              ...prev,
                              makeup: { ...prev.makeup, eyelinerStyle: el.id },
                            }));
                          }}
                          className={`px-3 py-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                            state.makeup.eyelinerStyle === el.id
                              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent'
                              : 'bg-pink-50/60 border-pink-200 text-[#4A1044]'
                          }`}
                        >
                          {el.name}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playSparkle();
                        onUpdateState((prev) => ({
                          ...prev,
                          makeup: { ...prev.makeup, mascara: !prev.makeup.mascara },
                        }));
                      }}
                      className={`w-full py-3 px-4 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        state.makeup.mascara
                          ? 'bg-purple-700 text-white border-transparent shadow-sm'
                          : 'bg-white border-pink-200 text-[#4A1044] hover:bg-pink-50'
                      }`}
                    >
                      {state.makeup.mascara ? 'Volumizing Mascara Applied' : 'Apply Volumizing Mascara'}
                    </button>
                  </div>
                )}

                {makeupTab === 'blush' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#4A1044]">Cheek Blush</span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateState((prev) => ({
                            ...prev,
                            makeup: { ...prev.makeup, blushColor: null },
                          }))
                        }
                        className="text-xs text-purple-700 hover:underline cursor-pointer"
                      >
                        Clear Blush
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      {BLUSH_SHADES.map((bl) => (
                        <button
                          key={bl.hex}
                          type="button"
                          onClick={() => {
                            soundFX.playBrush();
                            spawnStageCenterSparkle();
                            onUpdateState((prev) => ({
                              ...prev,
                              makeup: { ...prev.makeup, blushColor: bl.hex },
                            }));
                          }}
                          className={`p-2.5 rounded-xl border text-center cursor-pointer ${
                            state.makeup.blushColor === bl.hex
                              ? 'border-pink-600 bg-pink-50 ring-2 ring-pink-200'
                              : 'border-pink-100 bg-white hover:bg-pink-50/50'
                          }`}
                        >
                          <span
                            className="w-8 h-8 rounded-full block mx-auto border border-white shadow"
                            style={{ backgroundColor: bl.hex }}
                          />
                          <span className="text-[11px] font-medium text-[#4A1044] mt-1 block">
                            {bl.name}
                          </span>
                        </button>
                      ))}
                    </div>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-[#6A2363]">Blush Glow</span>
                      <input
                        type="range"
                        min="0.2"
                        max="0.85"
                        step="0.05"
                        value={state.makeup.blushIntensity}
                        onChange={(e) =>
                          onUpdateState((prev) => ({
                            ...prev,
                            makeup: {
                              ...prev.makeup,
                              blushIntensity: parseFloat(e.target.value),
                            },
                          }))
                        }
                        className="w-full accent-pink-600 cursor-pointer"
                      />
                    </label>
                  </div>
                )}

                {makeupTab === 'lips' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#4A1044]">Lipstick Shades</span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateState((prev) => ({
                            ...prev,
                            makeup: { ...prev.makeup, lipstickColor: null, lipGloss: false },
                          }))
                        }
                        className="text-xs text-purple-700 hover:underline cursor-pointer"
                      >
                        Natural Lips
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2.5">
                      {LIPSTICK_SHADES.map((lip) => (
                        <button
                          key={lip.hex}
                          type="button"
                          onClick={() => {
                            soundFX.playTap();
                            spawnStageCenterSparkle();
                            onUpdateState((prev) => ({
                              ...prev,
                              makeup: { ...prev.makeup, lipstickColor: lip.hex },
                            }));
                          }}
                          className={`p-2 rounded-xl border text-center cursor-pointer ${
                            state.makeup.lipstickColor === lip.hex
                              ? 'border-pink-600 bg-pink-50 ring-2 ring-pink-200'
                              : 'border-pink-100 bg-white hover:bg-pink-50/50'
                          }`}
                        >
                          <span
                            className="w-8 h-8 rounded-full block mx-auto border border-white shadow"
                            style={{ backgroundColor: lip.hex }}
                          />
                          <span className="text-[11px] font-medium text-[#4A1044] mt-1 block truncate">
                            {lip.name}
                          </span>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playSparkle();
                        onUpdateState((prev) => ({
                          ...prev,
                          makeup: { ...prev.makeup, lipGloss: !prev.makeup.lipGloss },
                        }));
                      }}
                      className={`w-full py-3 px-4 rounded-xl border text-xs font-bold cursor-pointer ${
                        state.makeup.lipGloss
                          ? 'bg-pink-600 text-white border-transparent'
                          : 'bg-white border-pink-200 text-[#4A1044] hover:bg-pink-50'
                      }`}
                    >
                      {state.makeup.lipGloss ? 'Shimmer Lip Gloss On' : 'Add Shimmer Lip Gloss'}
                    </button>
                  </div>
                )}

                {makeupTab === 'gems' && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-[#4A1044]">Cheek Gem Accent</div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: 'none' as const, label: 'None' },
                        { id: 'star' as const, label: 'Gold Star' },
                        { id: 'heart' as const, label: 'Pink Heart' },
                        { id: 'crystal' as const, label: 'Sky Crystal' },
                      ].map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            soundFX.playSparkle();
                            onUpdateState((prev) => ({
                              ...prev,
                              makeup: { ...prev.makeup, cheekGem: g.id },
                            }));
                          }}
                          className={`py-3 px-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                            state.makeup.cheekGem === g.id
                              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent'
                              : 'bg-pink-50/60 border-pink-200 text-[#4A1044]'
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================== 4. NAIL ART (MANICURE & PEDICURE) ==================== */}
            {activeStation === 'NAILS' && (
              <div className="space-y-5">
                {/* Manicure vs Pedicure Switch */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-pink-50 rounded-2xl border border-pink-100">
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playTap();
                      onUpdateState((prev) => ({
                        ...prev,
                        nails: { ...prev.nails, mode: 'manicure' },
                      }));
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      state.nails.mode === 'manicure'
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow'
                        : 'text-[#6A2363]'
                    }`}
                  >
                    Manicure (Hands)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playTap();
                      onUpdateState((prev) => ({
                        ...prev,
                        nails: { ...prev.nails, mode: 'pedicure' },
                      }));
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      state.nails.mode === 'pedicure'
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow'
                        : 'text-[#6A2363]'
                    }`}
                  >
                    Pedicure (Feet)
                  </button>
                </div>

                {/* Tool Selector */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'care' as const, label: 'File & Buff' },
                    { id: 'polish' as const, label: 'Polish' },
                    { id: 'pattern' as const, label: 'Patterns' },
                    { id: 'gem' as const, label: 'Gems' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        soundFX.playTap();
                        setNailTool(t.id);
                      }}
                      className={`py-2 px-2 rounded-xl border text-xs font-bold cursor-pointer ${
                        nailTool === t.id
                          ? 'bg-purple-700 text-white border-transparent'
                          : 'bg-white border-pink-200 text-[#4A1044] hover:bg-pink-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {nailTool === 'polish' && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-[#4A1044]">Pick Nail Polish Shade</div>
                    <div className="grid grid-cols-6 gap-2">
                      {NAIL_POLISH_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          title={c.name}
                          aria-label={c.name}
                          onClick={() => {
                            soundFX.playTap();
                            setSelectedPolish(c.hex);
                          }}
                          className={`w-9 h-9 rounded-full border-2 mx-auto cursor-pointer transition-transform ${
                            selectedPolish === c.hex
                              ? 'border-purple-900 scale-110 ring-2 ring-pink-300'
                              : 'border-white shadow'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {nailTool === 'pattern' && (
                  <div className="grid grid-cols-3 gap-2">
                    {NAIL_PATTERNS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          soundFX.playTap();
                          setSelectedPattern(p.id);
                        }}
                        className={`py-2.5 px-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                          selectedPattern === p.id
                            ? 'bg-pink-600 text-white border-transparent'
                            : 'bg-pink-50/70 border-pink-200 text-[#4A1044]'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}

                {nailTool === 'gem' && (
                  <div className="grid grid-cols-3 gap-2">
                    {NAIL_GEMS.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          soundFX.playTap();
                          setSelectedNailGem(g.id);
                        }}
                        className={`py-2.5 px-2 rounded-xl border text-xs font-semibold cursor-pointer ${
                          selectedNailGem === g.id
                            ? 'bg-pink-600 text-white border-transparent'
                            : 'bg-pink-50/70 border-pink-200 text-[#4A1044]'
                        }`}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={applyAllNails}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold shadow hover:brightness-105 cursor-pointer"
                >
                  Apply to All 5 Nails
                </button>

                {/* Hand Rings & Bracelets OR Foot Anklets */}
                {state.nails.mode === 'manicure' ? (
                  <div className="space-y-3 pt-2 border-t border-pink-100">
                    <div>
                      <div className="text-xs font-bold text-[#4A1044] mb-2">Royal Ring</div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: 'none' as const, label: 'None' },
                          { id: 'diamond' as const, label: 'Diamond' },
                          { id: 'ruby' as const, label: 'Ruby' },
                          { id: 'amethyst' as const, label: 'Amethyst' },
                          { id: 'gold_bow' as const, label: 'Pink Bow' },
                        ].map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => {
                              soundFX.playSparkle();
                              onUpdateState((prev) => ({
                                ...prev,
                                nails: { ...prev.nails, ringId: r.id },
                              }));
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                              state.nails.ringId === r.id
                                ? 'bg-purple-700 text-white border-transparent'
                                : 'bg-white border-pink-200 text-[#4A1044]'
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#4A1044] mb-2">Wrist Bracelet</div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: 'none' as const, label: 'None' },
                          { id: 'pearl' as const, label: 'Pearls' },
                          { id: 'charm' as const, label: 'Gold Charms' },
                          { id: 'crystal' as const, label: 'Crystals' },
                        ].map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => {
                              soundFX.playSparkle();
                              onUpdateState((prev) => ({
                                ...prev,
                                nails: { ...prev.nails, braceletId: b.id },
                              }));
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                              state.nails.braceletId === b.id
                                ? 'bg-purple-700 text-white border-transparent'
                                : 'bg-white border-pink-200 text-[#4A1044]'
                            }`}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2 border-t border-pink-100">
                    <div className="text-xs font-bold text-[#4A1044]">Anklet Jewelry</div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: 'none' as const, label: 'None' },
                        { id: 'gold_chain' as const, label: 'Gold Chain' },
                        { id: 'pearl_anklet' as const, label: 'Pearls' },
                        { id: 'flower_band' as const, label: 'Flower Band' },
                      ].map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => {
                            soundFX.playSparkle();
                            onUpdateState((prev) => ({
                              ...prev,
                              nails: { ...prev.nails, ankletId: a.id },
                            }));
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                            state.nails.ankletId === a.id
                              ? 'bg-purple-700 text-white border-transparent'
                              : 'bg-white border-pink-200 text-[#4A1044]'
                          }`}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================== 5. ROYAL BOUTIQUE ==================== */}
            {activeStation === 'BOUTIQUE' && (
              <div className="space-y-5">
                {/* Boutique Sub-tabs */}
                <div className="flex flex-wrap gap-1.5 p-1 bg-pink-50 rounded-xl border border-pink-100">
                  {[
                    { id: 'dresses' as const, label: 'Dresses' },
                    { id: 'shoes' as const, label: 'Shoes' },
                    { id: 'crowns' as const, label: 'Crowns' },
                    { id: 'jewelry' as const, label: 'Jewelry' },
                    { id: 'accessories' as const, label: 'Accessories' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        soundFX.playTap();
                        setBoutiqueTab(t.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        boutiqueTab === t.id
                          ? 'bg-white text-pink-700 shadow-sm'
                          : 'text-[#6A2363] hover:text-[#4A1044]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {boutiqueTab === 'dresses' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {DRESSES.map((d) => {
                        const active = state.boutique.dressId === d.id;
                        return (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => {
                              soundFX.playDressUp();
                              spawnStageCenterSparkle();
                              onUpdateState((prev) => ({
                                ...prev,
                                boutique: {
                                  ...prev.boutique,
                                  dressId: d.id,
                                  dressPrimaryColor: d.defaultPrimary,
                                  dressAccentColor: d.defaultAccent,
                                },
                              }));
                            }}
                            className={`px-3 py-3 rounded-xl border text-xs font-semibold text-left cursor-pointer transition-all ${
                              active
                                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent shadow-sm'
                                : 'bg-pink-50/60 border-pink-200 text-[#4A1044] hover:bg-pink-100/70'
                            }`}
                          >
                            {d.name}
                          </button>
                        );
                      })}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#4A1044] mb-2 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-pink-600" />
                        Gown Fabric Color
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {DRESS_COLOR_THEMES.map((theme) => (
                          <button
                            key={theme.name}
                            type="button"
                            title={theme.name}
                            onClick={() => {
                              soundFX.playTap();
                              onUpdateState((prev) => ({
                                ...prev,
                                boutique: {
                                  ...prev.boutique,
                                  dressId:
                                    prev.boutique.dressId === 'starter_lounge'
                                      ? 'rose_ballgown'
                                      : prev.boutique.dressId,
                                  dressPrimaryColor: theme.primary,
                                  dressAccentColor: theme.accent,
                                },
                              }));
                            }}
                            className="p-2 rounded-xl border border-pink-100 bg-white hover:bg-pink-50 text-center cursor-pointer"
                          >
                            <div className="flex items-center justify-center -space-x-1.5 mb-1">
                              <span
                                className="w-5 h-5 rounded-full border border-white shadow"
                                style={{ backgroundColor: theme.primary }}
                              />
                              <span
                                className="w-5 h-5 rounded-full border border-white shadow"
                                style={{ backgroundColor: theme.accent }}
                              />
                            </div>
                            <span className="text-[10px] font-semibold text-[#4A1044] block truncate">
                              {theme.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {boutiqueTab === 'shoes' && (
                  <div className="grid grid-cols-2 gap-2.5">
                    {SHOES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          soundFX.playDressUp();
                          spawnStageCenterSparkle();
                          onUpdateState((prev) => ({
                            ...prev,
                            boutique: { ...prev.boutique, shoeId: s.id },
                          }));
                        }}
                        className={`px-3 py-3 rounded-xl border text-xs font-semibold text-left cursor-pointer ${
                          state.boutique.shoeId === s.id
                            ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent'
                            : 'bg-pink-50/60 border-pink-200 text-[#4A1044] hover:bg-pink-100/70'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                )}

                {boutiqueTab === 'crowns' && (
                  <div className="grid grid-cols-2 gap-2.5">
                    {CROWNS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          soundFX.playSparkle();
                          spawnStageCenterSparkle();
                          onUpdateState((prev) => ({
                            ...prev,
                            boutique: { ...prev.boutique, crownId: c.id },
                          }));
                        }}
                        className={`px-3 py-3 rounded-xl border text-xs font-semibold text-left cursor-pointer ${
                          state.boutique.crownId === c.id
                            ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent'
                            : 'bg-pink-50/60 border-pink-200 text-[#4A1044] hover:bg-pink-100/70'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}

                {boutiqueTab === 'jewelry' && (
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-bold text-[#4A1044] mb-2 flex items-center gap-1.5">
                        <Gem className="w-3.5 h-3.5 text-purple-600" />
                        Necklaces
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {NECKLACES.map((n) => (
                          <button
                            key={n.id}
                            type="button"
                            onClick={() => {
                              soundFX.playSparkle();
                              onUpdateState((prev) => ({
                                ...prev,
                                boutique: { ...prev.boutique, necklaceId: n.id },
                              }));
                            }}
                            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-left cursor-pointer ${
                              state.boutique.necklaceId === n.id
                                ? 'bg-purple-700 text-white border-transparent'
                                : 'bg-pink-50/60 border-pink-200 text-[#4A1044]'
                            }`}
                          >
                            {n.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#4A1044] mb-2">Earrings</div>
                      <div className="grid grid-cols-2 gap-2">
                        {EARRINGS.map((er) => (
                          <button
                            key={er.id}
                            type="button"
                            onClick={() => {
                              soundFX.playSparkle();
                              onUpdateState((prev) => ({
                                ...prev,
                                boutique: { ...prev.boutique, earringId: er.id },
                              }));
                            }}
                            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-left cursor-pointer ${
                              state.boutique.earringId === er.id
                                ? 'bg-purple-700 text-white border-transparent'
                                : 'bg-pink-50/60 border-pink-200 text-[#4A1044]'
                            }`}
                          >
                            {er.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {boutiqueTab === 'accessories' && (
                  <div className="grid grid-cols-2 gap-2.5">
                    {ACCESSORIES.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          soundFX.playDressUp();
                          spawnStageCenterSparkle();
                          onUpdateState((prev) => ({
                            ...prev,
                            boutique: { ...prev.boutique, accessoryId: acc.id },
                          }));
                        }}
                        className={`px-3 py-3 rounded-xl border text-xs font-semibold text-left cursor-pointer ${
                          state.boutique.accessoryId === acc.id
                            ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent'
                            : 'bg-pink-50/60 border-pink-200 text-[#4A1044] hover:bg-pink-100/70'
                        }`}
                      >
                        {acc.name}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={randomizeBoutique}
                  className="w-full py-3 px-4 rounded-xl bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold flex items-center justify-center gap-2 hover:bg-purple-200/70 transition-colors cursor-pointer"
                >
                  <Wand2 className="w-4 h-4 text-purple-700" />
                  Surprise Royal Couture Look
                </button>
              </div>
            )}
          </div>

          {/* Bottom Station Progression Footer */}
          <div className="px-5 py-3.5 border-t border-pink-100 bg-pink-50/50 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                soundFX.playTap();
                const idx = STATIONS.findIndex((s) => s.id === activeStation);
                if (idx < STATIONS.length - 1) {
                  setActiveStation(STATIONS[idx + 1].id);
                } else {
                  soundFX.playRevealFanfare();
                  onGoToReveal();
                }
              }}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-pink-500/20 hover:brightness-105 transition-all cursor-pointer"
            >
              {activeStation === 'BOUTIQUE' ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  Reveal Before &amp; After
                </>
              ) : (
                <>
                  <span>
                    Next: {STATIONS[STATIONS.findIndex((s) => s.id === activeStation) + 1].label}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};
