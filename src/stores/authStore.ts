import { create } from 'zustand';
import { UserProfile } from '../types';
import { getSupabase, isSupabaseConfigured } from '../services/supabaseClient';

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isCloudConnected: boolean;
  favoritePresetIds: string[];

  // Actions
  initializeAuth: () => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  toggleFavoritePreset: (presetId: string) => Promise<void>;
  isPresetFavorited: (presetId: string) => boolean;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isCloudConnected: false,
  favoritePresetIds: (() => {
    try {
      return JSON.parse(localStorage.getItem('pixelmuse_fav_presets') || '[]');
    } catch {
      return [];
    }
  })(),

  initializeAuth: async () => {
    set({ isLoading: true });
    const configured = isSupabaseConfigured();
    const supabase = getSupabase();

    if (!configured || !supabase) {
      set({ isCloudConnected: false, isLoading: false });
      return;
    }

    try {
      set({ isCloudConnected: true });
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const user: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Artist',
          avatarUrl: session.user.user_metadata?.avatar_url,
          createdAt: new Date(session.user.created_at).getTime(),
        };
        set({ user });

        // Load favorite presets from Supabase if table exists
        try {
          const { data: favs } = await supabase
            .from('favorite_presets')
            .select('preset_id')
            .eq('user_id', session.user.id);
          
          if (favs && favs.length > 0) {
            const ids = Array.from(new Set([...get().favoritePresetIds, ...favs.map((f: { preset_id: string }) => f.preset_id)]));
            set({ favoritePresetIds: ids });
            localStorage.setItem('pixelmuse_fav_presets', JSON.stringify(ids));
          }
        } catch {
          // Table might not exist yet; gracefully fallback to local
        }
      }

      // Subscribe to auth changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Artist',
              avatarUrl: session.user.user_metadata?.avatar_url,
              createdAt: new Date(session.user.created_at).getTime(),
            },
          });
        } else {
          set({ user: null });
        }
      });
    } catch (err: unknown) {
      console.warn('[PixelMuse] Auth initialization error:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email, password, displayName) => {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, error: 'Supabase is not configured. Provide connection credentials.' };
    }

    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0],
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email || email,
            displayName: displayName || email.split('@')[0],
            createdAt: Date.now(),
          },
        });
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign up failed';
      set({ error: msg });
      return { success: false, error: msg };
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (email, password) => {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, error: 'Supabase is not configured. Provide connection credentials.' };
    }

    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email || email,
            displayName: data.user.user_metadata?.display_name || email.split('@')[0],
            avatarUrl: data.user.user_metadata?.avatar_url,
            createdAt: new Date(data.user.created_at).getTime(),
          },
        });
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed';
      set({ error: msg });
      return { success: false, error: msg };
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out failed', err);
      }
    }
    set({ user: null });
  },

  toggleFavoritePreset: async (presetId: string) => {
    const { favoritePresetIds, user } = get();
    const isFav = favoritePresetIds.includes(presetId);
    const updated = isFav
      ? favoritePresetIds.filter((id) => id !== presetId)
      : [...favoritePresetIds, presetId];

    set({ favoritePresetIds: updated });
    localStorage.setItem('pixelmuse_fav_presets', JSON.stringify(updated));

    // Sync to Supabase if authenticated
    const supabase = getSupabase();
    if (supabase && user) {
      try {
        if (isFav) {
          await supabase
            .from('favorite_presets')
            .delete()
            .eq('user_id', user.id)
            .eq('preset_id', presetId);
        } else {
          await supabase.from('favorite_presets').insert({
            user_id: user.id,
            preset_id: presetId,
            created_at: new Date().toISOString(),
          });
        }
      } catch {
        // Table may not exist yet; offline first
      }
    }
  },

  isPresetFavorited: (presetId: string) => {
    return get().favoritePresetIds.includes(presetId);
  },

  clearError: () => set({ error: null }),
}));

