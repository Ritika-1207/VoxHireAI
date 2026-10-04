import React, { useState } from 'react';
import {
  Building,
  Phone,
  Shield,
  Key,
  Database,
  Users,
  CheckCircle2,
  Save,
  Server,
  Lock,
  Bell,
  Mail,
  Download,
} from 'lucide-react';
import { getRegisteredAccounts, getSubscribers } from '../../utils/storage';

interface SettingsViewProps {
  onOpenSchemaModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenSchemaModal }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'telephony' | 'database' | 'team' | 'subscribers'>('general');
  const [toast, setToast] = useState<string | null>(null);

  const registeredUsers = getRegisteredAccounts();
  const subscribersList = getSubscribers();

  // Form states
  const [companyName, setCompanyName] = useState('Nexus Talent Enterprises');
  const [domain, setDomain] = useState('nexustalent.io');
  const [defaultLatency, setDefaultLatency] = useState('low_latency_240ms');
  const [telephonyProvider, setTelephonyProvider] = useState('voxhire_managed');
  const [webhookUrl, setWebhookUrl] = useState('https://api.nexustalent.io/webhooks/voxhire-call-completed');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast('Configuration settings updated successfully.');
    setTimeout(() => setToast(null), 3000);
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
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Workspace &amp; Telephony Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure telephony SIP trunking, Supabase synchronization, webhook endpoints, and team access.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 text-xs font-medium overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-2.5 px-3 border-b-2 transition-colors shrink-0 ${
            activeTab === 'general' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Company &amp; Workspace
        </button>
        <button
          onClick={() => setActiveTab('telephony')}
          className={`pb-2.5 px-3 border-b-2 transition-colors shrink-0 ${
            activeTab === 'telephony' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Telephony &amp; Voice Providers
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`pb-2.5 px-3 border-b-2 transition-colors shrink-0 ${
            activeTab === 'database' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Supabase &amp; Webhooks
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`pb-2.5 px-3 border-b-2 transition-colors shrink-0 ${
            activeTab === 'team' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Team &amp; Roles (RBAC)
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'subscribers' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Subscribers &amp; Sign-ups ({subscribersList.length + registeredUsers.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl max-w-3xl">
        {activeTab === 'general' && (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <h2 className="text-sm font-semibold text-white mb-2">Company Information</h2>

            <div>
              <label className="block text-slate-400 mb-1">Company / Workspace Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Company Domain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Current Subscription Tier</label>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Professional Plan</div>
                  <div className="text-[11px] text-slate-400">2,500 call minutes / month (184 minutes used)</div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-medium">
                  Active
                </span>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {activeTab === 'telephony' && (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <h2 className="text-sm font-semibold text-white mb-1">Telephony Infrastructure</h2>
            <p className="text-slate-400 mb-4">
              Select whether you prefer VoxHire.AI's zero-config managed SIP network or custom Twilio / LiveKit BYOC.
            </p>

            <div>
              <label className="block text-slate-400 mb-1">Telephony Carrier Routing</label>
              <select
                value={telephonyProvider}
                onChange={(e) => setTelephonyProvider(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="voxhire_managed">VoxHire.AI Managed High-Availability Telephony (Default)</option>
                <option value="custom_twilio">Custom Twilio SIP Trunk (Bring Your Own Carrier)</option>
                <option value="custom_livekit">LiveKit WebRTC Server (Custom On-Premises)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Voice Latency Target Profile</label>
              <select
                value={defaultLatency}
                onChange={(e) => setDefaultLatency(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="low_latency_240ms">Ultra-Low Latency (~240ms - Deepgram + Cartesia)</option>
                <option value="ultra_expressive_400ms">Ultra-Expressive (~400ms - ElevenLabs Turbo)</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              <div className="font-semibold text-slate-200 mb-1">Compliance Greeting Requirement:</div>
              All autonomous calls made through VoxHire.AI automatically include an upfront caller disclosure identifying the conversational voice agent, satisfying global communications regulations.
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
              >
                Update Telephony Engine
              </button>
            </div>
          </form>
        )}

        {activeTab === 'database' && (
          <div className="space-y-5 text-xs">
            <div>
              <h2 className="text-sm font-semibold text-white mb-1">Database &amp; Webhooks</h2>
              <p className="text-slate-400">
                Synchronize VoxHire.AI screening records directly to your Supabase PostgreSQL instance and ATS webhooks.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                  <Database className="w-4 h-4" />
                  <span>Supabase Database Schema</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenSchemaModal}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium"
                >
                  View DDL SQL &amp; ERD
                </button>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                VoxHire.AI stores data across 12 normalized tables with multi-tenant row level security. Click above to view the ready-to-run PostgreSQL schema script.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">ATS / CRM Webhook Callback URL</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-crm.com/webhooks/call-completed"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
                >
                  Save Webhook URL
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">Workspace Members &amp; Roles</h2>
                <p className="text-slate-400">Role-based access control (RBAC) enforced per enterprise standards.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setToast('Invite email sent to team member.');
                  setTimeout(() => setToast(null), 3000);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
              >
                + Invite Teammate
              </button>
            </div>

            <div className="divide-y divide-slate-800 border-t border-slate-800">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Admin User (You)</div>
                  <div className="text-slate-400 text-[11px]">admin@nexustalent.io</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 font-mono text-[10px]">
                  Super Admin
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Priya Sundaram</div>
                  <div className="text-slate-400 text-[11px]">priya.s@nexustalent.io</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[10px]">
                  Lead Recruiter
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Vikram Malhotra</div>
                  <div className="text-slate-400 text-[11px]">vikram.m@nexustalent.io</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[10px]">
                  Hiring Manager
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="space-y-6 text-xs">
            {/* Stay Updated Subscribers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-400" />
                    <span>Product Updates Subscribers</span>
                  </h2>
                  <p className="text-slate-400 text-[11px]">
                    Visitors who opted-in through the &ldquo;Stay Updated&rdquo; landing section.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(subscribersList, null, 2));
                    const dl = document.createElement('a');
                    dl.setAttribute('href', dataStr);
                    dl.setAttribute('download', `voxhire-subscribers-${Date.now()}.json`);
                    dl.click();
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Export JSON</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80">
                {subscribersList.length === 0 ? (
                  <div className="p-6 text-center text-slate-500">No subscribers registered yet.</div>
                ) : (
                  subscribersList.map((sub) => (
                    <div key={sub.id} className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{sub.name}</span>
                          <span className="px-1.5 py-0.2 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded text-[9px]">
                            Opted In
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 text-[11px] mt-0.5">
                          <span>{sub.email}</span>
                          <span>·</span>
                          <span className="font-mono">{sub.phone}</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Subscribed: {new Date(sub.consented_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Registered Accounts */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>Registered User Accounts</span>
                  </h2>
                  <p className="text-slate-400 text-[11px]">
                    Users who created credentials via Sign Up / Login with name, email, phone &amp; password.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80">
                {registeredUsers.map((usr) => (
                  <div key={usr.id} className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{usr.name}</span>
                        <span className="px-1.5 py-0.2 bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 rounded text-[9px] uppercase font-mono">
                          {usr.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 text-[11px] mt-0.5">
                        <span>{usr.email}</span>
                        <span>·</span>
                        <span className="font-mono">{usr.phone}</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Created: {new Date(usr.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
