import React from 'react';
import { PhoneMissed, Repeat, FileSpreadsheet, Hourglass, ArrowDown, Sparkles } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: PhoneMissed,
      title: 'Missed Calls',
      description: 'Important calls can be missed when teams are busy, leading to lost candidates and stalled business deals.',
      color: 'text-rose-400',
      border: 'hover:border-rose-500/30',
    },
    {
      icon: Repeat,
      title: 'Manual Screening',
      description: 'Employees spend hours asking the same basic questions repeatedly across dozens of repetitive calls daily.',
      color: 'text-amber-400',
      border: 'hover:border-amber-500/30',
    },
    {
      icon: FileSpreadsheet,
      title: 'Scattered Information',
      description: 'Important candidate and customer information gets lost across disjointed calls, messy sticky notes, and spreadsheets.',
      color: 'text-indigo-400',
      border: 'hover:border-indigo-500/30',
    },
    {
      icon: Hourglass,
      title: 'Slow Decisions',
      description: 'Hiring managers and team leads need to manually review hundreds of conversations before reaching final decisions.',
      color: 'text-cyan-400',
      border: 'hover:border-cyan-500/30',
    },
  ];

  return (
    <section className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold text-rose-400 tracking-wider uppercase">
            The Communication Bottleneck
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2 mb-4 tracking-tight">
            Business teams spend too much time on repetitive calls.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            High call volumes drain hours from recruiters, account managers, and coordinators every single day.
          </p>
        </div>

        {/* 4 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((prob, idx) => {
            const Icon = prob.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl bg-slate-900/60 border border-slate-800 transition-all duration-200 ${prob.border} group`}
              >
                <div className={`p-3 rounded-xl bg-slate-800/80 w-fit mb-4 ${prob.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">
                  {prob.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {prob.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* The Turnaround / Solution Transition */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/40 border border-indigo-500/20 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-medium border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The VoxHire.AI Solution</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              VoxHire.AI turns every conversation into structured, actionable information.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every phone interaction is systematically turned into verified skills, compensation expectations, availability timelines, and clean transcripts for fast decision-making.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
