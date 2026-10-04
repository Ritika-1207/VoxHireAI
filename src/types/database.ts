/**
 * VoxHire.AI Database Schema & Entity Definitions
 * Architecture designed for seamless integration with Supabase (PostgreSQL)
 * and modular Telephony/Speech/LLM APIs.
 */

export type UserRole = 'super_admin' | 'recruiter' | 'hiring_manager' | 'viewer';

export interface User {
  id: string;
  email: string;
  full_name: string;
  business_id: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Business {
  id: string;
  name: string;
  domain: string;
  plan: 'starter' | 'professional' | 'enterprise';
  call_minutes_allocated: number;
  call_minutes_used: number;
  telephony_provider: 'voxhire_managed' | 'custom_twilio' | 'custom_livekit';
  created_at: string;
}

export type AIAgentStatus = 'active' | 'inactive' | 'training';
export type AIAgentPurpose = 'candidate_screening' | 'lead_qualification' | 'customer_support' | 'appointment_booking' | 'follow_up';

export interface AIAgent {
  id: string;
  business_id: string;
  name: string;
  purpose: AIAgentPurpose;
  status: AIAgentStatus;
  voice_id: string;
  voice_name: string;
  voice_accent: string;
  voice_gender?: 'female' | 'male';
  voice_tone?: string;
  supported_languages?: string[];
  greeting_message: string;
  screening_criteria?: {
    min_experience_years?: number;
    required_skills?: string[];
    max_salary_lpa?: number;
    notice_period_days?: number;
    target_locations?: string[];
  };
  calls_handled: number;
  success_rate: number; // percentage
  created_at: string;
  updated_at: string;
}

export interface WorkflowQuestion {
  id: string;
  workflow_id: string;
  question_text: string;
  expected_type: 'open_text' | 'years_number' | 'currency' | 'duration_days' | 'boolean' | 'multiple_choice';
  criteria_key?: string;
  is_mandatory: boolean;
  order_index: number;
}

export interface Workflow {
  id: string;
  business_id: string;
  name: string;
  purpose: AIAgentPurpose;
  job_role: string;
  agent_id: string;
  status: 'active' | 'draft' | 'archived';
  questions: WorkflowQuestion[];
  screening_criteria: {
    min_experience_years: number;
    required_skills: string[];
    max_salary_lpa: number;
    max_notice_period_days: number;
    locations: string[];
  };
  total_screened: number;
  qualification_rate: number;
  created_at: string;
}

export type CallDirection = 'inbound' | 'outbound';
export type CallStatus = 'in_progress' | 'completed' | 'no_answer' | 'busy' | 'callback_requested' | 'failed';
export type CallOutcome = 'qualified' | 'review' | 'not_suitable' | 'incomplete';

export interface CallTranscriptItem {
  id: string;
  call_id: string;
  speaker: 'ai' | 'candidate' | 'caller';
  timestamp_seconds: number;
  formatted_time: string;
  text: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface CallSummary {
  id: string;
  call_id: string;
  experience_summary: string;
  skills_identified: string[];
  expected_salary: string;
  notice_period: string;
  availability: string;
  communication_rating: 'Exceptional' | 'Good' | 'Fair' | 'Needs Improvement';
  interest_level: 'High' | 'Medium' | 'Low';
  overall_score: number; // 0 - 100
  ai_recommendation: string; // Decision support rationale
  flags?: string[];
  strengths?: string[];
  recruiter_action_item?: string;
}

export interface CallRecord {
  id: string;
  business_id: string;
  agent_id: string;
  agent_name: string;
  workflow_id: string;
  workflow_name: string;
  candidate_id?: string;
  lead_id?: string;
  contact_name: string;
  contact_phone: string;
  direction: CallDirection;
  purpose: string;
  status: CallStatus;
  outcome: CallOutcome;
  duration_seconds: number;
  duration_formatted: string;
  selected_language?: string;
  ai_disclosure_completed?: boolean;
  started_at: string;
  ended_at?: string;
  ai_score: number;
  recording_url?: string;
  has_recording: boolean;
  transcript: CallTranscriptItem[];
  summary?: CallSummary;
}

export type CandidateStatus = 'Shortlisted' | 'Review' | 'Not Suitable' | 'Contacted' | 'Hired';

export interface RecruiterNote {
  id: string;
  candidate_id: string;
  author_name: string;
  author_role: string;
  content: string;
  created_at: string;
}

export interface Candidate {
  id: string;
  business_id: string;
  name: string;
  avatar_url?: string;
  role: string;
  phone: string;
  email: string;
  location: string;
  experience_years: number;
  skills: string[];
  expected_salary: string;
  notice_period_days: number;
  availability: string;
  ai_score: number;
  status: CandidateStatus;
  primary_call_id?: string;
  call_date: string;
  recruiter_notes: RecruiterNote[];
  timeline: {
    title: string;
    timestamp: string;
    description: string;
    type: 'call' | 'status_change' | 'note' | 'application';
  }[];
}

export interface Lead {
  id: string;
  business_id: string;
  contact_name: string;
  company_name: string;
  phone: string;
  email: string;
  service_interest: string;
  budget_range: string;
  timeline: string;
  ai_score: number;
  qualification_status: 'Qualified' | 'Follow-up' | 'Disqualified';
  last_call_at: string;
  call_id?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'call_completed' | 'candidate_shortlisted' | 'system' | 'alert';
  timestamp: string;
  read: boolean;
  related_id?: string;
}

export interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'recruiter' | 'hiring_manager';
  created_at: string;
  last_login_at?: string;
}

export interface NewsletterSubscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  consented_at: string;
  status: 'active' | 'unsubscribed';
  source: string;
}

