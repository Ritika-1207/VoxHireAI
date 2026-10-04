import React, { useState } from 'react';
import {
  Bot,
  Plus,
  PhoneCall,
  CheckCircle2,
  Sliders,
  Sparkles,
  Volume2,
  Activity,
  X,
  Globe,
  Heart,
  Smile,
} from 'lucide-react';
import { AIAgent, AIAgentPurpose, AIAgentStatus } from '../../types/database';
import { StatusBadge } from '../common/StatusBadge';
import { speakNaturalConversational } from '../../utils/voiceSynthesis';

interface AgentsViewProps {
  agents: AIAgent[];
  onToggleStatus: (agentId: string) => void;
  onCreateAgent: (agent: AIAgent) => void;
}

export const AgentsView: React.FC<AgentsViewProps> = ({
  agents,
  onToggleStatus,
  onCreateAgent,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState<AIAgentPurpose>('candidate_screening');
  const [voiceName, setVoiceName] = useState('Aria (Natural Warm Female - Friendly & Conversational)');
  const [greeting, setGreeting] = useState("Hello! This is Aria from VoxHire.AI. Before we begin, which language are you most comfortable speaking in?");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newAgent: AIAgent = {
      id: `agent-${Date.now()}`,
      business_id: 'biz-1',
      name: name.trim(),
      purpose,
      status: 'active',
      voice_id: 'voice-aria-warm',
      voice_name: voiceName,
      voice_accent: 'Warm & Natural with Realistic Pauses',
      voice_gender: 'female',
      voice_tone: 'Friendly, Sweet, Confident & Conversational',
      supported_languages: ['English', 'Hindi', 'Spanish', 'Telugu', 'Tamil', 'French', 'German'],
      greeting_message: greeting,
      calls_handled: 0,
      success_rate: 96.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onCreateAgent(newAgent);
    setIsModalOpen(false);
    setName('');
  };

  const handlePreviewVoice = (agent: AIAgent) => {
    speakNaturalConversational(agent.greeting_message, 'en', {
      rate: 0.95,
      pitch: 1.06,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">AI Voice Personas &amp; Agents</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure conversational voice personas with natural female inflections, upfront AI disclosures, and multi-language capabilities.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create AI Agent</span>
        </button>
      </div>

      {/* Agents Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const isActive = agent.status === 'active';
          const isAria = agent.id === 'agent-1' || agent.name.includes('Aria');

          return (
            <div
              key={agent.id}
              className={`p-6 rounded-2xl bg-slate-900 border transition-all duration-200 flex flex-col justify-between ${
                isAria
                  ? 'border-pink-500/50 shadow-xl shadow-pink-900/10'
                  : isActive
                  ? 'border-slate-800 hover:border-indigo-500/50 shadow-lg'
                  : 'border-slate-800/60 opacity-80'
              }`}
            >
              <div>
                {/* Agent Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isAria
                        ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold text-white">{agent.name}</h3>
                        {isAria && (
                          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 capitalize">
                        {agent.purpose.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <StatusBadge status={agent.status} size="sm" />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 py-3 px-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80 mb-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
                      Calls Handled
                    </span>
                    <span className="text-base font-bold text-white tabular-nums">
                      {agent.calls_handled}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
                      Success Rate
                    </span>
                    <span className="text-base font-bold text-emerald-400 tabular-nums">
                      {agent.success_rate}%
                    </span>
                  </div>
                </div>

                {/* Voice Profile & Tone */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-pink-400" />
                      <span>Voice Model:</span>
                    </span>
                    <span className="font-medium text-slate-200">{agent.voice_name}</span>
                  </div>

                  {agent.voice_tone && (
                    <div className="flex items-center justify-between text-slate-300 text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Smile className="w-3 h-3 text-cyan-400" />
                        <span>Tone &amp; Cadence:</span>
                      </span>
                      <span className="text-slate-300 italic">{agent.voice_tone}</span>
                    </div>
                  )}

                  {/* Supported Languages */}
                  {agent.supported_languages && (
                    <div className="pt-1">
                      <div className="text-[10px] uppercase font-mono text-slate-400 mb-1 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-indigo-400" />
                        <span>Supported Languages ({agent.supported_languages.length}):</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {agent.supported_languages.map((lang, lIdx) => (
                          <span
                            key={lIdx}
                            className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-indigo-300 font-mono"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 text-[11px] text-slate-400 italic">
                    &ldquo;{agent.greeting_message}&rdquo;
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePreviewVoice(agent)}
                    className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-pink-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen to Natural Voice Sample</span>
                  </button>
                </div>
              </div>

              {/* Status Toggle & Action */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Agent Status</span>
                <button
                  type="button"
                  onClick={() => onToggleStatus(agent.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-rose-950/50 text-rose-300 border border-rose-800/50 hover:bg-rose-900/50'
                      : 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/50'
                  }`}
                >
                  {isActive ? 'Deactivate' : 'Activate Agent'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Agent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <h2 className="text-base font-bold text-white">Create AI Voice Agent</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Agent Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aria - Technical Screener"
                  required
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Operational Purpose</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="candidate_screening">Candidate Screening</option>
                  <option value="lead_qualification">Lead Qualification</option>
                  <option value="customer_support">Customer Support</option>
                  <option value="appointment_booking">Appointment Booking</option>
                  <option value="follow_up">Follow-ups</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Synthesized Voice Persona</label>
                <select
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Aria (Natural Warm Female - Friendly & Conversational)">
                    Aria (Natural Warm Female - Sweet, Confident &amp; Conversational)
                  </option>
                  <option value="Tara (Empathetic & Natural - Bilingual Indian English/Hindi)">
                    Tara (Empathetic &amp; Natural - Indian English/Hindi)
                  </option>
                  <option value="Elena (Warm Spanish & English Specialist)">
                    Elena (Warm Spanish &amp; English Specialist)
                  </option>
                  <option value="Alloy (Clear & Efficient - Neutral)">
                    Alloy (Clear &amp; Efficient - Neutral)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Default Call Greeting (With AI Disclosure &amp; Language Check)</label>
                <textarea
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Create Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
