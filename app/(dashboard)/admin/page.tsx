"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useGlobal, CampusEvent, Issue, getStatusConfig } from "@/components/GlobalProvider";
import { useToast } from "@/components/ToastProvider";

export default function AdminIntelligencePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { issues, updateIssueStatus, updateEventStatus } = useGlobal();
  const { showToast } = useToast();

  const [pendingEvents, setPendingEvents] = useState<CampusEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState<"issues" | "events">("issues");
  const [issueFilter, setIssueFilter] = useState<"all" | "reported" | "in_progress" | "resolved" | "dismissed">("all");

  // Selection & Bulk Actions
  const [selectedIssueIds, setSelectedIssueIds] = useState<string[]>([]);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Status Management State (for assignments)
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [technician, setTechnician] = useState("");
  const [note, setNote] = useState("");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      showToast("Access Restricted. Admins only.", "error", "error");
      router.push("/dashboard");
    }
  }, [user, router, showToast]);

  // Fetch pending events
  const fetchPending = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch("/api/events?pending=true");
      if (res.ok) {
        const data = await res.json();
        console.log("FETCHED PENDING EVENTS:", data);
        data.forEach((evt: any) => console.log("Event Status:", evt.status));
        setPendingEvents(data);
      }
    } catch (err) {
      console.error("Failed to fetch pending events", err);
    } finally {
      setLoadingEvents(false);
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchPending();
    }
  }, [user]);

  if (!user || user.role !== "admin") return null;

  // Derived Metrics
  const openIssues = issues.filter(i => i.status === "reported" || i.status === "assigned");
  const inProgressIssues = issues.filter(i => i.status === "in_progress");
  const resolvedIssues = issues.filter(i => i.status === "resolved" || i.status === "dismissed");

  const displayedIssues = issues.filter(i => {
    if (issueFilter === "all") return i.status !== "resolved" && i.status !== "dismissed";
    if (issueFilter === "reported") return i.status === "reported" || i.status === "assigned";
    if (issueFilter === "in_progress") return i.status === "in_progress";
    if (issueFilter === "resolved") return i.status === "resolved";
    if (issueFilter === "dismissed") return i.status === "dismissed";
    return true;
  });

  const handleApproveEvent = async (id: string) => {
    await updateEventStatus(id, "approved");
    setPendingEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleRejectEvent = async (id: string) => {
    await updateEventStatus(id, "rejected");
    setPendingEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Quick Action
  const handleQuickStatus = async (id: string, status: Issue["status"]) => {
    await updateIssueStatus(id, status);
  };

  // Full assignment
  const handleAssignment = async (id: string) => {
    if (!technician.trim()) {
      showToast("Technician name is required.", "error", "error");
      return;
    }
    await updateIssueStatus(id, "assigned", technician.trim(), note.trim() || undefined);
    setActiveIssueId(null);
    setTechnician("");
    setNote("");
  };

  // Bulk Actions
  const toggleSelection = (id: string) => {
    setSelectedIssueIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkAction = async (status: Issue["status"]) => {
    if (selectedIssueIds.length === 0) return;
    setIsProcessingBulk(true);
    try {
      await Promise.all(selectedIssueIds.map(id => updateIssueStatus(id, status)));
      showToast(`Successfully updated ${selectedIssueIds.length} issues to ${status}`, "success", "done_all");
      setSelectedIssueIds([]);
    } catch {
      showToast("Some updates failed.", "error", "error");
    } finally {
      setIsProcessingBulk(false);
    }
  };

  return (
    <div className="px-8 pb-12 w-full max-w-7xl mx-auto space-y-12">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary glow-primary">
          <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-400">Command Center</span>
          </div>
          <h1 className="text-4xl font-headline font-bold text-on-surface leading-tight">Admin Console</h1>
          <p className="text-sm text-on-surface-variant flex items-center gap-2 mt-2">
            <span className="material-symbols-outlined text-[14px]">update</span>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <button onClick={fetchPending} className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-xs font-bold text-on-surface hover:text-primary">
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Force Sync
        </button>
      </div>

      {/* Control Panel Bento */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => { setActiveTab("events"); }} className={`glass-panel p-5 rounded-3xl border text-left transition-all ${activeTab === 'events' ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(199,153,255,0.1)]' : 'border-white/5 hover:border-white/20'}`}>
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <span className="material-symbols-outlined">event_note</span>
            </div>
            <span className="text-2xl font-headline font-bold text-on-surface">{pendingEvents.length}</span>
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Pending Events</p>
        </button>

        <button onClick={() => { setActiveTab("issues"); setIssueFilter("reported"); }} className={`glass-panel p-5 rounded-3xl border text-left transition-all ${activeTab === 'issues' && issueFilter === 'reported' ? 'border-error bg-error/5 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-white/5 hover:border-white/20'}`}>
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-error/20 text-error flex items-center justify-center">
              <span className="material-symbols-outlined">report</span>
            </div>
            <span className="text-2xl font-headline font-bold text-on-surface">{openIssues.length}</span>
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Open Reports</p>
        </button>

        <button onClick={() => { setActiveTab("issues"); setIssueFilter("in_progress"); }} className={`glass-panel p-5 rounded-3xl border text-left transition-all ${activeTab === 'issues' && issueFilter === 'in_progress' ? 'border-secondary bg-secondary/5 shadow-[0_0_20px_rgba(74,248,227,0.1)]' : 'border-white/5 hover:border-white/20'}`}>
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined">handyman</span>
            </div>
            <span className="text-2xl font-headline font-bold text-on-surface">{inProgressIssues.length}</span>
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">In Progress</p>
        </button>

        <button onClick={() => { setActiveTab("issues"); setIssueFilter("resolved"); }} className={`glass-panel p-5 rounded-3xl border text-left transition-all ${activeTab === 'issues' && issueFilter === 'resolved' ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-white/5 hover:border-white/20'}`}>
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <span className="text-2xl font-headline font-bold text-on-surface">{resolvedIssues.length}</span>
          </div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Resolved</p>
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === "issues" ? (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-headline font-bold text-on-surface flex items-center gap-3">
              Issue Management
              {issueFilter !== "all" && (
                <span className="text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10 text-on-surface-variant font-medium">
                  Filtered by: <span className="text-primary font-bold">{issueFilter.replace("_", " ").toUpperCase()}</span>
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2 bg-surface-container-high p-1 rounded-xl border border-white/5">
              {(["all", "reported", "in_progress", "resolved"] as const).map(f => (
                <button key={f} onClick={() => setIssueFilter(f)} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${issueFilter === f ? 'bg-white/10 text-on-surface shadow-md' : 'text-on-surface-variant hover:text-white hover:bg-white/5'}`}>
                  {f.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {displayedIssues.length === 0 ? (
              <div className="glass-panel border-dashed border-2 rounded-3xl p-12 py-24 text-center">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">task_alt</span>
                <p className="text-lg font-bold text-on-surface-variant">No issues found in this category.</p>
              </div>
            ) : (
              displayedIssues.map((issue) => {
                const conf = getStatusConfig(issue.status);
                const isSelected = selectedIssueIds.includes(issue.id);
                if (issue.imageUrl) {
                  console.log("Complaint Image:", issue.imageUrl);
                }
                return (
                  <div key={issue.id} className={`glass-panel rounded-2xl p-6 border transition-all relative overflow-hidden group flex gap-5 ${isSelected ? 'border-primary/50 bg-primary/5' : `border-l-2 border-l-${conf.color.replace('text-', '')} border-white/5`}`}>
                    {/* Checkbox */}
                    <div className="flex items-start pt-1">
                      <button onClick={() => toggleSelection(issue.id)} className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary text-on-primary' : 'border-white/20 hover:border-primary/50'}`}>
                        {isSelected && <span className="material-symbols-outlined text-[16px] font-bold">check</span>}
                      </button>
                    </div>

                    <div className="flex flex-col flex-1 h-full min-w-0">
                      <div className="flex flex-wrap items-center justify-between mb-3 gap-4">
                        <div className="flex items-center gap-3">
                          <span className={`${conf.bgLight} ${conf.color} text-[10px] px-2.5 py-1 flex items-center gap-1.5 rounded-full font-bold uppercase tracking-widest border border-current/20`}>
                            <span className="material-symbols-outlined text-[14px]">{conf.icon}</span>
                            {conf.label}
                          </span>
                          <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md border border-white/10">
                            {issue.category}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-on-surface-variant/80 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-primary">thumb_up</span> {issue.upvotes}
                        </span>
                      </div>
                      <h3 className="font-headline font-bold text-on-surface text-lg mb-1">{issue.title}</h3>
                      <p className="text-xs text-on-surface-variant mb-4 line-clamp-2">{issue.aiSummary || issue.description}</p>

                      {issue.imageUrl && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-white/5 bg-surface-container-low max-w-sm">
                          {/* Display image inside the complaint card */}
                          <img
                            src={issue.imageUrl}
                            alt="Complaint attachment"
                            className="w-full h-32 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(issue.imageUrl!);
                            }}
                          />
                        </div>
                      )}

                      <div className="flex flex-col gap-1 mb-6">
                        <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Location</span>
                        <span className="text-xs text-on-surface font-medium truncate flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-purple-400">location_on</span> {issue.location}
                        </span>
                      </div>

                      {/* Quick Actions & Assignments */}
                      {activeIssueId === issue.id ? (
                        <div className="pt-5 border-t border-white/10 space-y-3 mt-auto bg-black/20 -mx-6 -mb-6 p-6">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Assign Technician</h4>
                          <input
                            type="text"
                            placeholder="Technician Name (e.g. John Facility)"
                            value={technician}
                            onChange={(e) => setTechnician(e.target.value)}
                            className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/60 transition-colors"
                          />
                          <input
                            type="text"
                            placeholder="Optional Note / ETA (e.g. Parts arriving tomorrow)"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/60 transition-colors mt-2"
                          />
                          <div className="flex items-center gap-3 pt-3">
                            <button onClick={() => setActiveIssueId(null)} className="flex-1 py-3 rounded-xl text-xs font-bold text-on-surface-variant border border-white/10 hover:bg-white/5 transition-colors">
                              Cancel
                            </button>
                            <button onClick={() => handleAssignment(issue.id)} className="flex-1 py-3 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-lg shadow-primary/20">
                              Confirm Assignment
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2 pt-5 border-t border-white/5 mt-auto">
                          {issue.status !== "resolved" && issue.status !== "dismissed" && (
                            <>
                              <button onClick={() => handleQuickStatus(issue.id, "resolved")} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold transition-colors border border-emerald-500/20">
                                <span className="material-symbols-outlined text-[16px]">check_circle</span> Resolve
                              </button>
                              <button onClick={() => handleQuickStatus(issue.id, "in_progress")} className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-bold transition-colors border border-primary/20">
                                <span className="material-symbols-outlined text-[16px]">handyman</span> Start Work
                              </button>
                              <button onClick={() => setActiveIssueId(issue.id)} className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-lg text-xs font-bold transition-colors border border-amber-500/20">
                                <span className="material-symbols-outlined text-[16px]">assignment_ind</span> Assign...
                              </button>
                              <button onClick={() => handleQuickStatus(issue.id, "dismissed")} className="flex items-center gap-1.5 px-4 py-2 bg-surface-variant hover:bg-surface-variant/80 text-on-surface rounded-lg text-xs font-bold transition-colors border border-white/10 ml-auto">
                                <span className="material-symbols-outlined text-[16px]">block</span>
                              </button>
                            </>
                          )}
                          {(issue.status === "resolved" || issue.status === "dismissed") && (
                            <button onClick={() => handleQuickStatus(issue.id, "reported")} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-on-surface-variant rounded-lg text-xs font-bold transition-colors border border-white/10">
                              <span className="material-symbols-outlined text-[16px]">undo</span> Reopen
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      ) : (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-headline font-bold text-on-surface flex items-center gap-3">
              Event Moderation
            </h2>
          </div>

          <div className="space-y-4">
            {loadingEvents ? (
              <div className="glass-panel border-dashed border-2 rounded-3xl p-12 py-24 text-center">
                <span className="material-symbols-outlined animate-spin text-4xl mb-4 text-purple-400">progress_activity</span>
                <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Loading operations...</p>
              </div>
            ) : pendingEvents.length === 0 ? (
              <div className="glass-panel border-dashed border-2 rounded-3xl p-12 py-24 text-center">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">event_available</span>
                <p className="text-lg font-bold text-on-surface-variant">The event queue is completely clear.</p>
              </div>
            ) : (
              pendingEvents.map((evt) => (
                <div key={evt.id} className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row gap-6 relative overflow-hidden group items-center">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors"></div>

                  <div className="flex-1 min-w-0 z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest px-2.5 py-1 bg-purple-500/10 rounded-md border border-purple-500/20">
                        {evt.category || "General"}
                      </span>
                    </div>
                    <h3 className="font-headline font-bold text-on-surface text-xl mb-2 truncate">{evt.title}</h3>
                    <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{evt.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
                      <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><span className="material-symbols-outlined text-[14px] text-purple-400">location_on</span> {evt.location}</span>
                      <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><span className="material-symbols-outlined text-[14px] text-emerald-400">calendar_today</span> {evt.date ? new Date(evt.date).toLocaleDateString() : 'TBD'}</span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto z-10 shrink-0">
                    <button onClick={() => handleApproveEvent(evt.id)} className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/5 border border-emerald-500/20">
                      <span className="material-symbols-outlined text-lg">check_circle</span> Approve
                    </button>
                    <button onClick={() => handleRejectEvent(evt.id)} className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-error/10 hover:bg-error/20 text-error px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-error/5 border border-error/20">
                      <span className="material-symbols-outlined text-lg">cancel</span> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIssueIds.length > 0 && activeTab === "issues" && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 fade-in duration-300">
          <div className="bg-surface-container-highest border border-white/10 shadow-2xl shadow-black/80 p-4 rounded-2xl flex items-center gap-6 glass-panel backdrop-blur-3xl">
            <div className="flex items-center gap-3 border-r border-white/10 pr-6">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold font-headline">
                {selectedIssueIds.length}
              </div>
              <span className="text-sm font-bold text-on-surface whitespace-nowrap">Issues Selected</span>
            </div>
            <div className="flex items-center gap-3">
              <button disabled={isProcessingBulk} onClick={() => handleBulkAction("in_progress")} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-colors disabled:opacity-50">
                <span className="material-symbols-outlined text-[16px]">handyman</span> Mark In Progress
              </button>
              <button disabled={isProcessingBulk} onClick={() => handleBulkAction("resolved")} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-xl text-xs font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50">
                <span className="material-symbols-outlined text-[16px]">check_circle</span> Mark Resolved
              </button>
              <button disabled={isProcessingBulk} onClick={() => setSelectedIssueIds([])} className="p-2 text-on-surface-variant hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-2">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-size Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <button 
              className="absolute -top-12 right-0 md:-right-12 text-white hover:text-error bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
              onClick={() => setSelectedImage(null)}
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
            <img 
              src={selectedImage} 
              alt="Full size expanded complaint preview" 
              className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}

    </div>
  );
}
