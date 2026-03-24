"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
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
  status: "reported" | "in_progress" | "resolved" | string;
  upvotes: number;
  authorName?: string;
  createdAt: string;
  comments?: Comment[];
  isNew?: boolean;
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
  upvoteIssue: (id: string) => void;
  addComment: (issueId: string, content: string) => Promise<Comment | null>;
  addIssue: (issue: Omit<Issue, "id" | "upvotes" | "createdAt" | "comments" | "isNew">) => Promise<void>;
  getIssue: (id: string) => Promise<Issue | null>;
  getComments: (issueId: string) => Promise<Comment[]>;
  addFeedback: (type: string, message: string) => void;
  addActivity: (activity: Omit<Activity, "id" | "timestamp">) => void;
  updateEventStatus: (id: string, status: "approved" | "rejected") => Promise<void>;
  resolveIssue: (id: string) => Promise<void>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const STATIC_ACTIVITIES: Activity[] = [
  { id: "a1", type: "issue", title: "⚠️ Multiple reports incoming: Block A", description: "Our team is heading to elevator shaft 4 right now.", tag: "Active Response", icon: "construction", timestamp: "JUST NOW" },
  { id: "a2", type: "alert", title: "🚨 Network Drop: Critical Node 7", description: "The Central Library's main router just went dark. IT is on it.", tag: "Service Interruption", icon: "wifi_off", timestamp: "2m AGO" },
  { id: "a3", type: "event", title: "⚡ Spike detected: East Plaza density", description: "Whoa, it's getting crowded! Foot traffic near the auditorium is way up.", tag: "Monitoring", icon: "stadium", timestamp: "5m AGO" },
  { id: "a4", type: "resolved", title: "✅ Gate 4 is back in action", description: "Mechanical sensor recalibrated. Vehicle access is back to normal.", tag: "Resolved", icon: "check_circle", timestamp: "15m AGO" },
];

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [activities, setActivities] = useState<Activity[]>(STATIC_ACTIVITIES);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      const [issueRes, eventRes] = await Promise.all([
        fetch("/api/issues"),
        fetch("/api/events"),
      ]);
      const issueData: Issue[] = issueRes.ok ? await issueRes.json() : [];
      const eventData: CampusEvent[] = eventRes.ok ? await eventRes.json() : [];

      // Auto-seed if both are empty
      if (issueData.length === 0 && eventData.length === 0) {
        // Only seed events, never auto-seed issues
        await fetch("/api/seed", { method: "POST" });
        const sE = await fetch("/api/events");
        setIssues([]);
        setEvents(sE.ok ? await sE.json() : []);
      } else {
        setIssues(issueData);
        setEvents(eventData);
      }
    } catch (err) {
      console.error("[GlobalProvider] fetchData:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const upvoteIssue = useCallback((id: string) => {
    const upvotedKey = `upvoted_${id}`;
    if (typeof window !== "undefined" && localStorage.getItem(upvotedKey)) {
      showToast("You've already supported this issue! 👍", "error", "thumb_up");
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(upvotedKey, "true");
    }
    // Optimistic update
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, upvotes: issue.upvotes + 1 } : issue
      )
    );
    showToast("Your support has been counted! 👍", "success", "thumb_up");
    fetch(`/api/issues/${id}/upvote`, { method: "PATCH" }).catch((err) => {
      console.error("[upvoteIssue]", err);
      // Roll back on failure
      if (typeof window !== "undefined") {
        localStorage.removeItem(upvotedKey);
      }
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === id ? { ...issue, upvotes: issue.upvotes - 1 } : issue
        )
      );
      showToast("Upvote failed. Please try again.", "error", "error");
    });
  }, [showToast]);

  const addIssue = useCallback(
    async (newIssue: Omit<Issue, "id" | "upvotes" | "createdAt" | "comments" | "isNew">) => {
      try {
        const payload = { ...newIssue, authorName: user?.displayName || "Student Reporter" };
        const res = await fetch("/api/issues", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create issue");
        const created: Issue = await res.json();
        setIssues((prev) => [{ ...created, isNew: true }, ...prev]);
        showToast("Issue reported successfully! 🚨", "success", "campaign");
        addActivity({
          type: "issue",
          title: `🚨 New Report: ${created.title}`,
          description: created.aiSummary || created.description,
          tag: created.category,
          icon: "campaign",
        });
      } catch (err) {
        console.error("[addIssue]", err);
        showToast("Failed to submit issue. Try again.", "error", "error");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showToast]
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

  const resolveIssue = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/issues/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });
      if (!res.ok) throw new Error();
      setIssues(prev => prev.map(i => i.id === id ? { ...i, status: "resolved" } : i));
      showToast("Issue marked as resolved! ✅", "success", "check_circle");
    } catch {
      showToast("Failed to resolve issue.", "error", "error");
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
      upvoteIssue, addComment, addIssue, getIssue, getComments, addFeedback, addActivity,
      updateEventStatus, resolveIssue,
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
