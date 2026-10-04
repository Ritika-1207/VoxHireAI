import React from 'react';
import { Users, Target, Headphones, Calendar, Clock, TrendingUp } from 'lucide-react';

export const UseCasesSection: React.FC = () => {
  const useCases = [
    {
      icon: Users,
      title: 'Recruitment',
      tagline: 'Primary Solution',
      description: 'Screen candidates at scale, assess skills, verify salary expectations and notice periods, and schedule final interviews.',
      highlight: '60% Faster Time-to-Hire',
    },
    {
      icon: Target,
      title: 'Lead Qualification',
      tagline: 'Revenue Operations',
      description: 'Automatically identify high-intent inbound inquiries, determine budget & timeline, and route warm leads directly to account executives.',
      highlight: '3x Pipeline Velocity',
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      tagline: '24/7 Inbound Triage',
      description: 'Answer common policy questions, check order or ticket statuses, and escalate complex matters with pre-filled context.',
      highlight: 'Zero Hold Time',
    },
    {
      icon: Calendar,
      title: 'Appointment Booking',
      tagline: 'Calendar Automation',
      description: 'Coordinate schedules with clients or interviewers, confirm availability, and prevent calendar double-booking.',
      highlight: 'Automatic Rescheduling',
    },
    {
      icon: Clock,
      title: 'Follow-ups',
      tagline: 'Lifecycle Engagement',
      description: 'Automatically follow up with candidates post-offer or customers after service calls with polite voice check-ins.',
      highlight: '94% Reach Rate',
    },
    {
      icon: TrendingUp,
      title: 'Sales Outreach',
      tagline: 'Outbound Discovery',
      description: 'Qualify prospects against B2B criteria before passing vetted, interested decision-makers to enterprise sales teams.',
      highlight: 'Higher Rep Productivity',
    },
  ];

  return (
    <section id="solutions" className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
            Versatile Voice Engine
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2 mb-3 tracking-tight">
            One AI Voice Platform. Multiple Business Use Cases.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            While recruitment screening is our flagship workflow, VoxHire.AI seamlessly powers all conversational touchpoints across your company.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc, idx) => {
            const Icon = uc.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-800/80 text-indigo-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {uc.tagline}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">
                    {uc.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {uc.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Impact:</span>
                  <span className="font-semibold text-emerald-400">{uc.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
