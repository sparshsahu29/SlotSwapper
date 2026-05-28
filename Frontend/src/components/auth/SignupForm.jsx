import React, { useState } from 'react';
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

export const SignupForm = ({ onToggle }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Check all fields filled
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error('All fields are required.');
      return;
    }

    // 2. Format validation
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // 3. Password length
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    // 4. Match validation
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await signup(name, email, password);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Signup error:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to create account. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name block */}
      <div>
        <label htmlFor="signup-name" className="auth-label">Full Name</label>
        <div className="auth-input-wrapper">
          <div className="auth-input-icon">
            <User size={16} />
          </div>
          <input
            id="signup-name"
            type="text"
            required
            className="auth-input"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Email block */}
      <div>
        <label htmlFor="signup-email" className="auth-label">Email Address</label>
        <div className="auth-input-wrapper">
          <div className="auth-input-icon">
            <Mail size={16} />
          </div>
          <input
            id="signup-email"
            type="email"
            required
            className="auth-input"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password block */}
      <div>
        <label htmlFor="signup-password" className="auth-label">Password</label>
        <div className="auth-input-wrapper">
          <div className="auth-input-icon">
            <Lock size={16} />
          </div>
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            required
            className="auth-input pr-10"
            placeholder="At least 8 characters"
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
      </div>

      {/* Confirm Password block */}
      <div>
        <label htmlFor="signup-confirm" className="auth-label">Confirm Password</label>
        <div className="auth-input-wrapper">
          <div className="auth-input-icon">
            <ShieldCheck size={16} />
          </div>
          <input
            id="signup-confirm"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            className="auth-input pr-10"
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer focus:outline-none"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="auth-btn-primary mt-6 cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <RefreshCw size={16} className="animate-spin-slow" />
            <span>Creating account...</span>
          </>
        ) : (
          <span>Create Account</span>
        )}
      </button>

      {/* Switch to login link */}
      <div className="auth-divider" />
      <div className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <span onClick={onToggle} className="auth-link font-semibold">
          Sign In
        </span>
      </div>
    </form>
  );
};

export default SignupForm;
