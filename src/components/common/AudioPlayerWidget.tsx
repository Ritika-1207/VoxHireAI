import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { WaveformVisualizer } from './WaveformVisualizer';

interface AudioPlayerWidgetProps {
  title?: string;
  speakerName?: string;
  durationSeconds?: number;
  onTimeUpdate?: (seconds: number) => void;
  className?: string;
}

export const AudioPlayerWidget: React.FC<AudioPlayerWidgetProps> = ({
  title = 'Call Recording Playback',
  speakerName = 'Recruitment Assistant & Candidate',
  durationSeconds = 261, // 4m 21s
  onTimeUpdate,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // Play synthetic tone pulse on click to give genuine audio feedback
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(isMuted ? 0 : 0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // AudioContext may be restricted by browser policy before user gesture
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSeconds((prev) => {
          if (prev >= durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 1;
          onTimeUpdate?.(next);
          return next;
        });
      }, 1000 / playbackRate);
    }
    return () => clearInterval(interval);
  }, [isPlaying, durationSeconds, playbackRate, onTimeUpdate]);

  const togglePlay = () => {
    if (!isPlaying) {
      playChime();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentSeconds(0);
    setIsPlaying(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, (currentSeconds / durationSeconds) * 100);

  return (
    <div className={`p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-lg backdrop-blur-md ${className}`}>
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</div>
          <div className="text-sm font-medium text-slate-200">{speakerName}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaybackRate(playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1)}
            className="px-2 py-1 text-xs font-mono rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Change Playback Speed"
          >
            {playbackRate}x
          </button>
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Waveform Visualization area */}
      <div className="relative py-2 px-3 bg-slate-950/60 rounded-lg border border-slate-800/80 mb-3">
        <WaveformVisualizer isActive={isPlaying} barCount={42} height={40} />
      </div>

      {/* Seek scrub bar */}
      <div className="space-y-1.5">
        <div
          className="relative h-2 bg-slate-800 rounded-full cursor-pointer overflow-hidden group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            setCurrentSeconds(Math.floor(clickPos * durationSeconds));
          }}
        >
          <div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>{formatTime(currentSeconds)}</span>
          <span>{formatTime(durationSeconds)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mt-3 pt-2 border-t border-slate-800/60">
        <button
          type="button"
          onClick={handleReset}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors"
          title="Restart from beginning"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={togglePlay}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-transform active:scale-95"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        <div className="text-xs text-slate-400 flex items-center gap-1.5 ml-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>HD Stereo Telephony Stored</span>
        </div>
      </div>
    </div>
  );
};
