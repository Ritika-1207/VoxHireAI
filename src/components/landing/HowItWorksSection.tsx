import React from 'react';
import { Sliders, PhoneOutgoing, BrainCircuit, UserCheck, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Create a Workflow',
      description: 'Business creates questions, call objectives and screening criteria tailoring role requirements.',
      icon: Sliders,
      badge: 'Configuration',
    },
    {
      num: '02',
      title: 'AI Makes or Answers Calls',
      description: 'The AI voice agent communicates naturally with candidates or customers in real-time spoken English.',
      icon: PhoneOutgoing,
      badge: 'Conversational Voice',
    },
    {
      num: '03',
      title: 'AI Understands & Summarizes',
      description: 'The system converts conversations into transcripts, summaries and structured JSON data.',
      icon: BrainCircuit,
      badge: 'Decision Intelligence',
    },
    {
      num: '04',
      title: 'Your Team Decides',
      description: 'Managers review results, compare people side-by-side, and take the confident final action.',
      icon: UserCheck,
      badge: 'Human Oversight',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-900/60 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">
            Autonomous Pipeline
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2 mb-3 tracking-tight">
            How VoxHire.AI Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            From job requisition to verified candidate shortlists in four automated, compliant steps.
          </p>
        </div>

        {/* 4 Connected Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col p-6 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 group"
              >
                {/* Step number and icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-indigo-400/80">
                    {step.num}
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-800/80 text-cyan-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  {step.badge}
                </div>

                <h3 className="text-base font-semibold text-white mb-2">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed flex-1">
                  {step.description}
                </p>

                {/* Connecting arrow indicator for desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-600">
                    <ArrowRight className="w-5 h-5 text-indigo-500/50" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
