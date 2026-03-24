"use client";

import React, { useLayoutEffect, useRef } from 'react';
import { Eye, Zap, RefreshCw } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const cardsData = [
  {
    id: '01',
    title: 'Report Issues',
    desc: 'Flag problems, track issue status, and see exactly what is being fixed.',
    color: 'bg-canvas',
    Icon: Eye,
    iconColor: 'text-primary',
    AnimationContent: () => (
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <Eye className="w-64 h-64 text-primary animate-pulse" />
      </div>
    )
  },
  {
    id: '02',
    title: 'Engage & Enjoy',
    desc: 'Get reminders before events. See what’s happening today on campus and join events instantly with one click.',
    color: 'bg-surface',
    Icon: Zap,
    iconColor: 'text-accent',
    AnimationContent: () => (
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-10">
        <div className="w-full h-full border-[1px] border-accent/20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 w-full h-[2px] bg-accent shadow-[0_0_15px_rgba(255,45,85,0.8)] animate-[scan_3s_ease-in-out_infinite_alternate]" style={{ animationName: 'scan' }}></div>
      </div>
    )
  },
  {
    id: '03',
    title: 'Share & Collaborate',
    desc: 'Book spaces, exchange study materials, and build a unified campus network.',
    color: 'bg-surfaceHover',
    Icon: RefreshCw,
    iconColor: 'text-textMain',
    AnimationContent: () => (
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <RefreshCw className="w-64 h-64 text-textMain animate-spin-slow" />
      </div>
    )
  }
];

export const Protocol = () => {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.protocol-card');

      cards.forEach((card: any, i) => {
        if (i === cards.length - 1) return; 

        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          endTrigger: containerRef.current,
          end: 'bottom bottom',
          pin: true,
          pinSpacing: false,
          animation: gsap.to(card, {
            scale: 0.9,
            opacity: 0.5,
            ease: "none"
          }),
          scrub: true
        });
      });
    }, containerRef);

    if (!document.getElementById('scan-keyframes')) {
      const style = document.createElement('style');
      style.id = 'scan-keyframes';
      style.innerHTML = `
         @keyframes scan {
           0% { transform: translateY(0vh); }
           100% { transform: translateY(100vh); }
         }
         @keyframes spin-slow {
           from { transform: rotate(0deg); }
           to { transform: rotate(360deg); }
         }
       `;
      document.head.appendChild(style);
    }
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="guides" className="relative bg-canvas pb-32">
      {cardsData.map((card, i) => (
        <div
          key={card.id}
          className={`sticky top-0 protocol-card h-[100vh] w-full flex flex-col items-center justify-center ${card.color} lg:border-x-0 overflow-hidden shadow-xl border-b border-glassBorder`}
          style={{ zIndex: i }}
        >
          {<card.AnimationContent />}

          <div className="relative z-10 max-w-4xl px-8 flex flex-col md:flex-row items-start md:items-center gap-12 md:gap-24">
            <div className="font-mono text-[10rem] md:text-[15rem] leading-none text-textMuted opacity-20 font-black tracking-tighter select-none">
              {card.id}
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <card.Icon className={`w-8 h-8 md:w-12 md:h-12 ${card.iconColor}`} />
                <h2 className="font-heading font-bold text-5xl md:text-7xl text-textMain tracking-tight">{card.title}</h2>
              </div>
              <p className="font-drama italic text-2xl md:text-4xl text-textMuted max-w-lg leading-tight">
                {card.desc}
              </p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};
