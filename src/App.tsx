import React, { useState } from 'react';
import { LandingNavbar } from './components/landing/LandingNavbar';
import { HeroSection } from './components/landing/HeroSection';
import { ProblemSection } from './components/landing/ProblemSection';
import { HowItWorksSection } from './components/landing/HowItWorksSection';
import { UseCasesSection } from './components/landing/UseCasesSection';
import { SecurityTrustSection } from './components/landing/SecurityTrustSection';
import { PricingSection } from './components/landing/PricingSection';
import { StayUpdatedSection } from './components/landing/StayUpdatedSection';
import { LandingFooter } from './components/landing/LandingFooter';

import { DashboardLayout, DashboardViewType } from './components/dashboard/DashboardLayout';
import { OverviewView } from './components/dashboard/OverviewView';
import { LiveCallScreen } from './components/dashboard/LiveCallScreen';
import { CandidatesView } from './components/dashboard/CandidatesView';
import { CandidateDetailModal } from './components/dashboard/CandidateDetailModal';
import { CallsView } from './components/dashboard/CallsView';
import { WorkflowsView } from './components/dashboard/WorkflowsView';
import { AgentsView } from './components/dashboard/AgentsView';
import { LeadsView } from './components/dashboard/LeadsView';
import { AnalyticsView } from './components/dashboard/AnalyticsView';
import { SettingsView } from './components/dashboard/SettingsView';

import { SchemaViewerModal } from './components/common/SchemaViewerModal';
import { InteractiveCallDemoModal } from './components/dashboard/InteractiveCallDemoModal';
import { AuthModal } from './components/dashboard/AuthModal';
import { AuthPage } from './components/auth/AuthPage';

import {
  INITIAL_AGENTS,
  INITIAL_CALLS,
  INITIAL_CANDIDATES,
  INITIAL_NOTIFICATIONS,
  INITIAL_WORKFLOWS,
} from './data/mockData';
import { AIAgent, CallRecord, Candidate, CandidateStatus, Workflow } from './types/database';

