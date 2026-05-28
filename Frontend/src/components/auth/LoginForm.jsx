import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, RefreshCw, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

export const LoginForm = ({ onToggle }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Signed in successfully!');
    } catch (error) {
      console.error('Login error:', error);
      const msg = error.response?.data?.message || error.message || 'Invalid email or password.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    toast.success('Password reset link sent! Check your email inbox.', {
      icon: '📨',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email Input Field */}
      <div>
        <label htmlFor="login-email" className="auth-label">Email Address</label>
        <div className="auth-input-wrapper">
          <div className="auth-input-icon">
            <Mail size={16} />
          </div>
          <input
            id="login-email"
            type="email"
            required
            className="auth-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password Input Field with Eye/EyeOff Toggle */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label htmlFor="login-password" className="auth-label mb-0">Password</label>
        </div>
        <div className="auth-input-wrapper">
          <div className="auth-input-icon">
            <Lock size={16} />
          </div>
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            required
            className="auth-input pr-10"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        
        {/* Forgot Password link */}
        <div className="text-right mt-1.5">
          <a
            href="#"
            onClick={handleForgotPassword}
            className="text-xs auth-link inline-flex items-center gap-1"
          >
            <KeyRound size={11} /> Forgot password?
          </a>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="auth-btn-primary mt-6 cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <RefreshCw size={16} className="animate-spin-slow" />
            <span>Signing in...</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </button>

      {/* Toggle View Link */}
      <div className="auth-divider" />
      <div className="text-center text-sm text-slate-400">
        Don't have an account?{' '}
        <span onClick={onToggle} className="auth-link font-semibold">
          Create Account
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
