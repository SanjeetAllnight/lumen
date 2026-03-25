"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useGlobal } from "@/components/GlobalProvider";
import { useToast } from "@/components/ToastProvider";

type PendingEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string | null;
  createdAt: string | null;
  coordinatorName?: string;
  coordinatorPhone?: string;
  coordinatorEmail?: string;
  status: string;
  createdBy?: string;
  category?: string;
};

function timeAgo(dateString: string | null | undefined): string {
  if (!dateString) return "Unknown date";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "Unknown date";
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "TBD";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export default function PendingEventsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { updateEventStatus } = useGlobal();
  const { showToast } = useToast();

  const [events, setEvents] = useState<PendingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== "admin") {
      showToast("Access Restricted. Admins only.", "error", "error");
      router.push("/dashboard");
    }
  }, [user, router, showToast]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events?pending=true");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      } else {
        showToast("Failed to load pending events.", "error", "error");
      }
    } catch {
      showToast("Network error loading events.", "error", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchEvents();
    }
  }, [user, fetchEvents]);

  const handleAction = async (eventId: string, action: "approved" | "rejected", title: string) => {
    setProcessingId(eventId);
    try {
      await updateEventStatus(eventId, action);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      showToast(
        action === "approved" ? `"${title}" approved and published!` : `"${title}" has been rejected.`,
        action === "approved" ? "success" : "error",
        action === "approved" ? "check_circle" : "block"
      );
    } catch {
      showToast("Action failed. Please try again.", "error", "error");
    } finally {
      setProcessingId(null);
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="flex-1 md:p-8 max-w-6xl mx-auto w-full space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Admin Console
            </Link>
          </div>
          <h1 className="text-3xl font-headline font-bold text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-400 text-3xl">pending_actions</span>
            Pending Events
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Review and approve or reject events submitted by users.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              {loading ? "—" : events.length} Pending
            </span>
          </div>
          <button
            onClick={fetchEvents}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all text-sm disabled:opacity-40"
          >
            <span className={`material-symbols-outlined text-base ${loading ? "animate-spin" : ""}`}>
              refresh
            </span>
            Refresh
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="glass-panel rounded-2xl border border-white/5 p-6 animate-pulse"
            >
              <div className="h-5 bg-white/5 rounded-lg w-1/3 mb-3" />
              <div className="h-3 bg-white/5 rounded-lg w-2/3 mb-2" />
              <div className="h-3 bg-white/5 rounded-lg w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-emerald-400">check_circle</span>
          </div>
          <h2 className="text-xl font-headline font-bold text-on-surface mb-2">All Clear!</h2>
          <p className="text-sm text-on-surface-variant max-w-sm">
            No pending events at the moment. All submitted events have been reviewed.
          </p>
        </div>
      )}

      {/* Events List */}
      {!loading && events.length > 0 && (
        <div className="space-y-4">
          {events.map((event) => {
            const isProcessing = processingId === event.id;
            return (
              <div
                key={event.id}
                className={`glass-panel rounded-2xl border border-white/5 p-6 transition-all duration-300 ${isProcessing ? "opacity-50 scale-[0.99] pointer-events-none" : "hover:border-amber-500/20"}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  
                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    {/* Status + Category badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded-full uppercase tracking-widest">
                        Pending Review
                      </span>
                      {event.category && (
                        <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-widest">
                          {event.category}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-headline font-bold text-on-surface mb-2 leading-snug">
                      {event.title}
                    </h3>

                    <p className="text-sm text-on-surface-variant leading-relaxed mb-4 line-clamp-3">
                      {event.description || "No description provided."}
                    </p>

                    {/* Meta Info Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {/* Date */}
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-primary text-sm">event</span>
                        </div>
                        <div>
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                            Event Date
                          </p>
                          <p className="text-xs font-semibold text-on-surface">{formatDate(event.date)}</p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-secondary text-sm">location_on</span>
                        </div>
                        <div>
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Location</p>
                          <p className="text-xs font-semibold text-on-surface truncate max-w-[120px]">
                            {event.location}
                          </p>
                        </div>
                      </div>

                      {/* Submitted */}
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-slate-400 text-sm">schedule</span>
                        </div>
                        <div>
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                            Submitted
                          </p>
                          <p className="text-xs font-semibold text-on-surface">{timeAgo(event.createdAt)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Coordinator Info (if available) */}
                    {event.coordinatorName && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 font-bold">
                          Coordinator
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                              {event.coordinatorName[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-semibold text-on-surface">
                              {event.coordinatorName}
                            </span>
                          </div>
                          {event.coordinatorEmail && (
                            <a
                              href={`mailto:${event.coordinatorEmail}`}
                              className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                            >
                              <span className="material-symbols-outlined text-sm">mail</span>
                              {event.coordinatorEmail}
                            </a>
                          )}
                          {event.coordinatorPhone && (
                            <a
                              href={`tel:${event.coordinatorPhone}`}
                              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
                            >
                              <span className="material-symbols-outlined text-sm">call</span>
                              {event.coordinatorPhone}
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Submitted by */}
                    {event.createdBy && (
                      <p className="text-[11px] text-slate-500 mt-3">
                        Submitted by{" "}
                        <span className="font-semibold text-slate-400">{event.createdBy}</span>
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex lg:flex-col gap-3 lg:min-w-[160px]">
                    <button
                      onClick={() => handleAction(event.id, "approved", event.title)}
                      disabled={isProcessing}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-emerald-400/10 hover:bg-emerald-400/20 active:scale-95 border border-emerald-400/30 hover:border-emerald-400/60 text-emerald-400 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg shadow-emerald-400/5"
                    >
                      {isProcessing ? (
                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      ) : (
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(event.id, "rejected", event.title)}
                      disabled={isProcessing}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-error/10 hover:bg-error/20 active:scale-95 border border-error/30 hover:border-error/60 text-error rounded-xl font-bold text-sm transition-all duration-200 shadow-lg shadow-error/5"
                    >
                      {isProcessing ? (
                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      ) : (
                        <span className="material-symbols-outlined text-sm">block</span>
                      )}
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
