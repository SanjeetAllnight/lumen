"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

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
  status: "reported" | "in_progress" | "resolved" | "Urgent" | "Scheduled" | "New Report";
  upvotes: number;
  affectedCount: number;
  createdAt: string;
  comments?: Comment[];
  isNew?: boolean;
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
  activities: Activity[];
  isLoading: boolean;
  upvoteIssue: (id: string) => void;
  addComment: (issueId: string, content: string) => Promise<Comment | null>;
  addIssue: (issue: Omit<Issue, "id" | "upvotes" | "affectedCount" | "createdAt" | "comments" | "isNew">) => Promise<void>;
  getIssue: (id: string) => Promise<Issue | null>;
  getComments: (issueId: string) => Promise<Comment[]>;
  addFeedback: (type: string, message: string) => void;
  addActivity: (activity: Omit<Activity, "id" | "timestamp">) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Seed data for static activity feed (not stored in DB)
const STATIC_ACTIVITIES: Activity[] = [
  { id: "a1", type: "issue", title: "⚠️ Multiple reports incoming: Block A", description: "Our team is heading to elevator shaft 4 right now.", tag: "Active Response", icon: "construction", timestamp: "JUST NOW" },
  { id: "a2", type: "alert", title: "🚨 Network Drop: Critical Node 7", description: "The Central Library's main router just went dark. IT is on it.", tag: "Service Interruption", icon: "wifi_off", timestamp: "2m AGO" },
  { id: "a3", type: "event", title: "⚡ Spike detected: East Plaza density", description: "Whoa, it's getting crowded! Foot traffic near the auditorium is way up.", tag: "Monitoring", icon: "stadium", timestamp: "5m AGO" },
  { id: "a4", type: "resolved", title: "✅ Gate 4 is back in action", description: "Mechanical sensor recalibrated. Vehicle access is back to normal.", tag: "Resolved", icon: "check_circle", timestamp: "15m AGO" },
];

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [activities, setActivities] = useState<Activity[]>(STATIC_ACTIVITIES);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch issues on mount
  const fetchIssues = useCallback(async () => {
    try {
      const res = await fetch("/api/issues");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: Issue[] = await res.json();
      setIssues(data);
    } catch (err) {
      console.error("[GlobalProvider] fetchIssues:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Optimistic upvote → sync with API
  const upvoteIssue = useCallback((id: string) => {
    // Optimistic update
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, upvotes: issue.upvotes + 1, affectedCount: issue.affectedCount + 1 } : issue
      )
    );
    // Fire and forget API call
    fetch(`/api/issues/${id}/upvote`, { method: "PATCH" }).catch((err) => {
      console.error("[upvoteIssue]", err);
      // Roll back on failure
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === id ? { ...issue, upvotes: issue.upvotes - 1, affectedCount: issue.affectedCount - 1 } : issue
        )
      );
    });
  }, []);

  // Create new issue via API (with AI summary)
  const addIssue = useCallback(
    async (newIssue: Omit<Issue, "id" | "upvotes" | "affectedCount" | "createdAt" | "comments" | "isNew">) => {
      try {
        const res = await fetch("/api/issues", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newIssue),
        });
        if (!res.ok) throw new Error("Failed to create issue");
        const created: Issue = await res.json();
        setIssues((prev) => [{ ...created, isNew: true }, ...prev]);

        // Add to activity feed
        addActivity({
          type: "issue",
          title: `🚨 New Report: ${created.title}`,
          description: created.aiSummary || created.description,
          tag: created.category,
          icon: "campaign",
        });
      } catch (err) {
        console.error("[addIssue]", err);
        alert("Failed to submit issue. Please try again.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Fetch a single issue by ID
  const getIssue = useCallback(async (id: string): Promise<Issue | null> => {
    try {
      // Try in-memory cache first
      const cached = issues.find((i) => i.id === id);
      if (cached) return cached;

      const res = await fetch(`/api/issues/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }, [issues]);

  // Add a comment via API
  const addComment = useCallback(async (issueId: string, content: string): Promise<Comment | null> => {
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId, content, author: "Current User" }),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      return await res.json();
    } catch (err) {
      console.error("[addComment]", err);
      return null;
    }
  }, []);

  // Fetch comments for an issue from API
  const getComments = useCallback(async (issueId: string): Promise<Comment[]> => {
    try {
      const res = await fetch(`/api/comments?issueId=${issueId}`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }, []);

  const addActivity = useCallback((activity: Omit<Activity, "id" | "timestamp">) => {
    setActivities((prev) => [
      { ...activity, id: `act-${Date.now()}`, timestamp: "JUST NOW" },
      ...prev,
    ]);
  }, []);

  const addFeedback = useCallback((type: string, message: string) => {
    console.log("[Feedback]", type, message);
    alert("Feedback submitted successfully! Thank you.");
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        issues,
        activities,
        isLoading,
        upvoteIssue,
        addComment,
        addIssue,
        getIssue,
        getComments,
        addFeedback,
        addActivity,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
}
