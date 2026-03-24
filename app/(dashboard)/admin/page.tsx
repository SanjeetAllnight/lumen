export default function AdminIntelligencePage() {
  return (
    <div className="px-8 pb-12 w-full">
      {/* Header Grid */}
      <div className="grid grid-cols-12 gap-8 mb-12">
        {/* 1. Top Issue Right Now: Hero Card */}
        <section className="col-span-12 lg:col-span-8 group">
          <div className="relative glass-panel rounded-[2rem] p-10 glow-error border border-error/20 overflow-hidden transition-all duration-300 hover:border-error/40 hover:shadow-[0_0_40px_-5px_rgba(255,110,132,0.4)]">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-error/10 blur-[100px] rounded-full group-hover:bg-error/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-error/20 text-error px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Critical Anomaly</span>
                <span className="text-on-surface-variant text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  Reported 14m ago
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface mb-4 leading-tight">HVAC System Failure: Engineering Block C</h1>
              <p className="text-on-surface-variant text-lg max-w-2xl mb-8 leading-relaxed font-body font-light italic">
                Summary from multiple reports: Temperature threshold exceeded in Server Room 4B. Risk of localized hardware damage. Facilities dispatched.
              </p>
              <div className="flex flex-wrap items-end gap-12">
                <div>
                  <span className="text-on-surface-variant text-xs uppercase tracking-widest block mb-2">Affected People</span>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-headline font-bold text-error">1,402</span>
                    <span className="text-error/60 text-sm">Students impacted</span>
                  </div>
                </div>
                <div>
                  <span className="text-on-surface-variant text-xs uppercase tracking-widest block mb-2">Impact Score</span>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-headline font-bold text-on-surface">9.4</span>
                    <span className="material-symbols-outlined text-error">trending_up</span>
                  </div>
                </div>
                <div className="ml-auto flex gap-4">
                  <button className="bg-white/5 border border-white/10 text-on-surface px-6 py-4 rounded-full font-headline font-bold hover:bg-white/10 transition-all">
                    Support Issue
                  </button>
                  <button className="bg-error text-on-error px-8 py-4 rounded-full font-headline font-bold hover:scale-105 transition-transform glow-error">
                    Initialize Response
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Systems Overview: Quick Stats */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">

          <div className="grid grid-cols-2 gap-6">
            <div className="glass-panel rounded-3xl p-6 border border-white/5 transition-all duration-300 glow-hover">
              <span className="text-xs font-headline tracking-widest text-on-surface-variant uppercase block mb-2">Resolutions</span>
              <h3 className="text-3xl font-headline font-bold text-on-surface">92%</h3>
              <div className="w-full h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
                <div className="w-[92%] h-full bg-primary glow-primary"></div>
              </div>
            </div>
            <div className="glass-panel rounded-3xl p-6 border border-white/5 transition-all duration-300 glow-hover">
              <span className="text-xs font-headline tracking-widest text-on-surface-variant uppercase block mb-2">Reports</span>
              <h3 className="text-3xl font-headline font-bold text-on-surface">48</h3>
              <span className="text-xs text-error mt-2 block">+12% vs Yesterday</span>
            </div>
          </div>
        </section>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* 3. Live Issues Queue */}
        <div className="col-span-12 xl:col-span-7">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-headline font-bold text-on-surface">Live Intelligence Stream</h2>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Issue Item */}
            <div className="group glass-panel rounded-2xl p-6 flex items-center gap-6 border border-white/5 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(199,153,255,0.15)]">
              <div className="h-12 w-12 rounded-xl bg-error/10 flex items-center justify-center text-error glow-error">
                <span className="material-symbols-outlined">wifi_off</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-headline font-bold text-on-surface">Central Library WiFi Drop</span>
                  <span className="bg-error/20 text-error text-[10px] px-2 py-0.5 rounded-full font-bold">CRITICAL</span>
                </div>
                <p className="text-sm text-on-surface-variant">Cluster of 24 reports from Floor 2 Reading Room.</p>
              </div>
              <div className="text-right">
                <span className="block text-xs text-on-surface-variant font-mono">12:42 PM</span>
                <div className="flex items-center gap-1 mt-1 text-primary text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">diversity_3</span>
                  Grouped reports
                </div>
              </div>
            </div>

            {/* Issue Item */}
            <div className="group glass-panel rounded-2xl p-6 flex items-center gap-6 border border-white/5 hover:border-secondary/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(74,248,227,0.15)]">
              <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary glow-secondary">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-headline font-bold text-on-surface">Path Lighting: South Lawn</span>
                  <span className="bg-surface-container-highest text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full font-bold">STANDARD</span>
                </div>
                <p className="text-sm text-on-surface-variant">Sensor malfunction in Sector 09 path lights.</p>
              </div>
              <div className="text-right">
                <span className="block text-xs text-on-surface-variant font-mono">11:55 AM</span>
                <span className="text-xs text-secondary font-bold mt-1 block">Assigned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Widgets */}
        <div className="col-span-12 xl:col-span-5 space-y-8">
          {/* 4. Active Geo-Zones (Map Overlay) */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 relative h-80 transition-all duration-300 glow-hover">
            <div className="absolute inset-0 z-0 bg-slate-800" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBy2vda_7gNl95cdvIOFxyNHGfkIMf_KkpEWGEmaUGyBVLWjBjsfcGo0LK_Ih-L91n7CVetHAMzDfjqAflqu8IGZ4D_gIKz7ajEeDbJI9pECC3tPklUiAfTrnG1d2rSlT9I7gzDeE6WBaXpDc7bY20DDTeyOH2xO1mo7RHTTBMneFwBHfZz2Bna8WwmWD4qRLl4VafLIenl2zn_tfJOZ0e_0RwoUVBPSZqeCcn6aWED5I9DRGvzzDsR5RyLXN6c2K5KPU7Z5T8rwuY')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.4) saturate(0.5) contrast(1.2)" }}>
            </div>
            {/* Heatmap Faux Glows */}
            <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-error/40 blur-3xl rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 left-1/4 border-2 border-error/50 rounded-full w-4 h-4 flex items-center justify-center bg-error/20">
              <span className="absolute -top-6 whitespace-nowrap bg-error text-on-error px-2 py-0.5 rounded text-[10px] font-bold">🔥 23 reports</span>
            </div>
            <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-primary/30 blur-2xl rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/3 border-2 border-primary/50 rounded-full w-4 h-4 flex items-center justify-center bg-primary/20">
              <span className="absolute -top-6 whitespace-nowrap bg-primary text-on-primary px-2 py-0.5 rounded text-[10px] font-bold">12 Active</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-headline font-bold text-on-surface">Kinetic Heatmap</h3>
                  <p className="text-xs text-on-surface-variant">Live cluster density: Campus Square</p>
                </div>
                <span className="bg-background/80 backdrop-blur-md p-2 rounded-lg text-primary">
                  <span className="material-symbols-outlined text-sm">my_location</span>
                </span>
              </div>
              <div className="flex gap-4">
                <div className="bg-background/80 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                  <span className="text-xs font-bold">High Density</span>
                </div>
                <div className="bg-background/80 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="text-xs font-bold">Nominal</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Predictive Pulse */}
          <div className="glass-panel rounded-3xl p-8 border border-white/5 relative overflow-hidden transition-all duration-300 glow-hover">
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-tertiary/10 blur-[80px] rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-tertiary">psychology</span>
                <h3 className="text-lg font-headline font-bold text-on-surface">Predictive Insight</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1 h-12 bg-gradient-to-b from-tertiary to-transparent rounded-full"></div>
                  <div>
                    <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Est. T-Minus 2h</span>
                    <p className="text-sm text-on-surface mt-1">94% probability: Transport congestion at Gate 3 due to Event exit.</p>
                  </div>
                </div>

                <div className="flex gap-4 opacity-60">
                  <div className="w-1 h-12 bg-gradient-to-b from-slate-600 to-transparent rounded-full"></div>
                  <div>
                    <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Est. T-Minus 5h</span>
                    <p className="text-sm text-on-surface mt-1">72% probability: Dining Hall peak capacity alert.</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-8 py-3 rounded-2xl bg-white/5 text-on-surface-variant text-sm font-bold border border-white/10 hover:bg-white/10 transition-all">
                View Full Projections
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