export default function App() {
  // Navigation mode: 'landing' vs 'dashboard' vs 'auth'
  const [appMode, setAppMode] = useState<'landing' | 'dashboard' | 'auth'>('dashboard');
  const [dashboardView, setDashboardView] = useState<DashboardViewType>('overview');

  // Interactive state
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [calls, setCalls] = useState<CallRecord[]>(INITIAL_CALLS);
  const [agents, setAgents] = useState<AIAgent[]>(INITIAL_AGENTS);
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Selected candidate for detail drawer
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Modals
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Candidate status update
  const handleStatusChange = (candidateId: string, newStatus: CandidateStatus) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          return {
            ...c,
            status: newStatus,
            timeline: [
              {
                title: `Status Updated to ${newStatus}`,
                timestamp: 'Just now',
                description: `Recruiter updated candidate status to ${newStatus}.`,
                type: 'status_change',
              },
              ...c.timeline,
            ],
          };
        }
        return c;
      })
    );

    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Add Recruiter Note
  const handleAddNote = (candidateId: string, noteContent: string) => {
    const newNoteObj = {
      id: `note-${Date.now()}`,
      candidate_id: candidateId,
      author_name: 'Admin User',
      author_role: 'Hiring Lead',
      content: noteContent,
      created_at: new Date().toISOString(),
    };

    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          return {
            ...c,
            recruiter_notes: [newNoteObj, ...c.recruiter_notes],
            timeline: [
              {
                title: 'Recruiter Note Added',
                timestamp: 'Just now',
                description: noteContent.slice(0, 70) + (noteContent.length > 70 ? '...' : ''),
                type: 'note',
              },
              ...c.timeline,
            ],
          };
        }
        return c;
      })
    );

    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate((prev) =>
        prev
          ? {
              ...prev,
              recruiter_notes: [newNoteObj, ...prev.recruiter_notes],
            }
          : null
      );
    }
  };

  // Toggle Agent Active/Inactive
  const handleToggleAgentStatus = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' }
          : a
      )
    );
  };

  // Create new Agent
  const handleCreateAgent = (newAgent: AIAgent) => {
    setAgents([newAgent, ...agents]);
  };

  // Save workflow
  const handleSaveWorkflow = (newWf: Workflow) => {
    setWorkflows((prev) => {
      const idx = prev.findIndex((w) => w.id === newWf.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newWf;
        return copy;
      }
      return [newWf, ...prev];
    });
  };

  // Handle completed interactive demo call
  const handleDemoCallCompleted = (completedCall: CallRecord) => {
    setCalls([completedCall, ...calls]);
    setNotifications([
      {
        id: `notif-${Date.now()}`,
        title: 'New Screening Completed (Demo)',
        message: 'Interactive call completed with AI readiness score 90/100.',
        type: 'call_completed',
        timestamp: 'Just now',
        read: false,
      },
      ...notifications,
    ]);
  };

  // Mark notification read
  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top persistent mode switcher so evaluators can seamlessly jump between Pitch Landing Page & SaaS Workspace */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-xs text-slate-400 z-50">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">VoxHire.AI Demo Mode:</span>
          <span className="text-[11px] font-mono text-cyan-400">
            {appMode === 'dashboard' ? 'Operational SaaS Dashboard' : 'Public Commercial Landing Page'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAppMode('landing')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              appMode === 'landing'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Landing Page
          </button>
          <button
            type="button"
            onClick={() => setAppMode('dashboard')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              appMode === 'dashboard'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            SaaS Dashboard
          </button>
        </div>
      </div>

      {/* VIEW 1: Commercial Landing Page */}
      {appMode === 'landing' && (
        <div className="flex-1 flex flex-col">
          <LandingNavbar
            onOpenDashboard={() => setAppMode('dashboard')}
            onOpenLogin={() => {
              setAuthMode('login');
              setAppMode('auth');
            }}
            onOpenSignUp={() => {
              setAuthMode('signup');
              setAppMode('auth');
            }}
            onOpenDemo={() => setIsDemoModalOpen(true)}
            onOpenSchema={() => setIsSchemaModalOpen(true)}
          />

          <main className="flex-1">
            <HeroSection
              onStartScreening={() => setAppMode('dashboard')}
              onWatchDemo={() => setIsDemoModalOpen(true)}
            />
            <ProblemSection />
            <HowItWorksSection />
            <UseCasesSection />
            <SecurityTrustSection />
            <StayUpdatedSection />
            <PricingSection
              onSelectPlan={() => {
                setAuthMode('signup');
                setAppMode('auth');
              }}
            />
          </main>

          <LandingFooter
            onOpenDashboard={() => setAppMode('dashboard')}
            onOpenSchema={() => setIsSchemaModalOpen(true)}
          />
        </div>
      )}

      {/* VIEW 2: Dedicated Full-Screen Authentication Page (Sign Up & Login) */}
      {appMode === 'auth' && (
        <AuthPage
          initialMode={authMode}
          onBackToHome={() => setAppMode('landing')}
          onSuccess={() => {
            setAppMode('dashboard');
          }}
        />
      )}

      {/* VIEW 2: SaaS Operational Dashboard Workspace */}
      {appMode === 'dashboard' && (
        <DashboardLayout
          currentView={dashboardView}
          onNavigate={(view) => setDashboardView(view)}
          onBackToLanding={() => setAppMode('landing')}
          onOpenDemo={() => setIsDemoModalOpen(true)}
          onOpenSchema={() => setIsSchemaModalOpen(true)}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
        >
          {dashboardView === 'overview' && (
            <OverviewView
              onNavigateToCalls={() => setDashboardView('calls')}
              onNavigateToLiveCall={() => setDashboardView('live_call')}
              onSelectCallRecord={(call) => {
                const found = candidates.find((c) => c.id === call.candidate_id);
                if (found) {
                  setSelectedCandidate(found);
                } else {
                  setDashboardView('calls');
                }
              }}
              onNavigateToCandidates={() => setDashboardView('candidates')}
            />
          )}

          {dashboardView === 'live_call' && (
            <LiveCallScreen
              onViewCandidateProfile={(candId) => {
                const found = candidates.find((c) => c.id === candId);
                if (found) setSelectedCandidate(found);
              }}
              onOpenTwoWayVoice={() => setIsDemoModalOpen(true)}
            />
          )}

          {dashboardView === 'candidates' && (
            <CandidatesView
              candidates={candidates}
              onSelectCandidate={(cand) => setSelectedCandidate(cand)}
              onStatusChange={handleStatusChange}
            />
          )}

          {dashboardView === 'calls' && (
            <CallsView
              calls={calls}
              onSelectCall={(c) => {
                const found = candidates.find((cand) => cand.id === c.candidate_id);
                if (found) setSelectedCandidate(found);
              }}
            />
          )}

          {dashboardView === 'leads' && <LeadsView />}

          {dashboardView === 'workflows' && (
            <WorkflowsView
              workflows={workflows}
              onSaveWorkflow={handleSaveWorkflow}
            />
          )}

          {dashboardView === 'agents' && (
            <AgentsView
              agents={agents}
              onToggleStatus={handleToggleAgentStatus}
              onCreateAgent={handleCreateAgent}
            />
          )}

          {dashboardView === 'analytics' && <AnalyticsView />}

          {dashboardView === 'settings' && (
            <SettingsView onOpenSchemaModal={() => setIsSchemaModalOpen(true)} />
          )}
        </DashboardLayout>
      )}

      {/* Global Modals */}

      {/* Candidate Profile Drawer */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        isOpen={Boolean(selectedCandidate)}
        onClose={() => setSelectedCandidate(null)}
        onStatusChange={handleStatusChange}
        onAddNote={handleAddNote}
      />

      {/* Interactive AI Call Demo Simulator */}
      <InteractiveCallDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onCallCompleted={handleDemoCallCompleted}
      />

      {/* Database Schema & Telephony Architecture Modal */}
      <SchemaViewerModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
      />

      {/* Auth Modal (Login / Signup) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={() => {
          setAppMode('dashboard');
        }}
        onOpenFullAuthPage={(mode) => {
          setIsAuthModalOpen(false);
          setAuthMode(mode);
          setAppMode('auth');
        }}
      />

    </div>
  );
}
