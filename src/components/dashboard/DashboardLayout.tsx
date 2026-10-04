import React, { useState } from 'react';
import {
  LayoutDashboard,
  PhoneCall,
  Phone,
  Users,
  Target,
  Sliders,
  Bot,
  BarChart3,
  Settings,
  Bell,
  Search,
  Sparkles,
  ExternalLink,
  Menu,
  X,
  Radio,
  Database,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { NotificationItem } from '../../types/database';
import { getCurrentUser } from '../../utils/storage';

export type DashboardViewType =
  | 'overview'
  | 'live_call'
  | 'calls'
  | 'candidates'
  | 'leads'
  | 'workflows'
  | 'agents'
  | 'analytics'
  | 'settings';

interface DashboardLayoutProps {
  currentView: DashboardViewType;
  onNavigate: (view: DashboardViewType) => void;
  onBackToLanding: () => void;
  onOpenDemo: () => void;
  onOpenSchema: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentView,
  onNavigate,
  onBackToLanding,
  onOpenDemo,
  onOpenSchema,
  notifications,
  onMarkNotificationRead,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const currentUser = getCurrentUser();
  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AD';

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems: { id: DashboardViewType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live_call', label: 'AI Call Monitor', icon: Radio, badge: 'Live' },
    { id: 'calls', label: 'Calls', icon: PhoneCall },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'leads', label: 'Leads', icon: Target },
    { id: 'workflows', label: 'Workflows', icon: Sliders },
    { id: 'agents', label: 'AI Agents', icon: Bot },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col antialiased">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 h-16 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 min-h-[42px] min-w-[42px] rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 md:hidden flex items-center justify-center transition-colors"
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white py-1.5 px-2 sm:px-2.5 min-h-[38px] rounded-lg hover:bg-slate-800 transition-colors"
            title="Return to Public Website"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Landing</span>
          </button>

          <div className="flex items-center gap-2 font-bold text-white tracking-tight">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
            <span className="hidden xs:inline lg:inline text-sm sm:text-base">
              VoxHire<span className="text-cyan-400">.AI</span>
            </span>
          </div>
        </div>

        {/* Center: Global Quick Search (Desktop) */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search candidates, phone numbers, workflows..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Right: Quick actions, notifications, user profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Test AI Screener button */}
          <button
            type="button"
            onClick={onOpenDemo}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[38px] rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-pink-600/20 transition-transform active:scale-95"
            title="Launch Interactive Audio Call Simulator"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            <span className="hidden sm:inline">Test AI Screener</span>
            <span className="sm:hidden text-[11px]">AI Call</span>
          </button>

          {/* Database Schema trigger */}
          <button
            type="button"
            onClick={onOpenSchema}
            className="p-2 min-h-[38px] min-w-[38px] rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors flex items-center justify-center"
            title="Supabase Schema & Telephony Architecture"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 min-h-[38px] min-w-[38px] rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-950" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-40 overflow-hidden text-xs">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
                  <span className="font-semibold text-white">Notifications</span>
                  <span className="font-mono text-slate-400">{unreadCount} unread</span>
                </div>
                <div className="divide-y divide-slate-800 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-3.5 cursor-pointer hover:bg-slate-800/60 transition-colors ${
                        !n.read ? 'bg-indigo-950/20' : ''
                      }`}
                    >
                      <div className="font-semibold text-slate-200">{n.title}</div>
                      <p className="text-slate-400 text-[11px] mt-0.5">{n.message}</p>
                      <span className="text-[10px] font-mono text-slate-500 mt-1 block">{n.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0">
              {initials}
            </div>
            <div className="hidden lg:block text-left text-xs leading-tight">
              <span className="font-semibold text-white block truncate max-w-[120px]">{currentUser?.name || 'Admin User'}</span>
              <span className="text-[11px] text-slate-400 truncate max-w-[120px]">{currentUser?.email || 'admin@voxhire.ai'}</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Mobile Backdrop overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800/80 transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 pt-16 md:pt-0 flex flex-col justify-between shadow-2xl md:shadow-none ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] uppercase font-mono font-semibold text-slate-400 tracking-wider">
              Autonomous Operations
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Bottom Box */}
          <div className="p-4 border-t border-slate-800/80 space-y-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 mb-1">
                <span>Call Minutes</span>
                <span className="text-white font-semibold">184 / 2,500</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '7.3%' }} />
              </div>
              <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                <span>Professional Plan</span>
                <span className="text-emerald-400">Nominal</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                onOpenDemo();
              }}
              className="w-full py-2.5 min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-indigo-300 font-medium flex items-center justify-center gap-1.5 transition-colors active:scale-98"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Launch Audio Simulator</span>
            </button>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 bg-[#0b0f19]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};
