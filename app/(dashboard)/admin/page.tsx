"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useGlobal, CampusEvent } from "@/components/GlobalProvider";
import { useToast } from "@/components/ToastProvider";

export default function AdminIntelligencePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { issues, resolveIssue, updateEventStatus } = useGlobal();
  const { showToast } = useToast();

  const [pendingEvents, setPendingEvents] = useState<CampusEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      showToast("Access Restricted. Admins only.", "error", "error");
      router.push("/dashboard");
    }
  }, [user, router, showToast]);

  // Fetch pending events
  useEffect(() => {
    if (user?.role !== "admin") return;
    const fetchPending = async () => {
      try {
        const res = await fetch("/api/events?pending=true");
        if (res.ok) {
          const data = await res.json();
          setPendingEvents(data);
        }
      } catch (err) {
        console.error("Failed to fetch pending events", err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchPending();
  }, [user]);

  if (!user || user.role !== "admin") return null;

  const openIssues = issues.filter((i) => i.status === "open" || i.status === "in_progress" || i.status === "reported");

  const handleApproveEvent = async (id: string) => {
    await updateEventStatus(id, "approved");
    setPendingEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleRejectEvent = async (id: string) => {
    await updateEventStatus(id, "rejected");
    setPendingEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="px-8 pb-12 w-full max-w-7xl mx-auto space-y-12">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary glow-primary">
          <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold text-on-surface leading-tight">Admin Intelligence</h1>
          <p className="text-sm text-on-surface-variant">Review pending events and manage critical campus issues.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pending Events Section */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
              Pending Events
              {pendingEvents.length > 0 && (
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[10px] font-black">
                  {pendingEvents.length}
                </span>
              )}
            </h2>
          </div>

          <div className="space-y-4">
            {loadingEvents ? (
              <div className="glass-panel rounded-2xl p-8 border border-white/5 text-center flex flex-col items-center justify-center min-h-[200px]">
                <span className="material-symbols-outlined animate-spin text-3xl mb-2 text-primary">progress_activity</span>
                <p className="text-sm text-on-surface-variant">Loading pending events...</p>
              </div>
            ) : pendingEvents.length === 0 ? (
              <div className="glass-panel rounded-2xl p-8 border border-white/5 text-center flex flex-col items-center justify-center min-h-[200px]">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">task_alt</span>
                <p className="text-on-surface-variant text-sm font-medium">No pending events.</p>
              </div>
            ) : (
              pendingEvents.map((evt) => (
                <div key={evt.id} className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
                  <div className="relative z-10 flex flex-col flex-1 h-full">
                    <h3 className="font-headline font-bold text-on-surface text-lg mb-1">{evt.title}</h3>
                    <p className="text-xs text-on-surface-variant mb-4 flex-1">{evt.description}</p>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Location</span>
                        <span className="text-xs text-on-surface font-medium truncate">{evt.location}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Date</span>
                        <span className="text-xs text-on-surface font-medium truncate">{evt.date ? new Date(evt.date).toLocaleDateString() : 'TBD'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                      <button onClick={() => handleApproveEvent(evt.id)} className="flex-1 flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 border border-primary/20">
                        <span className="material-symbols-outlined text-sm">check</span> Approve
                      </button>
                      <button onClick={() => handleRejectEvent(evt.id)} className="flex-1 flex items-center justify-center gap-2 bg-error/10 hover:bg-error/20 text-error px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 border border-error/20">
                        <span className="material-symbols-outlined text-sm">close</span> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Active Issues Section */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
              Active Issues
              {openIssues.length > 0 && (
                <span className="bg-error/20 text-error px-2 py-0.5 rounded-full text-[10px] font-black">
                  {openIssues.length}
                </span>
              )}
            </h2>
          </div>

          <div className="space-y-4">
            {openIssues.length === 0 ? (
              <div className="glass-panel rounded-2xl p-8 border border-white/5 text-center flex flex-col items-center justify-center min-h-[200px]">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">verified</span>
                <p className="text-on-surface-variant text-sm font-medium">All issues resolved.</p>
              </div>
            ) : (
              openIssues.map((issue) => (
                <div key={issue.id} className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-4 border-l-2 border-l-error relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-error/5 blur-3xl rounded-full pointer-events-none group-hover:bg-error/10 transition-colors"></div>
                  <div className="relative z-10 flex flex-col flex-1 h-full">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-error/10 text-error text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-error/20">{issue.category}</span>
                      <span className="text-[10px] font-bold text-on-surface-variant/80 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-error">trending_up</span> {issue.upvotes} Upvotes
                      </span>
                    </div>
                    <h3 className="font-headline font-bold text-on-surface text-lg mb-1">{issue.title}</h3>
                    <p className="text-xs text-on-surface-variant mb-4 line-clamp-2 flex-1">{issue.aiSummary || issue.description}</p>
                    <div className="flex flex-col gap-1 mb-6">
                      <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Location</span>
                      <span className="text-xs text-on-surface font-medium truncate flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">location_on</span> {issue.location}</span>
                    </div>
                    <div className="flex items-center justify-end pt-4 border-t border-white/5 mt-auto">
                      <button onClick={() => resolveIssue(issue.id)} className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-on-surface px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 border border-white/10">
                        <span className="material-symbols-outlined text-sm text-secondary">how_to_reg</span> Mark as Resolved
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
