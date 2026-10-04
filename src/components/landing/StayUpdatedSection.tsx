import React, { useState } from 'react';
import {
  Bell,
  Mail,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Send,
  Check,
  ArrowRight,
} from 'lucide-react';
import { addSubscriber, isValidEmail, isValidName, isValidPhone } from '../../utils/storage';

export const StayUpdatedSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);

  // Validation & Feedback
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
    phone: string;
  } | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isValidName(name)) {
      newErrors.name = 'Please provide your full name (minimum 2 characters).';
    }
    if (!isValidEmail(email)) {
      newErrors.email = 'Please provide a valid work or personal email address.';
    }
    if (!isValidPhone(phone)) {
      newErrors.phone = 'Please provide a valid phone number (10 to 15 digits).';
    }
    if (!consent) {
      newErrors.consent = 'Your explicit consent is required to receive product updates.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const res = addSubscriber({
        name,
        email,
        phone,
        source: 'landing_stay_updated',
      });

      setIsSubmitting(false);

      if (res.success && res.subscriber) {
        setSubmittedData({
          name: res.subscriber.name,
          email: res.subscriber.email,
          phone: res.subscriber.phone,
        });
        setName('');
        setEmail('');
        setPhone('');
        setConsent(false);
        setErrors({});
      } else {
        setErrors({ general: res.error || 'Unable to complete subscription at this time.' });
      }
    }, 500);
  };

  return (
    <section id="updates" className="py-24 bg-[#0b0f19] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-indigo-600/10 via-pink-600/10 to-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Container Box */}
        <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800 rounded-3xl p-5 sm:p-10 lg:p-14 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Context & Value Proposition */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-xs text-indigo-300 font-medium">
                <Bell className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                <span>Stay Updated with VoxHire.AI</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Be the first to experience the future of autonomous voice calls.
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Join 4,500+ talent leaders, recruiters, and operations executives. Receive timely updates on:
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'New AI voice language models and dialect packs',
                  'Enterprise ATS & CRM connectors (Greenhouse, Workday, Ashby)',
                  'Custom screening prompt templates and benchmark reports',
                  'Live product demonstrations and executive webinars',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <div className="w-4 h-4 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-6 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Strict zero-spam policy</span>
                </div>
                <span>·</span>
                <div>1-click unsubscribe anytime</div>
              </div>
            </div>

            {/* Right Column: Form or Success Card */}
            <div className="lg:col-span-6">
              {submittedData ? (
                /* Success Card */
                <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-emerald-500/40 space-y-5 animate-in zoom-in-95 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto sm:mx-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">Subscription Confirmed!</h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Thank you, <strong className="text-white">{submittedData.name}</strong>. Your subscription has been securely registered.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs font-mono text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Registered Email:</span>
                      <span className="text-cyan-400 font-semibold">{submittedData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Registered Phone:</span>
                      <span className="text-slate-200">{submittedData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Consent Verified:</span>
                      <span className="text-emerald-400">Granted · Opt-In</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    You'll receive our next product announcement, voice engine release notes, and high-impact screening playbooks directly.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSubmittedData(null)}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    Subscribe Another Contact or Email
                  </button>
                </div>
              ) : (
                /* Subscription Form */
                <form
                  onSubmit={handleSubmit}
                  className="p-6 sm:p-8 rounded-2xl bg-slate-950/70 border border-slate-800/90 shadow-xl space-y-4"
                >
                  <div className="border-b border-slate-800/80 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>Stay in the Loop</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Enter your details below to receive feature drops &amp; product notifications.
                    </p>
                  </div>

                  {errors.general && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{errors.general}</span>
                    </div>
                  )}

                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Your Full Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        placeholder="e.g. Alex Morgan"
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-900 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors.name
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-slate-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        placeholder="alex@company.com"
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-900 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors.email
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-slate-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Phone Number <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        placeholder="+1 (555) 019-2834 or +91 98765 43210"
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-900 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors.phone
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-slate-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Consent for Receiving Communications */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          if (errors.consent) setErrors({ ...errors, consent: '' });
                        }}
                        className="mt-0.5 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 shrink-0"
                      />
                      <span className="leading-snug text-slate-400">
                        I consent to receive product updates, new feature announcements, and important notifications from <strong className="text-slate-200">VoxHire.AI</strong> via email and SMS/WhatsApp. You can unsubscribe at any time.
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="text-[11px] text-rose-400 mt-1">{errors.consent}</p>
                    )}
                  </div>

                  {/* Clear "Subscribe to Updates" CTA Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? (
                      <span>Saving Securely...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Subscribe to Updates</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
