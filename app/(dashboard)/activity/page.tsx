"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Severity = "critical" | "high" | "medium" | "low" | "unknown";
type FilterType = "all" | "issues" | "events";

type Issue = {
  id: string;
  title: string;
  description: string;
  aiSummary?: string;
  category: string;
  location: string;
  status: string;
  upvotes: number;
  // Stored by the API as `priority` (AI-classified on submission)
  priority?: Severity;
  createdAt: string | null;
};

type Event = {
  id: string;
  title: string;
  description: string;
  date: string | null;
  location: string;
  coordinatorName: string;
  status: string;
  createdAt: string | null;
};

type ActivityItem =
  | { kind: "issue"; data: Issue; sortKey: number }
  | { kind: "event"; data: Event; sortKey: number };

// ─── Helpers ───────────────────────────────────────────────────────────────────

// Numeric sort order — lower = shown first. unknown sorts last.
const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  high:     1,
  medium:   2,
  low:      3,
  unknown:  4,
};

/**
 * Reads the AI-assigned severity stored under the `priority` field in Firestore.
 * Returns "unknown" when the field is absent or invalid — does NOT recalculate
 * or default to "low". The single source of truth is what was stored at submission.
 */
function getStoredSeverity(issue: Issue): Severity {
  const valid: Severity[] = ["critical", "high", "medium", "low"];
  if (issue.priority && valid.includes(issue.priority)) {
    return issue.priority;
  }
  return "unknown";
}

