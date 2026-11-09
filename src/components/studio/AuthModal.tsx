import React, { useState } from 'react';
import {
  X,
  User,
  Key,
  LogOut,
  Mail,
  Lock,
  Cloud,
  HardDrive,
  Check,
  AlertCircle,
  Shield,
} from 'lucide-react';
import { Button, Badge } from '../ui';
import { useAuthStore } from '../../stores';
import { saveCustomSupabaseCredentials } from '../../services/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    isLoading,
    error,
    isCloudConnected,
    signIn,
    signUp,
    signOut,
    clearError,
  } = useAuthStore();

  const [mode, setMode] = useState<'signin' | 'signup' | 'config'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Custom Supabase configuration inputs
  const [customUrl, setCustomUrl] = useState(
    localStorage.getItem('pixelmuse_supabase_url') || ''
  );
  const [customKey, setCustomKey] = useState(
    localStorage.getItem('pixelmuse_supabase_key') || ''
  );
  const [configSuccess, setConfigSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (mode === 'signin') {
      const res = await signIn(email, password);
      if (res.success) {
        onClose();
      }
    } else if (mode === 'signup') {
      const res = await signUp(email, password, displayName);
      if (res.success) {
        onClose();
      }
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const success = saveCustomSupabaseCredentials(customUrl, customKey);
    if (success) {
      setConfigSuccess(true);
      setTimeout(() => {
        setConfigSuccess(false);
        setMode('signin');
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md select-none">
      <div className="w-full max-w-md bg-obsidian-surface border border-obsidian-border p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-obsidian-muted hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User is Signed In */}
        {user ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-obsidian-border">
              <div className="w-12 h-12 rounded-xs bg-obsidian-subtle border border-acid-lime/50 flex items-center justify-center text-acid-lime font-mono text-base font-bold">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-sm font-bold text-white uppercase truncate">
                    {user.displayName}
                  </h3>
                  <Badge variant="lime" size="xs">
                    ACTIVE
                  </Badge>
                </div>
                <p className="font-mono text-2xs text-obsidian-muted truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-obsidian-950 border border-obsidian-border rounded-xs space-y-2">
                <div className="flex items-center justify-between text-obsidian-muted text-2xs uppercase">
                  <span>Cloud Synchronization</span>
                  <Badge variant="lime" size="xs">
                    ONLINE
                  </Badge>
                </div>
                <p className="text-2xs text-obsidian-text">
                  Your project settings and favorite presets automatically sync to Supabase.
                  Original photograph pixels remain 100% private and local to your device.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-obsidian-border">
              <Button
                variant="outline"
                size="xs"
                onClick={() => setMode('config')}
                icon={<Key className="w-3 h-3 text-obsidian-muted" />}
              >
                Connection Details
              </Button>

              <Button
                variant="coral"
                size="xs"
                icon={<LogOut className="w-3 h-3" />}
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        ) : mode === 'config' ? (
          /* Custom Supabase Configuration Mode */
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="font-display text-sm uppercase tracking-widest text-white">
                Supabase Credentials
              </h3>
              <p className="font-mono text-2xs text-obsidian-muted">
                Connect your personal Supabase project for persistent cloud backup.
              </p>
            </div>

            {configSuccess && (
              <div className="p-2.5 bg-acid-lime/10 border border-acid-lime/40 text-acid-lime font-mono text-2xs flex items-center gap-2">
                <Check className="w-3.5 h-3.5" />
                <span>Credentials saved. Initializing client...</span>
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-3.5">
              <div>
                <label className="block font-mono text-2xs uppercase tracking-wider text-obsidian-muted mb-1">
                  Project URL
                </label>
                <input
                  type="url"
                  placeholder="https://xyzcompany.supabase.co"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full bg-obsidian-subtle border border-obsidian-border px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-acid-lime"
                />
              </div>

              <div>
                <label className="block font-mono text-2xs uppercase tracking-wider text-obsidian-muted mb-1">
                  Anon / Public API Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="w-full bg-obsidian-subtle border border-obsidian-border px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-acid-lime"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setMode('signin')}
                >
                  Back
                </Button>
                <Button type="submit" variant="primary" size="xs">
                  Save Credentials
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* Sign In / Sign Up Mode */
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-obsidian-border">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-electric-violet-light" />
                <h3 className="font-display text-sm uppercase tracking-widest text-white">
                  Studio Creator Account
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                {isCloudConnected ? (
                  <Badge variant="lime" size="xs">
                    <Cloud className="w-3 h-3 mr-1 inline" />
                    SUPABASE READY
                  </Badge>
                ) : (
                  <Badge variant="outline" size="xs">
                    <HardDrive className="w-3 h-3 mr-1 inline" />
                    LOCAL FIRST
                  </Badge>
                )}
              </div>
            </div>

            {/* Sub-mode selector */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-obsidian-950 border border-obsidian-border rounded-xs">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  clearError();
                }}
                className={`py-1 font-mono text-2xs uppercase tracking-wider transition-colors ${
                  mode === 'signin'
                    ? 'bg-obsidian-surface text-white font-bold'
                    : 'text-obsidian-muted hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  clearError();
                }}
                className={`py-1 font-mono text-2xs uppercase tracking-wider transition-colors ${
                  mode === 'signup'
                    ? 'bg-obsidian-surface text-white font-bold'
                    : 'text-obsidian-muted hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="p-2.5 bg-signal-coral/10 border border-signal-coral/40 text-signal-coral font-mono text-2xs flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block font-mono text-2xs uppercase tracking-wider text-obsidian-muted mb-1">
                    Creator Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Rostova"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-obsidian-subtle border border-obsidian-border px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-acid-lime"
                  />
                </div>
              )}

              <div>
                <label className="block font-mono text-2xs uppercase tracking-wider text-obsidian-muted mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-obsidian-muted absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="artist@pixelmuse.art"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-obsidian-subtle border border-obsidian-border pl-9 pr-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-acid-lime"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-2xs uppercase tracking-wider text-obsidian-muted mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-obsidian-muted absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-obsidian-subtle border border-obsidian-border pl-9 pr-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-acid-lime"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                  disabled={isLoading}
                >
                  {isLoading
                    ? 'Processing...'
                    : mode === 'signin'
                    ? 'Sign In to Cloud Vault'
                    : 'Create Studio Account'}
                </Button>
              </div>
            </form>

            {/* Privacy Promise Notice */}
            <div className="pt-3 border-t border-obsidian-border flex items-start gap-2 text-obsidian-muted font-mono text-[10px]">
              <Shield className="w-3.5 h-3.5 text-acid-lime shrink-0 mt-0.5" />
              <span>
                PixelMuse operates client-side first. Raw source photographs and pixels are never
                uploaded to the cloud. Only generative vector configurations and preset formulas
                are preserved.
              </span>
            </div>

            <div className="flex items-center justify-between text-2xs font-mono text-obsidian-muted">
              <button
                type="button"
                onClick={() => setMode('config')}
                className="hover:text-acid-lime underline underline-offset-2"
              >
                Configure Supabase URL
              </button>
              <button
                type="button"
                onClick={onClose}
                className="hover:text-white"
              >
                Continue in Local Mode
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
