import React, { useState } from 'react';
import { X, Key, ShieldCheck, ArrowRight, Info } from 'lucide-react';
import { 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  resetPassword,
  isFirebaseConfigured 
} from '../services/firebaseAuth';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserChange: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onUserChange }) => {
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
  
    try {
      if (tab === 'signin') {
        const user = await loginWithEmail(email, password);
        onUserChange(user);
        onClose();
      } else if (tab === 'signup') {
        const user = await registerWithEmail(email, password, name);
        onUserChange(user);
        onClose();
      } else {
        await resetPassword(email);
        setSuccessMsg('A password reset link has been dispatched to your email address.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      onUserChange(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const configured = isFirebaseConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.85)] backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#000000] border border-[rgba(246,65,55,0.4)] rounded-2xl shadow-[0_0_40px_rgba(246,65,55,0.25)] p-7 sm:p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#d1d1d6] hover:text-[#f64137] hover:bg-[#0d0d12] rounded-lg transition-colors cursor-pointer"
          aria-label="Close Login Modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="status-indicator status-red" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#f64137] font-bold">
              NASA Earth Detective Portal
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#ffffff]">
            {tab === 'signin' && 'Sign In to TrendLens'}
            {tab === 'signup' && 'Create Researcher Account'}
            {tab === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="text-xs text-[#d1d1d6] mt-1.5 leading-relaxed">
            Access your detective dashboard, compute Mann-Kendall statistics, and export NASA records.
          </p>
        </div>

        {/* Configuration Notice if placeholder keys are active */}
        {!configured && (
          <div className="mb-5 p-3 rounded-xl bg-[#0d0d12] border border-[rgba(246,65,55,0.3)] text-xs font-mono text-[#d1d1d6] flex items-start gap-2.5">
            <Info size={16} className="text-[#f64137] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="text-[#f64137] font-bold block mb-0.5">Firebase Connected via .env.local</span>
              Enter your live Firebase Project credentials in <code className="text-[#ffffff] bg-[#1a1a24] px-1 py-0.5 rounded">frontend/.env.local</code> to authenticate against your Firebase project.
            </div>
          </div>
        )}

        {/* Tabs */}
        {tab !== 'forgot' && (
          <div className="flex rounded-lg bg-[#0d0d12] p-1 border border-[rgba(255,255,255,0.12)] mb-5 text-xs font-mono">
            <button
              onClick={() => { setTab('signin'); setError(null); }}
              className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${
                tab === 'signin' ? 'bg-[#000000] text-[#f64137] border border-[rgba(246,65,55,0.4)] shadow-[0_0_10px_rgba(246,65,55,0.25)] font-bold' : 'text-[#d1d1d6] hover:text-[#ffffff]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); setError(null); }}
              className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${
                tab === 'signup' ? 'bg-[#000000] text-[#f64137] border border-[rgba(246,65,55,0.4)] shadow-[0_0_10px_rgba(246,65,55,0.25)] font-bold' : 'text-[#d1d1d6] hover:text-[#ffffff]'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Errors & Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[rgba(246,65,55,0.12)] border border-[rgba(246,65,55,0.35)] text-xs font-mono text-[#f64137] flex items-start gap-2">
            <span className="status-indicator status-red shrink-0 mt-1" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-[rgba(0,255,136,0.12)] border border-[rgba(0,255,136,0.35)] text-xs font-mono text-[#00ff88] flex items-start gap-2">
            <span className="status-indicator status-success shrink-0 mt-1" />
            <span className="leading-relaxed font-medium">{successMsg}</span>
          </div>
        )}

        {/* Google Authentication Button */}
        {tab !== 'forgot' && (
          <>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#0d0d12] hover:bg-[#15151c] border border-[rgba(255,255,255,0.16)] hover:border-[#f64137] hover:shadow-[0_0_15px_rgba(246,65,55,0.25)] rounded-xl text-xs font-mono text-[#ffffff] flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4L1.9 7C.7 9.4 0 12 0 14.7s.7 5.3 1.9 7.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 17c1.8 3.8 5.6 6.5 10.1 6.5z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-[rgba(255,255,255,0.1)]" />
              <span className="px-3 text-[10px] font-mono text-[#8e8e99] uppercase">Or email</span>
              <div className="flex-1 border-t border-[rgba(255,255,255,0.1)]" />
            </div>
          </>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-mono text-[#d1d1d6] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Dr. Maya Patel"
                required
                className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-[rgba(255,255,255,0.16)] focus:border-[#f64137] focus:shadow-[0_0_15px_rgba(246,65,55,0.25)] rounded-lg text-sm text-[#ffffff] outline-none transition-all placeholder:text-[#8e8e99]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-[#d1d1d6] mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="researcher@nasaspaceapps.org"
              required
              className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-[rgba(255,255,255,0.16)] focus:border-[#f64137] focus:shadow-[0_0_15px_rgba(246,65,55,0.25)] rounded-lg text-sm text-[#ffffff] outline-none transition-all placeholder:text-[#8e8e99]"
            />
          </div>

          {tab !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-mono text-[#d1d1d6]">Password</label>
                {tab === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setTab('forgot'); setError(null); }}
                    className="text-[11px] font-mono text-[#f64137] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                minLength={6}
                className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-[rgba(255,255,255,0.16)] focus:border-[#f64137] focus:shadow-[0_0_15px_rgba(246,65,55,0.25)] rounded-lg text-sm text-[#ffffff] outline-none transition-all placeholder:text-[#8e8e99]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 btn-primary-scitech justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Authorization...</span>
              </span>
            ) : (
              <span>
                {tab === 'signin' && 'Sign In to Workspace'}
                {tab === 'signup' && 'Register New Researcher'}
                {tab === 'forgot' && 'Send Reset Link'}
              </span>
            )}
          </button>
        </form>

        {/* Footer toggles */}
        <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.1)] text-center text-xs font-mono text-[#d1d1d6]">
          {tab === 'signin' && (
            <p>
              Need an account?{' '}
              <button 
                onClick={() => { setTab('signup'); setError(null); }}
                className="text-[#f64137] hover:underline font-bold cursor-pointer ml-1"
              >
                Create researcher account
              </button>
            </p>
          )}
          {tab === 'signup' && (
            <p>
              Already registered?{' '}
              <button 
                onClick={() => { setTab('signin'); setError(null); }}
                className="text-[#f64137] hover:underline font-bold cursor-pointer ml-1"
              >
                Sign in to existing account
              </button>
            </p>
          )}
          {tab === 'forgot' && (
            <button 
              onClick={() => { setTab('signin'); setError(null); }}
              className="text-[#f64137] hover:underline font-bold cursor-pointer"
            >
              ← Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
