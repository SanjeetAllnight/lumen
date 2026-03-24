"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGlobal } from '@/components/GlobalProvider';
import { HeroIssueSkeleton, IssueListSkeleton, EmptyIssues } from '@/components/Skeletons';

export default function DashboardPage() {
  const router = useRouter();
  const { issues, upvoteIssue, isLoading } = useGlobal();

  const issue1 = issues.find(i => i.id === "north-lib") || issues[0];
  const issue2 = issues.find(i => i.id === "maker-space") || issues[1];
  const issue3 = issues.find(i => i.id === "main-gate") || issues[2];

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-8">
        <HeroIssueSkeleton />
        <IssueListSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-12">
      {/* Top Campus Issue Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-error font-black tracking-[0.2em] text-[10px] uppercase flex items-center gap-2 bg-error/10 px-3 py-1 rounded-full border border-error/20">
            High Priority Issue
          </span>
          <span className="text-on-surface-variant text-xs">Updated 2m ago</span>
        </div>
        <div className="group card-hover glass-panel rounded-[2.5rem] p-1 md:p-1.5 border border-error/20 bg-gradient-to-br from-error/10 via-transparent to-transparent glow-error transition-all duration-500">
          <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-[2.25rem] p-8 md:p-12 flex flex-col lg:flex-row gap-10 items-center justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-error/10 blur-[100px] rounded-full group-hover:bg-error/20 transition-colors"></div>
            <div className="relative z-10 flex-1 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-1.5 rounded-full bg-error/20 text-error border border-error/30 text-[10px] font-bold uppercase tracking-widest">Facility Crisis</span>
                <span className="px-4 py-1.5 rounded-full bg-white/5 text-on-surface-variant border border-white/5 text-[10px] font-bold uppercase tracking-widest">Main Campus</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-headline font-bold text-on-surface leading-tight tracking-tight">
                North Library Air <br className="hidden md:block"/><span className="text-error">Conditioning Outage</span>
              </h2>
              <p className="text-on-surface-variant max-w-2xl text-lg md:text-xl font-body leading-relaxed">
                <span className="text-primary/80 font-semibold">Summary from multiple reports:</span> Levels 3, 4, and 5 are currently uninhabitable. Student medical reports increasing. Infrastructure team arrival estimated in 45 minutes.
              </p>
              <div className="flex flex-wrap items-center gap-8 pt-4">
                <div className="flex items-center gap-5">
                  <div className="flex -space-x-4">
                    <img className="w-14 h-14 rounded-full border-4 border-surface-container-lowest object-cover" alt="student profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsb7xA4zlIyEZvspyRU4q9n13AtYY5k7XrhxDzXxYDqNlXLntrk9T5KEqkfjB9j249C8MHDSDv37SNfIVETA3mEx82hcb9qUyvXdLbw4IogqzZTF4Eb2aXWmrek3V0YXl4_MiJ_K-P3jVHCDfGZEeKyPC-avsdtwAOcyUlvI5RfHxramFYo7jyOsyHbVLPrHFwrQuiQZ5IOOMKRn8u6-gXH9_4WBkHce9d1391rBWsK1Ti4bfa7QFLpaizhtJ2KasiJpQUY08G_yY" />
                    <img className="w-14 h-14 rounded-full border-4 border-surface-container-lowest object-cover" alt="student profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5-pTrqP3vX8Pchnf0pRBGLvGyT_MvuoBqiLRxnXMtOtE0qVFKxap4VL_LFqwHcUuFsQJlaANK_TvMwqXeSXTHdOcpscJuwoHv1PRhuuKYlD2YrB5hV1j0geIyMqrSCeW59WyRg-fzdFKkjThhcGqwRh29HhG0kCpogSU98tLuhVGdLdFDTjvMB90c4vBE45iT9L_7O86jeSp5Lw9QYwn_8ZU4hTK2VlNxbCg0wDqGcQhNuxsxCOZ1ik8mrNU1fc3427eb7WL-mh4" />
                    <div className="w-14 h-14 rounded-full border-4 border-surface-container-lowest bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface-variant">+842</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-on-surface text-2xl font-black">{issue1?.affectedCount ?? 842} Students</div>
                    <div className="text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">Actively Affected</div>
                  </div>
                </div>
                <div className="h-10 w-px bg-white/10 hidden md:block"></div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Library Density</div>
                  <div className="flex gap-1">
                    <div className="w-8 h-2 rounded-full bg-error"></div>
                    <div className="w-8 h-2 rounded-full bg-error"></div>
                    <div className="w-8 h-2 rounded-full bg-error"></div>
                    <div className="w-8 h-2 rounded-full bg-white/10"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-4 min-w-[240px]">
              <div className="bg-surface-container-high/50 p-8 pt-10 pb-10 rounded-3xl border border-white/5 text-center w-full">
                <div className="text-7xl font-headline font-black text-on-surface mb-2 tracking-tighter">{issue1?.upvotes}</div>
                <div className="text-on-surface-variant text-sm font-bold uppercase tracking-[0.2em]">Upvotes</div>
              </div>
              <button onClick={() => upvoteIssue(issue1?.id || "north-lib")} className="w-full py-6 bg-error text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-error/40 hover:scale-[1.04] active:scale-90 transition-all duration-150 flex items-center justify-center gap-3 text-lg glow-support select-none">
                <span className="material-symbols-outlined fill-1">thumb_up</span>
                Support Issue
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Header Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] p-12 bg-surface-container-low border border-white/5 glass-panel card-hover">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-on-surface leading-none tracking-tighter">
              The Campus <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Heartbeat.</span>
            </h1>
            <p className="text-on-surface-variant max-w-md text-lg leading-relaxed font-body">
              Real-time student insights, trending campus issues, and critical updates mapped in 3D for the modern observatory.
            </p>
            <div className="flex gap-4">
              <button onClick={() => router.push('/map')} className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                View Heatmap
              </button>
              <button onClick={() => router.push('/complaints')} className="px-8 py-3 border border-outline-variant/30 text-on-surface rounded-full font-bold hover:bg-white/5 transition-colors">
                Active Reports
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-6 rounded-3xl border border-white/5 glow-purple bg-surface-container-highest/30">
                <span className="material-symbols-outlined text-primary text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                <h4 className="text-3xl font-headline font-bold">14.2k</h4>
                <p className="text-on-surface-variant text-sm">Active Students</p>
              </div>
              <div className="glass-panel p-6 rounded-3xl border border-white/5">
                <span className="material-symbols-outlined text-tertiary text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>stadium</span>
                <h4 className="text-3xl font-headline font-bold">12</h4>
                <p className="text-on-surface-variant text-sm">Upcoming Events</p>
              </div>
              <div className="glass-panel p-6 rounded-3xl border border-white/5 translate-y-8 glow-purple">
                <span className="material-symbols-outlined text-error text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                <h4 className="text-3xl font-headline font-bold">03</h4>
                <p className="text-on-surface-variant text-sm">Active Alerts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Issues Bento Grid */}
      <section className="space-y-8">
        <div className="flex items-end justify-between px-2">
          <div className="space-y-1">
            <span className="text-tertiary font-bold tracking-[0.2em] text-[10px] uppercase">Real-Time Hub</span>
            <h2 className="text-4xl font-headline font-bold text-on-surface">Trending Issues</h2>
          </div>
          <a className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium flex items-center gap-2" href="#">
            View all trends <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Issue Card 1 */}
          <div onClick={() => router.push('/issue/maker-space')} className="md:col-span-2 group card-hover glass-panel rounded-[2rem] p-8 border border-white/5 hover:border-primary/40 transition-all duration-500 flex flex-col justify-between min-h-[420px] relative overflow-hidden cursor-pointer">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex gap-3">
                <span className="px-4 py-1.5 rounded-full bg-secondary-container/20 text-secondary-fixed border border-secondary/20 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  High Participation
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/5 text-on-surface-variant border border-white/5 text-[10px] font-bold uppercase tracking-widest">Sustainability</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  <span className="font-headline font-bold">{issue2?.upvotes}</span>
                </div>
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-xl">forum</span>
                  <span className="font-headline font-bold">{issue2?.comments?.length || 0}</span>
                </div>
              </div>
            </div>
            <div className="relative z-10 space-y-4 my-8">
              <h3 className="text-3xl md:text-4xl font-headline font-bold text-on-surface leading-tight">Petition for 24/7 Access <br/>to the Maker Space</h3>
              <p className="text-on-surface-variant max-w-lg font-body text-lg italic">
                <span className="text-primary-fixed-dim/80 font-bold not-italic">Summary from multiple reports:</span> Engineering students are requesting extended hours for thesis projects. Current 9 PM closure is hindering production cycles.
              </p>
            </div>
            <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <img className="w-10 h-10 rounded-full border-2 border-surface object-cover" alt="student profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM4LYXbH5yW4Q2Bo894pz16azlUPsZpeaHbqAba7RPTQBrp5plTCHD1aI1nRzuxxro7RERxmb8NoE5WWo6vF30SWd0LcUAz0Qr6b1ijk2wSgz6QgoJVoDHCsjixeBlzUJH3QLm8wPAUdTzHyTXrsFDhzEPBUCOmKXX1pSN14GYwrdL8hQor4bnnqs-_6C5-a1_sGSVXms51yiQz1Xzmorbd5v4x_tgytsxN61febDSPecmnguyxZvz9o7RDHIS5CAI1CW1jggI6IY" />
                  <img className="w-10 h-10 rounded-full border-2 border-surface object-cover" alt="student profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5-pTrqP3vX8Pchnf0pRBGLvGyT_MvuoBqiLRxnXMtOtE0qVFKxap4VL_LFqwHcUuFsQJlaANK_TvMwqXeSXTHdOcpscJuwoHv1PRhuuKYlD2YrB5hV1j0geIyMqrSCeW59WyRg-fzdFKkjThhcGqwRh29HhG0kCpogSU98tLuhVGdLdFDTjvMB90c4vBE45iT9L_7O86jeSp5Lw9QYwn_8ZU4hTK2VlNxbCg0wDqGcQhNuxsxCOZ1ik8mrNU1fc3427eb7WL-mh4" />
                  <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-on-surface-variant">+1.2k</div>
                </div>
                <span className="text-xs text-on-surface-variant font-medium">Joined by the Engineering Soc</span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="tooltip" data-tooltip="Increase visibility of this issue">
                  <button onClick={(e) => { e.stopPropagation(); upvoteIssue("maker-space"); }} className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-primary text-on-primary font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/30 glow-support">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                    <span>Support</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Issue Card 2 */}
          <div onClick={() => router.push('/issue/main-gate')} className="group card-hover glass-panel rounded-[2rem] p-8 border border-white/5 hover:border-secondary/40 transition-all duration-500 flex flex-col justify-between min-h-[420px] cursor-pointer">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <span className="px-4 py-1.5 rounded-full bg-secondary-container/20 text-secondary-fixed border border-secondary/20 text-[10px] font-bold uppercase tracking-widest inline-block">
                  Resolved
                </span>
                <div className="flex items-center gap-1.5 text-secondary">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-headline font-bold">100%</span>
                </div>
              </div>
              <h3 className="text-2xl font-headline font-bold text-on-surface leading-snug">Main Gate WiFi Node Connectivity</h3>
              <div className="flex items-center gap-2 text-secondary-fixed text-sm font-medium">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Fixed 14m ago
              </div>
            </div>
            <div className="mt-8 space-y-6">
              <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                <span>Signal Strength</span>
                <span className="text-secondary">98% Stable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Near You (Map Snip) */}
      <section className="space-y-16">
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-3xl font-headline font-bold text-on-surface">Activity Near You</h2>
            <div className="flex items-center gap-2 text-on-surface-variant text-sm bg-surface-container-low px-4 py-2 rounded-full border border-white/5 glass-panel">
              <span className="material-symbols-outlined text-sm text-secondary">location_on</span>
              Central Hub Area
            </div>
          </div>
          <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden border border-white/5 bg-slate-900 shadow-2xl glass-panel card-hover">
            <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
              <img className="w-full h-full object-cover" alt="campus map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSGn12LIFdrT4nLbtOyueg9tG1u06Oak-XyzOCcK2zccmZvbJgbF3ftGWsoga4tIqeLw59cc4dG2cPjYrbp01L-EPofFXBLggnBsLsT3m4ljlSiQ1uWYcG2Exg-yFrurEXj_xuBaCKBoLKTWn-DhLxCuo9HbPWlTrnzmJzOIOJw1A1Wsdy1-V6452NI1XtjAvb0gETjoVVTC-Dqpn_A2TtNktjTy3_ojTLOg_g3QyLQrX50Vr4Almc3yA9rqhG-jgQgMOCh_HAuGI" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-80"></div>
            {/* Pulse Points */}
            <div className="absolute top-1/4 left-1/3 group">
              <div className="w-16 h-16 bg-primary/20 rounded-full animate-pulse absolute -inset-4"></div>
              <div className="w-8 h-8 bg-primary rounded-full border-4 border-surface shadow-lg relative flex items-center justify-center">
                <span className="material-symbols-outlined text-xs text-on-primary">local_cafe</span>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 glass-panel px-4 py-2 rounded-xl text-xs font-bold border border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                High Density: Student Union
              </div>
            </div>
            <div className="absolute bottom-1/3 right-1/4 group">
              <div className="w-24 h-24 bg-secondary/10 rounded-full animate-pulse absolute -inset-8"></div>
              <div className="w-8 h-8 bg-secondary rounded-full border-4 border-surface shadow-lg relative flex items-center justify-center">
                <span className="material-symbols-outlined text-xs text-on-secondary">sports_soccer</span>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 glass-panel px-4 py-2 rounded-xl text-xs font-bold border border-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Intramural Finals Underway
              </div>
            </div>
            {/* Map Legend / Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <button className="w-12 h-12 glass-panel rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors tooltip" data-tooltip="Zoom In">
                <span className="material-symbols-outlined">add</span>
              </button>
              <button className="w-12 h-12 glass-panel rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors tooltip" data-tooltip="Zoom Out">
                <span className="material-symbols-outlined">remove</span>
              </button>
              <button className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 mt-4 hover:scale-110 transition-transform tooltip" data-tooltip="Recenter Map">
                <span className="material-symbols-outlined">my_location</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Events */}
        <div className="space-y-8">
          <div className="px-2 border-t border-white/5 pt-12">
            <h2 className="text-3xl font-headline font-bold text-on-surface">Recommended</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Event Item 1 */}
            <div className="glass-panel p-5 rounded-3xl border border-white/5 hover:bg-surface-container-highest/60 transition-all flex gap-4 group cursor-pointer card-hover">
              <div className="flex-shrink-0 w-20 h-24 rounded-2xl overflow-hidden relative">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="event thumbnail" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6suBahfjKWQPfLLNgVg__EnrwT-ywZl1aSw75ouYzKqe1bZrTgffe8Z-MIo2ibUkAuuguqE1syw4QOEoQertGYnE1dQZzwaZjD1qL20kXxQ1e9XX7d_vldlgoBcukVT_i7samgcxXcfQqHMoziSniYejSlbNsKzKtJsXz1oK5Wnief2C63biEQScBNoBvumzDoXtjqlUA8YhgZgOKlQeLJslF8F4F8PSdtDHgw4qt2x_4HkxQ_A8OM7ucm0GZXgvPJ-xkGoZNlCc" />
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
              </div>
              <div className="flex flex-col justify-center flex-1">
                <h4 className="font-headline font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">AI Ethics Symposium</h4>
                <div className="flex items-center gap-3 text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1 text-primary"><span className="material-symbols-outlined text-xs">calendar_today</span> Today</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">location_on</span> Hall 4B</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img className="w-6 h-6 rounded-full border border-surface-container-highest object-cover" alt="avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsb7xA4zlIyEZvspyRU4q9n13AtYY5k7XrhxDzXxYDqNlXLntrk9T5KEqkfjB9j249C8MHDSDv37SNfIVETA3mEx82hcb9qUyvXdLbw4IogqzZTF4Eb2aXWmrek3V0YXl4_MiJ_K-P3jVHCDfGZEeKyPC-avsdtwAOcyUlvI5RfHxramFYo7jyOsyHbVLPrHFwrQuiQZ5IOOMKRn8u6-gXH9_4WBkHce9d1391rBWsK1Ti4bfa7QFLpaizhtJ2KasiJpQUY08G_yY" />
                    <div className="w-6 h-6 rounded-full border border-surface-container-highest bg-surface-container-high flex items-center justify-center text-[8px] font-bold text-on-surface-variant">+3</div>
                  </div>
                  <span className="text-[9px] font-bold text-tertiary uppercase tracking-widest">Recommended for you</span>
                </div>
              </div>
            </div>
            {/* Event Item 2 */}
            <div className="glass-panel p-5 rounded-3xl border border-white/5 hover:bg-surface-container-highest/60 transition-all flex gap-4 group cursor-pointer card-hover">
              <div className="flex-shrink-0 w-20 h-24 rounded-2xl overflow-hidden relative">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="event thumbnail" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSQWW7LvlwTPusgmbOa-FsjaaTdcN8vwMlQUyB0LmzqMz0YZZ_77DPFN56knxPUqJrBnUtOGUvXVk4NUPaMicnZYzzwrAd-N64MWbQ9m1pS3Uwox6d1tmnXdT6o4JL324KrhuL87zVRiY5ac0i0CkrnolIphptdye5gfx4a9K8nkoegOcCuqKbadmQ4WgDl1dAaWmElnF2rVsBneUVyvt95lqM02EfIvUBYjx-UZvpvMy15fMdsPlMRK_EhJBoxLQ5bgDdTJc_3bA" />
                <div className="absolute inset-0 bg-secondary/20 mix-blend-overlay"></div>
              </div>
              <div className="flex flex-col justify-center flex-1">
                <h4 className="font-headline font-bold text-lg leading-tight mb-1 group-hover:text-secondary transition-colors">Sunset Acoustics</h4>
                <div className="flex items-center gap-3 text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1 text-secondary"><span className="material-symbols-outlined text-xs">schedule</span> 20:30</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">location_on</span> The Lawn</span>
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-1 text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">
                    <span className="material-symbols-outlined text-xs">group</span> 84 Going
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">
                    <span className="material-symbols-outlined text-xs">thumb_up</span> 312
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




    </div>
  );
}
