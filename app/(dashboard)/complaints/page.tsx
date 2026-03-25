"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

function statusColor(status: string) {
  if (status === "resolved")    return "text-secondary bg-secondary/10 border-secondary/30";
  if (status === "in_progress") return "text-primary bg-primary/10 border-primary/30";
  if (status === "dismissed")   return "text-slate-400 bg-slate-400/10 border-slate-400/20";
  return "text-error bg-error/10 border-error/30";
}
function statusLabel(status: string) {
  if (status === "resolved")    return "Resolved";
  if (status === "in_progress") return "In Progress";
  if (status === "dismissed")   return "Dismissed";
  return "Reported";
}
function timeAgo(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60)    return `${s}s ago`;
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const PRIORITY_BADGE: Record<string, { label: string; cls: string; dot: string }> = {
  critical: { label: "Critical", cls: "text-red-400 bg-red-500/15 border-red-500/30",        dot: "bg-red-400" },
  high:     { label: "High",     cls: "text-orange-400 bg-orange-500/15 border-orange-500/30", dot: "bg-orange-400" },
  medium:   { label: "Medium",   cls: "text-yellow-400 bg-yellow-500/15 border-yellow-500/30", dot: "bg-yellow-400" },
  low:      { label: "Low",      cls: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30", dot: "bg-emerald-400" },
};
function PriorityBadge({ priority }: { priority?: string }) {
  if (!priority) return null;
  const c = PRIORITY_BADGE[priority];
  if (!c) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

const CATEGORY_ICON: Record<string, string> = {
  Electrical: "bolt", Network: "wifi_off", Safety: "emergency_home",
  Sanitary: "cleaning_services", Academic: "school", Security: "security",
  Facility: "domain", Other: "report_problem",
};
const SEVERITY_GRADIENT: Record<string, string> = {
  critical: "from-red-900/60 via-red-800/30 to-surface-container",
  high:     "from-orange-900/60 via-orange-800/30 to-surface-container",
  medium:   "from-yellow-900/50 via-yellow-800/20 to-surface-container",
  low:      "from-emerald-900/50 via-emerald-800/20 to-surface-container",
};

// ─── Featured Issue Card ───────────────────────────────────────────────────────
function FeaturedCard({ issue, onUpvote }: { issue: Issue; onUpvote: (e: React.MouseEvent) => void }) {
  const router = useRouter();
  const [imgErr, setImgErr] = useState(false);
  const priority = issue.priority ?? "high";
  const categoryIcon = CATEGORY_ICON[issue.category] ?? "report_problem";

  return (
    <div
      onClick={() => router.push(`/issue/${issue.id}`)}
      className="w-full glass-panel rounded-[2.5rem] overflow-hidden border border-error/20 hover:border-error/40 group cursor-pointer transition-all duration-300"
      style={{ boxShadow: "0 0 40px -10px rgba(255,110,132,0.15)" }}
    >
      {/* Hero image */}
      <div className="relative overflow-hidden bg-surface-container-high" style={{ aspectRatio: "21/8" }}>
        {issue.imageUrl && !imgErr ? (
          <img
            src={issue.imageUrl} alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${SEVERITY_GRADIENT[priority] ?? SEVERITY_GRADIENT.high} flex items-center justify-center`}>
            <span className="material-symbols-outlined text-[7rem] text-on-surface-variant/10">{categoryIcon}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/95 via-surface-dim/40 to-transparent" />

        {/* Top-left badges */}
        <div className="absolute top-5 left-6 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-error text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            Featured
          </div>
          <PriorityBadge priority={priority} />
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-sm ${statusColor(issue.status)}`}>
            {statusLabel(issue.status)}
          </span>
        </div>

        {/* Title + meta pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-10">
          <h3 className="font-headline text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-lg line-clamp-2">
            {issue.title}
          </h3>
        </div>
      </div>

      {/* Content row */}
      <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2 flex-1 max-w-2xl">
          {issue.aiSummary || issue.description}
        </p>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span className="font-medium">{issue.location}</span>
          </div>
          <span className="text-on-surface-variant/40 text-xs">{timeAgo(issue.createdAt)}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onUpvote(e); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
            {issue.upvotes}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Compact Issue Card ────────────────────────────────────────────────────────
function IssueCard({ issue, onUpvote }: { issue: Issue; onUpvote: (e: React.MouseEvent) => void }) {
  const router = useRouter();
  const [imgErr, setImgErr] = useState(false);
  const priority = issue.priority ?? "medium";
  const gradientCls = SEVERITY_GRADIENT[priority] ?? SEVERITY_GRADIENT.medium;
  const categoryIcon = CATEGORY_ICON[issue.category] ?? "report_problem";

  return (
    <div
      onClick={() => router.push(`/issue/${issue.id}`)}
      className="glass-panel rounded-[2rem] overflow-hidden flex flex-col border border-white/5 hover:border-white/15 group cursor-pointer hover:scale-[1.012] transition-all duration-250"
    >
      {/* Image / fallback */}
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-container-high flex-shrink-0">
        {issue.imageUrl && !imgErr ? (
          <img
            src={issue.imageUrl} alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientCls} flex items-center justify-center`}>
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/20">{categoryIcon}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/80 via-transparent to-transparent" />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <PriorityBadge priority={priority} />
          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border backdrop-blur-sm ${statusColor(issue.status)}`}>
            {statusLabel(issue.status)}
          </span>
        </div>
        {/* Timestamp */}
        <div className="absolute bottom-3 right-3">
          <span className="text-[9px] font-bold text-white/70 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {timeAgo(issue.createdAt)}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h4 className="text-sm font-headline font-bold mb-1.5 group-hover:text-primary transition-colors leading-snug line-clamp-2">
          {issue.title}
        </h4>
        <p className="text-xs text-on-surface-variant leading-relaxed flex-1 line-clamp-2">
          {issue.aiSummary || issue.description}
        </p>
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <button
            onClick={(e) => { e.stopPropagation(); onUpvote(e); }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all active:scale-95 text-sm font-bold"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
            {issue.upvotes}
          </button>
          <div className="flex items-center gap-1 text-on-surface-variant text-[11px]">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span>{issue.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Side Stats Panel ──────────────────────────────────────────────────────────
function StatsPanel({ issues }: { issues: Issue[] }) {
  const active   = issues.filter(i => i.status !== "resolved" && i.status !== "dismissed").length;
  const critical = issues.filter(i => i.priority === "critical").length;
  const high     = issues.filter(i => i.priority === "high").length;
  const resolved = issues.filter(i => i.status === "resolved").length;

  const resRate = issues.length > 0 ? Math.round((resolved / issues.length) * 100) : 0;

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-4">
      {/* Quick Stats */}
      <div className="glass-panel rounded-2xl border border-white/8 p-5 space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">
          Campus Overview
        </h3>

        <div className="flex items-center justify-between py-2.5 border-b border-white/5">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
            <span className="text-on-surface font-medium">Active Issues</span>
          </div>
          <span className="text-xl font-black font-['Space_Grotesk'] text-error">{active}</span>
        </div>

        <div className="flex items-center justify-between py-2.5 border-b border-white/5">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-on-surface font-medium">Critical</span>
          </div>
          <span className="text-xl font-black font-['Space_Grotesk'] text-red-400">{critical}</span>
        </div>

        <div className="flex items-center justify-between py-2.5 border-b border-white/5">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            <span className="text-on-surface font-medium">High Priority</span>
          </div>
          <span className="text-xl font-black font-['Space_Grotesk'] text-orange-400">{high}</span>
        </div>

        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span className="text-on-surface font-medium">Resolved</span>
          </div>
          <span className="text-xl font-black font-['Space_Grotesk'] text-secondary">{resolved}</span>
        </div>
      </div>

      {/* Resolution rate */}
      <div className="glass-panel rounded-2xl border border-white/8 p-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-3">
          Resolution Rate
        </h3>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-4xl font-black font-['Space_Grotesk'] text-on-surface">{resRate}%</span>
          <span className="text-xs text-on-surface-variant mb-1">of all issues</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-secondary to-secondary/60 transition-all duration-700"
            style={{ width: `${resRate}%` }}
          />
        </div>
        <p className="text-[10px] text-on-surface-variant mt-2">
          {issues.length} total · {resolved} resolved
        </p>
      </div>

      {/* Quick action */}
      <button
        onClick={() => document.dispatchEvent(new Event("openReportModal"))}
        className="w-full py-3.5 flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-2xl font-bold text-sm tracking-wide shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-base">add_circle</span>
        Report an Issue
      </button>
    </aside>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ComplaintsPage() {
  const { issues, upvoteIssue, isLoading } = useGlobal();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("trending");
  const [recentsOrder, setRecentsOrder] = useState<RecentsOrder>("newest");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [locationOpen, setLocationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Featured: pick critical issue with most upvotes, or just top upvoted
  const featuredIssue = useMemo(() => {
    const active = filteredByLocation.filter(i => i.status !== "resolved" && i.status !== "dismissed");
    if (active.length === 0) return filteredByLocation[0] ?? null;
    const byPriority = [...active].sort((a, b) => {
      const pa = PRIORITY_ORDER[a.priority ?? ""] ?? 4;
      const pb = PRIORITY_ORDER[b.priority ?? ""] ?? 4;
      if (pa !== pb) return pa - pb;
      return (b.upvotes ?? 0) - (a.upvotes ?? 0);
    });
    return byPriority[0] ?? null;
  }, [filteredByLocation]);

  const trendingIssues = useMemo(() =>
    [...filteredByLocation].sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0)),
    [filteredByLocation]
  );
  const recentIssues = useMemo(() => {
    return [...filteredByLocation].sort((a, b) => {
      const ta = new Date(a.createdAt || 0).getTime();
      const tb = new Date(b.createdAt || 0).getTime();
      return recentsOrder === "newest" ? tb - ta : ta - tb;
    });
  }, [filteredByLocation, recentsOrder]);
  const myIssues = useMemo(() =>
    filteredByLocation.filter(i => i.authorName === user?.displayName),
    [filteredByLocation, user]
  );

  const displayIssues: Issue[] = tab === "trending" ? trendingIssues : tab === "recents" ? recentIssues : myIssues;
  // Exclude the featured issue from the list so it doesn't duplicate
  const listIssues = featuredIssue
    ? displayIssues.filter(i => i.id !== featuredIssue.id)
    : displayIssues;

  const handleUpvote = (id: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    upvoteIssue(id);
  };

  if (isLoading) {
    return (
      <div className="px-6 md:px-8 pb-12 w-full">
        <div className="mb-10">
          <h2 className="text-4xl font-headline font-bold text-on-surface mb-2">Campus Grievances</h2>
          <p className="text-on-surface-variant">Real-time status of reported issues across campus.</p>
        </div>
        <IssueListSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="px-6 md:px-8 pb-16 w-full page-fade">

      {/* ── Header ── */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-error" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-error">Live Data</span>
          </div>
          <h2 className="text-4xl font-headline font-bold text-on-surface mb-0.5">Campus Grievances</h2>
          <p className="text-on-surface-variant text-sm">
            <span className="font-bold text-on-surface">{issues.filter(i => i.status !== "resolved").length}</span> active · <span className="font-bold text-on-surface">{issues.length}</span> total
          </p>
        </div>
        {/* Report button — hidden on small screens, shown in stats panel */}
        <button
          onClick={() => document.dispatchEvent(new Event("openReportModal"))}
          className="hidden lg:flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary px-5 py-3 rounded-full font-bold text-sm tracking-wide shadow-[0_0_30px_-5px_rgba(199,153,255,0.4)] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          Report Issue
        </button>
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* ── Left: main content ── */}
        <div className="flex-1 min-w-0 space-y-8">

          {/* Featured issue — always shown if data exists */}
          {featuredIssue && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-3">
                🔴 Featured Issue
              </p>
              <FeaturedCard issue={featuredIssue} onUpvote={handleUpvote(featuredIssue.id)} />
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
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

            {tab === "recents" && (
              <div className="flex bg-surface-container-high p-1 rounded-full border border-white/5">
                {(["newest", "oldest"] as RecentsOrder[]).map(o => (
                  <button
                    key={o}
                    onClick={() => setRecentsOrder(o)}
                    className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${recentsOrder === o ? "bg-white/15 text-on-surface" : "text-on-surface-variant"}`}
                  >
                    {o === "newest" ? "Newest First" : "Oldest First"}
                  </button>
                ))}
              </div>
            )}

            <div className="h-5 w-[1px] bg-outline-variant/30 hidden sm:block" />

            {/* Location filter */}
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

          {/* Empty state */}
          {listIssues.length === 0 && !featuredIssue && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-6xl mb-4">📭</span>
              <p className="text-on-surface-variant text-lg font-semibold mb-2">
                {tab === "my" ? "You haven't submitted any reports yet." : "No issues found."}
              </p>
              <p className="text-on-surface-variant/60 text-sm">
                {tab === "my" ? "Hit the Report Issue button to get started." : "Try adjusting the location filter."}
              </p>
            </div>
          )}
          {listIssues.length === 0 && featuredIssue && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-5xl mb-3">🎉</span>
              <p className="text-on-surface-variant font-semibold">
                {tab === "my" ? "Only one report so far — keep going!" : "All clear — just the one featured issue."}
              </p>
            </div>
          )}

          {/* Issues grid */}
          {listIssues.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {listIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} onUpvote={handleUpvote(issue.id)} />
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Stats Sidebar ── */}
        <StatsPanel issues={issues} />
      </div>
    </div>
  );
}
