import { useState } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import logoImg from '../../imports/ChatGPT_Image_Jun_11__2026__09_04_24_PM.png';
import { isSupabaseConfigured } from '../../lib/supabase';
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from '../../lib/auth';

interface Props {
  mode: 'signup' | 'login';
  onSuccess: (user: { id?: string; name: string; email: string }) => void;
  onClose: () => void;
  onSwitchMode: (mode: 'signup' | 'login') => void;
}

export function AuthModal({ mode, onSuccess, onClose, onSwitchMode }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'signup' && !name.trim()) { setError('Name is required'); return; }
    if (!email.includes('@')) { setError('Enter a valid email'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        if (mode === 'signup') {
          const { user, session } = await signUpWithEmail(name, email, password);
          if (!session) {
            setSuccess('Account created! Check your email to confirm, then sign in.');
            return;
          }
          onSuccess({
            id: user.id,
            name: name.trim(),
            email: user.email ?? email,
          });
        } else {
          const { user } = await signInWithEmail(email, password);
          const displayName = (user.user_metadata?.display_name as string | undefined)?.trim()
            || email.split('@')[0];
          onSuccess({ id: user.id, name: displayName, email: user.email ?? email });
        }
      } else {
        await new Promise(r => setTimeout(r, 800));
        const displayName = mode === 'signup' ? name.trim() : email.split('@')[0];
        onSuccess({ name: displayName, email });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError('');
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        await signInWithGoogle();
      } else {
        onSuccess({ name: 'Fan', email: 'fan@gmail.com' });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
      setLoading(false);
    }
  }

  const inputClass = `w-full px-4 py-3 rounded-lg bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #1A56DB, #E53535)' }} />

        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex justify-center mb-6">
            <img src={logoImg} alt="MatchPulse" className="h-10 w-auto object-contain" />
          </div>

          <div className="flex rounded-lg p-1 bg-secondary mb-8">
            <button
              onClick={() => onSwitchMode('signup')}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => onSwitchMode('login')}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
          </div>

          <h2
            className="font-['Barlow_Condensed'] font-bold text-foreground mb-1"
            style={{ fontSize: '1.5rem' }}
          >
            {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === 'signup'
              ? 'Set up your World Cup calendar in under 2 minutes.'
              : 'Continue following the World Cup.'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Lionel"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={inputClass}
                  autoFocus
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputClass}
                autoFocus={mode === 'login'}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {success && (
              <p className="text-sm text-[#16A34A] bg-[#16A34A]/10 border border-[#16A34A]/20 rounded-lg px-3 py-2">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #1A56DB, #1244b0)', boxShadow: '0 0 20px rgba(26,86,219,0.3)' }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-xl font-semibold text-foreground border border-border hover:bg-white/5 transition-all disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Free forever · No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}
