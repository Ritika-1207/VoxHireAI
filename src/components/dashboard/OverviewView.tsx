import React, { useState } from 'react';
import {
  PhoneCall,
  CheckCircle,
  Activity,
  Award,
  TrendingUp,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Play,
  Volume2,
} from 'lucide-react';
import { CallRecord } from '../../types/database';
import { StatusBadge } from '../common/StatusBadge';
import { ANALYTICS_DATA, INITIAL_CALLS } from '../../data/mockData';

interface OverviewViewProps {
  onNavigateToCalls: () => void;
  onNavigateToLiveCall: () => void;
  onSelectCallRecord: (call: CallRecord) => void;
  onNavigateToCandidates: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigateToCalls,
  onNavigateToLiveCall,
  onSelectCallRecord,
  onNavigateToCandidates,
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const summary = ANALYTICS_DATA.summaryCards;
  const recentCalls = INITIAL_CALLS.slice(0, 5);

  const maxCallVolume = Math.max(...ANALYTICS_DATA.last7DaysCalls.map((d) => d.calls));

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Good morning, Admin</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here’s what’s happening with your AI agents today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateToLiveCall}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Monitor Live Call (Rahul Sharma)</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Calls */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Calls</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {summary.totalCalls.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+14.8% vs last week</span>
          </div>
        </div>

        {/* Completed */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Completed</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {summary.completed.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            87.0% completion rate
          </div>
        </div>

        {/* In Progress */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">In Progress</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {summary.inProgress}
          </div>
          <div className="mt-2 text-[11px] text-cyan-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>Active on SIP trunk</span>
          </div>
        </div>

        {/* Qualified */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Qualified</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {summary.qualified.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-medium">
            35.5% qualified ratio
          </div>
        </div>

      </div>

      {/* Two Analytics Charts: Calls Over Last 7 Days & Qualified vs Not Qualified */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calls over last 7 days chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Call Volume (Last 7 Days)</h2>
              <p className="text-xs text-slate-400">Total calls handled vs candidates qualified</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Total Calls
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Qualified
              </span>
            </div>
          </div>

          {/* SVG Bar / Trend Chart */}
          <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
            {ANALYTICS_DATA.last7DaysCalls.map((item, idx) => {
              const heightPct = Math.round((item.calls / maxCallVolume) * 100);
              const qualHeightPct = Math.round((item.qualified / maxCallVolume) * 100);
              const isHovered = hoveredDay === idx;

              return (
                <div
                  key={item.day}
                  onMouseEnter={() => setHoveredDay(idx)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute -top-12 z-20 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-[11px] font-mono shadow-xl whitespace-nowrap text-center">
                      <div className="text-white font-bold">{item.calls} Calls</div>
                      <div className="text-emerald-400">{item.qualified} Qualified</div>
                    </div>
                  )}

                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Total Calls Bar */}
                    <div
                      className={`w-3 sm:w-5 rounded-t-md transition-all duration-300 ${
                        isHovered ? 'bg-indigo-400' : 'bg-indigo-600/80 group-hover:bg-indigo-500'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    {/* Qualified Calls Bar */}
                    <div
                      className={`w-2.5 sm:w-4 rounded-t-md transition-all duration-300 ${
                        isHovered ? 'bg-emerald-400' : 'bg-emerald-600/80 group-hover:bg-emerald-500'
                      }`}
                      style={{ height: `${qualHeightPct}%` }}
                    />
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 mt-2 block">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Peak Day: <strong className="text-slate-200">Friday (220 calls)</strong></span>
            <span>Weekly Total: <strong className="font-mono text-slate-200">1,261 calls</strong></span>
          </div>
        </div>

        {/* Qualified vs Not Qualified Chart (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Call Outcomes Distribution</h2>
              <p className="text-xs text-slate-400">Decision support breakdown across workflows</p>
            </div>
          </div>

          {/* Segmented Progress Breakdown */}
          <div className="space-y-4 pt-2">
            {/* Visual stacked bar */}
            <div className="h-4 w-full rounded-full bg-slate-950 overflow-hidden flex shadow-inner">
              {ANALYTICS_DATA.outcomesBreakdown.map((seg, idx) => (
                <div
                  key={idx}
                  style={{ width: `${seg.percentage}%`, backgroundColor: seg.color }}
                  title={`${seg.label}: ${seg.percentage}%`}
                  className="h-full hover:opacity-90 transition-opacity"
                />
              ))}
            </div>

            {/* Legend list */}
            <div className="space-y-2.5 pt-2">
              {ANALYTICS_DATA.outcomesBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-300 font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-slate-400">
                    <span className="text-slate-200 font-semibold">{item.count}</span>
                    <span className="w-12 text-right">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Recruiter review required on 29.5% of calls</span>
              <button
                type="button"
                onClick={onNavigateToCandidates}
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Review Shortlist →
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Calls: Mobile List (Small screens < md) */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-white">Recent Calls</h2>
          <button
            type="button"
            onClick={onNavigateToCalls}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentCalls.map((call) => (
          <div
            key={call.id}
            onClick={() => onSelectCallRecord(call)}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 active:bg-slate-800/80 cursor-pointer space-y-2.5 shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-white text-sm">{call.contact_name}</h3>
                <p className="text-[11px] text-slate-400 font-mono">{call.contact_phone}</p>
                <p className="text-xs text-indigo-300 mt-0.5">{call.purpose}</p>
              </div>
              <div className="text-right shrink-0">
                <StatusBadge status={call.outcome} size="sm" />
                <span className="block mt-1 font-mono text-cyan-400 font-bold text-xs">
                  {call.duration_formatted}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-slate-400">
                Score: <strong className="text-slate-200">{call.ai_score}/100</strong>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCallRecord(call);
                }}
                className="px-3 py-1.5 min-h-[36px] rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
              >
                Audit Call
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Calls Table (Medium & Large screens) */}
      <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Recent Calls</h2>
            <p className="text-xs text-slate-400">Latest conversations processed by VoxHire.AI autonomous agents</p>
          </div>
          <button
            type="button"
            onClick={onNavigateToCalls}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Calls</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-3 font-semibold">Phone</th>
                <th className="py-3 px-3 font-semibold">Purpose</th>
                <th className="py-3 px-3 font-semibold">Duration</th>
                <th className="py-3 px-3 font-semibold text-center">AI Score</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {recentCalls.map((call) => (
                <tr
                  key={call.id}
                  onClick={() => onSelectCallRecord(call)}
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
                  <td className="py-3.5 px-3 font-mono font-semibold text-cyan-400 tabular-nums">
                    {call.duration_formatted}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="font-mono font-bold text-slate-200">
                      {call.ai_score}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={call.outcome} size="sm" />
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px]">
                    {new Date(call.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCallRecord(call);
                      }}
                      className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
