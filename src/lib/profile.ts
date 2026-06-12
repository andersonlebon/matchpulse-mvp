import { supabase } from './supabase';
import type { Profile } from './database.types';

export async function fetchProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertProfile(
  userId: string,
  updates: {
    display_name?: string;
    favorite_teams?: string[];
    onboarding_complete?: boolean;
  },
): Promise<Profile> {
  if (!supabase) throw new Error('Supabase is not configured');

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        ...updates,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveFavoriteTeams(userId: string, teams: string[]): Promise<Profile> {
  return upsertProfile(userId, {
    favorite_teams: teams,
    onboarding_complete: teams.length > 0,
  });
}
