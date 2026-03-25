"use client";

import React, { useState, useEffect } from 'react';
import { Users, ShieldAlert, Sun, Moon } from 'lucide-react';
import NextLink from 'next/link';

export const LandingFooter = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (!isDark) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (!newTheme) {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <>
      {/* PreFooterCTA Logic inside Footer to keep it bundled */}
      <section className="py-24 px-6 md:px-12 bg-canvas text-center relative overflow-hidden rounded-b-[4rem] z-20 shadow-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_center,theme(colors.primary)_0%,transparent_50%)] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="font-heading font-bold text-4xl md:text-6xl text-textMain tracking-tighter mb-6">
            Access the <span className="font-drama italic text-accent">Network.</span>
          </h2>
          
          <p className="font-body text-textMuted text-lg md:text-xl max-w-2xl mb-8">
            A centralized platform for campus management. Connect with peers, resolve infrastructure issues, and participate in campus life.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16 text-sm font-heading font-medium text-textMain">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Issue Tracking</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent"></div> Event Discovery</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-textMuted"></div> Resource Sharing</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
            <NextLink href="/login?role=student">
              <div className="landing-glass-panel p-8 rounded-3xl flex flex-col items-center justify-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer group border border-primary/30 hover:border-primary/60 bg-primary/5">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-xl text-textMain">Student Sign In</h3>
                <p className="font-body text-sm text-textMuted group-hover:text-textMain transition-colors">
                  Access dashboard, track events, and book resources.
                </p>
              </div>
            </NextLink>

            <NextLink href="/login?role=admin">
              <div className="landing-glass-panel p-8 rounded-3xl flex flex-col items-center justify-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer group border border-border hover:border-textMain/30">
                <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center group-hover:scale-110 transition-transform border border-glassBorder hover:border-textMain/30">
                  <ShieldAlert className="w-6 h-6 text-textMuted group-hover:text-textMain transition-colors" />
                </div>
                <h3 className="font-heading font-bold text-xl text-textMain group-hover:text-accent transition-colors">Admin Sign In</h3>
                <p className="font-body text-sm text-textMuted group-hover:text-textMain transition-colors">
                  Manage operations, resolve issues, and oversee campus.
                </p>
              </div>
            </NextLink>
          </div>
        </div>
      </section>

      <footer className="landing-glass-panel border-t border-glassBorder pt-24 pb-12 px-6 md:px-12 rounded-t-[4rem] -mt-16 relative z-10 mx-2 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 px-4">
            <div className="md:col-span-2">
              <h3 className="font-heading font-bold text-3xl text-textMain mb-4 flex items-center gap-2">
                LUMEN
              </h3>
              <p className="font-body text-textMuted max-w-sm mb-8 text-lg">
                The central operational dashboard for a secure, responsive, and student-powered campus environment.
              </p>
              
              <button 
                onClick={toggleTheme}
                className="inline-flex items-center gap-3 px-4 py-2 landing-glass-button rounded-full border border-glassBorder hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="relative flex items-center justify-center h-5 w-5 rounded-full overflow-hidden">
                  <div className={`transition-transform duration-500 absolute flex items-center justify-center text-textMain ${isDarkMode ? 'translate-y-0 opacity-100' : '-translate-y-0 opacity-0 scale-50'}`}>
                    <Moon className="w-4 h-4" />
                  </div>
                  <div className={`transition-transform duration-500 absolute flex items-center justify-center text-textMain ${!isDarkMode ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-0 scale-50'}`}>
                    <Sun className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
                <span className="font-heading text-sm text-textMain/80 font-medium group-hover:text-textMain transition-colors">
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
              </button>
            </div>
            
            <div>
              <h4 className="font-heading font-bold text-textMain mb-6 tracking-wider text-sm uppercase">Modules</h4>
              <ul className="flex flex-col gap-4 font-body text-textMuted">
                <li><a href="#" className="hover:text-primary transition-colors">Incident Reports</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Event Calendar</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Resource Booking</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community Forum</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-bold text-textMain mb-6 tracking-wider text-sm uppercase">Legal</h4>
              <ul className="flex flex-col gap-4 font-body text-textMuted">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Student Guidelines</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Data Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 mt-16 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-mono text-textMuted">
            <p>© {new Date().getFullYear()} LUMEN. All rights reserved.</p>
            <p>Built with precision.</p>
          </div>
        </div>
      </footer>
    </>
  );
};
