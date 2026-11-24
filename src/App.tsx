/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CharacterSelect } from './components/CharacterSelect';
import { HomeScreen } from './components/HomeScreen';
import { RevealStudio } from './components/RevealStudio';
import { SalonWorkspace } from './components/SalonWorkspace';
import { createInitialMakeoverState, PRINCESSES } from './data/salonData';
import {
  GameScreen,
  PrincessMakeoverState,
  StudioBackdropId,
} from './types/salon';
import { soundFX } from './utils/sound';

function buildInitialMakeovers(): Record<string, PrincessMakeoverState> {
  const map: Record<string, PrincessMakeoverState> = {};
  for (const p of PRINCESSES) {
    map[p.id] = createInitialMakeoverState(p);
  }
  return map;
}

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('HOME');
  const [selectedPrincessId, setSelectedPrincessId] = useState<string>(PRINCESSES[0].id);
  const [makeovers, setMakeovers] = useState<Record<string, PrincessMakeoverState>>(
    buildInitialMakeovers
  );
  const [muted, setMuted] = useState<boolean>(false);

  const activePrincess =
    PRINCESSES.find((p) => p.id === selectedPrincessId) || PRINCESSES[0];
  const activeState = makeovers[activePrincess.id];

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundFX.setMuted(next);
    if (!next) {
      soundFX.playTap();
    }
  };

  const handleUpdateActiveState = (
    updater: (prev: PrincessMakeoverState) => PrincessMakeoverState
  ) => {
    setMakeovers((prev) => ({
      ...prev,
      [activePrincess.id]: updater(prev[activePrincess.id]),
    }));
  };

  const handleResetPrincess = () => {
    setMakeovers((prev) => ({
      ...prev,
      [activePrincess.id]: createInitialMakeoverState(activePrincess),
    }));
  };

  const handleChangeBackdrop = (backdrop: StudioBackdropId) => {
    handleUpdateActiveState((prev) => ({
      ...prev,
      studioBackdrop: backdrop,
    }));
  };

  if (screen === 'HOME') {
    return (
      <HomeScreen
        onPlay={() => setScreen('SALON')}
        onChoosePrincess={() => setScreen('CHARACTER_SELECT')}
        muted={muted}
        onToggleMute={handleToggleMute}
      />
    );
  }

  if (screen === 'CHARACTER_SELECT') {
    return (
      <CharacterSelect
        selectedId={activePrincess.id}
        makeovers={makeovers}
        onSelectPrincess={(id) => {
          setSelectedPrincessId(id);
          setScreen('SALON');
        }}
        onBackHome={() => setScreen('HOME')}
      />
    );
  }

  if (screen === 'REVEAL') {
    return (
      <RevealStudio
        princess={activePrincess}
        state={activeState}
        onChangeBackdrop={handleChangeBackdrop}
        onBackToSalon={() => setScreen('SALON')}
        onStyleAnother={() => setScreen('CHARACTER_SELECT')}
      />
    );
  }

  return (
    <SalonWorkspace
      princess={activePrincess}
      state={activeState}
      onUpdateState={handleUpdateActiveState}
      onResetPrincess={handleResetPrincess}
      onSwitchPrincess={() => setScreen('CHARACTER_SELECT')}
      onGoToReveal={() => setScreen('REVEAL')}
      muted={muted}
      onToggleMute={handleToggleMute}
    />
  );
}
