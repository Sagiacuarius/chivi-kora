// === Chiví Korá — UI: useSound ===
// Hook para sonidos del juego via Web Audio API.
// Sin archivos externos — genera tonos sintéticos.

import { useState, useRef, useCallback } from 'react';

type SoundType = 'move' | 'capture' | 'victory_yaguarete' | 'victory_perros';

export function useSound() {
  const [muted, setMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    // Reanudar si el browser suspendió el contexto (política de autoplay)
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  const play = useCallback((type: SoundType) => {
    if (muted) return;

    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      switch (type) {
        case 'move': {
          // Tono corto suave — movimiento normal
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(520, now + 0.06);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        }
        case 'capture': {
          // Tono más grave y corto — captura
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }
        case 'victory_yaguarete': {
          // Melodía ascendente — victoria yaguareté
          const notes = [440, 554, 659, 880];
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.12);
            gain.gain.setValueAtTime(0, now + i * 0.12);
            gain.gain.linearRampToValueAtTime(0.18, now + i * 0.12 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.25);
            osc.start(now + i * 0.12);
            osc.stop(now + i * 0.12 + 0.25);
          });
          break;
        }
        case 'victory_perros': {
          // Melodía descendente — victoria perros
          const notes = [660, 523, 392, 330];
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.15);
            gain.gain.setValueAtTime(0, now + i * 0.15);
            gain.gain.linearRampToValueAtTime(0.16, now + i * 0.15 + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.3);
            osc.start(now + i * 0.15);
            osc.stop(now + i * 0.15 + 0.3);
          });
          break;
        }
      }
    } catch (e) {
      // Audio bloqueado por el browser (política de autoplay): esperado, no grave
      console.debug('useSound: audio no disponible', e);
    }
  }, [muted, getAudioContext]);

  const playMove = useCallback(() => play('move'), [play]);
  const playCapture = useCallback(() => play('capture'), [play]);
  const playVictoryYaguarete = useCallback(() => play('victory_yaguarete'), [play]);
  const playVictoryPerros = useCallback(() => play('victory_perros'), [play]);

  return {
    muted,
    setMuted,
    playMove,
    playCapture,
    playVictoryYaguarete,
    playVictoryPerros,
  };
}