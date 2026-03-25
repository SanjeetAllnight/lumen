"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGlobal, type Issue } from "@/components/GlobalProvider";

// ─── Trending Score ────────────────────────────────────────────────────────────
const PRIORITY_WEIGHT: Record<string, number> = {
  critical: 50,
  high: 30,
  medium: 15,
  low: 5,
};

export function trendingScore(issue: Issue): number {
  return (issue.upvotes ?? 0) + (PRIORITY_WEIGHT[issue.priority ?? ""] ?? 0);
}

// ─── Priority Badge ────────────────────────────────────────────────────────────
const PRIORITY_CFG: Record<string, { label: string; cls: string; dot: string }> = {
  critical: { label: "Critical", cls: "text-red-400 bg-red-500/15 border-red-500/30",     dot: "bg-red-400" },
  high:     { label: "High",     cls: "text-orange-400 bg-orange-500/15 border-orange-500/30", dot: "bg-orange-400" },
  medium:   { label: "Medium",   cls: "text-yellow-400 bg-yellow-500/15 border-yellow-500/30", dot: "bg-yellow-400" },
  low:      { label: "Low",      cls: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30", dot: "bg-emerald-400" },
};

function PriorityBadge({ priority }: { priority?: string }) {
  if (!priority) return null;
  const cfg = PRIORITY_CFG[priority];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Trending Card ─────────────────────────────────────────────────────────────
function TrendingCard({ issue, rank, score }: { issue: Issue; rank: number; score: number }) {
  const router = useRouter();
  const isCritical = issue.priority === "critical";
  const isTop3 = rank <= 3;

  return (
    <div
      onClick={() => router.push(`/issue/${issue.id}`)}
      className={`group relative flex items-start gap-5 p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-lg ${
        isCritical
          ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40"
          : isTop3
          ? "bg-primary/5 border-primary/15 hover:border-primary/30"
          : "bg-white/3 border-white/8 hover:border-white/20"
      }`}
    >
      {/* Rank */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-['Space_Grotesk'] font-black text-lg ${
        rank === 1 ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30" :
        rank === 2 ? "bg-slate-400/15 text-slate-300 border border-slate-400/20" :
        rank === 3 ? "bg-orange-400/15 text-orange-300 border border-orange-400/20" :
        "bg-white/5 text-slate-500 border border-white/10"
      }`}>
        {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          {isTop3 && (
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
              🔥 Trending
            </span>
          )}
          <PriorityBadge priority={issue.priority} />
        </div>
        <h3 className="font-['Space_Grotesk'] font-bold text-base text-slate-100 leading-snug group-hover:text-white transition-colors truncate">
          {issue.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{issue.aiSummary || issue.description}</p>
        <div className="flex flex-wrap items-center gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-[11px] text-primary font-bold">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
            {issue.upvotes ?? 0} upvotes
          </span>
          {issue.location && (
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {issue.location}
            </span>
          )}
        </div>
      </div>

      {/* Score */}
      <div className="flex-shrink-0 text-right">
        <div className="text-2xl font-['Space_Grotesk'] font-black text-primary">{score}</div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-slate-600">score</div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function TrendingPage() {
  const { issues, isLoading } = useGlobal();

  const ranked = useMemo(() => {
    return [...issues]
      .map(issue => ({ issue, score: trendingScore(issue) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);
  }, [issues]);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-10 page-fade">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Live Ranking</span>
        </div>
        <h1 className="font-['Space_Grotesk'] font-black text-4xl md:text-5xl text-white tracking-tight">
          🔥 Trending Issues
        </h1>
        <p className="text-slate-400 mt-2 text-sm max-w-md">
          Ranked by engagement score — upvotes + AI-assigned priority weight. Updates in real-time as the community votes.
        </p>

        {/* Score legend */}
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { label: "Critical +50", cls: "text-red-400 bg-red-500/10 border-red-500/20" },
            { label: "High +30",     cls: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
            { label: "Medium +15",   cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
            { label: "Low +5",       cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
          ].map(b => (
            <span key={b.label} className={`text-[10px] font-bold px-3 py-1 rounded-full border ${b.cls}`}>
              {b.label}
            </span>
          ))}
          <span className="text-[10px] font-bold px-3 py-1 rounded-full border text-primary bg-primary/10 border-primary/20">
            + 1 per upvote
          </span>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
          <p className="text-slate-400 text-sm">Loading trending issues...</p>
        </div>
      ) : ranked.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <span className="text-6xl">📭</span>
          <p className="font-['Space_Grotesk'] font-bold text-xl text-slate-300">Nothing trending yet</p>
          <p className="text-sm text-slate-500 max-w-xs">
            Submit issues and upvote them to start the trending feed.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ranked.map(({ issue, score }, i) => (
            <TrendingCard key={issue.id} issue={issue} rank={i + 1} score={score} />
          ))}
        </div>
      )}
    </div>
  );
}
