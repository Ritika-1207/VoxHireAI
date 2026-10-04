import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Volume2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { WaveformVisualizer } from '../common/WaveformVisualizer';
import { HERO_SOUNDWAVE_BG } from '../../data/mockData';

interface HeroSectionProps {
  onStartScreening: () => void;
  onWatchDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartScreening,
  onWatchDemo,
}) => {
  const [callDurationSeconds, setCallDurationSeconds] = useState(222); // 03:42
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const dialogueLines = [
    {
      speaker: 'Aria (Talent Specialist)',
      text: "Hello! This is Aria from VoxHire.AI calling regarding your job application. Before we begin, which language are you most comfortable speaking in?",
    },
    {
      speaker: 'Candidate',
      text: 'Hi Aria! I am comfortable speaking in English, but Hindi works great too.',
    },
    {
      speaker: 'Aria (Talent Specialist)',
      text: "Wonderful! We'll continue in English... Could you tell me about your hands-on development experience and core tech stack?",
    },
    {
      speaker: 'Candidate',
      text: 'I have around two years of production experience building Java Spring Boot microservices.',
    },
    {
      speaker: 'Aria (Talent Specialist)',
      text: 'That sounds great! What is your current annual package and expected CTC in LPA?',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDurationSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const dialogTimer = setInterval(() => {
      setCurrentLineIndex((prev) => (prev + 1) % dialogueLines.length);
    }, 4500);
    return () => clearInterval(dialogTimer);
  }, [dialogueLines.length]);

  const formatSeconds = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800/60 bg-gradient-to-b from-[#0b0f19] via-[#0d1424] to-[#0b0f19]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Enterprise Voice Screening Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] text-balance">
              Your AI Voice Agent for Smarter Business Calls.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Automate calls, screen candidates, qualify leads, and capture every important conversation — while your team focuses on decisions that matter.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <button
                type="button"
                onClick={onStartScreening}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[48px] rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Start Screening</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onWatchDemo}
                className="flex items-center justify-center gap-2.5 px-5 py-3.5 min-h-[48px] rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold transition-all hover:border-slate-600 active:scale-[0.98]"
              >
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                <span>Watch Interactive Demo</span>
              </button>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero telephony hardware setup</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Human-in-the-loop oversight</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Call Status Card & Waveform */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl p-6 bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
              {/* Optional background subtle texture */}
              <div
                className="absolute inset-0 opacity-10 rounded-2xl pointer-events-none bg-cover bg-center"
                style={{ backgroundImage: `url(${HERO_SOUNDWAVE_BG})` }}
              />

              {/* Call Header */}
              <div className="relative flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Volume2 className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Aria</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-950/80 border border-pink-700/60 text-pink-300 font-medium">
                        Natural Warm Female Voice
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium ml-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Active Call
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Warm &amp; Natural Female Voice · Multi-Language</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-mono">Duration</span>
                  <span className="text-sm font-mono font-bold text-white tabular-nums">
                    {formatSeconds(callDurationSeconds)}
                  </span>
                </div>
              </div>

              {/* Live Waveform Centerpiece */}
              <div className="relative my-5 py-4 px-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 px-1">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Bi-directional Voice Stream
                  </span>
                  <span className="font-mono text-cyan-400">Low Latency &lt; 260ms</span>
                </div>
                <WaveformVisualizer isActive={true} barCount={38} height={46} />
              </div>

              {/* Live Dialogue Stream */}
              <div className="relative space-y-3 p-3.5 bg-slate-950/50 rounded-xl border border-slate-800/50 min-h-[92px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-400">
                    {dialogueLines[currentLineIndex].speaker}:
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Live Transcript</span>
                </div>
                <p className="text-sm text-slate-200 italic leading-snug">
                  &ldquo;{dialogueLines[currentLineIndex].text}&rdquo;
                </p>
              </div>

              {/* Call Status Footer */}
              <div className="relative mt-4 pt-3 flex items-center justify-between border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-pink-300 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                    Conversing with Aria (Warm &amp; Natural Tone)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onWatchDemo}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Test Aria Voice →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Below Hero Trust-Style Metrics */}
        <div className="mt-16 pt-10 border-t border-slate-800/70">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                10K+
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                Calls Automated
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                95%+
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                Information Captured
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                24/7
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                AI Availability
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                60%
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                Less Manual Screening
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
