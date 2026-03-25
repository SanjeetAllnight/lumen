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

function priorityBadge(priority?: string) {
  if (!priority) return null;
  const cfg: Record<string, { label: string; cls: string }> = {
    critical: { label: "Critical", cls: "text-red-400 bg-red-500/15 border-red-500/30" },
    high:     { label: "High",     cls: "text-orange-400 bg-orange-500/15 border-orange-500/30" },
    medium:   { label: "Medium",   cls: "text-yellow-400 bg-yellow-500/15 border-yellow-500/30" },
    low:      { label: "Low",      cls: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" },
  };
  const c = cfg[priority];
  if (!c) return null;
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${c.cls}`}>
      {c.label}
    </span>
  );
}
// ─── Category icon map ────────────────────────────────────────────────────────
const CATEGORY_ICON: Record<string, string> = {
  Electrical: "bolt", Network: "wifi_off", Safety: "emergency_home",
  Sanitary: "cleaning_services", Academic: "school", Security: "security",
  Facility: "domain", Other: "report_problem",
};

// ─── Severity gradient for fallback image placeholder ─────────────────────────
const SEVERITY_GRADIENT: Record<string, string> = {
  critical: "from-red-900/60 via-red-800/30 to-surface-container",
  high:     "from-orange-900/60 via-orange-800/30 to-surface-container",
  medium:   "from-yellow-900/50 via-yellow-800/20 to-surface-container",
  low:      "from-emerald-900/50 via-emerald-800/20 to-surface-container",
};

function IssueCard({ issue, onUpvote }: { issue: Issue; onUpvote: (e: React.MouseEvent) => void }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const priority = issue.priority ?? "medium";
  const gradientCls = SEVERITY_GRADIENT[priority] ?? SEVERITY_GRADIENT.medium;
  const categoryIcon = CATEGORY_ICON[issue.category] ?? "report_problem";

  return (
    <div
      onClick={() => router.push(`/issue/${issue.id}`)}
      className="glass-panel rounded-[2.5rem] overflow-hidden flex flex-col glow-border border border-white/5 group cursor-pointer hover:scale-[1.015] transition-all duration-300"
    >
      {/* ── Image / Fallback ── */}
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-container-high flex-shrink-0">
        {issue.imageUrl && !imgError ? (
          <img
            src={issue.imageUrl}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientCls} flex items-center justify-center`}>
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">{categoryIcon}</span>
          </div>
        )}

        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/80 via-transparent to-transparent" />

        {/* Overlaid badges — severity + status */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
          {priorityBadge(priority)}
          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border backdrop-blur-sm ${statusColor(issue.status)}`}>
            {statusLabel(issue.status)}
          </span>
        </div>

        {/* Timestamp chip at bottom-left */}
        <div className="absolute bottom-4 left-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 bg-surface-dim/60 backdrop-blur-md px-3 py-1 rounded-full">
            {timeAgo(issue.createdAt)}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-6 flex flex-col flex-1 gap-3">
        <div>
          <h4 className="font-headline text-lg font-bold text-on-surface mb-1 leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {issue.title}
          </h4>
          <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
            {issue.aiSummary || issue.description}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-sm text-primary">location_on</span>
          <span>{issue.location}</span>
        </div>

        {/* Footer: upvote + category */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <button
            onClick={(e) => { e.stopPropagation(); onUpvote(e); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
            <span className="text-sm font-bold">{issue.upvotes}</span>
          </button>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">
            <span className="material-symbols-outlined text-xs">{categoryIcon}</span>
            <span>{issue.category || "Facility"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopIssueCard({ issue, onUpvote }: { issue: Issue; onUpvote: (e: React.MouseEvent) => void }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const priority = issue.priority ?? "critical";
  const categoryIcon = CATEGORY_ICON[issue.category] ?? "report_problem";

  return (
    <div
      onClick={() => router.push(`/issue/${issue.id}`)}
      className="glass-panel rounded-[2.5rem] overflow-hidden glow-border border border-error/20 group cursor-pointer hover:border-error/40 transition-all duration-300"
    >
      {/* ── Hero image ── */}
      <div className="relative aspect-[21/9] overflow-hidden bg-surface-container-high">
        {issue.imageUrl && !imgError ? (
          <img
            src={issue.imageUrl}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-900/60 via-red-800/30 to-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-8xl text-on-surface-variant/10">{categoryIcon}</span>
          </div>
        )}

        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/90 via-surface-dim/30 to-transparent" />

        {/* Live urgent badge */}
        <div className="absolute top-5 left-6 flex items-center gap-2">
          <div className="flex items-center gap-2 bg-error text-on-error px-3 py-1.5 rounded-full shadow-lg shadow-error/40">
            <span className="w-2 h-2 rounded-full bg-on-error animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-wider">Urgent</span>
          </div>
          {priorityBadge(priority)}
        </div>

        {/* Title pinned to bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-headline text-3xl font-bold text-white leading-tight drop-shadow-lg line-clamp-2">
            {issue.title}
          </h3>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-6 flex flex-col gap-4">
        <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">
          {issue.aiSummary || issue.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <button
            onClick={(e) => { e.stopPropagation(); onUpvote(e); }}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-on-primary font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/30"
          >
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
            <span className="text-xl">{issue.upvotes}</span>
          </button>
          <div className="flex flex-col items-end gap-1 text-on-surface-variant text-xs">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span className="font-medium">{issue.location}</span>
            </div>
            <span className="text-on-surface-variant/50 text-[10px]">{timeAgo(issue.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


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
      )}
    </div>
  );
}
