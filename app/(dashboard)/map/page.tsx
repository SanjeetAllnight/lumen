"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGlobal, getStatusConfig, type Issue, type CampusEvent } from "@/components/GlobalProvider";

// ─── Zone definitions ──────────────────────────────────────────────────────────
type Zone = { id: string; name: string; icon: string; col: string; row: string };

const ZONES: Zone[] = [
  { id: "Computer Dept",  name: "Computer Dept",  icon: "computer",                col: "col-span-2", row: "row-span-2" },
  { id: "IT Dept",        name: "IT Dept",         icon: "dns",                     col: "col-span-1", row: "row-span-1" },
  { id: "ETC Dept",       name: "ETC Dept",        icon: "settings_input_antenna",  col: "col-span-1", row: "row-span-1" },
  { id: "ENE Dept",       name: "ENE Dept",        icon: "bolt",                    col: "col-span-1", row: "row-span-1" },
  { id: "Mech Dept",      name: "Mech Dept",       icon: "precision_manufacturing", col: "col-span-1", row: "row-span-1" },
  { id: "Civil Dept",     name: "Civil Dept",      icon: "foundation",              col: "col-span-1", row: "row-span-1" },
  { id: "Mining Dept",    name: "Mining Dept",     icon: "diamond",                 col: "col-span-1", row: "row-span-1" },
  { id: "Library",        name: "Library",         icon: "local_library",           col: "col-span-2", row: "row-span-1" },
  { id: "Admin Block",    name: "Admin Block",     icon: "corporate_fare",          col: "col-span-1", row: "row-span-1" },
  { id: "Academic Block", name: "Academic Block",  icon: "school",                  col: "col-span-2", row: "row-span-1" },
  { id: "Hostel",         name: "Hostel",          icon: "hotel",                   col: "col-span-1", row: "row-span-1" },
  { id: "Canteen",        name: "Canteen",         icon: "restaurant",              col: "col-span-1", row: "row-span-1" },
  { id: "Ground",         name: "Ground",          icon: "sports_soccer",           col: "col-span-2", row: "row-span-1" },
  { id: "Main Gate",      name: "Main Gate",       icon: "door_front",              col: "col-span-1", row: "row-span-1" },
];

