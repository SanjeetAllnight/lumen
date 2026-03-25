"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
<<<<<<< HEAD
import { useGlobal, getStatusConfig } from '@/components/GlobalProvider';
import { IssueListSkeleton, EmptyIssues } from '@/components/Skeletons';
=======
import { useGlobal, type Issue } from '@/components/GlobalProvider';
import { useAuth } from '@/components/AuthProvider';
import { IssueListSkeleton } from '@/components/Skeletons';

type Tab = "trending" | "recents" | "my";
type RecentsOrder = "newest" | "oldest";

const LOCATIONS = [
  "All Locations",
  "Computer Dept", "IT Dept", "Civil Dept", "ETC Dept", "ENE Dept",
  "Mech Dept", "Library", "Canteen", "Main Gate", "Admin Block",
  "Academic Block", "Mining Dept", "Hostel", "Ground",
];

function statusColor(status: string) {
  if (status === "resolved") return "text-secondary bg-secondary/10 border-secondary/30";
  if (status === "in_progress") return "text-primary bg-primary/10 border-primary/30";
  return "text-error bg-error/10 border-error/30";
}

function statusLabel(status: string) {
  if (status === "resolved") return "Resolved";
  if (status === "in_progress") return "In Progress";
  return "Reported";
}

function timeAgo(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function IssueCard({ issue, onUpvote }: { issue: Issue; onUpvote: (e: React.MouseEvent) => void }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/issue/${issue.id}`)}
      className="glass-panel p-6 rounded-[2rem] border border-outline-variant/15 bg-surface-container/30 hover:border-primary/25 hover:bg-surface-container/50 transition-all duration-300 cursor-pointer flex flex-col h-full group"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${statusColor(issue.status)}`}>
          {statusLabel(issue.status)}
        </span>
        <span className="text-[10px] text-on-surface-variant/60">{timeAgo(issue.createdAt)}</span>
      </div>
      <h4 className="text-base font-headline font-bold mb-2 group-hover:text-primary transition-colors leading-snug">{issue.title}</h4>
      <p className="text-xs text-on-surface-variant leading-relaxed flex-1 line-clamp-3">{issue.aiSummary || issue.description}</p>
      <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
        <button
          onClick={(e) => { e.stopPropagation(); onUpvote(e); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
          <span className="text-sm font-bold">{issue.upvotes}</span>
        </button>
        <div className="flex items-center gap-2 text-on-surface-variant text-[11px]">
          <span className="material-symbols-outlined text-sm">location_on</span>
          <span className="font-medium">{issue.location}</span>
        </div>
      </div>
    </div>
  );
}

function TopIssueCard({ issue, onUpvote }: { issue: Issue; onUpvote: (e: React.MouseEvent) => void }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/issue/${issue.id}`)}
      className="glass-panel p-8 rounded-[2.5rem] border-2 border-error/30 bg-gradient-to-br from-error/8 via-surface-container/50 to-surface-container shadow-xl shadow-error/10 cursor-pointer hover:border-error/50 transition-all duration-300 group"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-error text-on-error px-3 py-1.5 rounded-full shadow-lg shadow-error/30">
          <span className="w-2 h-2 rounded-full bg-on-error animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-wider">Urgent Priority</span>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${statusColor(issue.status)}`}>
          {statusLabel(issue.status)}
        </span>
      </div>
      <h3 className="text-3xl font-headline font-bold mb-3 leading-tight group-hover:text-error/90 transition-colors">{issue.title}</h3>
      <p className="text-on-surface-variant leading-relaxed mb-6 text-sm line-clamp-3">{issue.aiSummary || issue.description}</p>
      <div className="flex items-center justify-between pt-6 border-t border-outline-variant/20">
        <button
          onClick={(e) => { e.stopPropagation(); onUpvote(e); }}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-on-primary font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/30"
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
          <span className="text-xl">{issue.upvotes}</span>
        </button>
        <div className="flex items-center gap-2 text-on-surface-variant text-sm">
          <span className="material-symbols-outlined text-base">location_on</span>
          <span className="font-medium">{issue.location}</span>
          <span className="mx-2 text-outline-variant">·</span>
          <span>{timeAgo(issue.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
>>>>>>> 80add7c75b2a2aadf06d07cdb753715a2222604e

export default function ComplaintsPage() {
  const { issues, upvoteIssue, isLoading } = useGlobal();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("trending");
  const [recentsOrder, setRecentsOrder] = useState<RecentsOrder>("newest");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [locationOpen, setLocationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredByLocation = useMemo(() =>
    locationFilter === "All Locations" ? issues : issues.filter(i => i.location === locationFilter),
    [issues, locationFilter]
  );

  const trendingIssues = useMemo(() =>
    [...filteredByLocation].sort((a, b) => b.upvotes - a.upvotes),
    [filteredByLocation]
  );

  const recentIssues = useMemo(() => {
    const sorted = [...filteredByLocation].sort((a, b) => {
      const ta = new Date(a.createdAt || 0).getTime();
      const tb = new Date(b.createdAt || 0).getTime();
      return recentsOrder === "newest" ? tb - ta : ta - tb;
    });
    return sorted;
  }, [filteredByLocation, recentsOrder]);

  const myIssues = useMemo(() =>
    filteredByLocation.filter(i => i.authorName === user?.displayName),
    [filteredByLocation, user]
  );

  const displayIssues: Issue[] = tab === "trending" ? trendingIssues : tab === "recents" ? recentIssues : myIssues;
  const topIssue = tab === "trending" ? trendingIssues[0] : undefined;
  const restIssues = tab === "trending" ? trendingIssues.slice(1) : displayIssues;

  const handleUpvote = (id: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    upvoteIssue(id);
  };

  if (isLoading) {
    return (
      <div className="px-8 pb-12 w-full">
        <div className="mb-10">
          <h2 className="text-4xl font-headline font-bold text-on-surface mb-2">Campus Grievances</h2>
          <p className="text-on-surface-variant">Real-time status of reported issues across campus.</p>
        </div>
        <IssueListSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="px-8 pb-16 w-full">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-headline font-bold text-on-surface mb-1">Campus Grievances</h2>
          <p className="text-on-surface-variant text-sm">
            <span className="font-bold text-on-surface">{issues.length}</span> active issue{issues.length !== 1 ? "s" : ""} · Real-time data
          </p>
        </div>
        <button
          onClick={() => document.dispatchEvent(new Event("openReportModal"))}
          className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary px-5 py-3 rounded-full font-bold text-sm tracking-wide shadow-[0_0_30px_-5px_rgba(199,153,255,0.5)] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          Report Issue
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        {/* Tabs */}
        <div className="flex bg-surface-container-high p-1 rounded-full border border-white/5">
          {(["trending", "recents", "my"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                tab === t ? "bg-primary text-on-primary shadow-lg" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {t === "my" ? "My Reports" : t}
            </button>
          ))}
        </div>

        {/* Recents Order toggle (only shown on Recents tab) */}
        {tab === "recents" && (
          <div className="flex bg-surface-container-high p-1 rounded-full border border-white/5">
            <button
              onClick={() => setRecentsOrder("newest")}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${recentsOrder === "newest" ? "bg-white/15 text-on-surface" : "text-on-surface-variant"}`}
            >
              Newest First
            </button>
            <button
              onClick={() => setRecentsOrder("oldest")}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${recentsOrder === "oldest" ? "bg-white/15 text-on-surface" : "text-on-surface-variant"}`}
            >
              Oldest First
            </button>
          </div>
        )}

        <div className="h-6 w-[1px] bg-outline-variant/30 hidden sm:block" />

        {/* Location Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setLocationOpen(!locationOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant/30 text-on-surface-variant hover:bg-surface-variant/20 transition-all text-xs font-bold uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-base">location_on</span>
            <span>{locationFilter === "All Locations" ? "All Locations" : locationFilter}</span>
            <span className="material-symbols-outlined text-base transition-transform" style={{ transform: locationOpen ? "rotate(180deg)" : "" }}>expand_more</span>
          </button>

          {locationOpen && (
            <div className="absolute top-full mt-2 left-0 z-50 bg-surface-container-high border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-w-[180px] py-2 animate-in fade-in slide-in-from-top-2 duration-150">
              {LOCATIONS.map(loc => (
                <button
                  key={loc}
                  onClick={() => { setLocationFilter(loc); setLocationOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors flex items-center justify-between gap-4 ${locationFilter === loc ? "text-primary font-bold" : "text-on-surface"}`}
                >
                  {loc}
                  {locationFilter === loc && <span className="material-symbols-outlined text-sm text-primary">check</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {displayIssues.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">inbox</span>
          <p className="text-on-surface-variant text-lg font-semibold mb-2">
            {tab === "my" ? "You haven't submitted any reports yet." : "No issues found."}
          </p>
          <p className="text-on-surface-variant/60 text-sm">
            {tab === "my" ? "Hit the Report Issue button to get started." : "Try adjusting the location filter or check back later."}
          </p>
        </div>
      )}

      {/* Content Grid */}
      {displayIssues.length > 0 && (
        <div className="space-y-8">
          {/* Top issue — full width for Trending */}
          {topIssue && (
            <TopIssueCard issue={topIssue} onUpvote={handleUpvote(topIssue.id)} />
          )}

          {/* Rest of issues */}
          {restIssues.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {restIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} onUpvote={handleUpvote(issue.id)} />
              ))}
            </div>
          )}
        </div>
<<<<<<< HEAD

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
=======
      )}
>>>>>>> 80add7c75b2a2aadf06d07cdb753715a2222604e
    </div>
  );
}
