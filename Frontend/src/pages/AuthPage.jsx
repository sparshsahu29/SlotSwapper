import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarRange, ArrowLeftRight } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

export const AuthPage = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Seed the initial flag based on the actual path: /signup vs /login
  const isSignupPath = location.pathname.includes('signup');
  const [isLogin, setIsLogin] = useState(!isSignupPath);

  // Sync state if navigation or browser URL changes
  useEffect(() => {
    setIsLogin(!location.pathname.includes('signup'));
  }, [location.pathname]);

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const toggleForm = () => {
    const nextLoginState = !isLogin;
    setIsLogin(nextLoginState);
    if (nextLoginState) {
      navigate('/login');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="auth-page">
      {/* Dynamic key forces the CS animation 'animate-fade-in-up' to kick start on toggle */}
      <div key={isLogin ? 'login' : 'signup'} className="auth-card">
        {/* Logo and Greeting */}
        <div className="flex flex-col items-center text-center mb-6 select-none">
          <div className="bg-cyan/10 p-3 rounded-full mb-3.5 border border-cyan/25">
            <ArrowLeftRight className="text-cyan h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-text-primary">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin
              ? 'Schedule, publish, and swap time slots with colleagues.'
              : 'Sign up to coordinate and swap peer schedules.'}
          </p>
        </div>

        {/* Dynamic Inner Form Element */}
        {isLogin ? (
          <LoginForm onToggle={toggleForm} />
        ) : (
          <SignupForm onToggle={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
