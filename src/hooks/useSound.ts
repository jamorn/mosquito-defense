// src/hooks/useSound.ts
import { useRef, useCallback } from 'react';
import { SoundSystem, SoundType } from '../game/engine/SoundSystem';

export function useSound() {
  const soundSystemRef = useRef<SoundSystem>(new SoundSystem());
  
  const play = useCallback((type: SoundType) => {
    soundSystemRef.current.play(type);
  }, []);
  
  const setEnabled = useCallback((enabled: boolean) => {
    soundSystemRef.current.setEnabled(enabled);
  }, []);
  
  const isEnabled = useCallback(() => {
    return soundSystemRef.current.isEnabled();
  }, []);
  
  return {
    play,
    setEnabled,
    isEnabled,
    soundSystem: soundSystemRef.current,
  };
}