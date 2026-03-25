"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useToast } from "./ToastProvider";
import { useAuth } from "./AuthProvider";

export type Comment = {
  id: string;
  issueId: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
};

export type Issue = {
  id: string;
  title: string;
  description: string;
  aiSummary?: string;
  category: string;
  location: string;
  status: "reported" | "assigned" | "in_progress" | "resolved" | "dismissed";
  technician?: string;
  updates?: { status: string; note: string; timestamp: string }[];
  upvotes: number;
  upvotedBy?: string[];
  authorName?: string;
  createdAt: string;
  comments?: Comment[];
  isNew?: boolean;
  priority?: "low" | "medium" | "high" | "critical";
  imageUrl?: string;
};

export type CampusEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  date: string | null;
  attendees: number;
  createdAt: string | null;
};

export type Activity = {
  id: string;
  type: "issue" | "alert" | "event" | "resolved";
  title: string;
  description: string;
  timestamp: string;
  tag: string;
  icon: string;
};

type GlobalContextType = {
  issues: Issue[];
  events: CampusEvent[];
  activities: Activity[];
  isLoading: boolean;
  upvotedIssueIds: Set<string>;
  currentUserId: string;
  upvoteIssue: (id: string) => void;
  addComment: (issueId: string, content: string) => Promise<Comment | null>;
  addIssue: (issue: Omit<Issue, "id" | "upvotes" | "createdAt" | "comments" | "isNew">, image?: File) => Promise<void>;
  getIssue: (id: string) => Promise<Issue | null>;
  getComments: (issueId: string) => Promise<Comment[]>;
  addFeedback: (type: string, message: string) => void;
  addActivity: (activity: Omit<Activity, "id" | "timestamp">) => void;
  updateEventStatus: (id: string, status: "approved" | "rejected") => Promise<void>;
  updateIssueStatus: (id: string, status: Issue["status"], technician?: string, note?: string) => Promise<void>;
};

