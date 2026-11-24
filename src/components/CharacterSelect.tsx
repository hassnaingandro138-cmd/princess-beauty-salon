import React from 'react';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { PRINCESSES } from '../data/salonData';
import { PrincessMakeoverState, PrincessPreset } from '../types/salon';
import { PrincessAvatar } from './PrincessAvatar';
import { soundFX } from '../utils/sound';

interface CharacterSelectProps {
  selectedId: string;
  makeovers: Record<string, PrincessMakeoverState>;
  onSelectPrincess: (princessId: string) => void;
  onBackHome: () => void;
}

function getCompletionPercent(state: PrincessMakeoverState): number {
  let points = 0;
  if (state.spa.cleansedProgress >= 70 && state.spa.rinsed) points += 1;
  if (state.spa.maskRinsed || state.spa.eyeDarknessCleared) points += 1;
  if (state.hair.styleId !== 'messy_starter') points += 1;
  if (state.makeup.eyeshadowColor || state.makeup.lipstickColor || state.makeup.blushColor) points += 1;
  if (state.nails.handPolish.some(Boolean) || state.nails.footPolish.some(Boolean)) points += 1;
  if (state.boutique.dressId !== 'starter_lounge' || state.boutique.crownId !== 'none') points += 1;
  return Math.round((points / 6) * 100);
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  selectedId,
  makeovers,
  onSelectPrincess,
  onBackHome,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5FA] via-[#FCE7F3] to-[#F3E8FF] text-[#3B123A] flex flex-col">
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-6">
        <button
          type="button"
          onClick={() => {
            soundFX.playTap();
            onBackHome();
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 border border-pink-200 text-sm font-semibold text-[#4A1044] hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <span className="font-display text-lg sm:text-xl font-bold text-[#4A1044] whitespace-nowrap">
          Princess Beauty Salon
        </span>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-6">
        <div className="max-w-2xl mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#4A1044] text-balance">
            Choose Your Princess Guest
          </h1>
          <p className="text-[#6B2665] mt-2 text-base">
            Select a princess to begin her spa day, hair styling, makeup, nail art, and royal
            wardrobe transformation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRINCESSES.map((princess: PrincessPreset) => {
            const state = makeovers[princess.id];
            const pct = getCompletionPercent(state);
            const isSelected = selectedId === princess.id;

            return (
              <button
                key={princess.id}
                type="button"
                onClick={() => {
                  soundFX.playSparkle();
                  onSelectPrincess(princess.id);
                }}
                className={`group text-left rounded-3xl p-4 bg-white/90 border transition-all duration-200 flex flex-col cursor-pointer hover:-translate-y-1 hover:shadow-xl ${
                  isSelected
                    ? 'border-pink-500 ring-2 ring-pink-300 shadow-lg shadow-pink-500/15'
                    : 'border-pink-200/80 shadow-md shadow-purple-900/5'
                }`}
              >
                <div className="relative w-full aspect-[4/4.2] rounded-2xl overflow-hidden bg-gradient-to-b from-pink-50 via-purple-50 to-pink-100 mb-4 flex items-center justify-center">
                  <PrincessAvatar
                    princess={princess}
                    state={state}
                    viewMode="portrait"
                    className="w-full h-full"
                  />
                  {isSelected && (
                    <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-pink-600 text-white flex items-center justify-center shadow">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-display text-xl font-bold text-[#4A1044]">
                    {princess.name}
                  </h2>
                </div>
                <p className="text-xs font-medium text-purple-700 mt-0.5">
                  {princess.title}
                </p>
                <p className="text-sm text-[#6E356B] mt-2 leading-relaxed flex-1">
                  {princess.bio}
                </p>

                <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-purple-800 tabular-nums">
                    {pct === 0 ? 'Ready for Spa' : `${pct}% Styled`}
                  </span>
                  <span className="inline-flex items-center gap-1 text-pink-600 group-hover:translate-x-0.5 transition-transform">
                    <Sparkles className="w-3.5 h-3.5" />
                    Style Now
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