/**
 * PostgreSQL DDL Export for Supabase migrations
 */
export const SUPABASE_POSTGRES_SCHEMA_SQL = `-- VoxHire.AI Production Schema (Supabase / PostgreSQL)
-- Enables Row Level Security (RLS) for multi-tenant isolation

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Businesses / Workspaces
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  call_minutes_allocated INT NOT NULL DEFAULT 500,
  call_minutes_used INT NOT NULL DEFAULT 0,
  telephony_provider TEXT NOT NULL DEFAULT 'voxhire_managed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'recruiter' CHECK (role IN ('super_admin', 'recruiter', 'hiring_manager', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Agents
CREATE TABLE ai_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'training')),
  voice_id TEXT NOT NULL,
  voice_name TEXT NOT NULL,
  greeting_message TEXT NOT NULL,
  calls_handled INT NOT NULL DEFAULT 0,
  success_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workflows
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  purpose TEXT NOT NULL,
  job_role TEXT NOT NULL,
  agent_id UUID REFERENCES ai_agents(id) ON DELETE SET NULL,
  screening_criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workflow Questions
CREATE TABLE workflow_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  expected_type TEXT NOT NULL,
  order_index INT NOT NULL,
  is_mandatory BOOLEAN NOT NULL DEFAULT true
);

-- Candidates
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT,
  experience_years NUMERIC(4,1),
  skills TEXT[] NOT NULL DEFAULT '{}',
  expected_salary TEXT,
  notice_period_days INT,
  ai_score INT CHECK (ai_score BETWEEN 0 AND 100),
  status TEXT NOT NULL DEFAULT 'Review',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Calls
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES ai_agents(id) ON DELETE SET NULL,
  workflow_id UUID REFERENCES workflows(id) ON DELETE SET NULL,
  candidate_id UUID REFERENCES candidates(id) ON DELETE SET NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'no_answer', 'busy', 'callback_requested', 'failed')),
  outcome TEXT NOT NULL CHECK (outcome IN ('qualified', 'review', 'not_suitable', 'incomplete')),
  duration_seconds INT NOT NULL DEFAULT 0,
  ai_score INT,
  recording_url TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Call Transcripts (Granular turns)
CREATE TABLE call_transcripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  speaker TEXT NOT NULL CHECK (speaker IN ('ai', 'candidate', 'caller')),
  timestamp_seconds NUMERIC(6,2) NOT NULL,
  text TEXT NOT NULL
);

-- Call Summaries (AI Structured Extraction)
CREATE TABLE call_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id UUID UNIQUE NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  experience_summary TEXT NOT NULL,
  skills_identified TEXT[] NOT NULL DEFAULT '{}',
  expected_salary TEXT,
  availability TEXT,
  communication_rating TEXT,
  interest_level TEXT,
  overall_score INT NOT NULL,
  ai_recommendation TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Recruiter Notes
CREATE TABLE recruiter_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;
