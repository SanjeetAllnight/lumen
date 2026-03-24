"use client";

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Navigation, Calendar, Clock, Compass, Layers, Activity, MousePointer2, Check, ShieldAlert, Users, BookOpen, FileText, Folder, Link } from 'lucide-react';

const DiagnosticShuffler = () => {
  const [cards, setCards] = useState([
    { id: 1, title: 'Wi-Fi Outage', desc: 'Library Hall 3 - Reported 2m ago', color: 'border-accent/30 shadow-[0_4px_24px_-8px_rgba(255,45,85,0.3)] text-textMain' },
    { id: 2, title: 'Broken Lights', desc: 'North Parking Lot - Reported 1h ago', color: 'border-primary/30 shadow-[0_4px_24px_-8px_rgba(0,122,255,0.3)] text-textMain' },
    { id: 3, title: 'HVAC Malfunction', desc: 'Lab block B - Reported 4h ago', color: 'border-border shadow-lg text-textMuted' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        const newCards = [...prev];
        const last = newCards.pop();
        if(last) newCards.unshift(last);
        return newCards;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-64 w-full flex items-center justify-center perspective-1000">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className={`absolute w-full max-w-[280px] h-[160px] p-6 flex flex-col justify-between rounded-3xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-surface border ${card.color}`}
          style={{
            zIndex: cards.length - index,
            transform: `translateY(${index * -15}px) scale(${1 - index * 0.05})`,
            opacity: 1 - index * 0.1,
          }}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-heading font-bold text-xl leading-tight text-textMain">{card.title}</h3>
            <ShieldAlert className="w-5 h-5 opacity-50 shrink-0 text-textMain" />
          </div>
          <p className="font-body text-sm opacity-90 leading-snug">{card.desc}</p>
        </div>
      ))}
    </div>
  );
};

const TrackEventsCard = () => {
  const events = [
    { time: '09:00 AM', title: 'Tech Symposium', status: 'Live', current: true },
    { time: '02:00 PM', title: 'Career Fair', status: 'Upcoming', current: false },
    { time: '05:30 PM', title: 'Alumni Mixer', status: 'Upcoming', current: false }
  ];

  return (
    <div className="landing-glass-panel p-6 rounded-3xl h-64 w-full relative flex flex-col justify-between shadow-glass border border-glassBorder hover:border-glassBorderHover transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading font-semibold text-textMain flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> Today&#39;s Schedule
        </h3>
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,122,255,1)]"></span>
      </div>
      <div className="flex flex-col gap-4 flex-1">
        {events.map((ev, i) => (
          <div key={i} className={`flex items-center gap-4 ${ev.current ? 'opacity-100' : 'opacity-60'}`}>
            <div className={`text-xs font-mono font-medium ${ev.current ? 'text-primary' : 'text-textMuted'} w-16`}>{ev.time}</div>
            
            <div className="relative flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${ev.current ? 'bg-primary' : 'bg-surface border border-border'}`}></div>
              {ev.current && <div className="absolute w-4 h-4 bg-primary/30 rounded-full animate-ping"></div>}
              {i < events.length - 1 && (
                <div className="absolute top-2 w-[1px] h-6 bg-border left-1/2 -translate-x-1/2"></div>
              )}
            </div>

            <div className="flex-1 flex justify-between items-center">
              <span className={`text-sm font-heading ${ev.current ? 'text-textMain font-medium' : 'text-textMuted'}`}>{ev.title}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${ev.current ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-surface text-textMuted border border-border'}`}>
                {ev.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResourceSharingNetwork = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });
      const items = gsap.utils.toArray('.resource-item');
      
      items.forEach((item: any, i) => {
        gsap.fromTo(item, 
          { x: -80, opacity: 0, scale: 0.5 },
          { 
            x: 80, 
            opacity: 0, 
            scale: 0.5,
            duration: 3,
            ease: "power2.inOut",
            repeat: -1,
            delay: i * 1,
            keyframes: {
              "0%": { opacity: 0, scale: 0.5, x: -80 },
              "20%": { opacity: 1, scale: 1, x: -30 },
              "80%": { opacity: 1, scale: 1, x: 30 },
              "100%": { opacity: 0, scale: 0.5, x: 80 }
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="landing-glass-panel border border-glassBorder p-6 rounded-3xl h-64 w-full relative flex items-center justify-center overflow-hidden shadow-glass hover:border-glassBorderHover transition-colors">
      <div className="absolute left-6 w-14 h-14 rounded-full landing-glass-button flex items-center justify-center z-10 border border-border shadow-md">
        <Users className="w-6 h-6 text-textMuted" />
      </div>
      <div className="absolute right-6 w-14 h-14 rounded-full landing-glass-button flex items-center justify-center z-10 border border-primary/50 shadow-[0_0_15px_rgba(0,122,255,0.3)] bg-primary/10">
        <Layers className="w-6 h-6 text-primary" />
      </div>
      
      <div className="absolute left-16 right-16 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30 animate-pulse"></div>

      <div className="relative flex items-center justify-center w-full h-full pointer-events-none">
        <div className="resource-item absolute p-2 rounded-xl landing-glass-button border border-glassBorder shadow-md">
          <FileText className="w-5 h-5 text-accent" />
        </div>
        <div className="resource-item absolute p-2 rounded-xl landing-glass-button border border-glassBorder shadow-md">
          <Folder className="w-5 h-5 text-primary" />
        </div>
        <div className="resource-item absolute p-2 rounded-xl landing-glass-button border border-glassBorder shadow-md">
          <Link className="w-5 h-5 text-textMain" />
        </div>
      </div>
      
      <div className="absolute bottom-4 text-xs font-mono text-textMuted tracking-wider">
        SYMMETRIC EXCHANGE
      </div>
    </div>
  );
};

export const Features = () => {
  return (
    <section id="features" className="py-24 px-6 md:px-12 lg:px-24 relative z-10 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24">
          <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-textMain mb-6 tracking-tight">
            Campus at your <span className="font-drama italic text-primary">Fingertips.</span>
          </h2>
          <p className="font-body text-textMuted max-w-xl text-lg font-light">
            Three interactive modules to coordinate reporting, track college events, and effortlessly share campus resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="flex flex-col gap-6">
            <DiagnosticShuffler />
            <div>
              <h3 className="font-heading font-bold text-xl text-textMain mb-2 relative inline-flex items-center gap-2">
                 Realtime Reporting
              </h3>
              <p className="font-body text-sm text-textMuted font-light">Crowdsource maintenance requests. Flag Wi-Fi outages, broken assets, or campus delays in real-time.</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <TrackEventsCard />
            <div>
              <h3 className="font-heading font-bold text-xl text-textMain mb-2 relative inline-flex items-center gap-2">
                Track Events
              </h3>
              <p className="font-body text-sm text-textMuted font-light">Stay synced with campus life. Get updates on workshops, club meetings, and administration announcements.</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <ResourceSharingNetwork />
            <div>
              <h3 className="font-heading font-bold text-xl text-textMain mb-2 relative inline-flex items-center gap-2">
                Resource Gateway
              </h3>
              <p className="font-body text-sm text-textMuted font-light">Seamlessly reserve study spaces, borrow equipment, or request shared resources from peer networks.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
