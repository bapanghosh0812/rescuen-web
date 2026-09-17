import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, ShieldAlert, Siren } from 'lucide-react';

interface SirenSynthesizerProps {
  onSirenStateChange?: (active: boolean) => void;
  externalActive?: boolean;
}

export default function SirenSynthesizer({ onSirenStateChange, externalActive = false }: SirenSynthesizerProps) {
  const [isActive, setIsActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Sync with external triggers
  useEffect(() => {
    if (externalActive !== isActive) {
      if (externalActive) {
        startSirenSound();
      } else {
        stopSirenSound();
      }
    }
  }, [externalActive]);

  useEffect(() => {
    return () => {
      stopSirenSound();
    };
  }, []);

  const startSirenSound = () => {
    try {
      // Create audio context safely
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sine';

      // Set frequency sweep for the classic warning siren frequency
      osc1.frequency.setValueAtTime(300, ctx.currentTime);
      osc2.frequency.setValueAtTime(440, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime); // keep it audible but safe!

      // Connect oscillators to gain, then destination
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
      gainNodeRef.current = gain;
      setIsActive(true);
      if (onSirenStateChange) onSirenStateChange(true);

      // Periodically sweep the pitch high and low (siren effect)
      let time = 0;
      const interval = window.setInterval(() => {
        if (!audioContextRef.current) return;
        const currentCtx = audioContextRef.current;
        const targetFreq = 400 + Math.sin(time) * 250; // wail frequencies
        osc1.frequency.exponentialRampToValueAtTime(targetFreq, currentCtx.currentTime + 0.15);
        osc2.frequency.exponentialRampToValueAtTime(targetFreq * 1.2, currentCtx.currentTime + 0.15);
        time += 0.5;
      }, 150);

      intervalRef.current = interval;
    } catch (e) {
      console.error('Failed to initialize audio siren:', e);
      setIsActive(true); // Still enable visual flashing indicator at least
      if (onSirenStateChange) onSirenStateChange(true);
    }
  };

  const stopSirenSound = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    try {
      if (osc1Ref.current) {
        oscRefStop(osc1Ref.current);
        osc1Ref.current = null;
      }
      if (osc2Ref.current) {
        oscRefStop(osc2Ref.current);
        osc2Ref.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      audioContextRef.current = null;
    } catch (e) {
      console.error('Error stopping siren audio:', e);
    }
    setIsActive(false);
    if (onSirenStateChange) onSirenStateChange(false);
  };

  const oscRefStop = (osc: OscillatorNode) => {
    try {
      osc.stop();
      osc.disconnect();
    } catch (err) {}
  };

  const toggleSiren = () => {
    if (isActive) {
      stopSirenSound();
    } else {
      startSirenSound();
    }
  };

  return (
    <div 
      id="siren-synthesizer-card" 
      className={`relative overflow-hidden bg-surface-container border ${isActive ? 'border-red-500/50' : 'border-white/10'} rounded-2xl p-6 transition-all duration-300`}
    >
      {/* Visual Flashing Siren Effect Background */}
      {isActive && (
        <div className="absolute inset-0 bg-red-500/5 pointer-events-none animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-blue-600/10 to-red-600/10 animate-infinite" />
        </div>
      )}

      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-lg ${isActive ? 'bg-red-500/20 text-red-400 animate-bounce' : 'bg-white/5 text-on-surface-variant'}`}>
              <Siren className="w-5 h-5" />
            </div>
            <h4 className="font-headline-md text-base text-on-surface font-semibold">Tactical Audio Siren</h4>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Emit a high-frequency acoustic wave to signal immediate local distress. Use this to attract eyes and target nearby responders.
          </p>
        </div>

        <button
          onClick={toggleSiren}
          id="toggle-siren-button"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-xs transition-all duration-300 ${
            isActive 
              ? 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-500/25 active:scale-95' 
              : 'bg-white/5 hover:bg-white/10 text-on-surface border border-white/10'
          }`}
        >
          {isActive ? (
            <>
              <VolumeX className="w-4 h-4" />
              Mute Siren
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              Sound Alarm
            </>
          )}
        </button>
      </div>

      {isActive && (
        <div className="mt-4 flex gap-1.5 items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-[10px] uppercase tracking-wider font-mono text-red-400 font-bold">
            Live Sonic Beacon Broadcast Active
          </span>
        </div>
      )}
    </div>
  );
}
