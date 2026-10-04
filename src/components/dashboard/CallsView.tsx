import React, { useState } from 'react';
import {
  PhoneIncoming,
  PhoneOutgoing,
  Search,
  Filter,
  Volume2,
  FileText,
  Clock,
  CheckCircle2,
  X,
  Play,
  Sparkles,
} from 'lucide-react';
import { CallRecord, CallDirection } from '../../types/database';
import { StatusBadge } from '../common/StatusBadge';
import { AudioPlayerWidget } from '../common/AudioPlayerWidget';

interface CallsViewProps {
  calls: CallRecord[];
  onSelectCall?: (call: CallRecord) => void;
}

export const CallsView: React.FC<CallsViewProps> = ({ calls, onSelectCall }) => {
  const [activeTab, setActiveTab] = useState<CallDirection>('outbound');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeModalCall, setActiveModalCall] = useState<CallRecord | null>(null);

  const filteredCalls = calls.filter((c) => {
    if (c.direction !== activeTab) return false;
    if (statusFilter !== 'all' && c.outcome.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (
      searchTerm &&
      !c.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !c.contact_phone.includes(searchTerm) &&
      !c.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Call History &amp; Recordings</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit inbound and outbound AI voice sessions with synchronized transcripts and audio playback.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('outbound')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'outbound'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PhoneOutgoing className="w-3.5 h-3.5" />
            <span>Outbound Calls</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inbound')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'inbound'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PhoneIncoming className="w-3.5 h-3.5" />
            <span>Inbound Calls</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contact, phone or purpose..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-slate-400 shrink-0">Outcome:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Outcomes</option>
            <option value="qualified">Qualified</option>
            <option value="review">Review</option>
            <option value="not_suitable">Not Suitable</option>
            <option value="incomplete">Incomplete / Callback</option>
          </select>
        </div>
      </div>

      {/* Calls: Mobile Card List (Small screens < md) */}
      <div className="md:hidden space-y-3">
        {filteredCalls.map((call) => (
          <div
            key={call.id}
            onClick={() => setActiveModalCall(call)}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all shadow-md active:bg-slate-800/80 cursor-pointer space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-white text-sm">{call.contact_name}</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{call.contact_phone}</p>
                <p className="text-xs text-indigo-300 font-medium mt-1">{call.purpose}</p>
              </div>

              <div className="text-right shrink-0">
                <StatusBadge status={call.outcome} size="sm" />
                <span className="block mt-1 font-mono font-bold text-xs text-cyan-400">
                  {call.duration_formatted}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono">
                {new Date(call.started_at).toLocaleDateString()} · Score: <strong className="text-slate-200">{call.ai_score}/100</strong>
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveModalCall(call);
                }}
                className="px-3 py-1.5 min-h-[38px] rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
                <span>Play &amp; Transcript</span>
              </button>
            </div>
          </div>
        ))}

        {filteredCalls.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-900 border border-slate-800 rounded-2xl">
            No {activeTab} calls found matching the filter.
          </div>
        )}
      </div>

      {/* Calls Table (Medium & Large screens) */}
      <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Caller / Candidate</th>
                <th className="py-3.5 px-3 font-semibold">Phone</th>
                <th className="py-3.5 px-3 font-semibold">Purpose</th>
                <th className="py-3.5 px-3 font-semibold">Date &amp; Time</th>
                <th className="py-3.5 px-3 font-semibold">Duration</th>
                <th className="py-3.5 px-3 font-semibold">Outcome</th>
                <th className="py-3.5 px-3 font-semibold text-center">AI Score</th>
                <th className="py-3.5 px-4 font-semibold text-right">Recording &amp; Transcript</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredCalls.map((call) => (
                <tr
                  key={call.id}
                  onClick={() => setActiveModalCall(call)}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    {call.contact_name}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-300">
                    {call.contact_phone}
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">
                    {call.purpose}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px]">
                    {new Date(call.started_at).toLocaleDateString()} · {new Date(call.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-semibold text-cyan-400 tabular-nums">
                    {call.duration_formatted}
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={call.outcome} size="sm" />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="font-mono font-bold text-slate-200 tabular-nums">
                      {call.ai_score}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalCall(call);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Play</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCalls.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-xs">
            No {activeTab} calls found matching the filter.
          </div>
        )}
      </div>

      {/* Call Details / Audio / Transcript Modal */}
      {activeModalCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <div>
                <h2 className="text-base font-bold text-white">
                  Call Recording &amp; Transcript: {activeModalCall.contact_name}
                </h2>
                <p className="text-xs text-slate-400">
                  {activeModalCall.purpose} · Duration: {activeModalCall.duration_formatted}
                </p>
              </div>
              <button onClick={() => setActiveModalCall(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Audio Player */}
              <AudioPlayerWidget
                title={`Playback · ${activeModalCall.contact_name}`}
                speakerName={`${activeModalCall.agent_name} with ${activeModalCall.contact_name}`}
                durationSeconds={activeModalCall.duration_seconds}
              />

              {/* AI Summary */}
              {activeModalCall.summary && (
                <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs space-y-2">
                  <div className="flex items-center justify-between text-indigo-400 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Extracted Summary</span>
                    </span>
                    <span className="text-emerald-400 font-mono">Score: {activeModalCall.ai_score}/100</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    {activeModalCall.summary.experience_summary}
                  </p>
                  <p className="text-slate-300 italic pt-1 border-t border-slate-800/60">
                    Recommendation: {activeModalCall.summary.ai_recommendation}
                  </p>
                </div>
              )}

              {/* Transcript */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Verbatim Transcript ({activeModalCall.transcript.length} turns)
                </h3>
                {activeModalCall.transcript.map((t) => (
                  <div
                    key={t.id}
                    className={`p-3 rounded-xl border text-xs leading-relaxed ${
                      t.speaker === 'ai'
                        ? 'bg-slate-950 border-indigo-900/30 text-slate-300'
                        : 'bg-indigo-950/20 border-cyan-900/30 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] mb-1 text-slate-400">
                      <span className={t.speaker === 'ai' ? 'text-indigo-400 font-bold' : 'text-cyan-400 font-bold'}>
                        {t.speaker === 'ai' ? activeModalCall.agent_name : activeModalCall.contact_name}
                      </span>
                      <span>{t.formatted_time}</span>
                    </div>
                    <p>&ldquo;{t.text}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end px-6 py-3 border-t border-slate-800 bg-slate-950/60">
              <button
                type="button"
                onClick={() => setActiveModalCall(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
