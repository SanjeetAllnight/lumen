import React from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'glass' | 'liquid';
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className = '', variant = 'primary', onClick, type = "button" }) => {
  const baseClasses = "relative overflow-hidden inline-flex items-center justify-center px-6 py-3 font-landing-heading font-semibold text-sm rounded-[2rem] group transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:shadow-[0_4px_24px_-8px_rgba(0,122,255,0.3)] hover:-translate-y-[1px] hover:scale-[1.03] will-change-transform";
  
  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary/30",
    secondary: "bg-surface border border-border text-textMain hover:bg-surfaceHover",
    accent: "bg-accent text-white shadow-lg shadow-accent/30",
    outline: "border border-primary/30 text-primary hover:bg-primary/10",
    glass: "landing-glass-button text-textMain",
    liquid: "liquid-button rounded-full"
  };

  return (
    <button 
      type={type}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      <span className="relative z-10 flex items-center gap-2 transition-transform duration-300 ease-out">{children}</span>
      <span className="absolute inset-0 z-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
    </button>
  );
};
