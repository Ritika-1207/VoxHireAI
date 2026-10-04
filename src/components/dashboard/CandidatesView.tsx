import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  User,
  Phone,
  Mail,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { Candidate, CandidateStatus } from '../../types/database';
import { StatusBadge } from '../common/StatusBadge';

interface CandidatesViewProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onStatusChange: (candidateId: string, newStatus: CandidateStatus) => void;
}

export const CandidatesView: React.FC<CandidatesViewProps> = ({
  candidates,
  onSelectCandidate,
  onStatusChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'date_desc'>('score_desc');

  // Collect all unique skills for filter dropdown
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => c.skills.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [candidates]);

  // Filtered & Sorted candidates
  const filteredCandidates = useMemo(() => {
    return candidates
      .filter((c) => {
        // Search filter
        const matchSearch =
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.phone.includes(searchTerm);
        if (!matchSearch) return false;

        // Status filter
        if (selectedStatus !== 'all' && c.status.toLowerCase() !== selectedStatus.toLowerCase()) {
          return false;
        }

        // Skill filter
        if (selectedSkill !== 'all' && !c.skills.some((sk) => sk.toLowerCase() === selectedSkill.toLowerCase())) {
          return false;
        }

        // Experience filter
        if (selectedExperience === '0-2' && c.experience_years > 2) return false;
        if (selectedExperience === '2-4' && (c.experience_years <= 2 || c.experience_years > 4)) return false;
        if (selectedExperience === '4+' && c.experience_years <= 4) return false;

        // Score filter
        if (c.ai_score < minScore) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score_desc') return b.ai_score - a.ai_score;
        if (sortBy === 'score_asc') return a.ai_score - b.ai_score;
        return 0;
      });
  }, [candidates, searchTerm, selectedStatus, selectedSkill, selectedExperience, minScore, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Candidate Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review AI voice screened candidates, audit transcripts, and verify recruitment decisions.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Showing <span className="text-white font-semibold">{filteredCandidates.length}</span> of {candidates.length} candidates
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by candidate name, role, email, or phone..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Quick Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['all', 'Shortlisted', 'Review', 'Not Suitable', 'Contacted'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedStatus.toLowerCase() === st.toLowerCase()
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st === 'all' ? 'All Statuses' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80 text-xs">
          
          {/* Skill Filter */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Filter by Skill</label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Skills</option>
              {allSkills.map((sk) => (
                <option key={sk} value={sk}>{sk}</option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Filter by Experience</label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Experience Levels</option>
              <option value="0-2">0 - 2 Years</option>
              <option value="2-4">2 - 4 Years</option>
              <option value="4+">4+ Years</option>
            </select>
          </div>

          {/* AI Score Filter */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Min AI Score ({minScore}+)</label>
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value={0}>Any Score (0+)</option>
              <option value={70}>70+ (Satisfactory)</option>
              <option value={80}>80+ (Strong Match)</option>
              <option value={90}>90+ (Exceptional)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Sort Candidates</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="score_desc">AI Score: High to Low</option>
              <option value="score_asc">AI Score: Low to High</option>
              <option value="date_desc">Latest Call Date</option>
            </select>
          </div>

        </div>
      </div>

      {/* Candidates: Mobile Cards View (Small screens < md) */}
      <div className="md:hidden space-y-3">
        {filteredCandidates.map((candidate) => (
          <div
            key={candidate.id}
            onClick={() => onSelectCandidate(candidate)}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all shadow-md active:bg-slate-800/80 cursor-pointer space-y-3"
          >
            {/* Top row: Avatar, Name, Phone & Score */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {candidate.avatar_url ? (
                  <img
                    src={candidate.avatar_url}
                    alt={candidate.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center border border-indigo-500/20 shrink-0 text-sm">
                    {candidate.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-sm truncate">{candidate.name}</h3>
                  <p className="text-xs text-indigo-300 font-medium truncate">{candidate.role}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{candidate.phone}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-block px-2.5 py-1 rounded-lg font-mono font-bold text-xs bg-slate-950 border border-indigo-500/40 text-indigo-400">
                  {candidate.ai_score}/100
                </span>
                <div className="mt-1">
                  <StatusBadge status={candidate.status} size="sm" />
                </div>
              </div>
            </div>

            {/* Middle row: Skills pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {candidate.skills.slice(0, 4).map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-300"
                >
                  {sk}
                </span>
              ))}
              {candidate.skills.length > 4 && (
                <span className="text-[10px] text-slate-500 font-mono self-center">
                  +{candidate.skills.length - 4} more
                </span>
              )}
            </div>

            {/* Bottom row: Details summary & Action button */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="space-y-0.5 text-[11px] text-slate-400">
                <div>Exp: <strong className="text-slate-200">{candidate.experience_years} yrs</strong> · Salary: <strong className="text-emerald-400">{candidate.expected_salary}</strong></div>
                <div>Availability: <strong className="text-slate-300">{candidate.availability}</strong></div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCandidate(candidate);
                }}
                className="px-3 py-2 min-h-[40px] rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
              >
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredCandidates.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs bg-slate-900 border border-slate-800 rounded-2xl">
            No candidates matched the current search and filter criteria.
          </div>
        )}
      </div>

      {/* Candidates Table (Medium & Large screens) */}
      <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Candidate</th>
                <th className="py-3.5 px-3 font-semibold">Role</th>
                <th className="py-3.5 px-3 font-semibold">Experience</th>
                <th className="py-3.5 px-3 font-semibold">Skills</th>
                <th className="py-3.5 px-3 font-semibold">Expected Salary</th>
                <th className="py-3.5 px-3 font-semibold">Availability</th>
                <th className="py-3.5 px-3 font-semibold text-center">AI Score</th>
                <th className="py-3.5 px-3 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredCandidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  onClick={() => onSelectCandidate(candidate)}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  {/* Candidate Name & Avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {candidate.avatar_url ? (
                        <img
                          src={candidate.avatar_url}
                          alt={candidate.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center border border-indigo-500/20 shrink-0">
                          {candidate.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                          {candidate.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {candidate.phone}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-3 text-slate-300">
                    <span className="truncate max-w-[140px] block">{candidate.role}</span>
                  </td>

                  {/* Experience */}
                  <td className="py-3.5 px-3 text-slate-300 font-mono tabular-nums">
                    {candidate.experience_years} yrs
                  </td>

                  {/* Skills tags */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {candidate.skills.slice(0, 3).map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-indigo-300"
                        >
                          {sk}
                        </span>
                      ))}
                      {candidate.skills.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-mono self-center">
                          +{candidate.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Salary */}
                  <td className="py-3.5 px-3 font-semibold text-emerald-400">
                    {candidate.expected_salary}
                  </td>

                  {/* Availability */}
                  <td className="py-3.5 px-3 text-slate-300">
                    {candidate.availability}
                  </td>

                  {/* AI Score */}
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-950 border border-slate-800 text-indigo-400 tabular-nums">
                      {candidate.ai_score}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    <StatusBadge status={candidate.status} size="sm" />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCandidate(candidate);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white transition-colors font-medium flex items-center gap-1 ml-auto"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCandidates.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-xs">
            No candidates matched the current search and filter criteria.
          </div>
        )}
      </div>

    </div>
  );
};
