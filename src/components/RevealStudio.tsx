import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Check,
  Columns2,
  Crown,
  SlidersHorizontal,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  CROWNS,
  DRESSES,
  HAIR_STYLES,
  SALON_IMAGES,
  SHOES,
} from '../data/salonData';
import {
  PrincessMakeoverState,
  PrincessPreset,
  StudioBackdropId,
} from '../types/salon';
import { soundFX } from '../utils/sound';
import { PrincessAvatar } from './PrincessAvatar';

interface RevealStudioProps {
  princess: PrincessPreset;
  state: PrincessMakeoverState;
  onChangeBackdrop: (backdrop: StudioBackdropId) => void;
  onBackToSalon: () => void;
  onStyleAnother: () => void;
}

export const RevealStudio: React.FC<RevealStudioProps> = ({
  princess,
  state,
  onChangeBackdrop,
  onBackToSalon,
  onStyleAnother,
}) => {
  const [compareMode, setCompareMode] = useState<'slider' | 'sideBySide'>('slider');
  const [sliderPercent, setSliderPercent] = useState(50);
  const [frameMode, setFrameMode] = useState<'full' | 'portrait'>('full');
  const [savedNotice, setSavedNotice] = useState(false);
  const [backdropFailed, setBackdropFailed] = useState(false);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const afterWrapperRef = useRef<HTMLDivElement | null>(null);

  const updateSliderFromPointer = (clientX: number) => {
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSliderPercent(Math.max(4, Math.min(96, pct)));
  };

  const handleSaveKeepsake = () => {
    soundFX.playSparkle();
    const svgEl = afterWrapperRef.current?.querySelector('svg');
    if (!svgEl) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgEl);
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 900, 1200);
        grad.addColorStop(0, '#FDF2F8');
        grad.addColorStop(0.5, '#FCE7F3');
        grad.addColorStop(1, '#F3E8FF');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 900, 1200);

        ctx.strokeStyle = '#EC4899';
        ctx.lineWidth = 10;
        ctx.strokeRect(24, 24, 852, 1152);

        ctx.drawImage(img, 110, 120, 680, 920);

        ctx.fillStyle = '#4A1044';
        ctx.font = 'bold 42px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Princess Beauty Salon', 450, 88);

        ctx.fillStyle = '#7E22CE';
        ctx.font = '600 30px sans-serif';
        ctx.fillText(`${princess.name} · Royal Makeover`, 450, 1122);

        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `princess-beauty-salon-${princess.id}.png`;
        link.click();
      }
      URL.revokeObjectURL(url);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    };
    img.src = url;
  };

  const backdropUrl =
    state.studioBackdrop === 'ballroom'
      ? SALON_IMAGES.ballroomBackdrop
      : SALON_IMAGES.vanityBackdrop;

  const hairName =
    HAIR_STYLES.find((h) => h.id === state.hair.styleId)?.name || 'Natural Starter';
  const dressName =
    DRESSES.find((d) => d.id === state.boutique.dressId)?.name || 'Loungewear';
  const crownName =
    CROWNS.find((c) => c.id === state.boutique.crownId)?.name || 'None';
  const shoeName =
    SHOES.find((s) => s.id === state.boutique.shoeId)?.name || 'Barefoot';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF5FA] via-[#FCE7F3] to-[#F3E8FF] text-[#3B123A]">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            soundFX.playTap();
            onBackToSalon();
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-pink-200 text-sm font-semibold text-[#4A1044] hover:bg-pink-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Salon
        </button>

        <div className="flex items-center gap-2 font-display text-lg sm:text-xl font-bold text-[#4A1044]">
          <Crown className="w-5 h-5 text-pink-600" />
          <span>Princess Beauty Salon</span>
        </div>

        <button
          type="button"
          onClick={() => {
            soundFX.playTap();
            onStyleAnother();
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 text-white text-sm font-semibold hover:bg-purple-800 transition-colors cursor-pointer"
        >
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Style Another Princess</span>
          <span className="sm:hidden">Guests</span>
        </button>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT: Interactive Before & After Reveal Stage */}
        <section className="lg:col-span-8 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white/90 px-4 py-3 rounded-2xl border border-pink-200/80 shadow-sm">
            <div className="flex items-center gap-1.5 bg-pink-50 p-1 rounded-xl border border-pink-100">
              <button
                type="button"
                onClick={() => {
                  soundFX.playTap();
                  setCompareMode('slider');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  compareMode === 'slider'
                    ? 'bg-white text-pink-700 shadow-sm'
                    : 'text-[#6A2363]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Drag Slider
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFX.playTap();
                  setCompareMode('sideBySide');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  compareMode === 'sideBySide'
                    ? 'bg-white text-pink-700 shadow-sm'
                    : 'text-[#6A2363]'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
                Side by Side
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFX.playTap();
                  setFrameMode((m) => (m === 'full' ? 'portrait' : 'full'));
                }}
                className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-900 hover:bg-purple-100 cursor-pointer"
              >
                {frameMode === 'full' ? 'Close-Up Portrait' : 'Full Gown View'}
              </button>
            </div>
          </div>

          {compareMode === 'slider' ? (
            <div
              ref={sliderRef}
              onPointerDown={(e) => {
                isDragging.current = true;
                updateSliderFromPointer(e.clientX);
              }}
              onPointerMove={(e) => {
                if (isDragging.current) updateSliderFromPointer(e.clientX);
              }}
              onPointerUp={() => {
                isDragging.current = false;
              }}
              onPointerLeave={() => {
                isDragging.current = false;
              }}
              className="relative flex-1 min-h-[480px] sm:min-h-[580px] rounded-3xl overflow-hidden border-2 border-white shadow-2xl shadow-purple-900/15 bg-gradient-to-b from-pink-100 to-purple-100 cursor-ew-resize select-none touch-none"
            >
              {/* Backdrop */}
              {!backdropFailed && (
                <img
                  src={backdropUrl}
                  alt="Salon makeover reveal backdrop"
                  referrerPolicy="no-referrer"
                  onError={() => setBackdropFailed(true)}
                  className="absolute inset-0 w-full h-full object-cover opacity-65"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-pink-50/35 via-transparent to-purple-100/55" />

              {/* AFTER Layer (Full Canvas beneath) */}
              <div
                ref={afterWrapperRef}
                className="absolute inset-0 flex items-center justify-center p-4 sm:p-8"
              >
                <PrincessAvatar
                  princess={princess}
                  state={state}
                  viewMode={frameMode}
                  className="w-full h-full max-h-[530px]"
                />
              </div>

              {/* BEFORE Layer (Clipped on left side of slider) */}
              <div
                className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 bg-slate-100/20"
                style={{ clipPath: `inset(0 ${100 - sliderPercent}% 0 0)` }}
              >
                <PrincessAvatar
                  princess={princess}
                  state={state}
                  viewMode={frameMode}
                  isBeforeMode
                  className="w-full h-full max-h-[530px]"
                />
              </div>

              {/* Before / After Corner Labels */}
              <div className="pointer-events-none absolute top-4 left-5 px-3 py-1 rounded-lg bg-white/85 text-xs font-bold text-[#4A1044] shadow-sm">
                Before
              </div>
              <div className="pointer-events-none absolute top-4 right-5 px-3 py-1 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-xs font-bold text-white shadow-sm">
                After Makeover
              </div>

              {/* Vertical Divider Handle */}
              <div
                style={{ left: `${sliderPercent}%` }}
                className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(236,72,153,0.8)]"
              >
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 border-2 border-white text-white shadow-lg flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 min-h-[480px]">
              <div className="relative rounded-3xl overflow-hidden border-2 border-white bg-gradient-to-b from-purple-50 to-pink-50 shadow-lg flex flex-col items-center justify-center p-4">
                <span className="absolute top-3 left-4 text-xs font-bold text-[#6A2363] bg-white/80 px-3 py-1 rounded-lg">
                  Before Spa
                </span>
                <PrincessAvatar
                  princess={princess}
                  state={state}
                  viewMode={frameMode}
                  isBeforeMode
                  className="w-full h-full max-h-[460px]"
                />
              </div>
              <div
                ref={afterWrapperRef}
                className="relative rounded-3xl overflow-hidden border-2 border-pink-300 bg-gradient-to-b from-pink-100 to-purple-100 shadow-xl flex flex-col items-center justify-center p-4"
              >
                {!backdropFailed && (
                  <img
                    src={backdropUrl}
                    alt="After makeover backdrop"
                    referrerPolicy="no-referrer"
                    onError={() => setBackdropFailed(true)}
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                  />
                )}
                <span className="relative z-10 self-start text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 px-3 py-1 rounded-lg">
                  After Makeover
                </span>
                <div className="relative z-10 w-full flex-1 flex items-center justify-center">
                  <PrincessAvatar
                    princess={princess}
                    state={state}
                    viewMode={frameMode}
                    className="w-full h-full max-h-[460px]"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* RIGHT: Studio Controls & Makeover Summary */}
        <aside className="lg:col-span-4 bg-white/95 rounded-3xl border border-pink-200/80 shadow-lg p-6 flex flex-col justify-between gap-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-pink-600">
                <Sparkles className="w-4 h-4" />
                <span>Royal Transformation Complete</span>
              </div>
              <h1 className="font-display text-3xl font-bold text-[#4A1044] mt-1">
                {princess.name}
              </h1>
              <p className="text-sm text-[#6E356B] mt-1">
                Drag the slider across the mirror to compare her before-and-after look.
              </p>
            </div>

            {/* Studio Backdrop Switcher */}
            <div>
              <h2 className="text-xs font-bold text-[#4A1044] mb-2.5">
                Studio Photoshoot Backdrop
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playTap();
                    setBackdropFailed(false);
                    onChangeBackdrop('vanity');
                  }}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    state.studioBackdrop === 'vanity'
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent shadow'
                      : 'bg-pink-50/70 border-pink-200 text-[#4A1044]'
                  }`}
                >
                  Pink &amp; Purple Salon
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playTap();
                    setBackdropFailed(false);
                    onChangeBackdrop('ballroom');
                  }}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    state.studioBackdrop === 'ballroom'
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent shadow'
                      : 'bg-pink-50/70 border-pink-200 text-[#4A1044]'
                  }`}
                >
                  Royal Ballroom
                </button>
              </div>
            </div>

            {/* Clean Editorial Style Summary */}
            <div className="border-t border-pink-100 pt-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#7B3573]">Skincare Glow</span>
                <span className="font-semibold text-[#4A1044]">
                  {state.spa.rinsed || state.spa.maskRinsed || state.spa.eyeDarknessCleared
                    ? 'Refreshed & Radiant'
                    : 'Natural'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7B3573]">Hairstyle</span>
                <span className="font-semibold text-[#4A1044]">{hairName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7B3573]">Gown</span>
                <span className="font-semibold text-[#4A1044]">{dressName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7B3573]">Crown</span>
                <span className="font-semibold text-[#4A1044]">{crownName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7B3573]">Footwear</span>
                <span className="font-semibold text-[#4A1044]">{shoeName}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleSaveKeepsake}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 hover:brightness-105 cursor-pointer"
            >
              {savedNotice ? (
                <>
                  <Check className="w-4 h-4" />
                  Keepsake Saved!
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  Save Makeover Keepsake
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.playTap();
                onBackToSalon();
              }}
              className="w-full py-3 px-5 rounded-2xl bg-pink-50 border border-pink-200 text-[#4A1044] font-semibold text-sm hover:bg-pink-100 transition-colors cursor-pointer"
            >
              Keep Styling {princess.name}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};
