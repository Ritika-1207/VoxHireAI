import React, { useState } from 'react';
import {
  PhoneCall,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building,
  Sparkles,
  ArrowLeft,
  Check,
} from 'lucide-react';
import {
  isValidEmail,
  isValidName,
  isValidPhone,
  loginAccount,
  saveRegisteredAccount,
  validatePassword,
} from '../../utils/storage';
import { WaveformVisualizer } from '../common/WaveformVisualizer';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onSuccess: (email: string) => void;
  onBackToHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'signup',
  onSuccess,
  onBackToHome,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'recruiter' | 'hiring_manager'>('recruiter');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(true);

  // Feedback states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password analysis
  const passwordAnalysis = validatePassword(password);

  const validateSignUpForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isValidName(name)) {
      newErrors.name = 'Please enter your full name (minimum 2 characters).';
    }
    if (!isValidEmail(email)) {
      newErrors.email = 'Please provide a valid work email address.';
    }
    if (!isValidPhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number (10 to 15 digits).';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!termsAgreed) {
      newErrors.terms = 'You must agree to the Terms of Service & Privacy Policy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLoginForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = 'Please enter your registered email address or phone.';
    }
    if (!password) {
      newErrors.password = 'Please enter your password.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateSignUpForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const res = saveRegisteredAccount({
        name,
        email,
        phone,
        password,
        role,
      });

      setIsSubmitting(false);

      if (!res.success) {
        setGeneralError(res.error || 'Failed to create account.');
      } else {
        setSuccessMessage(`Account created successfully! Welcome to VoxHire.AI, ${res.user?.name}.`);
        setTimeout(() => {
          onSuccess(email);
        }, 1200);
      }
    }, 600);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateLoginForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const res = loginAccount(email, password);
      setIsSubmitting(false);

      if (!res.success) {
        setGeneralError(res.error || 'Invalid credentials.');
      } else {
        setSuccessMessage(`Welcome back, ${res.user?.name}! Loading your screening workspace...`);
        setTimeout(() => {
          onSuccess(res.user?.email || email);
        }, 900);
      }
    }, 500);
  };

  const handleDemoFill = (type: 'admin' | 'candidate') => {
    if (type === 'admin') {
      setEmail('admin@voxhire.ai');
      setPassword('EnterprisePass2026!');
      setName('Sarah Jenkins');
      setPhone('+1 415 890 2341');
      setRole('admin');
    } else {
      setEmail('recruiter@voxhire.ai');
      setPassword('RecruitingTeam2026!');
      setName('Rahul Sharma');
      setPhone('+91 98765 43210');
      setRole('recruiter');
    }
    setErrors({});
    setGeneralError(null);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-3 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 gap-2">
        <button
          type="button"
          onClick={onBackToHome}
          className="flex items-center gap-1.5 group text-slate-400 hover:text-white transition-colors min-h-[38px] px-1"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform shrink-0" />
          <span className="text-xs font-semibold">Home</span>
        </button>

        <div className="flex items-center gap-2 font-bold text-white tracking-tight">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-600/30 text-white shrink-0">
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="text-sm sm:text-base">
            VoxHire<span className="text-cyan-400">.AI</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSuccess('admin@voxhire.ai')}
          className="px-2.5 sm:px-3 py-1.5 min-h-[38px] rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors whitespace-nowrap"
        >
          <span className="hidden sm:inline">Direct Dashboard Access ➔</span>
          <span className="sm:hidden">App ➔</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Left / Form Section (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              {/* Tab Mode Switcher */}
              <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-xl mb-6 max-w-xs">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrors({});
                    setGeneralError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    mode === 'signup'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrors({});
                    setGeneralError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    mode === 'login'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
              </div>

              {/* Title & Description */}
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {mode === 'signup' ? 'Join VoxHire.AI Platform' : 'Welcome Back'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                  {mode === 'signup'
                    ? 'Deploy natural voice screening agents to qualify candidates and handle calls 24/7.'
                    : 'Access your enterprise dashboard, screening transcripts, and live calling analytics.'}
                </p>
              </div>

              {/* Feedback Alerts */}
              {generalError && (
                <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5 mb-5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{generalError}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-start gap-2.5 mb-5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Sign Up Form */}
              {mode === 'signup' ? (
                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name <span className="text-rose-400">*</span>
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
                        placeholder="e.g. Sarah Jenkins"
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors.name
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-slate-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Work Email <span className="text-rose-400">*</span>
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
                          placeholder="sarah@company.com"
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                            errors.email
                              ? 'border-rose-500 focus:border-rose-500'
                              : 'border-slate-800 focus:border-indigo-500'
                          }`}
                        />
                      </div>
                      {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                          placeholder="+1 (555) 019-2834"
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                            errors.phone
                              ? 'border-rose-500 focus:border-rose-500'
                              : 'border-slate-800 focus:border-indigo-500'
                          }`}
                        />
                      </div>
                      {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Password & Confirm Password Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Password <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors({ ...errors, password: '' });
                          }}
                          placeholder="Min. 8 characters"
                          className={`w-full pl-10 pr-10 py-2.5 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                            errors.password
                              ? 'border-rose-500 focus:border-rose-500'
                              : 'border-slate-800 focus:border-indigo-500'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-[11px] text-rose-400 mt-1">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Confirm Password <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                          }}
                          placeholder="Re-enter password"
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                            errors.confirmPassword
                              ? 'border-rose-500 focus:border-rose-500'
                              : 'border-slate-800 focus:border-indigo-500'
                          }`}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-[11px] text-rose-400 mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>Password Strength:</span>
                        <span
                          className={`font-semibold ${
                            passwordAnalysis.score >= 3
                              ? 'text-emerald-400'
                              : passwordAnalysis.score === 2
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {passwordAnalysis.score >= 3 ? 'Strong' : passwordAnalysis.score === 2 ? 'Fair' : 'Weak'}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 h-1.5">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`rounded-full h-full transition-all ${
                              step <= passwordAnalysis.score
                                ? passwordAnalysis.score >= 3
                                  ? 'bg-emerald-500'
                                  : 'bg-amber-500'
                                : 'bg-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Role Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Primary Role
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'recruiter', label: 'Talent Recruiter' },
                        { id: 'hiring_manager', label: 'Hiring Lead' },
                        { id: 'admin', label: 'Enterprise Admin' },
                      ].map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setRole(r.id as any)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                            role === r.id
                              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Terms & Communications Consent */}
                  <div className="space-y-1 pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400">
                      <input
                        type="checkbox"
                        checked={termsAgreed}
                        onChange={(e) => {
                          setTermsAgreed(e.target.checked);
                          if (errors.terms) setErrors({ ...errors, terms: '' });
                        }}
                        className="mt-0.5 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                      />
                      <span className="leading-snug">
                        I agree to the{' '}
                        <a href="#terms" className="text-indigo-400 hover:underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#privacy" className="text-indigo-400 hover:underline">
                          Privacy Policy
                        </a>
                        . I consent to receive platform updates and technical screening alerts.
                      </span>
                    </label>
                    {errors.terms && <p className="text-[11px] text-rose-400">{errors.terms}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Setting Up Your Workspace...</span>
                    ) : (
                      <>
                        <span>Create Enterprise Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Login Form */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Email / Phone Field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address or Registered Phone
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        placeholder="admin@voxhire.ai or phone"
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors.email
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-slate-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">Password</label>
                      <button
                        type="button"
                        onClick={() => alert('Password reset link dispatched to registered email.')}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors({ ...errors, password: '' });
                        }}
                        placeholder="Enter your account password"
                        className={`w-full pl-10 pr-10 py-2.5 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          errors.password
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-slate-800 focus:border-indigo-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-[11px] text-rose-400 mt-1">{errors.password}</p>}
                  </div>

                  {/* Remember Me */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    <span>Remember this device for 30 days</span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Verifying Credentials...</span>
                    ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Fast 1-Click Demo Fill */}
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block mb-2.5">
                  Fast Demo Auto-Fill:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoFill('admin')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5 transition-colors"
                  >
                    <Building className="w-3 h-3 text-indigo-400" />
                    <span>Demo Admin (Sarah)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFill('candidate')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5 transition-colors"
                  >
                    <User className="w-3 h-3 text-cyan-400" />
                    <span>Demo Recruiter (Rahul)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom footnote */}
            <div className="pt-4 border-t border-slate-800/60 text-center text-xs text-slate-500">
              {mode === 'signup' ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrors({});
                      setGeneralError(null);
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Need an enterprise account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrors({});
                      setGeneralError(null);
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Create Account
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Right / Social Proof & Platform Highlight (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950/60 via-slate-950 to-slate-900 p-8 sm:p-10 border-t lg:border-t-0 lg:border-l border-slate-800/80 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-xs text-indigo-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Next-Gen Voice Intelligence</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  &ldquo;Let AI handle the calls. Let your team make the decisions.&rdquo;
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Screen hundreds of technical candidates, qualify leads with custom questions, and capture structured audio summaries in seconds.
                </p>
              </div>

              {/* Live Audio Preview Card */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-semibold text-white">Aria Voice Agent</span>
                  </div>
                  <span className="font-mono text-cyan-400">Live Active</span>
                </div>
                <WaveformVisualizer isActive={true} barCount={28} height={36} variant="dense" />
                <p className="text-[11px] text-slate-400 italic">
                  &ldquo;Hello! This is Aria from VoxHire.AI calling regarding your application...&rdquo;
                </p>
              </div>

              {/* Trust Features Checklist */}
              <div className="space-y-2.5 pt-2">
                {[
                  'Natural, sweet & human-like female voice cadence',
                  'Multi-language conversational switching (7 languages)',
                  'Automated transcripts & AI competency scoring',
                  'Enterprise data isolation with role-based access',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <div className="w-4 h-4 rounded-full bg-indigo-900/60 border border-indigo-500/40 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Badge */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>SOC2 Type II Compliant · 256-bit TLS Encryption · Human Review Always Enforced</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
