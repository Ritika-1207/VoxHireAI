import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Sliders,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Bot,
  HelpCircle,
} from 'lucide-react';
import { Workflow, WorkflowQuestion, AIAgentPurpose } from '../../types/database';

interface WorkflowsViewProps {
  workflows: Workflow[];
  onSaveWorkflow: (workflow: Workflow) => void;
}

export const WorkflowsView: React.FC<WorkflowsViewProps> = ({
  workflows,
  onSaveWorkflow,
}) => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(workflows[0]?.id || 'new');
  const [workflowName, setWorkflowName] = useState('Software Developer Screening');
  const [purpose, setPurpose] = useState<AIAgentPurpose>('candidate_screening');
  const [jobRole, setJobRole] = useState('Software Developer');

  // Screening criteria
  const [minExp, setMinExp] = useState(2);
  const [requiredSkills, setRequiredSkills] = useState('Java, SQL, REST APIs');
  const [maxSalary, setMaxSalary] = useState(8.5);
  const [noticePeriod, setNoticePeriod] = useState(30);
  const [location, setLocation] = useState('Bangalore, Hyderabad, Hybrid');

  // Questions
  const [questions, setQuestions] = useState<WorkflowQuestion[]>([
    {
      id: 'q-1',
      workflow_id: 'wf-1',
      question_text: 'Tell me about your experience.',
      expected_type: 'open_text',
      is_mandatory: true,
      order_index: 1,
    },
    {
      id: 'q-2',
      workflow_id: 'wf-1',
      question_text: 'What programming languages do you know?',
      expected_type: 'open_text',
      is_mandatory: true,
      order_index: 2,
    },
    {
      id: 'q-3',
      workflow_id: 'wf-1',
      question_text: 'How many years of Java experience do you have?',
      expected_type: 'years_number',
      is_mandatory: true,
      order_index: 3,
    },
    {
      id: 'q-4',
      workflow_id: 'wf-1',
      question_text: 'What is your expected salary?',
      expected_type: 'currency',
      is_mandatory: true,
      order_index: 4,
    },
    {
      id: 'q-5',
      workflow_id: 'wf-1',
      question_text: 'What is your notice period?',
      expected_type: 'duration_days',
      is_mandatory: true,
      order_index: 5,
    },
    {
      id: 'q-6',
      workflow_id: 'wf-1',
      question_text: 'Are you available for an interview?',
      expected_type: 'boolean',
      is_mandatory: true,
      order_index: 6,
    },
  ]);

  const [toast, setToast] = useState<string | null>(null);

  const handleAddQuestion = () => {
    const newQ: WorkflowQuestion = {
      id: `q-${Date.now()}`,
      workflow_id: selectedWorkflowId,
      question_text: '',
      expected_type: 'open_text',
      is_mandatory: true,
      order_index: questions.length + 1,
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (id: string) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleQuestionTextChange = (id: string, text: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, question_text: text } : q))
    );
  };

  const handleSave = () => {
    const updated: Workflow = {
      id: selectedWorkflowId === 'new' ? `wf-${Date.now()}` : selectedWorkflowId,
      business_id: 'biz-1',
      name: workflowName,
      purpose,
      job_role: jobRole,
      agent_id: 'agent-1',
      status: 'active',
      total_screened: 640,
      qualification_rate: 68.5,
      created_at: new Date().toISOString(),
      questions: questions.map((q, idx) => ({ ...q, order_index: idx + 1 })),
      screening_criteria: {
        min_experience_years: Number(minExp),
        required_skills: requiredSkills.split(',').map((s) => s.trim()),
        max_salary_lpa: Number(maxSalary),
        max_notice_period_days: Number(noticePeriod),
        locations: location.split(',').map((s) => s.trim()),
      },
    };

    onSaveWorkflow(updated);
    setToast(`Workflow "${workflowName}" successfully saved & deployed to active AI agents.`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toast && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Create AI Screening Workflow</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure conversational questions, benchmark criteria, and preview simulated candidate phone dialogues.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Workflow</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form Builder (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* General Role Configuration */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
            <h2 className="text-sm font-semibold text-white">General Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Workflow Name</label>
                <input
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Purpose</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="candidate_screening">Candidate Screening</option>
                  <option value="lead_qualification">Lead Qualification</option>
                  <option value="customer_support">Customer Support</option>
                  <option value="appointment_booking">Appointment Booking</option>
                  <option value="follow_up">Follow-ups</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Target Job / Role</label>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Software Developer, Account Executive"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Screening Criteria */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
            <h2 className="text-sm font-semibold text-white">Screening Criteria</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Minimum Experience (Years)</label>
                <input
                  type="number"
                  value={minExp}
                  onChange={(e) => setMinExp(Number(e.target.value))}
                  min={0}
                  step={0.5}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Maximum Salary (LPA / Budget)</label>
                <input
                  type="number"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(Number(e.target.value))}
                  min={0}
                  step={0.5}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Notice Period (Days)</label>
                <input
                  type="number"
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(Number(e.target.value))}
                  min={0}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Target Locations</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={requiredSkills}
                  onChange={(e) => setRequiredSkills(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Questions Builder */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">Screening Questions ({questions.length})</h2>
                <p className="text-xs text-slate-400">The AI agent will ask these questions in conversational sequence.</p>
              </div>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Question</span>
              </button>
            </div>

            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 group"
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-1">
                    {idx + 1}
                  </span>

                  <div className="flex-1">
                    <input
                      type="text"
                      value={q.question_text}
                      onChange={(e) => handleQuestionTextChange(q.id, e.target.value)}
                      placeholder={`Question ${idx + 1}...`}
                      className="w-full p-2 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none focus:border-b focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(q.id)}
                    disabled={questions.length <= 1}
                    className="p-1.5 text-slate-500 hover:text-rose-400 disabled:opacity-20 transition-colors"
                    title="Remove Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors"
              >
                Save Workflow
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Live Call Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl sticky top-20">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Bot className="w-4 h-4 text-cyan-400" />
              <div>
                <h3 className="text-sm font-bold text-white">AI Voice Call Preview</h3>
                <p className="text-[11px] text-slate-400">Simulation of how the AI agent conducts this call</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-1 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-indigo-900/40 text-slate-200">
                <span className="text-[10px] font-mono text-indigo-400 block mb-1">
                  1. GREETING &amp; PERMISSION
                </span>
                <p className="italic">
                  &ldquo;Hello! I'm calling from VoxHire.AI regarding your application for {jobRole}. Is this a good time to speak for 3 minutes?&rdquo;
                </p>
              </div>

              {questions.map((q, idx) => (
                <div key={q.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-300">
                  <span className="text-[10px] font-mono text-cyan-400 block mb-1">
                    QUESTION {idx + 1}
                  </span>
                  <p className="font-medium text-slate-100">
                    &ldquo;{q.question_text || `[Question ${idx + 1} Pending]`}&rdquo;
                  </p>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Expected extraction: {q.expected_type.replace('_', ' ')}
                  </span>
                </div>
              ))}

              <div className="p-3 rounded-xl bg-slate-950 border border-indigo-900/40 text-slate-200">
                <span className="text-[10px] font-mono text-indigo-400 block mb-1">
                  CONCLUSION &amp; NEXT STEPS
                </span>
                <p className="italic">
                  &ldquo;Thank you for sharing your details. Our recruitment team will review the responses against our criteria ({minExp}+ years exp, {requiredSkills}) and reach out promptly. Have a great day!&rdquo;
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Estimated duration: ~3m 30s</span>
              <span className="text-emerald-400 font-medium">Ready to deploy</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
