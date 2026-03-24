export default function MapPage() {
  return (
    <div className="mx-8 mb-12 h-[calc(100vh-8rem)] relative overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col bg-slate-950">
      {/* Map Canvas */}
      <div className="absolute inset-0 z-0 map-bg" data-location="Stanford University Campus">
        <div className="scan-line"></div>

        {/* Intense Heatmap Zones */}
        <div className="absolute top-[20%] left-[38%] w-[600px] h-[600px] heatmap-pulse-primary rounded-full flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-primary/30 backdrop-blur-xl px-4 py-2 rounded-2xl border border-primary/40 flex flex-col items-center gap-1 shadow-[0_0_30px_rgba(199,153,255,0.4)] translate-y-[-140px]">
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">High Activity Zone</span>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex flex-col items-center">
                <span className="text-xl font-headline font-bold text-primary">842</span>
                <span className="text-[8px] text-primary/70 uppercase">PPL/HR</span>
              </div>
              <div className="w-[1px] h-6 bg-white/20"></div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-headline font-bold text-primary">12</span>
                <span className="text-[8px] text-primary/70 uppercase">Events</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-[50%] left-[20%] w-[450px] h-[450px] heatmap-pulse-error rounded-full flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-error/30 backdrop-blur-xl px-4 py-2 rounded-2xl border border-error/40 flex flex-col items-center gap-1 shadow-[0_0_30px_rgba(255,110,132,0.4)] translate-y-[100px]">
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Issue Cluster Detected</span>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex flex-col items-center">
                <span className="text-xl font-headline font-bold text-error">23</span>
                <span className="text-[8px] text-error/70 uppercase">Reports</span>
              </div>
              <div className="w-[1px] h-6 bg-white/20"></div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-headline font-bold text-error">05</span>
                <span className="text-[8px] text-error/70 uppercase">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] heatmap-pulse-secondary rounded-full flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-secondary/30 backdrop-blur-xl px-4 py-2 rounded-2xl border border-secondary/40 flex flex-col items-center gap-1 shadow-[0_0_30px_rgba(74,248,227,0.4)] translate-y-[120px]">
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Growing Interest</span>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex flex-col items-center">
                <span className="text-xl font-headline font-bold text-secondary">156</span>
                <span className="text-[8px] text-secondary/70 uppercase">Check-ins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Density Indicators / Markers */}
        
        {/* Event Marker */}
        <div className="absolute top-[40%] left-[50%] group cursor-pointer z-20">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-12 h-12 bg-tertiary/30 rounded-full animate-ping"></div>
            <div className="absolute w-24 h-24 bg-tertiary/10 rounded-full blur-xl"></div>
            <div className="w-8 h-8 bg-tertiary rounded-full shadow-[0_0_30px_rgba(159,142,255,1)] border-2 border-white/40 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">452</span>
            </div>
          </div>
          {/* Glass Popup */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-slate-900/90 backdrop-blur-2xl p-4 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border border-white/10 translate-y-2 group-hover:translate-y-0">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-tertiary-fixed">Live Event</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_#4af8e3]"></div>
                <span className="text-[8px] text-secondary font-bold">ACTIVE</span>
              </div>
            </div>
            <h4 className="font-headline text-lg font-bold leading-tight mb-1 text-on-surface">Neon Jazz Night</h4>
            <p className="text-xs text-on-surface-variant mb-3">Main Plaza • 452 attending</p>
            <div className="h-20 w-full rounded-lg overflow-hidden mb-3">
              <img alt="Festival" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDGgw2rj6DFsP0JkGW2Wqo0IzskwJm6qVYqPnvt-cvrVJ0Uwi9ikP71syBTJWG7WJhTxP0iqBymu9P-gu86f3nlamOVl2tlLfRqYeU8WjUf3qn_c-odPe0igcKm8IY_bkUVu3C4sNRxOWEEw9vJU7QUcAKcG3zrCrM4oTRQLue_RIS7uBmprN0YudRLwhVg0dRE7Cdh5HQssvBx2hv1pl9JHmJ3FZzqr-UK9xof7meojfYiFGAN5CgdiCI5Eh5HXd_JtiyWYQSpGU" />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 rounded-lg bg-tertiary/20 text-tertiary text-[10px] font-bold pointer-events-auto hover:bg-tertiary/30 transition-colors">VIEW FEED</button>
              <button className="flex-1 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-[10px] font-bold pointer-events-auto hover:bg-white/5 transition-colors">DETAILS</button>
            </div>
          </div>
        </div>

        {/* Complaint Marker */}
        <div className="absolute top-[65%] left-[32%] group cursor-pointer z-20">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-10 h-10 bg-error/40 rounded-full animate-pulse"></div>
            <div className="absolute w-20 h-20 bg-error/10 rounded-full blur-xl"></div>
            <div className="w-7 h-7 bg-error rounded-full shadow-[0_0_20px_rgba(255,110,132,1)] border-2 border-white/40 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">12</span>
            </div>
          </div>
        </div>

        {/* Resource Marker */}
        <div className="absolute bottom-[35%] right-[40%] group cursor-pointer z-20">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-10 h-10 bg-secondary/40 rounded-full animate-pulse"></div>
            <div className="absolute w-20 h-20 bg-secondary/10 rounded-full blur-xl"></div>
            <div className="w-6 h-6 bg-secondary rounded-full shadow-[0_0_20px_rgba(74,248,227,1)] border-2 border-white/40 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* UI Overlays */}
      <div className="relative z-30 p-8 flex flex-col h-full pointer-events-none">
        {/* Top Dashboard Stats */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="bg-slate-900/40 backdrop-blur-xl px-6 py-4 rounded-3xl shadow-2xl border border-white/10">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-60 mb-1">System Health</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-headline font-bold text-secondary">98.4%</span>
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                </div>
              </div>
              <div className="w-[1px] h-10 bg-white/10"></div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-60 mb-1">Active Users</p>
                <span className="text-2xl font-headline font-bold text-on-surface">12,842</span>
              </div>
              <div className="w-[1px] h-10 bg-white/10"></div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-60 mb-1">Alerts</p>
                <span className="text-2xl font-headline font-bold text-error">03</span>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="bg-slate-900/40 backdrop-blur-xl p-2 rounded-2xl flex flex-col gap-2 border border-white/10">
            <button className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined">add</span>
            </button>
            <button className="p-3 bg-surface-container-high text-on-surface-variant rounded-xl hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined">remove</span>
            </button>
            <div className="w-full h-[1px] bg-white/5 my-1"></div>
            <button className="p-3 bg-surface-container-high text-on-surface-variant rounded-xl hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined">3d_rotation</span>
            </button>
            <button className="p-3 bg-surface-container-high text-on-surface-variant rounded-xl hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined">my_location</span>
            </button>
          </div>
        </div>

        {/* Bottom Left Legend & Controls */}
        <div className="mt-auto flex justify-between items-end">
          <div className="w-80 space-y-4 pointer-events-auto">
            {/* Filters Glass Card */}
            <div className="bg-slate-950/60 backdrop-blur-3xl p-6 rounded-[2.5rem] shadow-2xl border border-white/5">
              <h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">layers</span>
                Visual Layers
              </h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-error/10 flex items-center justify-center text-error border border-error/10">
                      <span className="material-symbols-outlined text-sm">report</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">Active Complaints</span>
                      <span className="text-[10px] text-error/60">42 detected</span>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-error/10 rounded-full relative border border-error/20">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-error rounded-full shadow-[0_0_12px_rgba(255,110,132,0.8)]"></div>
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary border border-tertiary/10">
                      <span className="material-symbols-outlined text-sm">event</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">Live Events</span>
                      <span className="text-[10px] text-tertiary/60">8 in progress</span>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-tertiary/10 rounded-full relative border border-tertiary/20">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-tertiary rounded-full shadow-[0_0_12px_rgba(159,142,255,0.8)]"></div>
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/10">
                      <span className="material-symbols-outlined text-sm">sensors</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">IoT Node Health</span>
                      <span className="text-[10px] text-secondary/60">99.1% online</span>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-secondary/10 rounded-full relative border border-secondary/20">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-secondary rounded-full shadow-[0_0_12px_#4af8e3]"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Bottom Right Floating Live Activity */}
          <div className="w-96 pointer-events-auto hidden md:block">
            <div className="bg-slate-950/60 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5">
              <div className="p-5 bg-white/5 flex justify-between items-center border-b border-white/5">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Live Data Pulse</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-[10px] text-on-surface-variant font-bold">REAL-TIME SYNC</span>
                </div>
              </div>
              <div className="max-h-56 overflow-y-auto">
                <div className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-tertiary/30">
                      <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI4WD56MHpTr51SJbfXBKLbBOf51DEeYlCF_xvcGPr0ku8LKoXfSQ9_kMlENNLdRNWNgAiTJEZZ1gftU4-sBmiQB8Vm8IwFOXm_ytuGkfn4huqE0fPd00FaF3U9ZrQaguWGynxfbXxsDChPXfso-rjvZe10pR1hXdmvFAUoOHHIlbXABHqtx4bFl-URaKe6d4MfMWwryw70YFhKXHvJayAU2goU6kNhedBib2MJFG38xbT_rt5PTkCdsXRCcXIHvcZr4S3zVC3nE8" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-tertiary rounded-full border-2 border-slate-900 flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-[8px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-on-surface">Alex R. registered for Neon Jazz</p>
                    <p className="text-[10px] text-on-surface-variant flex justify-between">
                      <span>Main Plaza</span>
                      <span>2 mins ago</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error border border-error/20">
                    <span className="material-symbols-outlined">warning</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-on-surface">Lighting sensor failure</p>
                    <p className="text-[10px] text-on-surface-variant flex justify-between">
                      <span>Library West Sector 4</span>
                      <span>5 mins ago</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                    <span className="material-symbols-outlined">eco</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-on-surface">Zone C Air Quality: Excellent</p>
                    <p className="text-[10px] text-on-surface-variant flex justify-between">
                      <span>North Campus</span>
                      <span>12 mins ago</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
