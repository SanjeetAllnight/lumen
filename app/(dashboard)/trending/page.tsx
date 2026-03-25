"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGlobal, type Issue } from "@/components/GlobalProvider";

// ─── Scoring ──────────────────────────────────────────────────────────────────
const PRIORITY_WEIGHT: Record<string, number> = { critical: 50, high: 30, medium: 15, low: 5 };
export function trendingScore(issue: Issue): number {
  return (issue.upvotes ?? 0) + (PRIORITY_WEIGHT[issue.priority ?? ""] ?? 0);
}

// ─── Priority badge ────────────────────────────────────────────────────────────
const PRIORITY_CFG: Record<string, { label: string; cls: string; dot: string; glow: string }> = {
  critical: { label: "Critical", cls: "text-red-400 bg-red-500/15 border-red-500/30",        dot: "bg-red-400",    glow: "rgba(255,110,132,0.25)" },
  high:     { label: "High",     cls: "text-orange-400 bg-orange-500/15 border-orange-500/30", dot: "bg-orange-400", glow: "rgba(249,115,22,0.20)" },
  medium:   { label: "Medium",   cls: "text-yellow-400 bg-yellow-500/15 border-yellow-500/30", dot: "bg-yellow-400", glow: "rgba(234,179,8,0.18)" },
  low:      { label: "Low",      cls: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30", dot: "bg-emerald-400", glow: "rgba(52,211,153,0.15)" },
};
function PriorityBadge({ priority }: { priority?: string }) {
  if (!priority) return null;
  const c = PRIORITY_CFG[priority];
  if (!c) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ─── Medal helpers ────────────────────────────────────────────────────────────
const MEDAL = ["🥇", "🥈", "🥉"];
const RANK_RING = [
  "border-yellow-400/50 bg-yellow-400/10 text-yellow-300",
  "border-slate-400/40 bg-slate-400/8 text-slate-300",
  "border-orange-400/40 bg-orange-400/8 text-orange-300",
];

// ─── Trending Card ────────────────────────────────────────────────────────────
function TrendingCard({ issue, rank, score }: { issue: Issue; rank: number; score: number }) {
  const router = useRouter();
  const isTop3    = rank <= 3;
  const isFirst   = rank === 1;
  const priority  = issue.priority ?? "low";
  const glowColor = PRIORITY_CFG[priority]?.glow ?? "rgba(199,153,255,0.12)";

  return (
    <div
      onClick={() => router.push(`/issue/${issue.id}`)}
      style={isTop3 ? { boxShadow: `0 0 28px -8px ${glowColor}` } : undefined}
      className={`group flex items-center gap-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.008]
        ${isFirst
          ? "p-5 bg-gradient-to-r from-yellow-500/5 via-amber-500/3 to-transparent border-yellow-400/20 hover:border-yellow-400/40"
          : isTop3
          ? "p-4 bg-white/3 border-primary/10 hover:border-primary/25"
          : "p-4 bg-white/2 border-white/6 hover:border-white/15"
        }`}
    >
      {/* Rank badge */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-['Space_Grotesk'] font-black text-sm border
        ${isTop3 ? RANK_RING[rank - 1] : "bg-white/4 text-slate-500 border-white/8"}`}
      >
        {isTop3 ? MEDAL[rank - 1] : `#${rank}`}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          {isTop3 && (
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
              🔥 Trending
            </span>
          )}
          <PriorityBadge priority={issue.priority} />
        </div>
        <h3 className={`font-['Space_Grotesk'] font-bold leading-snug group-hover:text-white transition-colors truncate ${isFirst ? "text-[15px] text-slate-100" : "text-sm text-slate-200"}`}>
          {issue.title}
        </h3>
        <div className="flex flex-wrap items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-[11px] text-primary font-bold">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
            {issue.upvotes ?? 0}
          </span>
          {issue.location && (
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {issue.location}
            </span>
          )}
          {issue.category && (
            <span className="text-[11px] text-slate-600">{issue.category}</span>
          )}
        </div>
      </div>

      {/* Score chip */}
      <div className="flex-shrink-0 text-right">
        <div className={`font-['Space_Grotesk'] font-black leading-none ${isFirst ? "text-3xl text-primary" : "text-xl text-primary/70"}`}>
          {score}
        </div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mt-0.5">score</div>
      </div>
    </div>
  );
}

// ─── Side Panel ───────────────────────────────────────────────────────────────
function SidePanel({ issues, ranked }: { issues: Issue[]; ranked: { issue: Issue; score: number }[] }) {
  const totalIssues  = issues.length;
  const criticalCnt  = issues.filter(i => i.priority === "critical").length;
  const avgUpvotes   = totalIssues > 0
    ? Math.round(issues.reduce((s, i) => s + (i.upvotes ?? 0), 0) / totalIssues)
    : 0;
  const maxScore     = ranked[0]?.score ?? 0;

  return (
    <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-4">

      {/* Stats card */}
      <div className="glass-panel rounded-2xl border border-white/8 p-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Live Stats
        </h3>
        <div className="space-y-3">
          {[
            { label: "Total Issues", value: totalIssues,  color: "text-on-surface" },
            { label: "Avg Upvotes",  value: avgUpvotes,   color: "text-primary" },
            { label: "Critical",     value: criticalCnt,  color: "text-red-400" },
            { label: "Top Score",    value: maxScore,     color: "text-amber-400" },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-xs text-on-surface-variant">{s.label}</span>
              <span className={`font-['Space_Grotesk'] font-black text-lg ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How scoring works */}
      <div className="glass-panel rounded-2xl border border-white/8 p-5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-primary">info</span>
          How Ranking Works
        </h3>
        <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
          Score = upvotes + AI priority weight. Higher score = higher rank.
        </p>
        <div className="space-y-2">
          {[
            { label: "Critical", weight: "+50", cls: "text-red-400 bg-red-500/10 border-red-500/20" },
            { label: "High",     weight: "+30", cls: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
            { label: "Medium",   weight: "+15", cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
            { label: "Low",      weight: "+5",  cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
          ].map(r => (
            <div key={r.label} className={`flex items-center justify-between px-3 py-2 rounded-xl border ${r.cls}`}>
              <span className="text-[11px] font-bold">{r.label}</span>
              <span className="text-[11px] font-black">{r.weight}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-primary/20 bg-primary/8 text-primary">
            <span className="text-[11px] font-bold">Per upvote</span>
            <span className="text-[11px] font-black">+1</span>
          </div>
        </div>
      </div>

      {/* Top 3 quick-list */}
      {ranked.length >= 3 && (
        <div className="glass-panel rounded-2xl border border-white/8 p-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">🏆 Leaders</h3>
          <div className="space-y-2">
            {ranked.slice(0, 3).map(({ issue, score }, i) => (
              <div key={issue.id} className="flex items-center gap-3">
                <span className="text-base">{MEDAL[i]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">{issue.title}</p>
                  <p className="text-[10px] text-slate-500">{score} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TrendingPage() {
  const { issues, isLoading } = useGlobal();

  const ranked = useMemo(() =>
    [...issues]
      .map(issue => ({ issue, score: trendingScore(issue) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score),
    [issues]
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 page-fade">

      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Live Ranking</span>
        </div>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-['Space_Grotesk'] font-black text-3xl md:text-4xl text-white tracking-tight">
              🔥 Trending Issues
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Ranked by engagement score — upvotes + AI priority weight.
              <span className="ml-2 text-amber-400 font-bold">{ranked.length} ranked</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Left — Ranked list */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
              <p className="text-slate-400 text-sm">Loading trending issues…</p>
            </div>
          ) : ranked.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <span className="text-6xl">📭</span>
              <p className="font-['Space_Grotesk'] font-bold text-xl text-slate-300">Nothing trending yet</p>
              <p className="text-sm text-slate-500 max-w-xs">Submit and upvote issues to build the ranking.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {ranked.map(({ issue, score }, i) => (
                <TrendingCard key={issue.id} issue={issue} rank={i + 1} score={score} />
              ))}
            </div>
          )}
        </div>

        {/* Right — Side panel */}
        {!isLoading && <SidePanel issues={issues} ranked={ranked} />}
      </div>
    </div>
  );
}
