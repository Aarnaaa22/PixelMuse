/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from environment or user-configured localStorage
const getEnvCredentials = () => {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
  const envUrl = metaEnv?.VITE_SUPABASE_URL as string | undefined;
  const envKey = metaEnv?.VITE_SUPABASE_ANON_KEY as string | undefined;

  const localUrl = localStorage.getItem('pixelmuse_supabase_url');
  const localKey = localStorage.getItem('pixelmuse_supabase_key');

  const url = localUrl || envUrl || '';
  const key = localKey || envKey || '';

  const isConfigured = Boolean(
    url &&
    key &&
    url.startsWith('http') &&
    key.length > 20
  );

  return { url, key, isConfigured };
};

let clientInstance: SupabaseClient | null = null;
let currentConfigured = false;

export const initializeSupabase = (): { client: SupabaseClient | null; isConfigured: boolean } => {
  const { url, key, isConfigured } = getEnvCredentials();

  if (isConfigured && (!clientInstance || currentConfigured !== isConfigured)) {
    try {
      clientInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      currentConfigured = true;
    } catch (err) {
      console.warn('[PixelMuse] Failed to initialize Supabase client:', err);
      clientInstance = null;
      currentConfigured = false;
    }
  }

  return { client: clientInstance, isConfigured: currentConfigured };
};

export const getSupabase = (): SupabaseClient | null => {
  if (!clientInstance) {
    initializeSupabase();
  }
  return clientInstance;
};

export const isSupabaseConfigured = (): boolean => {
  const { isConfigured } = getEnvCredentials();
  return isConfigured && Boolean(clientInstance);
};

export const saveCustomSupabaseCredentials = (url: string, key: string): boolean => {
  try {
    if (!url || !key) {
      localStorage.removeItem('pixelmuse_supabase_url');
      localStorage.removeItem('pixelmuse_supabase_key');
      clientInstance = null;
      currentConfigured = false;
      return true;
    }
    localStorage.setItem('pixelmuse_supabase_url', url.trim());
    localStorage.setItem('pixelmuse_supabase_key', key.trim());
    const init = initializeSupabase();
    return init.isConfigured;
  } catch {
    return false;
  }
};
