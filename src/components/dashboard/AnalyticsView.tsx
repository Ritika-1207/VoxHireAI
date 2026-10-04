import React from 'react';
import {
  BarChart2,
  Clock,
  CheckCircle2,
  TrendingUp,
  PhoneOff,
  UserCheck,
  Bot,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { ANALYTICS_DATA, INITIAL_WORKFLOWS } from '../../data/mockData';

export const AnalyticsView: React.FC = () => {
  const summary = ANALYTICS_DATA.summaryCards;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Telephony &amp; Voice Intelligence Analytics</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Comprehensive metrics on automated call volume, qualification conversion rates, and conversational performance.
        </p>
      </div>

      {/* 6 Top Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Total Calls</span>
          <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
            {summary.totalCalls.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +14.8%
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Completed Calls</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {summary.completed.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">87.0% completed</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Avg Duration</span>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
            03:44
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">224 sec per call</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Qualified Candidates</span>
          <div className="text-xl font-bold font-mono text-indigo-400 mt-1 tabular-nums">
            {summary.qualified}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Shortlisted</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Conversion Rate</span>
          <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
            {summary.qualificationRate}%
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +3.2% vs benchmark
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Missed Calls Avoided</span>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            {summary.missedCallsAvoided}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">24/7 AI handled</span>
        </div>

      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calls by Day Detailed View (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Daily Call Distribution &amp; Outcomes</h2>
              <p className="text-xs text-slate-400">Completed vs non-responsive call attempts</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-md">
              Past 7 Days
            </span>
          </div>

          <div className="h-64 w-full flex items-end justify-between gap-4 pt-8 pb-2 px-2 border-b border-slate-800">
            {ANALYTICS_DATA.last7DaysCalls.map((item) => {
              const max = 240;
              const hTotal = Math.round((item.calls / max) * 100);
              const hQual = Math.round((item.qualified / max) * 100);
              const hBusy = Math.round((item.failedOrBusy / max) * 100);

              return (
                <div key={item.day} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    <div
                      className="w-3 sm:w-5 bg-indigo-500 rounded-t-sm"
                      style={{ height: `${hTotal}%` }}
                      title={`Total: ${item.calls}`}
                    />
                    <div
                      className="w-2.5 sm:w-4 bg-emerald-500 rounded-t-sm"
                      style={{ height: `${hQual}%` }}
                      title={`Qualified: ${item.qualified}`}
                    />
                    <div
                      className="w-1.5 sm:w-2.5 bg-rose-500/70 rounded-t-sm"
                      style={{ height: `${hBusy}%` }}
                      title={`Busy/No Answer: ${item.failedOrBusy}`}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mt-2 block">{item.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm" /> Total Calls</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" /> Qualified</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rose-500 rounded-sm" /> No Answer</span>
            </div>
            <span className="font-mono text-slate-300">Average Reach Rate: 88.9%</span>
          </div>
        </div>

        {/* Qualification Rate Gauge / Donut breakdown (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white">Qualification Efficiency</h2>
            <p className="text-xs text-slate-400">Proportion of candidates matching criteria</p>
          </div>

          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Circular SVG Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-indigo-500"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * 0.355)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black font-mono text-white tabular-nums">35.5%</span>
                <span className="text-[10px] text-slate-400 block font-sans">Pass Rate</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Recruiter Time Saved:</span>
              <strong className="text-emerald-400 font-mono">142 Hours / Mo</strong>
            </div>
            <div className="flex justify-between">
              <span>Cost Per Qualified Candidate:</span>
              <strong className="text-slate-200 font-mono">$3.40</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Lower Section: Top Workflows & AI Agent Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Workflows */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Top Active Workflows</span>
            </h2>
            <span className="text-xs text-slate-400">Sorted by Volume</span>
          </div>

          <div className="space-y-3">
            {INITIAL_WORKFLOWS.map((wf) => (
              <div
                key={wf.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <h3 className="font-semibold text-white">{wf.name}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">Role: {wf.job_role}</span>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold text-indigo-400">{wf.total_screened} Screened</div>
                  <div className="text-[11px] text-emerald-400">{wf.qualification_rate}% Qual Rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agent Performance Table */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>AI Agent Performance</span>
            </h2>
            <span className="text-xs text-slate-400">Live Agent Stats</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="py-2 px-2">Agent</th>
                  <th className="py-2 px-2">Calls</th>
                  <th className="py-2 px-2">Success</th>
                  <th className="py-2 px-2">Avg Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {ANALYTICS_DATA.agentPerformance.map((ag, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-3 px-2 font-sans font-medium text-slate-200">
                      {ag.name}
                    </td>
                    <td className="py-3 px-2 text-slate-300 tabular-nums">
                      {ag.calls}
                    </td>
                    <td className="py-3 px-2 text-emerald-400 font-semibold tabular-nums">
                      {ag.successRate}
                    </td>
                    <td className="py-3 px-2 text-cyan-400 tabular-nums">
                      {ag.avgDuration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
