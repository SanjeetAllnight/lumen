"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGlobal } from '@/components/GlobalProvider';
import { IssueListSkeleton } from '@/components/Skeletons';
import { useState, useEffect, useMemo } from 'react';

export default function ComplaintsPage() {
  const router = useRouter();
  const { issues, upvoteIssue, isLoading } = useGlobal();

  const [activeTab, setActiveTab] = useState<"trending" | "recent" | "my">("trending");
  const [recentOrder, setRecentOrder] = useState<"desc" | "asc">("desc");
  const [selectedSector, setSelectedSector] = useState<string>("All Sectors");
  const [myReportIds, setMyReportIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = JSON.parse(localStorage.getItem("my_reported_issues") || "[]");
      setMyReportIds(stored);
    }
  }, [issues]); // Re-check when issues update

  const locations = useMemo(() => {
    return ["All Sectors", ...Array.from(new Set(issues.map(i => i.location))).filter(Boolean)];
  }, [issues]);

  const filteredAndSortedIssues = useMemo(() => {
    let result = issues.filter(issue => {
      // Filter My Reports
      if (activeTab === "my" && !myReportIds.includes(issue.id)) return false;
      // Filter Sectors
      if (selectedSector !== "All Sectors" && issue.location !== selectedSector) return false;
      return true;
    });

    result.sort((a, b) => {
      if (activeTab === "trending" || activeTab === "my") {
        return b.upvotes - a.upvotes;
      } else {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return recentOrder === "desc" ? timeB - timeA : timeA - timeB;
      }
    });

    return result;
  }, [issues, activeTab, selectedSector, recentOrder, myReportIds]);

  if (isLoading) {
    return (
      <div className="px-8 pb-12 w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-headline font-bold text-on-surface mb-2">Campus Grievances</h2>
            <p className="text-on-surface-variant font-medium">Real-time status of reported issues across the ecosystem.</p>
          </div>
        </div>
        <IssueListSkeleton count={5} />
      </div>
    );
  }

  const activeIssuesCount = issues.filter(i => i.status !== "resolved").length;
  const inProgressCount = issues.filter(i => i.status === "in_progress").length;
  const reportedCount = issues.filter(i => i.status === "reported").length;

  return (
    <div className="px-8 pb-12 w-full">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-headline font-bold text-on-surface mb-2">Campus Grievances</h2>
          <p className="text-on-surface-variant font-medium">Real-time status of reported issues across the ecosystem.</p>
        </div>
        <button onClick={() => document.dispatchEvent(new Event('openReportModal'))} className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-6 py-3.5 rounded-full font-headline font-bold text-sm tracking-wide shadow-[0_0_30px_-5px_rgba(199,153,255,0.5)] active:scale-95 transition-all">
          <span className="material-symbols-outlined">add_circle</span>
          REPORT ISSUE
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex bg-surface-container-high p-1 rounded-full">
          <button onClick={() => setActiveTab("trending")} className={`px-6 py-2 rounded-full font-bold text-xs tracking-wider transition-colors ${activeTab === "trending" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"}`}>
            TRENDING
          </button>
          <button onClick={() => setActiveTab("recent")} className={`px-6 py-2 rounded-full font-bold text-xs tracking-wider transition-colors flex items-center gap-1 ${activeTab === "recent" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"}`}>
            RECENT
            {activeTab === "recent" && (
              <span className="material-symbols-outlined text-[14px] cursor-pointer hover:text-white" onClick={(e) => { e.stopPropagation(); setRecentOrder(prev => prev === "desc" ? "asc" : "desc"); }}>
                {recentOrder === "desc" ? "arrow_downward" : "arrow_upward"}
              </span>
            )}
          </button>
          <button onClick={() => setActiveTab("my")} className={`px-6 py-2 rounded-full font-bold text-xs tracking-wider transition-colors ${activeTab === "my" ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"}`}>
            MY REPORTS
          </button>
        </div>
        <div className="h-8 w-[1px] bg-outline-variant/30 mx-2"></div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-lg text-on-surface-variant">location_on</span>
          </div>
          <select 
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="pl-10 pr-10 py-2 bg-transparent border border-outline-variant/30 rounded-full text-xs font-bold tracking-widest uppercase text-on-surface hover:bg-surface-variant/30 transition-all appearance-none cursor-pointer focus:outline-none"
          >
            {locations.map(loc => (
              <option key={loc} value={loc} className="bg-surface-container text-on-surface">{loc}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-lg text-on-surface-variant">expand_more</span>
          </div>
        </div>
      </div>

      {/* Stats Summary - Now spanning full width since Insights is removed */}
      <div className="mb-8">
        <div className="glass-panel p-6 rounded-[2rem] border border-outline-variant/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-secondary uppercase mb-2 block">LIVE CAMPUS STATUS</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-headline font-bold">{activeIssuesCount}</span>
              <span className="text-on-surface-variant text-sm">Active Issues</span>
            </div>
          </div>
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="h-2 bg-surface-container rounded-full overflow-hidden w-full relative">
              <div 
                className="absolute top-0 left-0 h-full bg-primary" 
                style={{ width: `${Math.min(100, (inProgressCount / Math.max(1, activeIssuesCount)) * 100)}%` }}
              ></div>
              <div 
                className="absolute top-0 h-full bg-secondary" 
                style={{ 
                  left: `${Math.min(100, (inProgressCount / Math.max(1, activeIssuesCount)) * 100)}%`,
                  width: `${Math.min(100, (reportedCount / Math.max(1, activeIssuesCount)) * 100)}%` 
                }}
              ></div>
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-bold text-on-surface-variant">
              <span>{inProgressCount} IN PROGRESS</span>
              <span>{reportedCount} PENDING ACTION</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {filteredAndSortedIssues.length === 0 ? (
          <div className="xl:col-span-12 glass-panel p-12 text-center rounded-[2.5rem] border border-outline-variant/20 flex flex-col items-center justify-center min-h-[400px]">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">check_circle</span>
            <h3 className="text-2xl font-headline font-bold text-on-surface-variant">No Issues Found</h3>
            <p className="text-on-surface-variant/80 mt-2">There are no complaints matching your current filters.</p>
          </div>
        ) : (
          filteredAndSortedIssues.map((issue, index) => {
            // Give the first item in Trending a larger layout
            const isTopTrending = activeTab === "trending" && index === 0;

            if (isTopTrending) {
              return (
                <div key={issue.id} onClick={() => router.push(`/issue/${issue.id}`)} className="xl:col-span-12 group cursor-pointer mb-4">
                  <div className="glass-panel p-8 rounded-[2.5rem] border-[3px] border-primary/40 relative overflow-hidden card-interaction-hover bg-gradient-to-br from-primary/10 via-surface-container/50 to-surface-container shadow-2xl shadow-primary/10">
                    <div className="flex items-start gap-8 mb-8">
                      <div className="p-6 rounded-[2rem] bg-primary text-on-primary flex-shrink-0 shadow-2xl shadow-primary/30">
                        <span className="material-symbols-outlined text-4xl">campaign</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold tracking-widest text-primary uppercase block">{issue.category} • {issue.location}</span>
                          <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{issue.status}</div>
                        </div>
                        <h3 className="text-4xl font-headline font-bold mb-4">{issue.title}</h3>
                        <p className="text-on-surface-variant leading-relaxed text-lg">
                          {issue.aiSummary ? (
                            <><span className="text-primary font-bold">AI Summary:</span> {issue.aiSummary}</>
                          ) : (
                            issue.description
                          )}
                        </p>
                      </div>
                    </div>
                    {/* Interactions Row */}
                    <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-outline-variant/20">
                      <button onClick={(e) => { e.stopPropagation(); upvoteIssue(issue.id); }} className="flex items-center gap-4 px-10 py-5 rounded-2xl bg-primary text-on-primary font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_-5px_rgba(199,153,255,0.8)]">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                        <span className="text-2xl">{issue.upvotes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Regular Issue Card
            return (
              <div key={issue.id} onClick={() => router.push(`/issue/${issue.id}`)} className="xl:col-span-4 cursor-pointer">
                <div className="glass-panel p-6 rounded-[2.5rem] border border-outline-variant/20 h-full flex flex-col card-interaction-hover group bg-surface-container/30">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 rounded-2xl bg-surface-variant text-on-surface shadow-lg shadow-black/10">
                      <span className="material-symbols-outlined text-2xl">
                        {issue.category === "IT" ? "wifi_off" : issue.category === "Security" ? "security" : "build"}
                      </span>
                    </div>
                    <div className="bg-white/10 text-on-surface px-3 py-1.5 rounded-full text-[10px] font-black border border-white/20 uppercase tracking-widest">{issue.status}</div>
                  </div>
                  <h4 className="text-xl font-headline font-bold mb-3 group-hover:text-primary transition-colors">{issue.title}</h4>
                  <p className="text-sm text-on-surface-variant mb-6 leading-relaxed flex-1">
                    {issue.aiSummary || (issue.description.length > 100 ? issue.description.substring(0, 100) + "..." : issue.description)}
                  </p>
                  <div className="mt-auto pt-6 border-t border-outline-variant/10 flex flex-col gap-6">
                    <button onClick={(e) => { e.stopPropagation(); upvoteIssue(issue.id); }} className="flex items-center gap-3 px-6 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all shadow-lg shadow-primary/5 border border-primary/20 w-fit">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                      <span className="text-lg font-bold">{issue.upvotes}</span>
                    </button>
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-on-surface-variant px-3 py-1 uppercase tracking-widest leading-none bg-black/20 rounded-lg">
                        {issue.location}
                      </div>
                      <button className="text-primary text-[10px] font-black tracking-[0.2em] uppercase hover:underline decoration-2 underline-offset-4">VIEW THREAD</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
