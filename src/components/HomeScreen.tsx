import React, { useState } from 'react';
import { Crown, Play, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { SALON_IMAGES } from '../data/salonData';
import { soundFX } from '../utils/sound';

interface HomeScreenProps {
  onPlay: () => void;
  onChoosePrincess: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPlay,
  onChoosePrincess,
  muted,
  onToggleMute,
}) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF5FA] via-[#FCE7F3] to-[#F3E8FF] text-[#3B123A]">
      {/* Minimal 3-Zone Top Bar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-8">
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <Crown className="w-6 h-6 text-pink-600" aria-hidden="true" />
          <span className="font-display text-xl font-bold tracking-tight text-[#4A1044]">
            Princess Beauty Salon
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#70246A]">
          <button
            type="button"
            onClick={() => {
              soundFX.playTap();
              onChoosePrincess();
            }}
            className="hover:text-pink-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Princesses
          </button>
          <button
            type="button"
            onClick={() => {
              soundFX.playTap();
              onPlay();
            }}
            className="hover:text-pink-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Spa &amp; Makeup
          </button>
          <button
            type="button"
            onClick={() => {
              soundFX.playTap();
              onPlay();
            }}
            className="hover:text-pink-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Hair &amp; Nails
          </button>
          <button
            type="button"
            onClick={() => {
              soundFX.playTap();
              onPlay();
            }}
            className="hover:text-pink-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Royal Boutique
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
            className="w-11 h-11 rounded-xl bg-white/80 border border-pink-200 flex items-center justify-center text-purple-800 hover:bg-white transition-colors shadow-sm cursor-pointer"
          >
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Hero */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-4 md:py-8 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Copy & Play Action */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <p className="text-sm font-semibold tracking-wide text-purple-800">
              Royal Spa · Makeup · Hair · Nail Art · Boutique
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] text-[#4A1044] text-balance">
              Princess Beauty Salon
            </h1>

            <p className="text-base sm:text-lg text-[#662660] leading-relaxed max-w-xl">
              Welcome four royal guests into your pink and purple beauty studio. Pamper their skin
              with soothing facials, style vibrant hairstyles, paint custom manicure and pedicure
              nail art, dress them in sparkling ballgowns, and reveal their before-and-after
              transformation.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundFX.playSparkle();
                  onPlay();
                }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-pink-500/25 hover:shadow-xl hover:brightness-105 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[52px]"
              >
                <Play className="w-5 h-5 fill-current" />
                Play
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playTap();
                  onChoosePrincess();
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/90 border border-pink-200 text-[#4A1044] font-semibold text-base hover:bg-white hover:border-pink-300 transition-all whitespace-nowrap shrink-0 cursor-pointer min-h-[52px]"
              >
                <Sparkles className="w-4 h-4 text-fuchsia-600" />
                Choose Princess
              </button>
            </div>

            {/* Clean unboxed activity summary */}
            <div className="pt-4 border-t border-pink-200/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-[#4A1044]">Facial &amp; Skincare</div>
                <div className="text-[#7B3573] text-xs mt-0.5">Foam cleanser, masks &amp; eye pads</div>
              </div>
              <div>
                <div className="font-semibold text-[#4A1044]">Hair &amp; Makeup</div>
                <div className="text-[#7B3573] text-xs mt-0.5">8 hairstyles, highlights &amp; glam</div>
              </div>
              <div>
                <div className="font-semibold text-[#4A1044]">Nails &amp; Couture</div>
                <div className="text-[#7B3573] text-xs mt-0.5">Manicure, pedicure &amp; ballgowns</div>
              </div>
            </div>
          </div>

          {/* Right Princess Hero Illustration */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full max-w-md lg:max-w-lg rounded-3xl overflow-hidden bg-gradient-to-b from-pink-100 to-purple-100 border-2 border-white shadow-2xl shadow-purple-900/15 aspect-[3/4]">
              {!heroImgFailed ? (
                <img
                  src={SALON_IMAGES.homeHero}
                  alt="Princess smiling inside the pink and purple Princess Beauty Salon"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-pink-200 via-fuchsia-100 to-purple-200">
                  <Crown className="w-16 h-16 text-pink-600 mb-4 animate-float-slow" />
                  <p className="font-display text-2xl font-bold text-[#4A1044]">
                    Princess Beauty Salon
                  </p>
                  <p className="text-sm text-[#70246A] mt-2">
                    Tap Play to enter the royal makeover studio
                  </p>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/40 rounded-3xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
