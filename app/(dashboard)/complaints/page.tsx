"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGlobal, getStatusConfig } from '@/components/GlobalProvider';
import { IssueListSkeleton, EmptyIssues } from '@/components/Skeletons';

export default function ComplaintsPage() {
  const router = useRouter();
  const { issues, upvoteIssue, isLoading } = useGlobal();

  const issue1 = issues.find(i => i.id === "network-sector-4") || issues[3];
  const issue2 = issues.find(i => i.id === "library-hvac") || issues[4];
  const issue3 = issues.find(i => i.id === "water-cooler") || issues[5];
  const issue4 = issues.find(i => i.id === "gym-glass") || issues[6];

  const newIssues = issues.filter(i => i.isNew);

  if (isLoading) {
    return (
      <div className="px-8 pb-12 w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-headline font-bold text-on-surface mb-2">Campus Grievances</h2>
            <p className="text-on-surface-variant font-medium">Real-time status of reported issues across the ecosystem.</p>
          </div>
        </div>
        <IssueListSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="px-8 pb-12 w-full">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-headline font-bold text-on-surface mb-2">Campus Grievances</h2>
          <p className="text-on-surface-variant font-medium">Real-time status of reported issues across the ecosystem.</p>
        </div>
        <button onClick={() => document.dispatchEvent(new Event('openReportModal'))} className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-6 py-3.5 rounded-full font-headline font-bold text-sm tracking-wide shadow-[0_0_30px_-5px_rgba(199,153,255,0.5)] active:scale-95 transition-all">
          <span className="material-symbols-outlined">add_circle</span>
          REPORT ISSUE
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex bg-surface-container-high p-1 rounded-full">
          <button className="px-6 py-2 rounded-full bg-primary text-on-primary font-bold text-xs tracking-wider">TRENDING</button>
          <button className="px-6 py-2 rounded-full text-on-surface-variant hover:text-on-surface font-bold text-xs tracking-wider transition-colors">RECENT</button>
          <button className="px-6 py-2 rounded-full text-on-surface-variant hover:text-on-surface font-bold text-xs tracking-wider transition-colors">MY REPORTS</button>
        </div>
        <div className="h-8 w-[1px] bg-outline-variant/30 mx-2"></div>
        <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-outline-variant/30 text-on-surface-variant hover:bg-surface-variant/30 transition-all">
          <span className="material-symbols-outlined text-lg">location_on</span>
          <span className="text-xs font-bold tracking-widest uppercase">All Sectors</span>
          <span className="material-symbols-outlined text-lg">expand_more</span>
        </button>
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Top Issue Emphasized */}
        <div onClick={() => router.push('/issue/network-sector-4')} className="xl:col-span-8 group cursor-pointer">
          <div className="glass-panel p-8 rounded-[2.5rem] border-[3px] border-error/40 relative overflow-hidden card-interaction-hover bg-gradient-to-br from-error/10 via-surface-container/50 to-surface-container shadow-2xl shadow-error/10">
            <div className="absolute top-0 right-0 p-6">
              <div className="bg-error text-on-error px-4 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-error/40 animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-error opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-on-error"></span>
                </span>
                <span className="text-xs font-black tracking-tighter uppercase">URGENT PRIORITY</span>
              </div>
            </div>
            <div className="flex items-start gap-8 mb-8">
              <div className="p-6 rounded-[2rem] bg-error text-on-error flex-shrink-0 shadow-2xl shadow-error/30">
                <span className="material-symbols-outlined text-4xl">wifi_off</span>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-error uppercase mb-2 block">CRITICAL ALERT • DORMITORY A</span>
                <h3 className="text-4xl font-headline font-bold mb-4">Total Network Outage: Sector 4</h3>
                <p className="text-on-surface-variant leading-relaxed text-lg">
                  <span className="text-primary font-bold">Summary from multiple reports:</span> Multiple students indicate a physical line break near the main router hub. This is currently affecting <span className="text-on-surface font-bold">450 residents</span> since 02:00 AM.
                </p>
              </div>
            </div>

            {/* Interactions Row */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-outline-variant/20">
              <div className="flex items-center gap-8">
                {/* Large Upvote */}
                <button onClick={(e) => { e.stopPropagation(); upvoteIssue("network-sector-4"); }} className="flex items-center gap-4 px-10 py-5 rounded-2xl bg-primary text-on-primary font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_-5px_rgba(199,153,255,0.8)]">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                  <span className="text-2xl">{issue1?.upvotes}</span>
                </button>
                {/* Badge */}
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Impact Level</span>
                  <span className="text-lg font-black uppercase tracking-tight text-on-surface"><span className="text-error">{issue1?.affectedCount}</span> STUDENTS AFFECTED</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Reactions */}
                <div className="flex gap-4 bg-surface-container-lowest/80 p-3 rounded-2xl border border-outline-variant/20 shadow-inner">
                  <button className="reaction-tooltip text-2xl transition-all hover:-translate-y-2 hover:scale-125" data-tooltip="Anger">!</button>
                  <button className="reaction-tooltip text-2xl transition-all hover:-translate-y-2 hover:scale-125" data-tooltip="Urgent">!!</button>
                  <button className="reaction-tooltip text-2xl transition-all hover:-translate-y-2 hover:scale-125" data-tooltip="Support">+</button>
                </div>
                {/* Avatars */}
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Recent Activity</span>
                  <div className="flex -space-x-4">
                    <img className="w-11 h-11 rounded-full border-2 border-surface shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0zq3pct0kuCwIhrTygGEzjvywZQWfXuqbPlDaVKHUW7V_v2KWGTxR2J2u1iW8n5Q4uABfCQDRtU3UFR_0GB12zDsqA1yIvoIuYECbXMl8LERNsQEhVfkh-oaM7oBdgF-oyLkyOcw-OzsbB-ZPePUCt2HbYr3kSI6k67X-w-SFYF3_0aeC4mBA7VKG1HYpJNh9LAUuDEIhzFwr5HiYHXebguR745APJcxp7E5bYXYpeekX7w4zBTqthBpFzmgcnbnwxfpS3c8CHug" alt="avatar" />
                    <img className="w-11 h-11 rounded-full border-2 border-surface shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_mLGqUdubLbXvcbCkdYYPwDAcHIwXI3cs8EFM4P6QW_dHwe_v5jqC60GLkd3OGuzwPTd9QMxOqZf7lMH58ZtQKSlJTD4ZP8zrD0044vmxw7bD57sfDPSCiyg_VSIXhGleRdEh2Six7cYnSbM9_Tt-L6iwI-5Nvz7MkH0x28vpzMTAGYPLzGX3GN3YsfixRAO3yTOwH8aNG4fZ53RbDByLx9nTRWBfe_NGgnkZU-a4u_p3DDccOjFW8Son7jqc2-JbXafbzaXRNco" alt="avatar" />
                    <img className="w-11 h-11 rounded-full border-2 border-surface shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChkrgjDFRIdY7qPNn11jy3fJeR2zAtFwFOhbp2WU03ZoN64Bk7rQ97dMNLO2XZ2n2onX3hT_2MSEb1M-pJ83rhXaXaIlBYa1S14Au3eRgtcXMRUu9TKsh9ZcbnmGwZ9GbO1rzSk75lPGfcZqTiQq8O3phAVZ1XgYdH3cnBEkm-M4QcPqHFecJ8g3TbcdNFaLL7bMAD01Sv9X5pI7a6ZQZucIiQSGPwsCuNlhpdAdPahgA4jxSBPhmAVjdLV_0o3owV9V8XGA0T1KI" alt="avatar" />
                    <div className="w-11 h-11 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-bold border-2 border-surface text-on-surface shadow-md">+342</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Module */}
        <div className="xl:col-span-4 grid grid-cols-1 gap-6">
          <div className="glass-panel p-6 rounded-[2rem] border border-outline-variant/10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-secondary uppercase mb-4 block">LIVE STATUS</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-headline font-bold">{issues.length}</span>
                <span className="text-on-surface-variant text-sm">Active Issues</span>
              </div>
            </div>
            <div className="mt-4 h-2 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-error via-tertiary to-secondary w-3/4"></div>
            </div>
            <div className="mt-4 flex justify-between text-[10px] font-bold text-on-surface-variant">
              <span>4 CRITICAL</span>
              <span>8 PENDING</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2rem] border border-outline-variant/10 bg-primary/5">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              <h4 className="font-headline font-bold text-sm tracking-wide">Lumen Insight</h4>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <span className="font-bold text-primary">Summary from multiple reports:</span> 85% of electrical complaints are concentrated in the South Wing. An automated inspection ticket has been generated for the infrastructure team.
            </p>
          </div>
        </div>

        {/* List Issue 2 */}
        <div onClick={() => router.push('/issue/library-hvac')} className="xl:col-span-4 cursor-pointer">
          <div className="glass-panel p-6 rounded-[2.5rem] border border-outline-variant/20 h-full flex flex-col card-interaction-hover group bg-surface-container/30">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 rounded-2xl bg-tertiary/20 text-tertiary shadow-lg shadow-tertiary/10">
                <span className="material-symbols-outlined text-2xl">ac_unit</span>
              </div>
              <div className="bg-tertiary-fixed/10 text-tertiary-fixed px-3 py-1.5 rounded-full text-[10px] font-black border border-tertiary-fixed/30 uppercase tracking-widest">In Progress</div>
            </div>
            <h4 className="text-xl font-headline font-bold mb-3 group-hover:text-tertiary transition-colors">Library HVAC Malfunction</h4>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
              <span className="text-tertiary/80 font-semibold">Summary from multiple reports:</span> The 3rd floor reading room temperature has reached 28°C. Reports indicate a potential compressor failure.
            </p>
            <div className="mt-auto pt-6 border-t border-outline-variant/10 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <button onClick={(e) => { e.stopPropagation(); upvoteIssue("library-hvac"); }} className="flex items-center gap-3 px-6 py-3 rounded-xl bg-tertiary/10 hover:bg-tertiary/20 text-tertiary transition-all shadow-lg shadow-tertiary/5 border border-tertiary/20">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                  <span className="text-lg font-bold">{issue2?.upvotes}</span>
                </button>
                <span className="text-[11px] font-black uppercase tracking-tighter text-on-surface-variant">{issue2?.affectedCount} STUDENTS AFFECTED</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2 bg-black/20 p-1.5 rounded-lg">
                    <button className="reaction-tooltip text-lg hover:scale-110" data-tooltip="Frustrated">!</button>
                    <button className="reaction-tooltip text-lg hover:scale-110" data-tooltip="Warning">!!</button>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full border border-surface bg-slate-400"></div>
                    <div className="w-6 h-6 rounded-full border border-surface bg-slate-500"></div>
                  </div>
                </div>
                <button className="text-primary text-[10px] font-black tracking-[0.2em] uppercase hover:underline decoration-2 underline-offset-4">VIEW THREAD</button>
              </div>
            </div>
          </div>
        </div>

        {/* List Issue 3 */}
        <div onClick={() => router.push('/issue/water-cooler')} className="xl:col-span-4 cursor-pointer">
          <div className="glass-panel p-6 rounded-[2.5rem] border border-outline-variant/20 h-full flex flex-col card-interaction-hover group bg-surface-container/30">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 rounded-2xl bg-secondary/20 text-secondary shadow-lg shadow-secondary/10">
                <span className="material-symbols-outlined text-2xl">water_drop</span>
              </div>
              <div className="bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-[10px] font-black border border-secondary/30 uppercase tracking-widest">Scheduled</div>
            </div>
            <h4 className="text-xl font-headline font-bold mb-3 group-hover:text-secondary transition-colors">Cafeteria Water Cooler Filter</h4>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
              <span className="text-secondary/80 font-semibold">Summary from multiple reports:</span> Maintenance scheduled for tomorrow at 10:00 AM. Routine replacement cycle exceeded.
            </p>
            <div className="mt-auto pt-6 border-t border-outline-variant/10 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <button onClick={(e) => { e.stopPropagation(); upvoteIssue("water-cooler"); }} className="flex items-center gap-3 px-6 py-3 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary transition-all shadow-lg shadow-secondary/5 border border-secondary/20">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                  <span className="text-lg font-bold">{issue3?.upvotes}</span>
                </button>
                <span className="text-[11px] font-black uppercase tracking-tighter text-on-surface-variant">{issue3?.affectedCount} STUDENTS AFFECTED</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2 bg-black/20 p-1.5 rounded-lg">
                    <button className="reaction-tooltip text-lg hover:scale-110" data-tooltip="Good Luck">+</button>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full border border-surface bg-slate-600"></div>
                  </div>
                </div>
                <button className="text-primary text-[10px] font-black tracking-[0.2em] uppercase hover:underline decoration-2 underline-offset-4">VIEW THREAD</button>
              </div>
            </div>
          </div>
        </div>

        {/* List Issue 4 */}
        <div onClick={() => router.push('/issue/gym-glass')} className="xl:col-span-4 cursor-pointer">
          <div className="glass-panel p-6 rounded-[2.5rem] border border-outline-variant/20 h-full flex flex-col card-interaction-hover group bg-surface-container/30">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 rounded-2xl bg-error/20 text-error shadow-lg shadow-error/10">
                <span className="material-symbols-outlined text-2xl">security</span>
              </div>
              <div className="bg-error/10 text-error px-3 py-1.5 rounded-full text-[10px] font-black border border-error/30 uppercase tracking-widest">New Report</div>
            </div>
            <h4 className="text-xl font-headline font-bold mb-3 group-hover:text-error transition-colors">Shattered Glass - Gym Entry</h4>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
              <span className="text-error/80 font-semibold">Summary from multiple reports:</span> Safety hazard identified at Main Gym Entrance. Reported by 5 students in the last 10 minutes.
            </p>
            <div className="mt-auto pt-6 border-t border-outline-variant/10 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <button onClick={(e) => { e.stopPropagation(); upvoteIssue("gym-glass"); }} className="flex items-center gap-3 px-6 py-3 rounded-xl bg-error/10 hover:bg-error/20 text-error transition-all shadow-lg shadow-error/5 border border-error/20">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                  <span className="text-lg font-bold">{issue4?.upvotes}</span>
                </button>
                <span className="text-[11px] font-black uppercase tracking-tighter text-on-surface-variant">{issue4?.affectedCount} STUDENTS AFFECTED</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2 bg-black/20 p-1.5 rounded-lg">
                    <button className="reaction-tooltip text-lg hover:scale-110" data-tooltip="Hazardous">!!</button>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full border border-surface bg-slate-300"></div>
                    <div className="w-6 h-6 rounded-full border border-surface bg-slate-700"></div>
                  </div>
                </div>
                <button className="text-primary text-[10px] font-black tracking-[0.2em] uppercase hover:underline decoration-2 underline-offset-4">VIEW THREAD</button>
              </div>
            </div>
          </div>
        </div>

        {/* New Issues Feed */}
        {newIssues.map((issue) => {
          const conf = getStatusConfig(issue.status);
          return (
            <div key={issue.id} onClick={() => router.push(`/issue/${issue.id}`)} className="xl:col-span-4 cursor-pointer">
              <div className="glass-panel p-6 rounded-[2.5rem] border border-outline-variant/20 h-full flex flex-col card-interaction-hover group bg-surface-container/30">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${conf.bgLight} ${conf.color} shadow-lg ${conf.shadow}`}>
                    <span className="material-symbols-outlined text-2xl">{conf.icon}</span>
                  </div>
                  <div className={`${conf.bgLight} ${conf.color} px-3 py-1.5 rounded-full text-[10px] font-black border ${conf.border}/30 uppercase tracking-widest`}>{conf.label}</div>
                </div>
                <h4 className={`text-xl font-headline font-bold mb-3 group-hover:${conf.color} transition-colors`}>{issue.title}</h4>
                <p className="text-sm text-on-surface-variant mb-6 leading-relaxed flex-1">
                  {issue.description}
                </p>
                <div className="mt-auto pt-6 border-t border-outline-variant/10 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <button onClick={(e) => { e.stopPropagation(); upvoteIssue(issue.id); }} className={`flex items-center gap-3 px-6 py-3 rounded-xl ${conf.bgLight} hover:bg-white/10 ${conf.color} transition-all shadow-lg ${conf.shadow} border ${conf.border}/20`}>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                    <span className="text-lg font-bold">{issue.upvotes}</span>
                  </button>
                  <span className="text-[11px] font-black uppercase tracking-tighter text-on-surface-variant">{issue.affectedCount} STUDENTS AFFECTED</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2 bg-black/20 p-1.5 rounded-lg text-xs font-bold text-on-surface-variant px-3 py-1 uppercase tracking-widest leading-none">
                      {issue.category}
                    </div>
                  </div>
                  <button className={`${conf.color} text-[10px] font-black tracking-[0.2em] uppercase hover:underline decoration-2 underline-offset-4`}>VIEW THREAD</button>
                </div>
              </div>
            </div>
          </div>
        )})}

      </div>

      {/* Pagination */}
      <div className="mt-20 mb-8 flex justify-center">
        <button className="group flex flex-col items-center gap-2">
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-on-surface-variant group-hover:text-primary transition-colors">Load History</span>
          <span className="material-symbols-outlined text-primary group-hover:translate-y-2 transition-transform duration-300">keyboard_double_arrow_down</span>
        </button>
      </div>
    </div>
  );
}
