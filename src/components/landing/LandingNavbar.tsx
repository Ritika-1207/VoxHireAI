import React, { useState } from 'react';
import { PhoneCall, Sparkles, LayoutDashboard, UserPlus, LogIn, Bell, Menu, X, ArrowRight } from 'lucide-react';

interface LandingNavbarProps {
  onOpenDashboard: () => void;
  onOpenLogin: () => void;
  onOpenSignUp?: () => void;
  onOpenDemo: () => void;
  onOpenSchema: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onOpenDashboard,
  onOpenLogin,
  onOpenSignUp,
  onOpenDemo,
  onOpenSchema,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <span className="whitespace-nowrap">
              VoxHire<span className="text-cyan-400">.AI</span>
            </span>
          </a>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-medium text-slate-300">
          <a href="#product" className="hover:text-white transition-colors">Product</a>
          <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#updates" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-cyan-400" />
            <span>Stay Updated</span>
          </a>
          <a href="#trust" className="hover:text-white transition-colors">Trust &amp; Privacy</a>
          <button
            onClick={onOpenSchema}
            className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            title="View Supabase Schema & Architecture"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architecture</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={onOpenLogin}
            className="px-2.5 sm:px-3 py-1.5 min-h-[40px] text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
          
          <button
            type="button"
            onClick={onOpenSignUp || onOpenLogin}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 min-h-[40px] text-xs sm:text-sm font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/60 rounded-lg transition-colors whitespace-nowrap"
          >
            <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sign Up</span>
          </button>

          <button
            type="button"
            onClick={onOpenDashboard}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 min-h-[40px] text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all hover:shadow-indigo-600/50 whitespace-nowrap"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Dashboard</span>
            <span className="xs:hidden sm:hidden">App</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 min-h-[40px] min-w-[40px] rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center ml-1"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1">
            <button
              type="button"
              onClick={() => handleNavClick('#product')}
              className="w-full text-left px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>Product &amp; Features</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#solutions')}
              className="w-full text-left px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>Solutions</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#how-it-works')}
              className="w-full text-left px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>How It Works</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#pricing')}
              className="w-full text-left px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>Pricing Plans</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#updates')}
              className="w-full text-left px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium text-cyan-300 hover:bg-slate-800 hover:text-cyan-200 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <span>Stay Updated</span>
              </div>
              <ArrowRight className="w-4 h-4 text-cyan-500" />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#trust')}
              className="w-full text-left px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-between"
            >
              <span>Trust &amp; Privacy</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSchema();
              }}
              className="w-full text-left px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium text-indigo-300 hover:bg-slate-800 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Supabase Architecture</span>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-500" />
            </button>
          </nav>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="w-full py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-pink-600/20"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Launch Live Two-Way Voice Call</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenSignUp) onOpenSignUp();
                else onOpenLogin();
              }}
              className="w-full py-2.5 min-h-[44px] rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-800"
            >
              <UserPlus className="w-4 h-4 text-indigo-400" />
              <span>Create Account</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
