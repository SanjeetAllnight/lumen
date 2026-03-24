import Link from 'next/link';

export default function IssueDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 md:p-10 max-w-7xl mx-auto w-full">
      {/* Issue Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start">
        {/* Left Column: Media & Core Info */}
        <div className="lg:col-span-8 space-y-8">
          <div className="relative rounded-3xl overflow-hidden group">
            <img 
              className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" 
              alt="broken elevator" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ1vZVAPBxZG0qHMWM1LGx8-ilepevop4Qdgw84Vf-VdF1RYEWPZGDEZargpGLnAGU73sxTeuiD4wReEZ_RMig-STa_AA_3mZOOVwQoQme4VSYEerWSFo4LzA7cVssQ4pcG1J9CZmoHTAbLQjIxSCeeDl2DzrqK9AbW5kK5XtIjHFTBBfy5OAqdXcV49ncpKnCrTvDdQ5jZ4bbPya6XzxtaX8Ee2zdds_LQAXJXKi72ixYa6WpbbBUWFpHharY6zCnsnp0rIUn1d4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-6 left-6">
              <span className="px-3 py-1 bg-error/20 backdrop-blur-md border border-error/30 text-error text-[10px] font-bold rounded-full uppercase tracking-tighter mb-3 inline-block">High Priority</span>
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface leading-tight">Broken Elevator: Science Wing B</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 py-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-400">person</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Reported by</p>
                <p className="text-sm font-semibold">Alex Rivera</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-400">schedule</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Time Elapsed</p>
                <p className="text-sm font-semibold">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-400">location_on</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Location</p>
                <p className="text-sm font-semibold">Floor 4, Sector G</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2rem] border border-outline-variant/10">
            <h3 className="text-lg font-headline font-bold mb-4 text-purple-200">Summary from multiple reports</h3>
            <p className="text-on-surface-variant leading-relaxed font-body">
              The central elevator in Science Wing B is currently unresponsive. Multiple students have reported being stuck between the 3rd and 4th floors. A technician was called approximately 30 minutes ago. The digital display is showing an "Error E-42" code. This is the second time this unit has failed this week. Immediate inspection required for the pulley mechanism.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-full transition-all group active:scale-95">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                <span className="text-sm font-bold text-primary">84 Upvotes</span>
              </button>
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-700"></div>
                <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-600"></div>
                <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-500"></div>
                <div className="w-8 h-8 rounded-full border-2 border-background bg-surface-variant flex items-center justify-center text-[10px] font-bold">+21</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Timeline */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status Card */}
          <div className="glass-panel p-6 rounded-[2rem] border border-outline-variant/10 glow-purple">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-on-surface">Live Status</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_#4af8e3] animate-pulse"></span>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">In Progress</span>
              </div>
            </div>

            <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary before:via-primary/50 before:to-surface-variant">
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-surface-variant border-2 border-outline-variant z-10"></div>
                <div className="opacity-40">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Resolved</p>
                  <p className="text-[10px] text-on-surface-variant">Awaiting completion</p>
                </div>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10 shadow-[0_0_15px_rgba(199,153,255,0.6)]">
                  <span className="material-symbols-outlined text-[14px] text-on-primary font-bold">handyman</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">In Progress</p>
                  <p className="text-[10px] text-on-surface-variant">Maintenance crew dispatched</p>
                  <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[11px] italic text-slate-400">"Technician J. Smith is currently on site investigating the cable tensioner."</p>
                  </div>
                </div>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-[14px] text-primary">check</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface uppercase tracking-widest">Reported</p>
                  <p className="text-[10px] text-on-surface-variant">Today at 14:30</p>
                </div>
              </div>
            </div>

            <button className="w-full mt-10 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-2xl active:scale-95 transition-all shadow-xl shadow-primary/20">
              Notify Me of Updates
            </button>
          </div>

          {/* Micro Stats Bento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-outline-variant/10 text-center">
              <span className="material-symbols-outlined text-secondary mb-1">group</span>
              <p className="text-[10px] text-on-surface-variant uppercase font-bold">Affected</p>
              <p className="text-xl font-headline font-bold">120+</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-outline-variant/10 text-center">
              <span className="material-symbols-outlined text-tertiary mb-1">timer</span>
              <p className="text-[10px] text-on-surface-variant uppercase font-bold">Est. Fix</p>
              <p className="text-xl font-headline font-bold">2h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <section className="max-w-4xl">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-headline font-bold">Discussion</h3>
            <span className="bg-primary/20 text-primary px-3 py-0.5 rounded-full text-xs font-bold">12 Live</span>
          </div>
          <div className="flex p-1 bg-surface-container-highest/50 rounded-full border border-white/5">
            <button className="px-5 py-1.5 text-xs font-bold bg-white/10 rounded-full shadow-lg transition-all">Newest</button>
            <button className="px-5 py-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-all">Trending</button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Comment Input */}
          <div className="relative flex gap-4 items-start mb-12">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-purple-900/40">
              <span className="material-symbols-outlined text-white">person</span>
            </div>
            <div className="flex-1 group">
              <textarea className="w-full bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl p-5 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all min-h-[120px] backdrop-blur-sm" placeholder="Add a comment or update..."></textarea>
              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-2">
                  <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-white/5">
                    <span className="material-symbols-outlined text-xl">image</span>
                  </button>
                  <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-white/5">
                    <span className="material-symbols-outlined text-xl">alternate_email</span>
                  </button>
                </div>
                <button className="px-8 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:shadow-[0_0_20px_rgba(199,153,255,0.4)] transition-all active:scale-95 glow-primary-hover">Post Update</button>
              </div>
            </div>
          </div>

          {/* Live Thread Timeline */}
          <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-primary/30 before:via-outline-variant/10 before:to-transparent">
            {/* Comment 1: Admin Verified */}
            <div className="relative pl-14 group">
              <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center border border-secondary/50 shadow-lg shadow-secondary/20 z-10">
                <span className="material-symbols-outlined text-on-secondary-fixed text-xl">engineering</span>
              </div>
              <div className="bg-secondary/10 backdrop-blur-xl p-6 rounded-2xl border-l-4 border-l-secondary border-y border-r border-secondary/20 shadow-xl shadow-secondary/5 transition-all duration-300 hover:bg-secondary/[0.15] hover:border-secondary/30">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-bold text-secondary">Campus Ops Team</h4>
                    <div className="flex items-center gap-1.5 bg-secondary/20 px-2 py-0.5 rounded-full border border-secondary/40">
                      <span className="material-symbols-outlined text-[14px] font-bold text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      <span className="text-[9px] font-black text-secondary uppercase tracking-widest">Verified Staff</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-secondary/70 font-bold bg-secondary/5 px-2 py-1 rounded">2m ago</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4">Maintenance team is now on-site at Wing B. We are bypassing the elevator control system to release the safety brakes. Expected downtime is 2 hours.</p>
                <div className="flex items-center gap-6 pt-3 border-t border-secondary/10">
                  <button className="flex items-center gap-2 text-[11px] font-bold text-secondary hover:brightness-125 transition-all group/btn">
                    <span className="material-symbols-outlined text-sm group-hover/btn:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                    24 Helpful
                  </button>
                  <button className="flex items-center gap-2 text-[11px] font-bold text-secondary/70 hover:text-secondary transition-all">
                    <span className="material-symbols-outlined text-sm">reply</span>
                    Reply
                  </button>
                </div>
              </div>
            </div>

            {/* Comment 2 */}
            <div className="relative pl-14 group">
              <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl overflow-hidden border border-outline-variant/20 shadow-lg z-10">
                <img className="w-full h-full object-cover" alt="portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdGAMQpQ9FsIJfsnTnrEcqzDIagOetCSYoddOAHv5FXCrIKDMkESFdGq0OXZjJkH6_nvxyFcNA0MYRSnuLe6kI9gSEcEGBeP08ibIyq3uKXrxAzw7juqnD4NdekmGCs-FMqBjSz7Ib_gSV6nSILCOODN3mqKpnugcwR6FKIMgjTRxiL2jQlgfa9AekOmS3H-UZiE_KXOeZbnQ0EBzlXdo2QF4MBp_fSP2pqGDWTdzBq8vMl2X5kEcfR0--XfnCvpJkjI6NLkJ3snk" />
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/20 hover:bg-white/5 transition-all duration-300">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-purple-300">Marcus Chen</h4>
                  <span className="text-[10px] text-on-surface-variant font-medium opacity-60">15m ago</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4">The doors have been making a grinding sound for days. I'm glad someone finally reported it. Please check the sensors too, they don't seem to detect people properly.</p>
                <div className="flex items-center gap-6 pt-3 border-t border-white/5">
                  <button className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant hover:text-primary transition-all group/btn">
                    <span className="material-symbols-outlined text-sm group-hover/btn:scale-110 transition-transform">thumb_up</span>
                    12
                  </button>
                  <button className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant hover:text-primary transition-all">
                    <span className="material-symbols-outlined text-sm">reply</span>
                    Reply
                  </button>
                </div>
              </div>
            </div>

            {/* Comment 3 */}
            <div className="relative pl-14 group">
              <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl overflow-hidden border border-outline-variant/20 shadow-lg z-10">
                <img className="w-full h-full object-cover" alt="portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuHND6GfOZwQsTMjfZ4HdR99xtZXul_Tk2Md7v3z5-xsp1pmO7B0OwN8cYQ9RtmOItYJJl5KgLMXy2A-ZyEFof5ZxzO8_N-D6RoVyOF3vqtxysvxiy3JIGppvVIXdzUQfke9dYB36fUI1KxLL5Ng6Lfyyd72UswV-hOgVkhNE9ATbiZ43peJxzvK5qmjwGe_JuMtVf-QAsCY_hIgXhtPXge25EWeeGoQovSSXySXM-w8jgqcqpORsdxwKCbc7FCc98oPzNibv0Fgg" />
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/20 hover:bg-white/5 transition-all duration-300">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-purple-300">Elena Voss</h4>
                  <span className="text-[10px] text-on-surface-variant font-medium opacity-60">1h ago</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4">I'm stuck in the library lobby because of this. Can we get an update on when the freight elevator will be available for access?</p>
                <div className="flex items-center gap-6 pt-3 border-t border-white/5">
                  <button className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant hover:text-primary transition-all group/btn">
                    <span className="material-symbols-outlined text-sm group-hover/btn:scale-110 transition-transform">thumb_up</span>
                    4
                  </button>
                  <button className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant hover:text-primary transition-all">
                    <span className="material-symbols-outlined text-sm">reply</span>
                    Reply
                  </button>
                </div>
              </div>
            </div>

            {/* New Active Comment Placeholder */}
            <div className="relative pl-14 group animate-pulse">
              <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center border border-outline-variant/20 z-10">
                <span className="material-symbols-outlined text-slate-500">person</span>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-dashed border-outline-variant/30 flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500 italic">Someone is typing...</p>
                <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
