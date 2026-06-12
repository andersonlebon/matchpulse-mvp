import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { mapSupabaseUser, type AppUser } from '../lib/auth';
import { fetchProfile } from '../lib/profile';

export interface AuthState {
  user: AppUser | null;
  favTeams: string[];
  loading: boolean;
  onboardingComplete: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    favTeams: [],
    loading: true,
    onboardingComplete: false,
  });

  useEffect(() => {
    if (!supabase) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    let mounted = true;

    async function loadUserSession() {
      const { data: { session } } = await supabase!.auth.getSession();
      if (!mounted) return;

      if (!session?.user) {
        setState({ user: null, favTeams: [], loading: false, onboardingComplete: false });
        return;
      }

      const user = mapSupabaseUser(session.user);
      try {
        const profile = await fetchProfile(session.user.id);
        if (!mounted) return;
        setState({
          user,
          favTeams: profile?.favorite_teams ?? [],
          loading: false,
          onboardingComplete: profile?.onboarding_complete ?? false,
        });
      } catch {
        if (!mounted) return;
        setState({ user, favTeams: [], loading: false, onboardingComplete: false });
      }
    }

    loadUserSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (!session?.user) {
        setState({ user: null, favTeams: [], loading: false, onboardingComplete: false });
        return;
      }

      const user = mapSupabaseUser(session.user);
      try {
        const profile = await fetchProfile(session.user.id);
        if (!mounted) return;
        setState({
          user,
          favTeams: profile?.favorite_teams ?? [],
          loading: false,
          onboardingComplete: profile?.onboarding_complete ?? false,
        });
      } catch {
        if (!mounted) return;
        setState({ user, favTeams: [], loading: false, onboardingComplete: false });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
