import { supabase } from './supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface AppUser {
  id: string;
  name: string;
  email: string;
}

export function mapSupabaseUser(user: SupabaseUser): AppUser {
  const metadataName = [
    user.user_metadata?.display_name,
    user.user_metadata?.full_name,
    user.user_metadata?.name,
  ].find((value): value is string => typeof value === 'string' && value.trim().length > 0);
  const fallbackName = user.email?.split('@')[0] ?? 'Fan';

  return {
    id: user.id,
    name: metadataName?.trim() || fallbackName,
    email: user.email ?? '',
  };
}

export async function signUpWithEmail(name: string, email: string, password: string) {
  if (!supabase) throw new Error('Supabase is not configured');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: name.trim() },
    },
  });

  if (error) throw error;
  if (!data.user) throw new Error('Sign up failed. Please try again.');
  return { user: data.user, session: data.session };
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) throw new Error('Supabase is not configured');

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('Sign in failed. Please try again.');
  return data;
}

export async function signInWithGoogle() {
  if (!supabase) throw new Error('Supabase is not configured');

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;
}

export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}
