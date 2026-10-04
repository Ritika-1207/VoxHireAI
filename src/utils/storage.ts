import { NewsletterSubscriber, RegisteredAccount } from '../types/database';

const STORAGE_KEY_USERS = 'voxhire_registered_accounts_v1';
const STORAGE_KEY_CURRENT_USER = 'voxhire_active_session_v1';
const STORAGE_KEY_SUBSCRIBERS = 'voxhire_newsletter_subscribers_v1';

// Seed default initial accounts if empty
const INITIAL_DEMO_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'user-demo-admin',
    name: 'Sarah Jenkins',
    email: 'admin@voxhire.ai',
    phone: '+1 415 890 2341',
    role: 'admin',
    created_at: '2026-08-01T10:00:00Z',
    last_login_at: '2026-10-03T08:00:00Z',
  },
  {
    id: 'user-demo-recruiter',
    name: 'Rahul Sharma',
    email: 'recruiter@voxhire.ai',
    phone: '+91 98765 43210',
    role: 'recruiter',
    created_at: '2026-09-12T14:30:00Z',
    last_login_at: '2026-10-02T18:20:00Z',
  },
];

const INITIAL_DEMO_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: 'sub-demo-1',
    name: 'Emily Watson',
    email: 'emily.w@talentpartners.co',
    phone: '+1 (555) 234-8901',
    consented_at: '2026-09-28T12:00:00Z',
    status: 'active',
    source: 'landing_stay_updated',
  },
  {
    id: 'sub-demo-2',
    name: 'Vikram Mehta',
    email: 'vikram.m@nexustech.io',
    phone: '+91 98200 11223',
    consented_at: '2026-10-01T09:15:00Z',
    status: 'active',
    source: 'landing_stay_updated',
  },
];

/**
 * Validation utilities
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  // Allows formats like +1 234 567 8901, +91-9876543210, (555) 000-0000, 10-15 digits
  const clean = phone.replace(/[\s\-\(\)\.]/g, '');
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(clean);
}

export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

export interface PasswordValidationResult {
  valid: boolean;
  score: number; // 0 to 4
  feedback: string;
}

export function validatePassword(password: string): PasswordValidationResult {
  let score = 0;
  if (!password) {
    return { valid: false, score: 0, feedback: 'Password is required' };
  }
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (password.length < 8) {
    return { valid: false, score, feedback: 'Must be at least 8 characters long' };
  }
  if (score < 2) {
    return { valid: false, score, feedback: 'Use letters, numbers, and symbols for security' };
  }

  return { valid: true, score, feedback: 'Password meets security standards' };
}

/**
 * Storage helpers
 */
export function getRegisteredAccounts(): RegisteredAccount[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_DEMO_ACCOUNTS));
      return INITIAL_DEMO_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_ACCOUNTS;
  }
}

export function saveRegisteredAccount(data: {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role?: 'admin' | 'recruiter' | 'hiring_manager';
}): { success: boolean; user?: RegisteredAccount; error?: string } {
  if (!isValidName(data.name)) {
    return { success: false, error: 'Full name must contain at least 2 characters.' };
  }
  if (!isValidEmail(data.email)) {
    return { success: false, error: 'Please provide a valid work email address.' };
  }
  if (!isValidPhone(data.phone)) {
    return { success: false, error: 'Please enter a valid phone number with 10–15 digits.' };
  }
  if (data.password) {
    const pCheck = validatePassword(data.password);
    if (!pCheck.valid) {
      return { success: false, error: pCheck.feedback };
    }
  }

  const existing = getRegisteredAccounts();
  const normalizedEmail = data.email.trim().toLowerCase();

  if (existing.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email address is already registered.' };
  }

  const newAccount: RegisteredAccount = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: data.name.trim(),
    email: normalizedEmail,
    phone: data.phone.trim(),
    role: data.role || 'recruiter',
    created_at: new Date().toISOString(),
    last_login_at: new Date().toISOString(),
  };

  try {
    const updated = [newAccount, ...existing];
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updated));
    setCurrentUser(newAccount);
    return { success: true, user: newAccount };
  } catch (err) {
    return { success: false, error: 'Could not store account in local secure storage.' };
  }
}

export function loginAccount(
  emailOrPhone: string,
  password?: string
): { success: boolean; user?: RegisteredAccount; error?: string } {
  if (!emailOrPhone.trim()) {
    return { success: false, error: 'Please enter your registered email or phone.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const term = emailOrPhone.trim().toLowerCase();
  const accounts = getRegisteredAccounts();

  const found = accounts.find(
    (a) => a.email.toLowerCase() === term || a.phone.replace(/[\s\-\(\)]/g, '') === term.replace(/[\s\-\(\)]/g, '')
  );

  if (!found) {
    // If it's a valid email, auto-create a graceful enterprise session for demo convenience or return error
    if (isValidEmail(term)) {
      const generatedAccount: RegisteredAccount = {
        id: `usr-${Date.now()}`,
        name: term.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        email: term,
        phone: '+1 555-0199',
        role: 'admin',
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString(),
      };
      saveRegisteredAccount(generatedAccount);
      setCurrentUser(generatedAccount);
      return { success: true, user: generatedAccount };
    }
    return { success: false, error: 'Account not found. Please verify credentials or sign up.' };
  }

  // Update last login
  found.last_login_at = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(accounts));
  } catch {}

  setCurrentUser(found);
  return { success: true, user: found };
}

export function getCurrentUser(): RegisteredAccount | null {
  if (typeof window === 'undefined') return INITIAL_DEMO_ACCOUNTS[0];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!raw) return INITIAL_DEMO_ACCOUNTS[0];
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_ACCOUNTS[0];
  }
}

export function setCurrentUser(user: RegisteredAccount | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    }
  } catch {}
}

/**
 * Newsletter Subscribers Storage
 */
export function getSubscribers(): NewsletterSubscriber[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_SUBSCRIBERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBSCRIBERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SUBSCRIBERS, JSON.stringify(INITIAL_DEMO_SUBSCRIBERS));
      return INITIAL_DEMO_SUBSCRIBERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_SUBSCRIBERS;
  }
}

export function addSubscriber(data: {
  name: string;
  email: string;
  phone: string;
  source?: string;
}): { success: boolean; subscriber?: NewsletterSubscriber; error?: string } {
  if (!isValidName(data.name)) {
    return { success: false, error: 'Please enter your full name (minimum 2 characters).' };
  }
  if (!isValidEmail(data.email)) {
    return { success: false, error: 'Please enter a valid email address (e.g. name@company.com).' };
  }
  if (!isValidPhone(data.phone)) {
    return { success: false, error: 'Please enter a valid phone number (minimum 10 digits).' };
  }

  const existing = getSubscribers();
  const normalizedEmail = data.email.trim().toLowerCase();

  const foundIndex = existing.findIndex((s) => s.email.toLowerCase() === normalizedEmail);
  if (foundIndex !== -1) {
    // Already subscribed
    return {
      success: true,
      subscriber: existing[foundIndex],
      error: 'You are already registered for updates! We have confirmed your subscription details.',
    };
  }

  const newSub: NewsletterSubscriber = {
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: data.name.trim(),
    email: normalizedEmail,
    phone: data.phone.trim(),
    consented_at: new Date().toISOString(),
    status: 'active',
    source: data.source || 'landing_stay_updated',
  };

  try {
    const updated = [newSub, ...existing];
    localStorage.setItem(STORAGE_KEY_SUBSCRIBERS, JSON.stringify(updated));
    return { success: true, subscriber: newSub };
  } catch (err) {
    return { success: false, error: 'Unable to save subscription at this time.' };
  }
}
