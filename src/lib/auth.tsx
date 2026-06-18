/**
 * Auth state via Supabase. When Supabase isn't configured yet, this stays in a
 * signed-out "local mode" and the auth actions return a friendly message.
 */

import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type Result = { error?: string; needsConfirmation?: boolean };

type AuthValue = {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  signUp: (email: string, password: string) => Promise<Result>;
  signIn: (email: string, password: string) => Promise<Result>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signUp(email: string, password: string): Promise<Result> {
    if (!supabase) return { error: 'Supabase isn’t connected yet. Add your keys to .env.' };
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    // If email confirmation is off, Supabase returns a session (auto signed-in).
    return { needsConfirmation: !data.session };
  }

  async function signIn(email: string, password: string): Promise<Result> {
    if (!supabase) return { error: 'Supabase isn’t connected yet. Add your keys to .env.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
  }

  const value = useMemo<AuthValue>(
    () => ({ configured: isSupabaseConfigured, loading, session, user: session?.user ?? null, signUp, signIn, signOut }),
    [loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
