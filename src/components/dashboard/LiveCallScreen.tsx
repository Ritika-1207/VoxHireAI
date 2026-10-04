import React, { useState, useEffect } from 'react';
import {
  Phone,
  PhoneOff,
  User,
  Shield,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Headphones,
  Globe,
  Heart,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import { WaveformVisualizer } from '../common/WaveformVisualizer';
import { StatusBadge } from '../common/StatusBadge';
import { INITIAL_CALLS, AVATAR_RAHUL } from '../../data/mockData';
import { speakNaturalConversational, stopNaturalSpeech } from '../../utils/voiceSynthesis';

interface LiveCallScreenProps {
  onViewCandidateProfile?: (candidateId: string) => void;
  onOpenTwoWayVoice?: () => void;
}

export const LiveCallScreen: React.FC<LiveCallScreenProps> = ({
  onViewCandidateProfile,
  onOpenTwoWayVoice,
}) => {
  const [callActive, setCallActive] = useState(true);
  const [seconds, setSeconds] = useState(261); // 04:21
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioSpeaking, setIsAudioSpeaking] = useState(false);
  const [activeTurnIndex, setActiveTurnIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Language demonstration toggle
  const [previewLanguage, setPreviewLanguage] = useState<'en' | 'hi' | 'es'>('en');

  const rahulCall = INITIAL_CALLS[0];
  const transcriptTurns = rahulCall.transcript;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callActive) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callActive]);

  useEffect(() => {
    return () => {
      stopNaturalSpeech();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleEndCall = () => {
    setCallActive(false);
    stopNaturalSpeech();
    setIsAudioSpeaking(false);
    showToast('Call finalized and saved. Transcript & AI summary stored in database.');
  };

  const handleTransferToRecruiter = () => {
    showToast('Transferring call to Lead Recruiter Priya Sundaram (+91-98700-11223)...');
  };

  const formatDuration = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Natural warm female voice synthesis trigger using Aria
  const speakCurrentAITurn = (text: string, lang: string = previewLanguage) => {
    speakNaturalConversational(text, lang, {
      onStart: () => setIsAudioSpeaking(true),
      onEnd: () => setIsAudioSpeaking(false),
      onError: () => setIsAudioSpeaking(false),
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-indigo-900/90 border border-indigo-500/50 rounded-xl text-xs text-indigo-200 flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Banner / Call Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={AVATAR_RAHUL}
              alt="Rahul Sharma"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-xl object-cover border-2 border-pink-500/40 shadow-md"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {callActive && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">Call Screening Assistant</h1>
              <StatusBadge status={callActive ? 'Active' : 'Completed'} size="sm" />
              <span className="px-2 py-0.5 rounded-full bg-pink-950/60 border border-pink-800/60 text-[10px] text-pink-300 font-medium flex items-center gap-1">
                <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                <span>Aria Voice (Warm &amp; Feminine)</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-400">
              <span>
                <strong className="text-slate-300">Candidate:</strong> Rahul Sharma
              </span>
              <span>·</span>
              <span className="font-mono">
                <strong className="text-slate-300">Phone:</strong> +91 9876543212
              </span>
              <span>·</span>
              <span>
                <strong className="text-slate-300">Talent Specialist:</strong> Aria
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Smile className="w-3.5 h-3.5" />
                <span>Smooth Human-Like Tone</span>
              </span>
            </div>
          </div>
        </div>

        {/* Call Timer & Quick Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
              Call Duration
            </span>
            <span className="text-lg font-mono font-bold text-cyan-400 tabular-nums">
              {formatDuration(seconds)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {onOpenTwoWayVoice && (
              <button
                type="button"
                onClick={onOpenTwoWayVoice}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-md shadow-pink-600/30 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Start Live 2-Way Voice Call</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleTransferToRecruiter}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Headphones className="w-3.5 h-3.5 text-indigo-400" />
              <span>Transfer to Recruiter</span>
            </button>

            {callActive ? (
              <button
                type="button"
                onClick={handleEndCall}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition-colors"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setCallActive(true);
                  setSeconds(0);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Restart Call</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Waveform & Live Transcript (Left) + AI Conversation Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Live Audio Stream & Full Transcript */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Live Waveform Container */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${callActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                <span className="font-medium text-slate-300">
                  {callActive ? 'Live Audio Stream (Aria Voice)' : 'Audio Stream Paused'}
                </span>
                <span className="text-slate-400 font-mono">· Opus HD 48kHz</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-pink-400 text-[11px]">Emotional Tone: Warm &amp; Friendly</span>
              </div>
            </div>

            <div className="py-4 px-3 bg-slate-950 rounded-xl border border-slate-800/80">
              <WaveformVisualizer
                isActive={callActive || isAudioSpeaking}
                barCount={48}
                height={52}
                variant="glow"
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>Active Language: <strong>English (Caller Confirmed)</strong></span>
              </span>
              <button
                type="button"
                onClick={() => speakCurrentAITurn("Hello Rahul! This is Aria from VoxHire.AI calling regarding your application for the Software Developer position. Before we begin, which language are you most comfortable speaking in?")}
                className="text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Play Aria's Warm Female Voice</span>
              </button>
            </div>
          </div>

          {/* Conversation Transcript Container */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div>
                <h3 className="text-sm font-semibold text-white">Live Conversation Transcript</h3>
                <p className="text-xs text-slate-400">Natural greeting &amp; language comfort check executed at Turn 1</p>
              </div>

              {/* Language Switcher for viewing dialogue */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
                <span className="text-[11px] text-slate-500 px-2 font-mono">Simulate:</span>
                <button
                  type="button"
                  onClick={() => setPreviewLanguage('en')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    previewLanguage === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLanguage('hi')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    previewLanguage === 'hi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  हिंदी
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLanguage('es')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    previewLanguage === 'es' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Español
                </button>
              </div>
            </div>

            <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-2">
              {transcriptTurns.map((turn, idx) => {
                const isAI = turn.speaker === 'ai';
                return (
                  <div
                    key={turn.id}
                    onClick={() => setActiveTurnIndex(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isAI
                        ? 'bg-slate-950/70 border-pink-950/50 text-slate-200'
                        : 'bg-indigo-950/20 border-cyan-900/30 text-slate-100'
                    } ${activeTurnIndex === idx ? 'ring-1 ring-pink-500' : ''}`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                      <div className="flex items-center gap-1.5 font-sans font-semibold">
                        <span className={isAI ? 'text-pink-400 flex items-center gap-1' : 'text-cyan-400'}>
                          {isAI && <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />}
                          {isAI ? 'Aria (Talent Specialist)' : 'Candidate (Rahul Sharma)'}
                        </span>
                        {idx === 0 && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 text-[9px] border border-indigo-800">
                            Introduction &amp; Language Check
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{turn.formatted_time}</span>
                        {isAI && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakCurrentAITurn(turn.text);
                            }}
                            className="p-1 text-slate-400 hover:text-pink-300 transition-colors"
                            title="Listen to Aria speaking with warm pauses"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                      &ldquo;{turn.text}&rdquo;
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: AI Conversation Summary (Decision Support) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">AI Conversation Summary</h3>
                <p className="text-xs text-slate-400">Structured candidate data extracted in real-time</p>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-mono text-xs font-bold">
                Score: 92/100
              </div>
            </div>

            {/* Extracted Structured Fields */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400 font-medium">Spoken Language:</span>
                <span className="font-semibold text-emerald-400 text-right">English (Caller Preference)</span>
              </div>

              <div className="flex items-start justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400 font-medium">Experience:</span>
                <span className="font-semibold text-slate-200 text-right">2 Years</span>
              </div>

              <div className="flex items-start justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400 font-medium">Primary Skills:</span>
                <span className="font-semibold text-indigo-300 text-right">Java, SQL, Spring Boot</span>
              </div>

              <div className="flex items-start justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400 font-medium">Expected Salary:</span>
                <span className="font-semibold text-emerald-400 text-right">₹6 LPA</span>
              </div>

              <div className="flex items-start justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400 font-medium">Availability:</span>
                <span className="font-semibold text-slate-200 text-right">30 Days</span>
              </div>

              <div className="flex items-start justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400 font-medium">Communication:</span>
                <span className="font-semibold text-cyan-400 text-right">Good (Natural &amp; Articulate)</span>
              </div>

              <div className="flex items-start justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400 font-medium">Interest Level:</span>
                <span className="font-semibold text-emerald-400 text-right">High</span>
              </div>
            </div>

            {/* AI Recommendation Box (Decision Support) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                <Shield className="w-4 h-4" />
                <span>AI Recommendation</span>
              </div>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                &ldquo;Suitable for recruiter review.&rdquo;
              </p>
              <div className="pt-2 text-[11px] text-slate-400 leading-snug border-t border-slate-800/60">
                Candidate meets core Java experience requirements, verified language preference in Turn 1, and demonstrates clear conversational alignment.
              </div>
            </div>

            {/* Important Disclaimer Note */}
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <p className="text-[11px] leading-relaxed">
                <strong className="font-semibold">Human Governance Notice:</strong> The AI recommendation is designed strictly as decision support, NOT as an automatic hiring decision. Final candidate assessment requires recruiter evaluation.
              </p>
            </div>

            {/* Candidate Profile Button */}
            {onViewCandidateProfile && (
              <button
                type="button"
                onClick={() => onViewCandidateProfile('cand-1')}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-colors"
              >
                <span>Open Full Candidate Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
