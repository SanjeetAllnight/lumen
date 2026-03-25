"use client";

import { useRouter } from 'next/navigation';
import { useGlobal } from '@/components/GlobalProvider';
import { HeroIssueSkeleton, IssueListSkeleton } from '@/components/Skeletons';

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

function statusLabel(status: string) {
  if (status === "resolved") return "Resolved";
  if (status === "in_progress") return "In Progress";
  return "Reported";
}

function statusColor(status: string) {
  if (status === "resolved") return "text-secondary bg-secondary/10 border-secondary/30";
  if (status === "in_progress") return "text-primary bg-primary/10 border-primary/30";
  return "text-error bg-error/10 border-error/30";
}

function formatEventDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Date TBD";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Date TBD";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function DashboardPage() {
  const router = useRouter();
  const { issues, events, upvoteIssue, isLoading } = useGlobal();

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-8">
        <HeroIssueSkeleton />
        <IssueListSkeleton count={3} />
      </div>
    );
  }

  const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedByUpvotes = [...issues].sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority ?? ""] ?? 4;
    const pb = PRIORITY_ORDER[b.priority ?? ""] ?? 4;
    if (pa !== pb) return pa - pb;
    return (b.upvotes ?? 0) - (a.upvotes ?? 0);
  });
  const topIssue = sortedByUpvotes[0];
  const trendingIssues = sortedByUpvotes.slice(1, 4); // next 3 for trending grid

  // Upcoming events — take first 4
  const upcomingEvents = events.slice(0, 4);

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-12">

      {/* ── Top Campus Issue ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-error font-black tracking-[0.2em] text-[10px] uppercase flex items-center gap-2 bg-error/10 px-3 py-1 rounded-full border border-error/20">
            Highest Impact Issue
          </span>
          {topIssue && (
            <span className="text-on-surface-variant text-xs">{timeAgo(topIssue.createdAt)}</span>
          )}
        </div>

        {!topIssue ? (
          <div className="glass-panel rounded-[2.5rem] p-10 border border-white/5 flex flex-col items-center justify-center text-center min-h-[200px]">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">inbox</span>
            <p className="text-on-surface-variant font-semibold">No issues reported yet.</p>
            <p className="text-on-surface-variant/60 text-sm mt-1">Be the first to report a campus issue.</p>
            <button
              onClick={() => document.dispatchEvent(new Event("openReportModal"))}
              className="mt-6 px-6 py-2.5 bg-primary text-on-primary rounded-full font-bold text-sm hover:brightness-110 transition-all"
            >
              Report an Issue
            </button>
          </div>
        ) : (
          <div className="group card-hover glass-panel rounded-[2.5rem] p-1 md:p-1.5 border border-error/20 bg-gradient-to-br from-error/10 via-transparent to-transparent glow-error transition-all duration-500">
            <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-[2.25rem] p-8 md:p-12 flex flex-col lg:flex-row gap-10 items-center justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-error/10 blur-[100px] rounded-full group-hover:bg-error/20 transition-colors" />
              <div className="relative z-10 flex-1 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusColor(topIssue.status)}`}>
                    {statusLabel(topIssue.status)}
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-white/5 text-on-surface-variant border border-white/5 text-[10px] font-bold uppercase tracking-widest">
                    {topIssue.category}
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-white/5 text-on-surface-variant border border-white/5 text-[10px] font-bold uppercase tracking-widest">
                    {topIssue.location}
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-headline font-bold text-on-surface leading-tight tracking-tight">
                  {topIssue.title}
                </h2>
                <p className="text-on-surface-variant max-w-2xl text-lg font-body leading-relaxed">
                  {topIssue.aiSummary || topIssue.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => router.push(`/issue/${topIssue.id}`)}
                    className="px-6 py-3 border border-outline-variant/30 text-on-surface rounded-full font-bold hover:bg-white/5 transition-colors"
                  >
                    View Details →
                  </button>
                  <span className="text-xs text-on-surface-variant">
                    Reported by <span className="text-on-surface font-semibold">{topIssue.authorName || "Student"}</span>
                  </span>
                </div>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-4 min-w-[220px]">
                <div className="bg-surface-container-high/50 p-8 rounded-3xl border border-white/5 text-center w-full">
                  <div className="text-6xl font-headline font-black text-on-surface mb-2 tracking-tighter">{topIssue.upvotes}</div>
                  <div className="text-on-surface-variant text-sm font-bold uppercase tracking-[0.2em]">Upvotes</div>
                </div>
                <button
                  onClick={() => upvoteIssue(topIssue.id)}
                  className="w-full py-5 bg-error text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-error/40 hover:scale-[1.04] active:scale-90 transition-all duration-150 flex items-center justify-center gap-3 text-base"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                  Support Issue
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Campus Heartbeat Hero ── */}
      <section className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-12 bg-surface-container-low border border-white/5 glass-panel">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-on-surface leading-none tracking-tighter">
              The Campus <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Heartbeat.</span>
            </h1>
            <p className="text-on-surface-variant max-w-md text-lg leading-relaxed font-body">
              Real-time student insights and campus issue tracking — powered by your community.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => router.push("/map")}
                className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
              >
                View Heatmap
              </button>
              <button
                onClick={() => router.push("/complaints")}
                className="px-8 py-3 border border-outline-variant/30 text-on-surface rounded-full font-bold hover:bg-white/5 transition-colors"
              >
                Active Reports
              </button>
            </div>
          </div>

          {/* Live stats — all real */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-3xl border border-white/5 glow-purple bg-surface-container-highest/30">
              <span className="material-symbols-outlined text-error text-3xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>report_problem</span>
              <h4 className="text-4xl font-headline font-bold">{issues.length}</h4>
              <p className="text-on-surface-variant text-sm mt-1">Active Issues</p>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-white/5">
              <span className="material-symbols-outlined text-secondary text-3xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <h4 className="text-4xl font-headline font-bold">{issues.filter(i => i.status === "resolved").length}</h4>
              <p className="text-on-surface-variant text-sm mt-1">Resolved</p>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-white/5 translate-y-6">
              <span className="material-symbols-outlined text-tertiary text-3xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>stadium</span>
              <h4 className="text-4xl font-headline font-bold">{events.length}</h4>
              <p className="text-on-surface-variant text-sm mt-1">Upcoming Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trending Issues ── */}
      <section className="space-y-6">
        <div className="flex items-end justify-between px-2">
          <div className="space-y-1">
            <span className="text-tertiary font-bold tracking-[0.2em] text-[10px] uppercase">Real-Time Hub</span>
            <h2 className="text-3xl font-headline font-bold text-on-surface">Trending Issues</h2>
          </div>
          <button
            onClick={() => router.push("/complaints")}
            className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium flex items-center gap-2"
          >
            View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {trendingIssues.length === 0 ? (
          <div className="glass-panel rounded-[2rem] p-10 border border-white/5 flex flex-col items-center justify-center text-center min-h-[160px]">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3">trending_up</span>
            <p className="text-on-surface-variant text-sm">No trending issues yet. Submit a report to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {trendingIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => router.push(`/issue/${issue.id}`)}
                className="group card-hover glass-panel rounded-[2rem] p-6 border border-white/5 hover:border-primary/30 transition-all duration-300 flex flex-col cursor-pointer min-h-[200px]"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${statusColor(issue.status)}`}>
                    {statusLabel(issue.status)}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/50">{timeAgo(issue.createdAt)}</span>
                </div>
                <h3 className="text-lg font-headline font-bold text-on-surface leading-snug mb-2 group-hover:text-primary transition-colors">
                  {issue.title}
                </h3>
                <p className="text-sm text-on-surface-variant line-clamp-2 flex-1">
                  {issue.aiSummary || issue.description}
                </p>
                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={(e) => { e.stopPropagation(); upvoteIssue(issue.id); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                    <span className="text-sm font-bold">{issue.upvotes}</span>
                  </button>
                  <span className="text-[11px] text-on-surface-variant font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {issue.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Recommended (Upcoming Events) ── */}
      <section className="space-y-6 border-t border-white/5 pt-10">
        <div className="flex items-end justify-between px-2">
          <div className="space-y-1">
            <span className="text-secondary font-bold tracking-[0.2em] text-[10px] uppercase">What's On</span>
            <h2 className="text-3xl font-headline font-bold text-on-surface">Upcoming Events</h2>
          </div>
          <button
            onClick={() => router.push("/events")}
            className="text-on-surface-variant hover:text-secondary transition-colors text-sm font-medium flex items-center gap-2"
          >
            All events <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="glass-panel rounded-[2rem] p-10 border border-white/5 text-center min-h-[120px] flex items-center justify-center">
            <p className="text-on-surface-variant text-sm">No upcoming events at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => router.push("/events")}
                className="glass-panel p-5 rounded-3xl border border-white/5 hover:bg-surface-container-highest/60 hover:border-secondary/20 transition-all flex gap-4 group cursor-pointer"
              >
                {/* Icon block replacing fake thumbnail image */}
                <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/10 border border-white/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {event.category === "Sports" ? "sports_soccer"
                      : event.category === "Cultural" ? "music_note"
                      : event.category === "Career" ? "work"
                      : "school"}
                  </span>
                </div>
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <h4 className="font-headline font-bold text-base leading-tight mb-1 group-hover:text-secondary transition-colors truncate">
                    {event.title}
                  </h4>
                  <div className="flex items-center gap-3 text-on-surface-variant text-[10px] font-bold uppercase tracking-wider flex-wrap">
                    <span className="flex items-center gap-1 text-secondary">
                      <span className="material-symbols-outlined text-xs">calendar_today</span>
                      {formatEventDate(event.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      {event.location}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                    <span className="material-symbols-outlined text-xs">group</span>
                    {(event.attendees ?? 0).toLocaleString()} expected
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
