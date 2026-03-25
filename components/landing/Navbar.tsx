"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

export const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center mt-6 px-4 pointer-events-none">
      <nav className={`pointer-events-auto w-full max-w-5xl transition-all duration-500 rounded-full flex items-center justify-between px-8 py-4 ${
        scrolled 
          ? 'landing-glass-panel text-textMain' 
          : 'bg-transparent text-textMain'
      }`}>
        <div className="font-heading font-bold text-xl tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span>LUMEN</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-3 font-heading text-sm font-medium">
            <Link href="/login">
                <MagneticButton variant="secondary" className="!px-4 !py-2 text-xs">
                  Sign In
                </MagneticButton>
            </Link>
            <Link href="/signup">
                <MagneticButton variant="primary" className="!px-4 !py-2 text-xs">
                  Sign Up
                </MagneticButton>
            </Link>
        </div>

        {/* Mobile Nav Toggle */}
        <button aria-label="Toggle menu" className="md:hidden block p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="text-textMain" /> : <Menu className="text-textMain" />}
        </button>
      </nav>
      
      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[95%] max-w-md landing-glass-panel p-4 flex flex-col gap-3 pointer-events-auto rounded-[2rem]">
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <MagneticButton variant="secondary" className="w-full">
                Sign In
              </MagneticButton>
            </Link>
            <Link href="/signup" onClick={() => setMenuOpen(false)}>
              <MagneticButton variant="primary" className="w-full">
                Sign Up
              </MagneticButton>
            </Link>
        </div>
      )}
    </div>
  );
};
