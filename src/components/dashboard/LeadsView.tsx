import React, { useState } from 'react';
import { Target, Search, PhoneCall, Mail, Building, TrendingUp, CheckCircle, ChevronRight } from 'lucide-react';
import { Lead } from '../../types/database';
import { INITIAL_LEADS } from '../../data/mockData';
import { StatusBadge } from '../common/StatusBadge';

export const LeadsView: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const filtered = leads.filter((l) =>
    l.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.service_interest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCallback = (lead: Lead) => {
    setToast(`Autonomous callback scheduled for ${lead.contact_name} (${lead.company_name}) at +91 9876543256.`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      
      {toast && (
        <div className="p-3 bg-emerald-950 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Lead Qualification Pipeline</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Inbound business leads qualified autonomously by the VoxHire.AI Lead Qualification Agent.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads by contact or company name..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Leads: Mobile Card List (Small screens < md) */}
      <div className="md:hidden space-y-3">
        {filtered.map((lead) => (
          <div
            key={lead.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-white text-sm">{lead.contact_name}</h3>
                <p className="text-xs text-indigo-300 font-medium">{lead.company_name}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{lead.phone}</p>
              </div>

              <div className="text-right shrink-0">
                <StatusBadge status={lead.qualification_status} size="sm" />
                <span className="block mt-1 font-mono font-bold text-xs text-indigo-400">
                  {lead.ai_score}/100
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1">
              <div>Interest: <strong className="text-slate-200">{lead.service_interest}</strong></div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Budget: <strong className="text-emerald-400">{lead.budget_range}</strong></span>
                <span>Timeline: <strong className="text-slate-300">{lead.timeline}</strong></span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex justify-end">
              <button
                type="button"
                onClick={() => handleCallback(lead)}
                className="w-full sm:w-auto px-4 py-2 min-h-[40px] rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Initiate Call</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-900 border border-slate-800 rounded-2xl">
            No leads found matching your search.
          </div>
        )}
      </div>

      {/* Leads Table (Medium & Large screens) */}
      <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Lead Contact</th>
                <th className="py-3.5 px-3 font-semibold">Company</th>
                <th className="py-3.5 px-3 font-semibold">Service Intent</th>
                <th className="py-3.5 px-3 font-semibold">Budget Range</th>
                <th className="py-3.5 px-3 font-semibold">Timeline</th>
                <th className="py-3.5 px-3 font-semibold text-center">AI Fit Score</th>
                <th className="py-3.5 px-3 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{lead.contact_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{lead.phone}</div>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-slate-300">
                    {lead.company_name}
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 max-w-[200px] truncate">
                    {lead.service_interest}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-semibold text-emerald-400">
                    {lead.budget_range}
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">
                    {lead.timeline}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="font-mono font-bold text-indigo-400 tabular-nums">
                      {lead.ai_score}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={lead.qualification_status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleCallback(lead)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors flex items-center gap-1.5 ml-auto"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>Initiate Call</span>
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
