import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  PhoneCall,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  isValidEmail,
  isValidName,
  isValidPhone,
  loginAccount,
  saveRegisteredAccount,
} from '../../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onSuccess: (userEmail: string) => void;
  onOpenFullAuthPage?: (mode: 'login' | 'signup') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
  onOpenFullAuthPage,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [consent, setConsent] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (mode === 'signup') {
      if (!isValidName(name)) errs.name = 'Name must be at least 2 characters.';
      if (!isValidEmail(email)) errs.email = 'Valid work email required.';
      if (!isValidPhone(phone)) errs.phone = 'Valid 10–15 digit phone required.';
      if (!password || password.length < 8) errs.password = 'Password must be at least 8 characters.';
      if (!consent) errs.consent = 'Consent is required to create an account.';
    } else {
      if (!email.trim()) errs.email = 'Enter your email or phone.';
      if (!password) errs.password = 'Enter your password.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) return;

    if (mode === 'signup') {
      const res = saveRegisteredAccount({ name, email, phone, password });
      if (!res.success) {
        setGeneralError(res.error || 'Failed to register account.');
      } else {
        setSuccessMessage(`Account created! Welcome, ${res.user?.name}.`);
        setTimeout(() => {
          onSuccess(email);
          onClose();
        }, 900);
      }
    } else {
      const res = loginAccount(email, password);
      if (!res.success) {
        setGeneralError(res.error || 'Login failed.');
      } else {
        setSuccessMessage(`Welcome back, ${res.user?.name}!`);
        setTimeout(() => {
          onSuccess(res.user?.email || email);
          onClose();
        }, 800);
      }
    }
  };

  const handleGoogleAuth = () => {
    const demoEmail = 'enterprise.partner@voxhire.ai';
    onSuccess(demoEmail);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white text-base">VoxHire.AI</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="text-center">
            <h2 className="text-lg font-bold text-white">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-400 mt-1">
              {mode === 'login'
                ? 'Sign in to access your screening pipeline & AI agents.'
                : 'Sign up with your name, email, phone number & password.'}
            </p>
          </div>

          {generalError && (
            <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-3 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative px-3 bg-slate-900 text-slate-500 font-mono text-[10px] uppercase">
              Or with credentials
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="Jane Doe"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  {errors.name && <p className="text-[10px] text-rose-400 mt-0.5">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      placeholder="+1 (555) 019-2834"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-rose-400 mt-0.5">{errors.phone}</p>}
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-400 mb-1">
                {mode === 'signup' ? 'Work Email' : 'Email or Phone'}{' '}
                <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="admin@company.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              {errors.email && <p className="text-[10px] text-rose-400 mt-0.5">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder={mode === 'signup' ? 'Min. 8 characters' : 'Enter password'}
                  className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-rose-400 mt-0.5">{errors.password}</p>}
            </div>

            {mode === 'signup' && (
              <div>
                <label className="flex items-start gap-2 cursor-pointer text-slate-400 text-[11px] pt-1">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      if (errors.consent) setErrors({ ...errors, consent: '' });
                    }}
                    className="mt-0.5 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <span>
                    I consent to receive platform updates and technical notifications from VoxHire.AI.
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-[10px] text-rose-400 mt-0.5">{errors.consent}</p>
                )}
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent.')}
                  className="hover:text-indigo-400"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all mt-2 text-xs"
            >
              <span>{mode === 'login' ? 'Login' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="pt-2 text-center text-slate-400 text-xs">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrors({});
                    setGeneralError(null);
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Sign up
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrors({});
                    setGeneralError(null);
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Log in
                </button>
              </span>
            )}
          </div>

          {onOpenFullAuthPage && (
            <div className="pt-2 text-center border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullAuthPage(mode);
                }}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Open Full Screen Authentication Page ↗
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
