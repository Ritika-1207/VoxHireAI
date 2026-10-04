import React, { useEffect, useState } from 'react';

interface WaveformVisualizerProps {
  isActive?: boolean;
  barCount?: number;
  height?: number;
  className?: string;
  variant?: 'minimal' | 'glow' | 'dense';
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isActive = true,
  barCount = 36,
  height = 54,
  className = '',
  variant = 'glow',
}) => {
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: barCount }, (_, i) => {
      // Natural bell curve pattern
      const normalized = Math.sin((i / (barCount - 1)) * Math.PI);
      return Math.max(0.18, normalized * 0.75 + 0.15);
    })
  );

  useEffect(() => {
    if (!isActive) {
      setHeights(Array.from({ length: barCount }, () => 0.15));
      return;
    }

    const interval = setInterval(() => {
      setHeights((prev) =>
        prev.map((_, i) => {
          const envelope = Math.sin((i / (barCount - 1)) * Math.PI);
          const jitter = (Math.random() * 0.65 + 0.35) * envelope;
          return Math.max(0.15, Math.min(1.0, jitter));
        })
      );
    }, 120);

    return () => clearInterval(interval);
  }, [isActive, barCount]);

  return (
    <div
      className={`flex items-center justify-center gap-[3px] select-none overflow-hidden max-w-full ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      {heights.map((h, idx) => {
        // Gradient color transition from cyan to indigo to purple
        const ratio = idx / barCount;
        const barColor =
          ratio < 0.35
            ? 'bg-cyan-400'
            : ratio < 0.7
            ? 'bg-indigo-400'
            : 'bg-violet-400';

        const glow =
          isActive && variant === 'glow' && h > 0.6
            ? 'shadow-[0_0_8px_rgba(99,102,241,0.5)]'
            : '';

        return (
          <div
            key={idx}
            className={`w-[3px] rounded-full transition-all duration-150 ease-out ${
              isActive ? barColor : 'bg-slate-700/60'
            } ${glow}`}
            style={{
              height: `${Math.round(h * height)}px`,
              opacity: isActive ? 0.9 : 0.35,
            }}
          />
        );
      })}
    </div>
  );
};
