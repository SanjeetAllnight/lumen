export default function ActivityStreamPage() {
  return (
    <>
      <header className="flex justify-between items-end mb-10 px-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse-dot"></span>
            <span className="text-secondary text-xs font-bold uppercase tracking-tighter">Live Ecosystem Feed</span>
          </div>
          <h1 className="text-5xl font-headline font-bold text-on-background tracking-tighter">Activity Stream</h1>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 glass-panel rounded-full border border-outline-variant/20 text-xs font-bold hover:bg-white/10 transition-all">ALL SYSTEMS</button>
          <button className="px-4 py-2 glass-panel rounded-full border border-outline-variant/20 text-xs font-bold text-error bg-error/5 hover:bg-error/10 transition-all">CRITICAL ONLY</button>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-6">
        {/* Main Live Feed Column */}
        <div className="lg:col-span-8 space-y-4">
          {/* Activity Item: Issue */}
          <div className="glass-panel p-6 rounded-3xl border border-primary/20 hover:border-primary/50 transition-all group relative overflow-hidden bg-primary/5 glow-card-urgent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-10 -mt-10"></div>
            <div className="flex gap-6 items-start">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <span className="material-symbols-outlined text-primary">construction</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background animate-pulse-dot"></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-headline font-bold text-primary">
                      ⚠️ Multiple reports incoming: Block A
                    </h3>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0"></span>
                  </div>
                  <span className="text-[10px] text-primary font-bold font-mono bg-primary/10 px-2 py-0.5 rounded-full shrink-0">JUST NOW</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4 max-w-xl">Our team is heading to elevator shaft 4 right now. We expect to have this sorted in 45 minutes. Please use the North stairs for now!</p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-secondary uppercase bg-secondary/5 px-2 py-1 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Active Response
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">person</span> Supervisor: K. Vance
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Item: WiFi Alert */}
          <div className="glass-panel p-6 rounded-3xl border border-error/30 hover:border-error/50 transition-all group relative overflow-hidden bg-error/5 glow-card-critical">
            <div className="absolute top-0 right-0 w-32 h-32 bg-error/10 blur-3xl -mr-10 -mt-10"></div>
            <div className="flex gap-6 items-start">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center border border-error/20">
                  <span className="material-symbols-outlined text-error">wifi_off</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full border-2 border-background animate-pulse-dot"></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-headline font-bold text-error">
                      🚨 Network Drop: Critical Node 7
                    </h3>
                    <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse shrink-0"></span>
                  </div>
                  <span className="text-[10px] text-error font-bold font-mono bg-error/10 px-2 py-0.5 rounded-full shrink-0">JUST NOW</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4 max-w-xl">The Central Library&apos;s main router just went dark. IT is on it—looks like a firmware glitch. Hang tight while we reconnect you.</p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-error uppercase bg-error/5 px-2 py-1 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span> Service Interruption
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">location_on</span> Central Library
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Item: Event */}
          <div className="glass-panel p-6 rounded-3xl border border-tertiary/10 hover:border-tertiary/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/5 blur-3xl -mr-10 -mt-10"></div>
            <div className="flex gap-6 items-start">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center border border-tertiary/20">
                  <span className="material-symbols-outlined text-tertiary">stadium</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-tertiary rounded-full border-2 border-background animate-pulse-dot"></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-headline font-bold text-tertiary">
                    ⚡ Spike detected: East Plaza density
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">2m AGO</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4 max-w-xl">Whoa, it&apos;s getting crowded! Foot traffic near the auditorium is way up. We&apos;ve opened the extra gates to keep everyone moving smoothly.</p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-tertiary-fixed uppercase bg-tertiary/10 px-2 py-1 rounded-md">
                    Monitoring
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">groups</span> ~1,200 Active Users
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Item: Resolved */}
          <div className="glass-panel p-6 rounded-3xl border border-secondary/10 hover:border-secondary/30 transition-all group opacity-60">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20 shrink-0">
                <span className="material-symbols-outlined text-secondary">check_circle</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-headline font-bold text-secondary">✅ Gate 4 is back in action</h3>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">15m AGO</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-2 max-w-xl">Mechanical sensor recalibrated. Vehicle access is back to normal.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Analytics/Stats */}
        <div className="lg:col-span-4 space-y-6">
          {/* System Pulse Map */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-outline-variant/10">
            <div className="h-48 relative">
              <div className="absolute inset-0 bg-slate-900" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCHtudNTG3bsKSO6Yb7icn7UOKxzHBwnD-OGpJwxhysZxlRUVJrmD4aPSLlBwXTMygSydjmKiByo3EU2nkuwpxpMGOTbH8E7kaadaOSOX74P7Br7k7MMLW9MkhepLz3xGHE8H7vfyJ35kM8TS0lX-GiMf75hS3BmrlxQdJyZyCB4VXfPYlRNdVHi7uqinx7RoB1tFRm5Anoax7PNtUZf_k8aYKoT36xJGPwhbbtdfTJaVx1i8EZxT5FI8ZeI5KUR_z_rMwC0bd_UcI')", backgroundSize: "cover" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent"></div>
              {/* Live Indicator Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute w-8 h-8 bg-secondary/20 rounded-full animate-ripple -left-2 -top-2"></div>
                  <div className="w-4 h-4 bg-secondary rounded-full border-2 border-white/20 animate-pulse-dot"></div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="text-[10px] font-bold text-secondary uppercase bg-secondary/10 backdrop-blur-md px-2 py-1 rounded border border-secondary/20 tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Live Pulse Map
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Network Stability</span>
                  <span className="text-sm font-headline font-bold text-secondary tracking-tighter">98.2%</span>
                </div>
                <div className="w-full bg-surface-container-low h-1 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: "98.2%" }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Power Efficiency</span>
                  <span className="text-sm font-headline font-bold text-primary tracking-tighter">104 kW/h</span>
                </div>
                <div className="w-full bg-surface-container-low h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full shadow-[0_0_10px_rgba(199,153,255,0.5)]" style={{ width: "72%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Alerts Quick List */}
          <div className="glass-panel p-6 rounded-3xl border border-outline-variant/10">
            <h4 className="font-headline font-bold text-slate-300 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">history</span>
              Signal History
            </h4>
            <div className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="w-2 h-2 rounded-full bg-primary glow-border-primary animate-pulse-dot"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-200">Door Alarm Triggered</p>
                  <p className="text-[10px] text-slate-500">Physics Lab A - False Alarm</p>
                </div>
                <span className="text-[9px] text-primary font-bold font-mono">JUST NOW</span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-200">Bio-Metric Sync Success</p>
                  <p className="text-[10px] text-slate-500">Security Gate North</p>
                </div>
                <span className="text-[9px] text-slate-600 font-mono">2m AGO</span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-2 h-2 rounded-full bg-error"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-200">Thermal Threshold Warning</p>
                  <p className="text-[10px] text-slate-500">Main Server Room</p>
                </div>
                <span className="text-[9px] text-slate-600 font-mono">11m AGO</span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-2 h-2 rounded-full bg-primary opacity-50"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-200">HVAC Filter Alert</p>
                  <p className="text-[10px] text-slate-500">Dormitory Block C</p>
                </div>
                <span className="text-[9px] text-slate-600 font-mono">47m AGO</span>
              </div>
            </div>
            <button className="w-full mt-8 py-3 glass-panel border border-outline-variant/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary hover:border-primary/40 transition-all">
              Open Full Logs
            </button>
          </div>

          {/* Weather/Atmosphere Small Card */}
          <div className="glass-panel p-6 rounded-3xl border border-primary/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Atmosphere</p>
              <p className="text-2xl font-headline font-bold text-on-background tracking-tighter">24°C <span className="text-slate-500 text-sm font-light">Partly Clouded</span></p>
            </div>
            <span className="material-symbols-outlined text-primary text-4xl">cloud_queue</span>
          </div>
        </div>
      </div>
    </>
  );
}