function timeAgo(isoString: string | null): string {
  if (!isoString) return "Unknown";
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Severity Config ───────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<Severity, {
  label: string;
  color: string;
  bg: string;
  border: string;
  badgeBg: string;
  dot: string;
  icon: string;
}> = {
  critical: {
    label: "CRITICAL",
    color: "text-error",
    bg: "bg-error/5",
    border: "border-error/30 hover:border-error/60",
    badgeBg: "bg-error/10 text-error border-error/20",
    dot: "bg-error",
    icon: "emergency_home",
  },
  high: {
    label: "HIGH",
    color: "text-orange-400",
    bg: "bg-orange-500/5",
    border: "border-orange-500/20 hover:border-orange-400/50",
    badgeBg: "bg-orange-500/10 text-orange-400 border-orange-400/20",
    dot: "bg-orange-400",
    icon: "warning",
  },
  medium: {
    label: "MEDIUM",
    color: "text-yellow-400",
    bg: "bg-yellow-500/5",
    border: "border-yellow-500/20 hover:border-yellow-400/40",
    badgeBg: "bg-yellow-500/10 text-yellow-400 border-yellow-400/20",
    dot: "bg-yellow-400",
    icon: "info",
  },
  low: {
    label: "LOW",
    color: "text-emerald-400",
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/20 hover:border-emerald-400/40",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-400/20",
    dot: "bg-emerald-400",
    icon: "feedback",
  },
  unknown: {
    label: "UNKNOWN",
    color: "text-on-surface-variant",
    bg: "bg-surface-container/20",
    border: "border-white/5 hover:border-white/10",
    badgeBg: "bg-white/5 text-on-surface-variant border-white/10",
    dot: "bg-on-surface-variant/50",
    icon: "help_outline",
  },
};

// ─── Issue Card ────────────────────────────────────────────────────────────────

function IssueCard({ issue }: { issue: Issue }) {
  const severity = getStoredSeverity(issue);
  // Debug: verify severity matches Complaint section
  console.log("Activity Severity:", issue.priority, "→ resolved as:", severity, "| issue id:", issue.id);
  const cfg = SEVERITY_CONFIG[severity];
  const isCritical = severity === "critical";

  return (
    <div className={`glass-panel p-6 rounded-3xl border ${cfg.border} transition-all group relative overflow-hidden ${cfg.bg}`}>
      {isCritical && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-error/10 blur-3xl -mr-10 -mt-10" />
      )}
      <div className="flex gap-5 items-start">
        {/* Icon */}
        <div className="relative shrink-0">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${cfg.badgeBg}`}>
            <span className={`material-symbols-outlined ${cfg.color}`}>{cfg.icon}</span>
          </div>
          {(severity === "critical" || severity === "high") && (
            <div className={`absolute -top-1 -right-1 w-3 h-3 ${cfg.dot} rounded-full border-2 border-background animate-pulse`} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1 gap-4">
            <div className="flex items-center gap-2 min-w-0">
              {/* ACTIVE ISSUE label */}
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border shrink-0 ${cfg.badgeBg}`}>
                ACTIVE ISSUE
              </span>
              <h3 className={`text-base font-headline font-bold ${cfg.color} truncate`}>
                {issue.title}
              </h3>
            </div>
            <span className={`text-[10px] font-bold font-mono shrink-0 ${isCritical ? "text-error bg-error/10" : "text-on-surface-variant"} px-2 py-0.5 rounded-full`}>
              {timeAgo(issue.createdAt)}
            </span>
          </div>

          <p className="text-sm text-on-surface-variant leading-relaxed mb-3 max-w-xl line-clamp-2">
            {issue.aiSummary || issue.description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {/* Severity badge */}
            <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border ${cfg.badgeBg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${isCritical ? "animate-pulse" : ""}`} />
              {cfg.label}
            </span>
            {/* Location */}
            {issue.location && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant">
                <span className="material-symbols-outlined text-xs">location_on</span>
                {issue.location}
              </span>
            )}
            {/* Upvotes */}
            <span className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant ml-auto">
              <span className="material-symbols-outlined text-xs">thumb_up</span>
              {issue.upvotes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Event Card ────────────────────────────────────────────────────────────────

function EventCard({ event }: { event: Event }) {
  const eventDate = event.date ? new Date(event.date) : null;
  const isUpcoming = eventDate ? eventDate > new Date() : false;
  const isLive = eventDate
    ? Math.abs(Date.now() - eventDate.getTime()) < 3 * 60 * 60 * 1000  // within 3h
    : false;

  return (
    <div className="glass-panel p-6 rounded-3xl border border-tertiary/15 hover:border-tertiary/40 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 blur-3xl -mr-8 -mt-8" />
      <div className="flex gap-5 items-start">
        {/* Icon */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center border border-tertiary/20">
            <span className="material-symbols-outlined text-tertiary">stadium</span>
          </div>
          {isLive && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-tertiary rounded-full border-2 border-background animate-pulse" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1 gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border shrink-0 ${
                isLive
                  ? "bg-tertiary/10 text-tertiary border-tertiary/20"
                  : "bg-white/5 text-on-surface-variant border-white/10"
              }`}>
                {isLive ? "EVENT LIVE" : isUpcoming ? "UPCOMING" : "EVENT"}
              </span>
              <h3 className="text-base font-headline font-bold text-tertiary truncate">{event.title}</h3>
            </div>
            <span className="text-[10px] font-bold font-mono text-on-surface-variant shrink-0">
              {timeAgo(event.createdAt)}
            </span>
          </div>

          <p className="text-sm text-on-surface-variant leading-relaxed mb-3 max-w-xl line-clamp-2">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {eventDate && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-tertiary bg-tertiary/5 px-2.5 py-1 rounded-md border border-tertiary/10">
                <span className="material-symbols-outlined text-xs">calendar_today</span>
                {eventDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                {" · "}
                {eventDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant">
                <span className="material-symbols-outlined text-xs">location_on</span>
                {event.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ActivityStreamPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  // Counters
  const criticalCount = issues.filter((i) => getStoredSeverity(i) === "critical").length;

  // Fetch both in parallel
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [issueRes, eventRes] = await Promise.all([
        fetch("/api/issues"),
        fetch("/api/events"),
      ]);
      if (issueRes.ok) setIssues(await issueRes.json());
      if (eventRes.ok) setEvents(await eventRes.json());
    } catch (e) {
      console.error("[ActivityStreamPage] fetchData:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Poll every 30s for live feel
    const id = setInterval(fetchData, 30000);
    return () => clearInterval(id);
  }, [fetchData]);

  // Build merged & sorted activity feed
  const activityItems: ActivityItem[] = [];

  if (filter !== "events") {
    issues.forEach((issue) => {
      activityItems.push({
        kind: "issue",
        data: issue,
        // Sort: stored severity first (critical→high→medium→low→unknown), then recency
        sortKey: SEVERITY_ORDER[getStoredSeverity(issue)] * 1e12 - new Date(issue.createdAt ?? 0).getTime(),
      });
    });
  }

  if (filter !== "issues") {
    events.forEach((event) => {
      activityItems.push({
        kind: "event",
        data: event,
        // Events sort after all issues when mixed; by date desc
        sortKey: 4 * 1e12 - new Date(event.createdAt ?? 0).getTime(),
      });
    });
  }

  // Sort: issues by severity→recency; events after issues when "all"
  activityItems.sort((a, b) => {
    if (filter === "all") {
      // Issues first (severity-sorted), events after
      if (a.kind !== b.kind) return a.kind === "issue" ? -1 : 1;
    }
    return a.sortKey - b.sortKey;
  });

  const filterBtnClass = (f: FilterType) =>
    `px-4 py-2 rounded-full text-xs font-bold transition-all ${
      filter === f
        ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
        : "glass-panel border border-white/10 text-on-surface-variant hover:bg-white/10"
    }`;

  return (
    <>
      {/* Header */}
      <header className="flex flex-wrap justify-between items-end mb-10 px-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-secondary text-xs font-bold uppercase tracking-tighter">Live Ecosystem Feed</span>
          </div>
          <h1 className="text-5xl font-headline font-bold text-on-surface tracking-tighter">Activity Stream</h1>
          <p className="text-on-surface-variant text-sm mt-1">Real-time campus status — issues &amp; events</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="flex items-center gap-1.5 text-[10px] font-black text-error bg-error/10 border border-error/20 px-3 py-1.5 rounded-full mr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
              {criticalCount} CRITICAL
            </span>
          )}
          <button id="filter-all" className={filterBtnClass("all")} onClick={() => setFilter("all")}>ALL</button>
          <button id="filter-issues" className={filterBtnClass("issues")} onClick={() => setFilter("issues")}>ISSUES</button>
          <button id="filter-events" className={filterBtnClass("events")} onClick={() => setFilter("events")}>EVENTS</button>
        </div>
      </header>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-6">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-4">
          {loading ? (
            <div className="flex justify-center py-24">
              <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
            </div>
          ) : activityItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant opacity-30">inbox</span>
              <p className="font-headline text-lg font-bold text-on-surface-variant">No recent activity</p>
              <p className="text-sm text-on-surface-variant/50">
                {filter === "issues" ? "No issues reported yet." : filter === "events" ? "No approved events found." : "Nothing to show right now."}
              </p>
            </div>
          ) : (
            activityItems.map((item) =>
              item.kind === "issue" ? (
                <IssueCard key={`issue-${item.data.id}`} issue={item.data as Issue} />
              ) : (
                <EventCard key={`event-${item.data.id}`} event={item.data as Event} />
              )
            )
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Stats Card */}
          <div className="glass-panel p-6 rounded-3xl border border-outline-variant/10 space-y-5">
            <h4 className="font-headline font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary">bar_chart</span>
              Live Summary
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-on-surface-variant">Active Issues</span>
                  <span className="text-sm font-bold text-on-surface">{issues.length}</span>
                </div>
                <div className="flex gap-1 h-2">
                  {(["critical", "high", "medium", "low", "unknown"] as Severity[]).map((s) => {
                    const count = issues.filter((i) => getStoredSeverity(i) === s).length;
                    const pct = issues.length > 0 ? (count / issues.length) * 100 : 0;
                    const bgMap: Record<Severity, string> = {
                      critical: "bg-error",
                      high: "bg-orange-400",
                      medium: "bg-yellow-400",
                      low: "bg-emerald-400",
                      unknown: "bg-on-surface-variant/30",
                    };
                    return pct > 0 ? (
                      <div
                        key={s}
                        className={`${bgMap[s]} rounded-full h-full`}
                        style={{ width: `${pct}%` }}
                        title={`${s}: ${count}`}
                      />
                    ) : null;
                  })}
                  {issues.length === 0 && <div className="bg-surface-container-high rounded-full h-full w-full" />}
                </div>
                <div className="flex gap-3 mt-2 flex-wrap">
                  {(["critical", "high", "medium", "low", "unknown"] as Severity[]).map((s) => {
                    const count = issues.filter((i) => getStoredSeverity(i) === s).length;
                    const colorMap: Record<Severity, string> = {
                      critical: "text-error",
                      high: "text-orange-400",
                      medium: "text-yellow-400",
                      low: "text-emerald-400",
                      unknown: "text-on-surface-variant/50",
                    };
                    return (
                      <span key={s} className={`text-[9px] font-bold uppercase ${colorMap[s]}`}>
                        {count} {s}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Approved Events</span>
                <span className="text-sm font-bold text-tertiary">{events.length}</span>
              </div>
              <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-tertiary h-full rounded-full transition-all duration-700"
                  style={{ width: events.length > 0 ? "100%" : "0%" }}
                />
              </div>
            </div>
          </div>

          {/* Severity Legend */}
          <div className="glass-panel p-6 rounded-3xl border border-outline-variant/10">
            <h4 className="font-headline font-bold text-on-surface flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-sm">legend_toggle</span>
              Severity Guide
            </h4>
            <div className="space-y-3">
              {(["critical", "high", "medium", "low"] as Severity[]).map((s) => {
                const cfg = SEVERITY_CONFIG[s];
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot} shrink-0`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${cfg.color}`}>{s}</span>
                    <span className="text-[10px] text-on-surface-variant ml-auto">
                      {s === "critical" && "Immediate action required"}
                      {s === "high" && "Significant disruption"}
                      {s === "medium" && "Moderate inconvenience"}
                      {s === "low" && "Minor / cosmetic issue"}
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center gap-3 opacity-50">
                <div className="w-2.5 h-2.5 rounded-full bg-on-surface-variant/40 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">unknown</span>
                <span className="text-[10px] text-on-surface-variant ml-auto">No AI data yet</span>
              </div>
            </div>
          </div>

          {/* Map snippet — kept from original design, static */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-outline-variant/10">
            <div className="h-36 relative">
              <div
                className="absolute inset-0 bg-slate-900"
                style={{
                  backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCHtudNTG3bsKSO6Yb7icn7UOKxzHBwnD-OGpJwxhysZxlRUVJrmD4aPSLlBwXTMygSydjmKiByo3EU2nkuwpxpMGOTbH8E7kaadaOSOX74P7Br7k7MMLW9MkhepLz3xGHE8H7vfyJ35kM8TS0lX-GiMf75hS3BmrlxQdJyZyCB4VXfPYlRNdVHi7uqinx7RoB1tFRm5Anoax7PNtUZf_k8aYKoT36xJGPwhbbtdfTJaVx1i8EZxT5FI8ZeI5KUR_z_rMwC0bd_UcI')",
                  backgroundSize: "cover",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute w-8 h-8 bg-secondary/20 rounded-full animate-ping -left-2 -top-2" />
                  <div className="w-4 h-4 bg-secondary rounded-full border-2 border-white/20 animate-pulse" />
                </div>
              </div>
              <div className="absolute bottom-3 left-4">
                <span className="text-[10px] font-bold text-secondary uppercase bg-secondary/10 backdrop-blur-md px-2 py-1 rounded border border-secondary/20 tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Live Activity Map
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
