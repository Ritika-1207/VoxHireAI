import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (planName: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Starter',
      target: 'For small teams',
      priceMonthly: 149,
      priceAnnual: 119,
      buttonLabel: 'Start Free',
      popular: false,
      features: [
        '500 AI call minutes / mo',
        '1 Active AI agent',
        'Call summaries & transcripts',
        'Basic call analytics',
        'Standard voice latency (~400ms)',
        'Email customer support',
      ],
    },
    {
      name: 'Professional',
      target: 'For growing businesses',
      priceMonthly: 499,
      priceAnnual: 399,
      buttonLabel: 'Choose Plan',
      popular: true,
      features: [
        '2,500 AI call minutes / mo',
        '5 Active AI agents',
        'Advanced analytics & metrics',
        'Custom workflow builder',
        'Candidate management & filters',
        'Ultra-low latency voices (~240ms)',
        'ATS & Webhook integrations',
        'Priority email & Slack support',
      ],
    },
    {
      name: 'Enterprise',
      target: 'For large organizations',
      priceMonthly: null, // Custom
      priceAnnual: null,
      buttonLabel: 'Contact Sales',
      popular: false,
      features: [
        'Custom high-volume call minutes',
        'Unlimited AI agents & workflows',
        'Custom voice cloning & accents',
        'Dedicated SIP trunking (BYO carrier)',
        'Custom ATS & HRIS integrations',
        'SSO & SAML role-based access',
        '99.9% uptime SLA guarantee',
        'Dedicated Technical Account Manager',
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">
            Flexible Deployment Plans
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2 mb-3 tracking-tight">
            Transparent, Predictable Voice Pricing
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Scale seamlessly from initial screening pilots to enterprise-grade conversational operations.
          </p>

          {/* Billing Switch */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-xs ${billingCycle === 'monthly' ? 'text-white font-medium' : 'text-slate-400'}`}>
              Monthly billing
            </span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-800 border border-slate-700 transition-colors"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-indigo-500 transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-xs flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-white font-medium' : 'text-slate-400'}`}>
              Annual billing
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={idx}
                className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-200 ${
                  plan.popular
                    ? 'bg-slate-900 border-indigo-500/60 shadow-xl shadow-indigo-500/10'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-semibold tracking-wide shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.target}</p>

                  <div className="mt-4 flex items-baseline gap-1">
                    {price !== null ? (
                      <>
                        <span className="text-4xl font-extrabold text-white font-mono tabular-nums">
                          ${price}
                        </span>
                        <span className="text-xs text-slate-400">/ month</span>
                      </>
                    ) : (
                      <span className="text-3xl font-extrabold text-white">Custom</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => onSelectPlan(plan.name)}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {plan.buttonLabel}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