// ─── Zone Card ────────────────────────────────────────────────────────────────
function ZoneCard({ zone, issues, events, onClick }: {
  zone: Zone; issues: Issue[]; events: CampusEvent[]; onClick: () => void;
}) {
  const hasIssues = issues.length > 0;
  const hasEvents = events.length > 0;
  const total     = issues.length + events.length;
  const isHot     = total > 2;

  // Border + background
  const baseCard = hasIssues
    ? "bg-red-500/8 border-red-500/30"
    : hasEvents
    ? "bg-emerald-500/6 border-emerald-500/22"
    : "bg-white/3 border-white/8";

  // Box-shadow glow (inline style — Tailwind can't generate arbitrary shadow colors)
  const glowStyle = hasIssues
    ? { boxShadow: "0 0 18px 0px rgba(248,113,113,0.18)" }
    : hasEvents
    ? { boxShadow: "0 0 14px 0px rgba(52,211,153,0.14)" }
    : {};

  const iconClass = hasIssues
    ? "bg-red-500/15 border-red-500/20 text-red-300"
    : hasEvents
    ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-300"
    : "bg-white/8 border-white/10 text-slate-400";

  return (
    <button
      onClick={onClick}
      style={glowStyle}
      className={`${zone.col} ${zone.row} relative rounded-2xl border p-3 flex flex-col gap-1.5 cursor-pointer group text-left transition-all duration-250 hover:scale-[1.02] hover:border-white/25 active:scale-[0.98] active:duration-75 ${baseCard} ${hasIssues ? "zone-issue-pulse" : hasEvents ? "zone-event-pulse" : ""}`}
    >
      {/* HOT badge */}
      {isHot && (
        <div className="absolute -top-2.5 -right-2 z-10 bg-gradient-to-r from-red-500 to-purple-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-md select-none">
          🔥 HOT
        </div>
      )}

      {/* Blinking status dot — top-right */}
      {hasIssues && (
        <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
        </span>
      )}
      {hasEvents && !hasIssues && (
        <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
      )}

      {/* Hover brightness overlay */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-250 bg-white/[0.03] pointer-events-none" />

      {/* Icon */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border transition-transform duration-200 group-hover:scale-110 ${iconClass}`}>
        <span className="material-symbols-outlined text-base">{zone.icon}</span>
      </div>

      {/* Name */}
      <p className="font-['Space_Grotesk'] font-bold text-[13px] text-slate-200 leading-tight line-clamp-2 flex-1 group-hover:text-white transition-colors duration-150">
        {zone.name}
      </p>

      {/* Count pills */}
      <div className="flex flex-wrap gap-1 mt-auto">
        {hasIssues && (
          <span className="flex items-center gap-0.5 text-[10px] font-bold bg-red-500/15 text-red-300 border border-red-500/20 px-1.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            {issues.length} issue{issues.length !== 1 ? "s" : ""}
          </span>
        )}
        {hasEvents && (
          <span className="flex items-center gap-0.5 text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {events.length} event{events.length !== 1 ? "s" : ""}
          </span>
        )}
        {total === 0 && <span className="text-[10px] text-slate-600 italic">clear</span>}
      </div>
    </button>
  );
}

// ─── Zone Modal ───────────────────────────────────────────────────────────────
function ZoneModal({ zone, issues, events, onClose }: {
  zone: Zone; issues: Issue[]; events: CampusEvent[]; onClose: () => void;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"issues" | "events">(issues.length > 0 ? "issues" : "events");

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-950/95 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-97 duration-250"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/8 border border-white/10 flex-shrink-0">
            <span className="material-symbols-outlined text-xl text-slate-300">{zone.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-['Space_Grotesk'] font-bold text-lg text-white">{zone.name}</h2>
            <p className="text-[11px] text-slate-400">
              <span className="text-red-400 font-bold">{issues.length} issue{issues.length !== 1 ? "s" : ""}</span>
              {" · "}
              <span className="text-emerald-400 font-bold">{events.length} event{events.length !== 1 ? "s" : ""}</span>
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {(["issues", "events"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2 ${tab === t
                ? t === "issues"
                  ? "text-red-300 border-b-2 border-red-400 bg-red-500/5"
                  : "text-emerald-300 border-b-2 border-emerald-400 bg-emerald-500/5"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/3"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${t === "issues" ? "bg-red-400" : "bg-emerald-400"}`} />
              {t === "issues" ? `Issues (${issues.length})` : `Events (${events.length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-h-[55vh] overflow-y-auto divide-y divide-white/5">
          {tab === "issues" ? (
            issues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                <span className="material-symbols-outlined text-4xl text-emerald-400 mb-3">check_circle</span>
                <p className="font-bold text-white mb-1">All Clear!</p>
                <p className="text-sm text-slate-400">No issues reported in this zone.</p>
              </div>
            ) : issues.map(issue => {
              const conf = getStatusConfig(issue.status);
              return (
              <button key={issue.id} onClick={() => router.push(`/issue/${issue.id}`)}
                className="w-full text-left p-5 hover:bg-white/5 transition-colors group flex items-start gap-3"
              >
                <div className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 ${conf.bg}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors line-clamp-1">{issue.title}</p>
                  {issue.aiSummary && <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{issue.aiSummary}</p>}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <span className="material-symbols-outlined text-[13px] text-primary">thumb_up</span>
                      {(issue.upvotes ?? 0).toLocaleString()}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${conf.bgLight} ${conf.color}`}>
                      {conf.label}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors flex-shrink-0 mt-1 text-sm">arrow_forward</span>
              </button>
            )})
          ) : (
            events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                <span className="material-symbols-outlined text-4xl text-slate-600 mb-3">event_busy</span>
                <p className="font-bold text-white mb-1">No Events Scheduled</p>
                <p className="text-sm text-slate-400">Nothing planned in this zone yet.</p>
              </div>
            ) : events.map(event => (
              <button key={event.id} onClick={() => router.push(`/events`)}
                className="w-full text-left p-5 hover:bg-white/5 transition-colors group flex items-start gap-3"
              >
                <div className="mt-1 w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                  <span className="material-symbols-outlined text-emerald-400 text-lg">event</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors line-clamp-1">{event.title}</p>
                  {event.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{event.description}</p>}
                  <div className="flex items-center gap-2 mt-1.5">
                    {event.date && (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        {new Date(event.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">group</span>
                      {(event.attendees ?? 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">{event.category}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:text-emerald-400 transition-colors flex-shrink-0 mt-1 text-sm">arrow_forward</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MapPage() {
  const { issues, events, isLoading } = useGlobal();
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const { issuesByZone, eventsByZone } = useMemo(() => {
    const iBZ: Record<string, Issue[]>       = {};
    const eBZ: Record<string, CampusEvent[]> = {};
    for (const z of ZONES) { iBZ[z.id] = []; eBZ[z.id] = []; }
    for (const issue of issues) { if (iBZ[issue.location]) iBZ[issue.location].push(issue); }
    for (const event of events) { if (eBZ[event.location]) eBZ[event.location].push(event); }
    return { issuesByZone: iBZ, eventsByZone: eBZ };
  }, [issues, events]);

  const totalActive = issues.filter(i => i.status !== "resolved").length;
  const totalEvents = events.length;
  const hotZones    = ZONES.filter(z => (issuesByZone[z.id]?.length ?? 0) + (eventsByZone[z.id]?.length ?? 0) > 2).length;

  const selIssues = selectedZone ? (issuesByZone[selectedZone.id] ?? []) : [];
  const selEvents = selectedZone ? (eventsByZone[selectedZone.id] ?? []) : [];

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto">

      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Live Campus Data</span>
          </div>
          <h1 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl text-white">Campus Zone Map</h1>
          <p className="text-slate-400 mt-1 text-sm">Click any zone to view issues &amp; events.</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-3 text-center">
            <p className="text-2xl font-['Space_Grotesk'] font-black text-red-400">{totalActive}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-400/70">Active Issues</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-3 text-center">
            <p className="text-2xl font-['Space_Grotesk'] font-black text-emerald-400">{totalEvents}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/70">Events</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl px-5 py-3 text-center">
            <p className="text-2xl font-['Space_Grotesk'] font-black text-purple-400">{hotZones}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400/70">Hot Zones</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-5 flex-wrap text-xs text-slate-400 font-medium">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" /> Issues</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Events</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400" /> 🔥 Hot (&gt;2 activities)</span>
      </div>

      {/* Zone Grid */}
      {isLoading ? (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3 auto-rows-[130px]">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3 auto-rows-[130px]">
          {ZONES.map(zone => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              issues={issuesByZone[zone.id] ?? []}
              events={eventsByZone[zone.id] ?? []}
              onClick={() => setSelectedZone(zone)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedZone && (
        <ZoneModal
          zone={selectedZone}
          issues={selIssues}
          events={selEvents}
          onClose={() => setSelectedZone(null)}
        />
      )}
    </div>
  );
}
