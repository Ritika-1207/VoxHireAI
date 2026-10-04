import React from 'react';
import { PhoneCall, Sparkles } from 'lucide-react';

interface LandingFooterProps {
  onOpenDashboard: () => void;
  onOpenSchema: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onOpenDashboard,
  onOpenSchema,
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-14 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
              <span>VoxHire.AI</span>
            </div>
            <p className="text-slate-300 text-sm italic font-medium max-w-sm">
              &ldquo;Let AI handle the calls. Let your team make the decisions.&rdquo;
            </p>
            <p className="text-slate-400 leading-relaxed max-w-md">
              Enterprise conversational AI infrastructure for autonomous candidate screening, customer inquiries, and lead qualification with human oversight.
            </p>
          </div>

          <div>
            <div className="text-slate-200 font-semibold mb-3">Platform</div>
            <ul className="space-y-2">
              <li><button onClick={onOpenDashboard} className="hover:text-white transition-colors">Screening Dashboard</button></li>
              <li><a href="#updates" className="hover:text-cyan-400 transition-colors">Stay Updated</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Workflow Builder</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">Voice AI Agents</a></li>
              <li><button onClick={onOpenSchema} className="hover:text-white transition-colors flex items-center gap-1"><span>Supabase Schema</span><Sparkles className="w-3 h-3 text-indigo-400" /></button></li>
            </ul>
          </div>

          <div>
            <div className="text-slate-200 font-semibold mb-3">Trust &amp; Legal</div>
            <ul className="space-y-2">
              <li><a href="#trust" className="hover:text-white transition-colors">Human Oversight Charter</a></li>
              <li><a href="#trust" className="hover:text-white transition-colors">Data Privacy Safeguards</a></li>
              <li><a href="#trust" className="hover:text-white transition-colors">Role-Based Access</a></li>
              <li><span className="text-slate-400">Security Architecture</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} VoxHire.AI Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Enterprise Telephony Engine</span>
            <span>·</span>
            <span>Decision Support System</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
