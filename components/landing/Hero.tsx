"use client";

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import Link from 'next/link';

export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".hero-text", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.1
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-[100dvh] w-full overflow-hidden landing-clip-path-bottom bg-canvas transition-colors duration-700">
      
      <div 
        ref={bgRef}
        className="absolute inset-0 w-full h-[105%] -top-[2%] z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2560&auto=format&fit=crop"
          alt="Campus Background"
          className="absolute inset-0 w-full h-full object-cover opacity-15 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/90 to-transparent z-10"></div>
      </div>
      
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16 lg:p-24 pb-32">
        <div className="max-w-4xl">
          <h1 className="flex flex-col gap-2 mb-6">
            <span className="hero-text font-heading font-bold text-5xl md:text-7xl lg:text-8xl text-textMain tracking-tight leading-none">
              Empower your
            </span>
            <span className="hero-text font-drama italic text-7xl md:text-9xl lg:text-[11rem] bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent leading-none translate-x-4 md:translate-x-12">
              Campus.
            </span>
          </h1>
          <p className="hero-text font-heading text-textMuted text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-light">
            A unified dashboard for students. Flag critical issues, coordinate live events, and seamlessly share resources across the community.
          </p>
          <div className="hero-text flex flex-wrap gap-4 mt-8">
            <Link href="/login">
                <MagneticButton variant="liquid" className="!px-8 !py-4 text-lg tracking-wide font-medium">
                  Launch Dashboard <ArrowRight className="w-5 h-5" />
                </MagneticButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