export const getStatusConfig = (status: string) => {
  switch (status) {
    case 'reported': return { color: 'text-error', bg: 'bg-error', bgLight: 'bg-error/20', border: 'border-error', icon: 'campaign', label: 'Reported', shadow: 'shadow-error/60' };
    case 'assigned': return { color: 'text-amber-400', bg: 'bg-amber-400', bgLight: 'bg-amber-400/20', border: 'border-amber-400', icon: 'assignment_ind', label: 'Assigned', shadow: 'shadow-amber-400/60' };
    case 'in_progress': return { color: 'text-primary', bg: 'bg-primary', bgLight: 'bg-primary/20', border: 'border-primary', icon: 'handyman', label: 'In Progress', shadow: 'shadow-[rgba(199,153,255,0.6)]' };
    case 'resolved': return { color: 'text-emerald-400', bg: 'bg-emerald-400', bgLight: 'bg-emerald-400/20', border: 'border-emerald-400', icon: 'check_circle', label: 'Resolved', shadow: 'shadow-emerald-400/60' };
    case 'dismissed': return { color: 'text-slate-400', bg: 'bg-slate-500', bgLight: 'bg-slate-500/20', border: 'border-slate-500', icon: 'block', label: 'Dismissed', shadow: 'shadow-slate-500/60' };
    default: return { color: 'text-on-surface', bg: 'bg-white', bgLight: 'bg-white/10', border: 'border-white/20', icon: 'info', label: status, shadow: 'shadow-white/60' };
  }
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Returns a stable anonymous ID for this browser (survives page refresh)
function getAnonUserId(): string {
  if (typeof window === "undefined") return "anon";
  let uid = localStorage.getItem("lumen_anon_uid");
  if (!uid) {
    uid = `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("lumen_anon_uid", uid);
  }
  return uid;
}

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Set of issue IDs the current user has upvoted (seeded from localStorage on mount)
  const [upvotedIssueIds, setUpvotedIssueIds] = useState<Set<string>>(new Set());
  // Ref mirror — always current, safe to read inside useCallback without stale-closure issues
  const upvotedIssueIdsRef = useRef<Set<string>>(new Set());
  // Per-issue in-flight guard to prevent spam clicks
  const upvoteInflight = useRef<Set<string>>(new Set());
  const { showToast } = useToast();
  const { user } = useAuth();
  
  // Compute it once per render
  const currentUserId = (user?.uid) ?? getAnonUserId();

  const fetchData = useCallback(async () => {
    try {
      const [issueRes, eventRes] = await Promise.all([
        fetch("/api/issues"),
        fetch("/api/events"),
      ]);
      const issueData: Issue[] = issueRes.ok ? await issueRes.json() : [];
      const eventData: CampusEvent[] = eventRes.ok ? await eventRes.json() : [];
      setIssues(issueData);
      setEvents(eventData);
    } catch (err) {
      console.error("[GlobalProvider] fetchData:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Seed upvotedIssueIds from localStorage on first client render
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("lumen_upvoted_issues");
    if (stored) {
      try {
        const arr: string[] = JSON.parse(stored);
        const s = new Set<string>(arr);
        upvotedIssueIdsRef.current = s;
        setUpvotedIssueIds(s);
      } catch { /* ignore malformed */ }
    }
  }, []);

  const upvoteIssue = useCallback((id: string) => {
    // Prevent spam clicks while a request is in flight
    if (upvoteInflight.current.has(id)) return;
    upvoteInflight.current.add(id);

    // Read from the ref — always the current value, no stale closure
    const isUpvoted = upvotedIssueIdsRef.current.has(id);
    const userId = currentUserId;
    const action = isUpvoted ? "remove" : "add";
    const delta = isUpvoted ? -1 : 1;

    console.log("[upvoteIssue] Has Upvoted:", isUpvoted, "→ action:", action);

    // ── Optimistic UI update ──────────────────────────────────────────────────
    const next = new Set(upvotedIssueIdsRef.current);
    if (isUpvoted) next.delete(id); else next.add(id);
    upvotedIssueIdsRef.current = next;                         // keep ref in sync first
    setUpvotedIssueIds(new Set(next));                         // trigger re-render
    if (typeof window !== "undefined") {
      localStorage.setItem("lumen_upvoted_issues", JSON.stringify([...next]));
    }

    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === id) {
          const arr = issue.upvotedBy || [];
          return {
            ...issue,
            upvotes: Math.max(0, issue.upvotes + delta),
            upvotedBy: isUpvoted ? arr.filter(uid => uid !== userId) : [...arr, userId]
          };
        }
        return issue;
      })
    );
    showToast(
      isUpvoted ? "Support removed." : "Your support has been counted! 👍",
      isUpvoted ? "info" : "success",
      isUpvoted ? "thumb_down" : "thumb_up"
    );

    // ── Backend sync ─────────────────────────────────────────────────────────
    fetch(`/api/issues/${id}/upvote`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, userId }),
    })
      .then((res) => { if (!res.ok) throw new Error("upvote failed"); })
      .catch((err) => {
        console.error("[upvoteIssue] rollback:", err);
        // Roll back — mirror the inverse operation
        const rolled = new Set(upvotedIssueIdsRef.current);
        if (isUpvoted) rolled.add(id); else rolled.delete(id);
        upvotedIssueIdsRef.current = rolled;
        setUpvotedIssueIds(new Set(rolled));
        if (typeof window !== "undefined") {
          localStorage.setItem("lumen_upvoted_issues", JSON.stringify([...rolled]));
        }
        setIssues((prev) =>
          prev.map((issue) => {
            if (issue.id === id) {
              const arr = issue.upvotedBy || [];
              return {
                ...issue,
                upvotes: Math.max(0, issue.upvotes - delta),
                upvotedBy: isUpvoted ? [...arr, userId] : arr.filter(uid => uid !== userId)
              };
            }
            return issue;
          })
        );
        showToast("Action failed. Please try again.", "error", "error");
      })
      .finally(() => {
        upvoteInflight.current.delete(id);
      });
  // upvotedIssueIds intentionally excluded — we read from the ref to avoid stale closure
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showToast, user]);

  const addIssue = useCallback(
    async (newIssue: Omit<Issue, "id" | "upvotes" | "createdAt" | "comments" | "isNew">, image?: File) => {
      try {
        // ─── Step 1: Save complaint with rule-based severity (instant) ───────────
        const formData = new FormData();
        formData.append("title",       newIssue.title);
        formData.append("description", newIssue.description);
        formData.append("location",    newIssue.location    || "");
        formData.append("category",    newIssue.category    || "Facility");
        formData.append("authorName",  user?.displayName    || "Student Reporter");

        const res = await fetch("/api/issues", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Failed to create issue");
        const created: Issue = await res.json();

        // Priority is always set immediately by the rule-based classifier
        setIssues((prev) => [{ ...created, isNew: true }, ...prev]);
        showToast("Complaint submitted successfully! 🚨", "success", "campaign");
        addActivity({
          type:        "issue",
          title:       `🚨 New Report: ${created.title}`,
          description: created.aiSummary || created.description,
          tag:         created.category,
          icon:        "campaign",
        });

        // ─── Step 2: Upload image in background ─────────────────────────────────
        if (image) {
          const allowed = ["image/jpeg", "image/jpg", "image/png"];
          if (allowed.includes(image.type)) {
            (async () => {
              try {
                const ext        = image.name.split(".").pop() || "jpg";
                const storageRef = ref(storage, `issues/${Date.now()}.${ext}`);
                await uploadBytes(storageRef, image, { contentType: image.type });
                const imageUrl   = await getDownloadURL(storageRef);
                // Patch Firestore doc
                await fetch(`/api/issues/${created.id}`, {
                  method:  "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body:    JSON.stringify({ imageUrl }),
                });
                // Patch local state so card shows image without reload
                setIssues((prev) =>
                  prev.map((i) => (i.id === created.id ? { ...i, imageUrl } : i))
                );
                console.log("[addIssue] Image patched:", imageUrl);
              } catch (imgErr) {
                console.error("[addIssue] Background image upload failed:", imgErr);
              }
            })();
          } else {
            console.warn("[addIssue] Rejected non-JPG/PNG file:", image.type);
          }
        }

      } catch (err) {
        console.error("[addIssue]", err);
        showToast("Failed to submit complaint. Try again.", "error", "error");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showToast, user]
  );

  const getIssue = useCallback(async (id: string): Promise<Issue | null> => {
    const cached = issues.find((i) => i.id === id);
    if (cached) return cached;
    try {
      const res = await fetch(`/api/issues/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch { return null; }
  }, [issues]);

  const addComment = useCallback(async (issueId: string, content: string): Promise<Comment | null> => {
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId, content, author: user?.displayName || "Student Reporter" }),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      const newComment = await res.json();
      // Update local state to sync comment count
      setIssues((prev) =>
        prev.map((i) =>
          i.id === issueId
            ? { ...i, comments: [...(i.comments || []), newComment] }
            : i
        )
      );
      showToast("Comment posted! 💬", "success", "forum");
      return newComment;
    } catch (err) {
      console.error("[addComment]", err);
      showToast("Failed to post comment.", "error", "error");
      return null;
    }
  }, [showToast]);

  const getComments = useCallback(async (issueId: string): Promise<Comment[]> => {
    try {
      const res = await fetch(`/api/comments?issueId=${issueId}`);
      if (!res.ok) return [];
      return await res.json();
    } catch { return []; }
  }, []);

  const addActivity = useCallback((activity: Omit<Activity, "id" | "timestamp">) => {
    setActivities((prev) => [
      { ...activity, id: `act-${Date.now()}`, timestamp: "JUST NOW" },
      ...prev,
    ]);
  }, []);

  const updateIssueStatus = useCallback(async (id: string, status: Issue["status"], technician?: string, note?: string) => {
    try {
      const res = await fetch(`/api/issues/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, technician, note }),
      });
      if (!res.ok) throw new Error();
      
      const newUpdate = note ? { status, note, timestamp: new Date().toISOString() } : undefined;

      setIssues(prev => prev.map(i => {
        if (i.id !== id) return i;
        const newUpdates = newUpdate ? [...(i.updates || []), newUpdate] : (i.updates || []);
        return { 
          ...i, 
          status, 
          ...(technician && { technician }),
          updates: newUpdates
        };
      }));
      
      showToast(`Issue marked as ${status.replace("_", " ")}!`, "success", "check_circle");
    } catch {
      showToast("Failed to update issue status.", "error", "error");
    }
  }, [showToast]);

  const updateEventStatus = useCallback(async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      if (status === "approved") {
        setEvents(prev => prev.map(e => e.id === id ? { ...e, status: "approved" } : e));
      } else {
        setEvents(prev => prev.filter(e => e.id !== id));
      }
      showToast(`Event ${status}!`, "success", status === "approved" ? "check_circle" : "cancel");
    } catch {
      showToast(`Failed to ${status} event.`, "error", "error");
    }
  }, [showToast]);

  const addFeedback = useCallback((type: string, message: string) => {
    console.log("[Feedback]", type, message);
    showToast("Feedback submitted! Thank you 🙏", "success", "favorite");
  }, [showToast]);

  return (
    <GlobalContext.Provider value={{
      issues, events, activities, isLoading,
      upvotedIssueIds, currentUserId,
      upvoteIssue, addComment, addIssue, getIssue, getComments, addFeedback, addActivity,
      updateEventStatus, updateIssueStatus,
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (context === undefined) throw new Error("useGlobal must be used within a GlobalProvider");
  return context;
}
