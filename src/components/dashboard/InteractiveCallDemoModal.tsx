import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Heart,
  Smile,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Radio,
  Zap,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { WaveformVisualizer } from '../common/WaveformVisualizer';
import { CallRecord } from '../../types/database';
import { useTwoWayVoiceCall } from '../../utils/useTwoWayVoiceCall';

interface InteractiveCallDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCallCompleted?: (call: CallRecord) => void;
}

export const InteractiveCallDemoModal: React.FC<InteractiveCallDemoModalProps> = ({
  isOpen,
  onClose,
  onCallCompleted,
}) => {
  const [typedInput, setTypedInput] = useState('');
  const [mobileInsightsExpanded, setMobileInsightsExpanded] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const {
    callActive,
    voiceStatus,
    seconds,
    turns,
    interimTranscript,
    isMicMuted,
    micSupported,
    micPermissionGranted,
    micPermissionError,
    audioLevel,
    formatTimer,
    startCall,
    endCall,
    toggleMute,
    sendTextTurn,
    interruptAiSpeech,
    requestMicrophoneAccess,
  } = useTwoWayVoiceCall();

  // Auto-scroll transcript to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, interimTranscript]);

  if (!isOpen) return null;

  // Handle ending call & building structured record
  const handleEndCall = () => {
    const duration = seconds;
    endCall();

    if (turns.length > 1 && onCallCompleted) {
      const callRecord: CallRecord = {
        id: `call-live-${Date.now()}`,
        business_id: 'biz-1',
        agent_id: 'agent-1',
        agent_name: 'Aria (Warm AI Screener)',
        workflow_id: 'wf-1',
        workflow_name: 'Software Developer Screening',
        candidate_id: 'cand-1',
        contact_name: 'Rahul Sharma (Live Microphone)',
        contact_phone: '+91 9876543212',
        direction: 'outbound',
        purpose: 'Candidate Screening',
        status: 'completed',
        outcome: 'qualified',
        duration_seconds: duration,
        duration_formatted: formatTimer(duration),
        selected_language: 'English',
        ai_disclosure_completed: true,
        started_at: new Date(Date.now() - duration * 1000).toISOString(),
        ended_at: new Date().toISOString(),
        ai_score: 94,
        has_recording: true,
        transcript: turns.map((t, idx) => ({
          id: t.id || `turn-${idx}`,
          call_id: `call-live-${Date.now()}`,
          speaker: t.speaker,
          timestamp_seconds: idx * 8,
          formatted_time: t.time,
          text: t.text,
        })),
        summary: {
          id: `sum-live-${Date.now()}`,
          call_id: `call-live-${Date.now()}`,
          experience_summary:
            'Two-way live interactive voice screening conversation completed with candidate via dynamic Gemini intelligence.',
          skills_identified: ['Full-Stack Development', 'Problem Solving', 'Communication'],
          expected_salary: '8 - 10 LPA',
          notice_period: '30 Days',
          availability: 'Immediate / 30 Days',
          communication_rating: 'Exceptional',
          interest_level: 'High',
          overall_score: 94,
          ai_recommendation:
            'Candidate engaged in dynamic voice dialogue, answered experience questions and demonstrated strong communication.',
        },
      };
      onCallCompleted(callRecord);
    }
  };

  const handleSendCustomText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!typedInput.trim()) return;
    sendTextTurn(typedInput);
    setTypedInput('');
  };

  // Suggested prompt pills to test spontaneous unexpected questions
  const samplePrompts = [
    'I have 3 years of experience with React, Node.js and TypeScript.',
    'What is the tech stack and tools your team uses?',
    'What is the salary range and package for this role?',
    'Is this position hybrid or can it be 100% remote?',
    'I am currently serving a 30-day notice period.',
    'Could you tell me what the next interview rounds look like?',
  ];

  // Dynamic extraction based on turns
  const conversationText = turns.map((t) => t.text).join(' ');
  const hasExperience = /(experience|react|node|python|java|sql|years|backend|frontend)/i.test(conversationText);
  const hasSalary = /(lpa|salary|ctc|package|lakh|\d+\s*lpa)/i.test(conversationText);
  const hasNotice = /(notice|immediate|days|weeks|serving|available)/i.test(conversationText);
  const hasLocation = /(bangalore|hyderabad|remote|hybrid|office|relocate)/i.test(conversationText);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl h-[96vh] sm:h-auto sm:max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-500/20 to-indigo-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30 shrink-0 shadow-sm">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-white truncate">
                  Aria · Live 2-Way Voice Call
                </h2>
                <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-950/60 text-pink-300 border border-pink-800/60 items-center gap-1">
                  <Heart className="w-2.5 h-2.5 text-pink-400 fill-pink-400" />
                  <span>Warm Female Voice</span>
                </span>
                <span className="hidden md:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950/80 text-cyan-300 border border-indigo-700/60 items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  <span>Gemini</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                Continuous microphone listening, dynamic turn-taking, barge-in interruption &amp; contextual understanding.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {callActive && (
              <button
                type="button"
                onClick={toggleMute}
                className={`min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors active:scale-95 ${
                  isMicMuted
                    ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
                title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMicMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                <span className="hidden sm:inline">{isMicMuted ? 'Muted' : 'Mic Active'}</span>
              </button>
            )}

            <button
              onClick={() => {
                if (callActive) handleEndCall();
                onClose();
              }}
              className="min-w-[40px] min-h-[40px] rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Call Control & Status Strip */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-2.5 text-xs shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {callActive ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span>Call Connected</span>
              </span>
            ) : (
              <span className="text-slate-400 flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                <span>Ready to Connect</span>
              </span>
            )}
            <span className="text-slate-600">·</span>
            <span className="font-mono text-cyan-400 text-xs">Duration: {formatTimer(seconds)}</span>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300 text-xs">
              <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse shrink-0" />
              <span>Full Duplex Audio</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!callActive ? (
              <button
                type="button"
                onClick={startCall}
                className="min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 via-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Start Two-Way Voice Call</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEndCall}
                className="min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call</span>
              </button>
            )}

            {/* Mobile Toggle for Insights Panel */}
            <button
              type="button"
              onClick={() => setMobileInsightsExpanded(!mobileInsightsExpanded)}
              className="lg:hidden min-h-[40px] px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
            >
              <span>Insights</span>
              {mobileInsightsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Microphone Permission Warning / Action Banner */}
        {micPermissionError && (
          <div className="px-4 sm:px-6 py-2.5 bg-amber-950/80 border-b border-amber-800 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="leading-snug">{micPermissionError}</span>
            </div>
            <button
              type="button"
              onClick={requestMicrophoneAccess}
              className="min-h-[36px] px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs self-start sm:self-auto shrink-0 transition-colors"
            >
              Enable Microphone
            </button>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 p-3 sm:p-6 overflow-y-auto">
          
          {/* Left Column: Audio Waveform, Live Transcript, Controls (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-3 sm:space-y-4">
            
            {/* Live Visualizer & Dynamic State Banner */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-inner space-y-2.5 sm:space-y-3 shrink-0">
              <div className="flex items-center justify-between text-xs gap-2 flex-wrap">
                {/* Voice Status Pill */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {voiceStatus === 'ai_speaking' && (
                    <span className="px-2.5 py-1 rounded-full bg-pink-950/80 border border-pink-700 text-pink-300 font-medium text-xs flex items-center gap-1.5 animate-pulse">
                      <Volume2 className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span>Aria is Speaking... (Interrupt anytime)</span>
                    </span>
                  )}
                  {voiceStatus === 'user_speaking' && (
                    <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-700 text-cyan-300 font-medium text-xs flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-cyan-400 animate-bounce shrink-0" />
                      <span>Listening: You are Speaking...</span>
                    </span>
                  )}
                  {voiceStatus === 'thinking' && (
                    <span className="px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-700 text-indigo-300 font-medium text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0" />
                      <span>Understanding with Gemini...</span>
                    </span>
                  )}
                  {voiceStatus === 'interrupted' && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-700 text-amber-300 font-medium text-xs flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Interrupted · Listening to you</span>
                    </span>
                  )}
                  {voiceStatus === 'listening' && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-medium text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                      <span>Microphone Active · Speak anytime</span>
                    </span>
                  )}
                  {voiceStatus === 'idle' && (
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-medium text-xs flex items-center gap-1.5">
                      <span>Ready to Start</span>
                    </span>
                  )}
                  {voiceStatus === 'permission_denied' && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-700 text-rose-300 font-medium text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Text Mode Active</span>
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
                  {callActive && (isMicMuted ? 'Mic Muted' : 'Continuous Stream')}
                </div>
              </div>

              {/* Dynamic Waveform Visualizer */}
              <div className="py-1">
                <WaveformVisualizer
                  isActive={callActive && (voiceStatus === 'ai_speaking' || voiceStatus === 'user_speaking' || voiceStatus === 'thinking')}
                  barCount={36}
                  height={38}
                  variant="glow"
                />
              </div>

              {/* Live Interim Speech Preview */}
              {interimTranscript && (
                <div className="p-2 sm:p-2.5 rounded-xl bg-indigo-950/40 border border-cyan-800/40 text-xs text-cyan-200 animate-in fade-in flex items-start gap-2">
                  <span className="font-mono text-[10px] uppercase text-cyan-400 mt-0.5 shrink-0">Hearing:</span>
                  <p className="italic leading-relaxed break-words">&ldquo;{interimTranscript}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Conversation Transcript Stream */}
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 sm:space-y-3 min-h-[220px] max-h-[300px] sm:max-h-[360px] overflow-y-auto">
              {turns.length === 0 ? (
                <div className="py-12 sm:py-16 text-center text-slate-500 text-xs space-y-2 px-2">
                  <p className="font-medium text-slate-400">
                    Tap <strong className="text-pink-400">&ldquo;Start Two-Way Voice Call&rdquo;</strong> to begin.
                  </p>
                  <p className="text-[11px] text-slate-600 max-w-sm mx-auto">
                    Aria will greet you aloud. You can speak into your microphone, interrupt her at any point, or ask unexpected questions.
                  </p>
                </div>
              ) : (
                turns.map((t) => (
                  <div
                    key={t.id}
                    className={`p-3 sm:p-3.5 rounded-2xl border text-xs leading-relaxed transition-all ${
                      t.speaker === 'ai'
                        ? 'bg-slate-900/90 border-pink-900/40 text-slate-200 mr-2 sm:mr-4'
                        : 'bg-indigo-950/40 border-cyan-800/40 text-white ml-2 sm:ml-4'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-1.5">
                      <div className="flex items-center gap-1.5 font-sans font-semibold">
                        <span className={t.speaker === 'ai' ? 'text-pink-400 flex items-center gap-1' : 'text-cyan-400 flex items-center gap-1'}>
                          {t.speaker === 'ai' ? (
                            <>
                              <Heart className="w-3 h-3 text-pink-400 fill-pink-400 shrink-0" />
                              <span>Aria (Talent Specialist)</span>
                            </>
                          ) : (
                            <>
                              <User className="w-3 h-3 text-cyan-400 shrink-0" />
                              <span>You (Candidate / Caller)</span>
                            </>
                          )}
                        </span>
                        {t.interrupted && (
                          <span className="px-1.5 py-0.2 bg-amber-950 text-amber-300 text-[9px] rounded border border-amber-800">
                            Interrupted
                          </span>
                        )}
                      </div>
                      <span>{t.time}</span>
                    </div>
                    <p className="text-slate-100 break-words">{t.text}</p>
                  </div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>

            {/* Input & Suggested Questions Bar */}
            {callActive && (
              <div className="space-y-2 pt-1">
                {/* Spontaneous Questions Suggestions */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-slate-400 scrollbar-none">
                  <span className="shrink-0 font-medium text-slate-500 text-[10px]">Quick Prompts:</span>
                  {samplePrompts.slice(0, 3).map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendTextTurn(prompt)}
                      className="shrink-0 min-h-[32px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-pink-900/40 hover:text-white border border-slate-700/80 text-slate-300 text-[10px] transition-colors active:scale-95 text-left"
                    >
                      &ldquo;{prompt}&rdquo;
                    </button>
                  ))}
                </div>

                {/* Text Fallback Bar */}
                <form onSubmit={handleSendCustomText} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={typedInput}
                    onChange={(e) => setTypedInput(e.target.value)}
                    placeholder="Speak into microphone or type unexpected question..."
                    className="flex-1 min-h-[44px] px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!typedInput.trim()}
                    className="min-w-[44px] min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md shadow-indigo-600/30 active:scale-95 shrink-0"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* Right Column: Real-Time Intelligence & Candidate Insights (5 cols) */}
          <div className={`lg:col-span-5 space-y-4 ${mobileInsightsExpanded ? 'block' : 'hidden lg:block'}`}>
            
            {/* Live Context & Candidate Qualification Extraction */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Real-Time Screening Insights</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  Gemini Active
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Position:</span>
                  <span className="font-semibold text-white">Software Developer</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Technical Skills:</span>
                  <span className={`font-semibold ${hasExperience ? 'text-emerald-400' : 'text-slate-500 italic'}`}>
                    {hasExperience ? 'Extracted from speech' : 'Listening...'}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Expected Compensation:</span>
                  <span className={`font-semibold ${hasSalary ? 'text-emerald-400' : 'text-slate-500 italic'}`}>
                    {hasSalary ? 'Captured in conversation' : 'Listening...'}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Notice Period / Join Date:</span>
                  <span className={`font-semibold ${hasNotice ? 'text-emerald-400' : 'text-slate-500 italic'}`}>
                    {hasNotice ? 'Captured in conversation' : 'Listening...'}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Work Arrangement Fit:</span>
                  <span className={`font-semibold ${hasLocation ? 'text-cyan-400' : 'text-slate-500 italic'}`}>
                    {hasLocation ? 'Hybrid / Discussed' : 'Listening...'}
                  </span>
                </div>
              </div>

              {/* Dynamic Behavioral Tone Verification */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-pink-400 font-semibold">
                  <Heart className="w-3.5 h-3.5 fill-pink-400 shrink-0" />
                  <span>Aria Voice Synthesis &amp; Persona</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Natural female voice with relaxed cadence, polite conversational transitions, and real-time barge-in interruption.
                </p>
              </div>
            </div>

            {/* Two-Way Interaction Highlights Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 text-xs space-y-2">
              <span className="font-semibold text-slate-300 block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Two-Way Conversation Capabilities:</span>
              </span>
              <ul className="space-y-1.5 text-slate-400 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>Microphone Stream:</strong> Continuous speech recognition across iOS, Android &amp; Desktop.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>Barge-In Interruption:</strong> Speak while Aria is talking; audio terminates instantly.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>Unexpected Questions:</strong> Ask about tech stack, culture, or compensation anytime.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>Memory &amp; Context:</strong> Gemini maintains your prior answers throughout the call.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Footer */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="truncate">VoxHire.AI Two-Way Voice Engine · Online</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (callActive) handleEndCall();
              onClose();
            }}
            className="min-h-[36px] px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Call
          </button>
        </div>

      </div>
    </div>
  );
};
