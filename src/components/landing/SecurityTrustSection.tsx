import React from 'react';
import { Lock, FileText, UserCheck, Eye, ShieldAlert } from 'lucide-react';

export const SecurityTrustSection: React.FC = () => {
  const trustPillars = [
    {
      icon: Lock,
      title: 'Data Privacy',
      description: 'Customer and applicant voice streams are processed with encrypted transport layers and customer-controlled retention policies.',
    },
    {
      icon: FileText,
      title: 'Conversation Records',
      description: 'Every interaction produces searchable verbatim transcripts and structured summaries archived in centralized audit tables.',
    },
    {
      icon: UserCheck,
      title: 'Human Oversight',
      description: 'AI assists teams with decision-support recommendations. Final hiring and commercial choices always remain with your team.',
    },
    {
      icon: Eye,
      title: 'Transparent AI',
      description: 'Every call starts with an upfront greeting stating the caller is conversing with an autonomous AI voice screener.',
    },
    {
      icon: ShieldAlert,
      title: 'Role-Based Access',
      description: 'Granular workspace permissions distinguish between Super Administrators, Recruiters, Hiring Managers, and Viewers.',
    },
  ];

  return (
    <section id="trust" className="py-20 bg-slate-900/40 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
            Trust &amp; Responsible Governance
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2 mb-3 tracking-tight">
            Built for Enterprise Transparency &amp; Human Oversight
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Responsible conversational AI designed to support human teams rather than replace human accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-slate-800/60 text-emerald-400 w-fit mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Ethical statement box */}
        <div className="mt-12 p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 text-center max-w-3xl mx-auto">
          <span className="font-semibold text-slate-200">Ethical AI Standard:</span> VoxHire.AI recommendation outputs are generated exclusively as advisory decision support. Our platform enforces human-in-the-loop workflows to protect candidate fairness and business standards.
        </div>

      </div>
    </section>
  );
};
