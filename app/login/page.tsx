"use client";

import React, { useState, Suspense } from 'react';
import { Eye, EyeOff, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

const AuthForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'student';

  const { loginWithEmail, loginWithGoogle } = useAuth();

  const [role, setRole] = useState(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const title = `${role === 'admin' ? 'Admin' : 'Student'} Sign In`;
  const subtitle = role === "admin"
    ? "Manage campus events and reports"
    : "Access events, resources, and campus updates";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      const msg = err?.code === 'auth/invalid-credential'
        ? 'Invalid email or password.'
        : err?.message || 'Sign in failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-6 bg-canvas relative overflow-hidden transition-colors duration-700 landing-theme">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_top,var(--color-surface)_0%,transparent_70%)] pointer-events-none"></div>

      <Link href="/">
        <div className="absolute top-8 left-6 md:left-12 flex items-center gap-2 text-textMuted hover:text-textMain transition-colors font-heading text-sm font-medium z-10 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </div>
      </Link>

      <div className="landing-glass-panel w-full max-w-md p-8 md:p-10 rounded-[2.5rem] flex flex-col items-center shadow-2xl relative z-10 border border-glassBorder mt-8 md:mt-0">

        <div className="flex bg-surface p-1 rounded-full border border-border mb-8 w-full max-w-[240px]">
          <button onClick={() => setRole("student")} className={`flex-1 py-2 text-xs font-heading font-semibold rounded-full transition-all duration-300 ${role === "student" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-textMuted hover:text-textMain"}`}>Student</button>
          <button onClick={() => setRole("admin")} className={`flex-1 py-2 text-xs font-heading font-semibold rounded-full transition-all duration-300 ${role === "admin" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-textMuted hover:text-textMain"}`}>Admin</button>
        </div>

        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>

        <h1 className="font-heading font-bold text-3xl text-textMain mb-2 text-center tracking-tight">{title}</h1>
        <p className="font-body text-sm text-textMuted mb-8 text-center px-4">{subtitle}</p>

        {error && (
          <div className="w-full mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <form className="w-full flex gap-5 flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-heading font-medium text-textMain/90 ml-1">Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="jane@campus.edu" required className="w-full bg-surface border border-border rounded-2xl px-4 py-3 text-textMain placeholder:text-textMuted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300" />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-heading font-medium text-textMain/90 ml-1">Password</label>
            <div className="relative">
              <input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="••••••••" required className="w-full bg-surface border border-border rounded-2xl px-4 py-3 text-textMain placeholder:text-textMuted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain transition-colors">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <a href="#" className="text-xs font-medium text-textMuted hover:text-primary transition-colors">Forgot Password?</a>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-opacity-90 text-white font-heading font-semibold text-base py-3.5 rounded-2xl mt-4 transition-all duration-300 shadow-md shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed">
            {isLoading ? <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span> : <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </form>

        {/* Divider */}
        <div className="w-full flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-textMuted font-medium">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google Sign In */}
        <button onClick={handleGoogle} disabled={isLoading} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-border bg-surface hover:bg-surface/80 text-textMain font-heading font-semibold text-sm transition-all duration-300 disabled:opacity-60">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="mt-8 text-sm font-body text-textMuted text-center">
          Don&#39;t have an account?{" "}
          <Link href={`/signup?role=${role}`} className="text-primary font-medium hover:underline focus:outline-none transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <AuthForm />
    </Suspense>
  );
}
