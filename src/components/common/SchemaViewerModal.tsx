import React, { useState } from 'react';
import { X, Database, Copy, Check, Server, PhoneCall, Cpu, Network } from 'lucide-react';
import { SUPABASE_POSTGRES_SCHEMA_SQL } from '../../types/database';

interface SchemaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SchemaViewerModal: React.FC<SchemaViewerModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'sql' | 'architecture' | 'telephony'>('sql');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_POSTGRES_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">Database Schema &amp; Telephony Architecture</h2>
              <p className="text-xs text-slate-400">Supabase PostgreSQL DDL &amp; Future Telephony Integration Spec</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 border-b border-slate-800 bg-slate-950/30 overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors shrink-0 ${
              activeTab === 'sql'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            PostgreSQL / Supabase Schema (12 Tables)
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'architecture'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Multi-Tenant Data Pipeline
          </button>
          <button
            onClick={() => setActiveTab('telephony')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'telephony'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Telephony &amp; AI Voice Pipeline (Twilio / Deepgram / Cartesia / LLM)
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans">
          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Tables: <code>users</code>, <code>businesses</code>, <code>ai_agents</code>, <code>workflows</code>, <code>workflow_questions</code>, <code>calls</code>, <code>call_transcripts</code>, <code>call_summaries</code>, <code>candidates</code>, <code>leads</code>, <code>appointments</code>, <code>notifications</code>
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied SQL' : 'Copy DDL'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-[50vh] leading-relaxed">
                {SUPABASE_POSTGRES_SCHEMA_SQL}
              </pre>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold">
                  <Server className="w-4 h-4" />
                  <span>1. Supabase Postgres &amp; RLS</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every record is tagged with <code>business_id</code> for enterprise multi-tenancy. Row Level Security policies ensure recruiters only access their workspace data.
                </p>
                <div className="pt-2 text-xs font-mono text-slate-500">
                  JWT Auth → RLS Filtering → Realtime Subscriptions
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                  <Cpu className="w-4 h-4" />
                  <span>2. Structured Extraction</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  As conversational turns complete, the transcript is parsed into <code>call_summaries</code> with verified candidate skills, salary expectations, notice period, and decision recommendations.
                </p>
                <div className="pt-2 text-xs font-mono text-slate-500">
                  Audio Stream → Turn Buffering → JSON Schema Validation
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <Network className="w-4 h-4" />
                  <span>3. Webhook Delivery</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Completed screenings trigger outbound webhooks to ATS systems (Greenhouse, Lever, Ashby, Workday) and CRM pipelines (HubSpot, Salesforce).
                </p>
                <div className="pt-2 text-xs font-mono text-slate-500">
                  Event: call.completed → ATS Candidate Sync
                </div>
              </div>
            </div>
          )}

          {activeTab === 'telephony' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-2">
                  <PhoneCall className="w-4 h-4" />
                  <span>Modular Telephony Architecture (SIP / WebRTC)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  VoxHire.AI is designed with modular abstraction layers. When production telephony is connected, the components connect via standard WebRTC / SIP trunks:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-semibold text-slate-200">1. Telephony Layer</span>
                    <p className="text-slate-400 mt-1">Twilio SIP Trunking, Vonage Voice, or LiveKit WebRTC server.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-semibold text-slate-200">2. Speech-To-Text</span>
                    <p className="text-slate-400 mt-1">Deepgram Nova-2 / Whisper streaming for ultra-low latency &lt;250ms.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-semibold text-slate-200">3. Conversation LLM</span>
                    <p className="text-slate-400 mt-1">Gemini 2.5 Flash / Claude with deterministic workflow guardrails.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-semibold text-slate-200">4. Text-To-Speech</span>
                    <p className="text-slate-400 mt-1">Cartesia Sonic or ElevenLabs Flash for expressive human-like cadence.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400">
          <span>VoxHire.AI Telephony Engine v1.0.0 Architecture</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
