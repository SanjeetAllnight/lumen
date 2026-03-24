"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useGlobal, type Issue, type Comment } from '@/components/GlobalProvider';
import { useToast } from '@/components/ToastProvider';

function timeAgo(dateString: string | undefined | null) {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export default function IssueDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { upvoteIssue, addComment, getIssue, getComments, issues } = useGlobal();
  const { showToast } = useToast();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isNotified, setIsNotified] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch issue and comments on mount / when id changes
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const [fetchedIssue, fetchedComments] = await Promise.all([
        getIssue(id),
        getComments(id),
      ]);
      setIssue(fetchedIssue);
      setComments(fetchedComments);
      setIsLoading(false);
    }
    load();
  }, [id, getIssue, getComments]);

  // Keep upvote count in sync with global state optimistic updates
  useEffect(() => {
    const globalIssue = issues.find(i => i.id === id);
    if (globalIssue) setIssue(globalIssue);
  }, [issues, id]);

  const handlePostComment = async () => {
    if (!issue || !newComment.trim()) return;
    const created = await addComment(issue.id, newComment);
    if (created) {
      setComments(prev => [...prev, created]);
    }
    setNewComment("");
  };

  const handleNotifyToggle = () => {
    setIsNotified(!isNotified);
    showToast(!isNotified ? 'You will be notified of updates in your notification bar' : 'Notifications cancelled', !isNotified ? 'success' : 'info', 'notifications');
  };

  const handleReply = (authorName: string) => {
    setNewComment(`@${authorName} `);
    textareaRef.current?.focus();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 min-h-[500px]">
        <span className="material-symbols-outlined text-5xl text-primary animate-spin mb-4">progress_activity</span>
        <p className="text-on-surface-variant font-medium">Loading issue...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 min-h-[500px]">
        <h2 className="text-3xl font-headline font-bold text-on-surface mb-4">Issue Not Found</h2>
        <Link href="/dashboard" className="text-primary hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  const statusLabel = issue.status === 'resolved' ? 'Resolved' : issue.status === 'in_progress' ? 'In Progress' : 'Reported';
  const statusColor = issue.status === 'resolved' ? 'bg-secondary text-on-secondary' : issue.status === 'in_progress' ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface';

  // Sort comments by likes desc
  const sortedComments = [...comments].sort((a, b) => b.likes - a.likes);

  return (
    <div className="flex-1 md:p-10 max-w-7xl mx-auto w-full">
      {/* Issue Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start">
        {/* Left Column: Media & Core Info */}
        <div className="lg:col-span-8 space-y-8">
          <div className="relative rounded-3xl overflow-hidden group border border-white/5">
            <div className="w-full h-[300px] bg-gradient-to-tr from-slate-900 to-indigo-950 flex items-center justify-center text-primary/10">
               <span className="material-symbols-outlined text-[100px]">image</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 pr-6">
              <span className={`px-3 py-1 backdrop-blur-md border text-[10px] font-bold rounded-full uppercase tracking-tighter mb-3 inline-block ${statusColor}`}>{statusLabel}</span>
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface leading-tight">{issue.title}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 py-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center font-bold text-purple-400 capitalize">
                {(issue.authorName || "S")[0]}
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Reported by</p>
                <p className="text-sm font-semibold">{issue.authorName || "Student Reporter"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-400">schedule</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Time Elapsed</p>
                <p className="text-sm font-semibold">{timeAgo(issue.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-400">location_on</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Location</p>
                <p className="text-sm font-semibold">{issue.location}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2rem] border border-outline-variant/10">
            <h3 className="text-lg font-headline font-bold mb-4 text-purple-200">AI Summary (Updated based on recent discussions)</h3>
            {issue.aiSummary && (
              <div className="flex items-start gap-3 mb-5 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <span className="material-symbols-outlined text-primary mt-0.5">auto_awesome</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">AI Assessed Details</p>
                  <p className="text-sm text-primary-fixed-dim/90 italic leading-relaxed">{issue.aiSummary}</p>
                </div>
              </div>
            )}
            <p className="text-on-surface-variant leading-relaxed font-body whitespace-pre-line">
              {issue.description}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <button onClick={() => upvoteIssue(issue.id)} className="flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-full transition-all group active:scale-95">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                <span className="text-sm font-bold text-primary">{issue.upvotes} Upvotes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Timeline */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status Card */}
          <div className="glass-panel p-6 rounded-[2rem] border border-outline-variant/10 glow-purple">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-on-surface">Live Status</h3>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_currentColor] ${issue.status === 'resolved' ? 'bg-secondary text-secondary' : issue.status === 'in_progress' ? 'bg-primary text-primary' : 'bg-error text-error'}`}></span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${issue.status === 'resolved' ? 'text-secondary' : issue.status === 'in_progress' ? 'text-primary' : 'text-error'}`}>{statusLabel}</span>
              </div>
            </div>

            <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary before:via-primary/50 before:to-surface-variant">
              <div className="relative pl-10">
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-outline-variant z-10 flex items-center justify-center ${issue.status === 'resolved' ? 'bg-secondary text-on-secondary shadow-[0_0_15px_rgba(74,248,227,0.6)] border-secondary' : 'bg-surface-variant text-transparent'}`}>
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <div className={issue.status === 'resolved' ? '' : 'opacity-40'}>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Resolved</p>
                  <p className="text-[10px] text-on-surface-variant">{issue.status === 'resolved' ? 'Issue has been successfully fixed' : 'Awaiting completion'}</p>
                </div>
              </div>

              <div className="relative pl-10">
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center ${issue.status === 'in_progress' || issue.status === 'resolved' ? 'bg-primary border-primary text-on-primary shadow-[0_0_15px_rgba(199,153,255,0.6)]' : 'bg-surface-variant border-outline-variant text-transparent'}`}>
                  <span className="material-symbols-outlined text-[14px]">handyman</span>
                </div>
                <div className={issue.status === 'in_progress' || issue.status === 'resolved' ? '' : 'opacity-40'}>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">In Progress</p>
                  <p className="text-[10px] text-on-surface-variant">{issue.status === 'in_progress' ? 'Maintenance crew dispatched' : issue.status === 'resolved' ? 'Work completed' : 'Pending review'}</p>
                  {issue.status === 'in_progress' && (
                    <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[11px] italic text-slate-400">"Technician dispatched to the location."</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-[14px] text-primary">report</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface uppercase tracking-widest">Reported</p>
                  <p className="text-[10px] text-on-surface-variant">{issue.status === 'reported' ? 'Has not been looked at yet' : 'Report received'}</p>
                </div>
              </div>
            </div>

            <button onClick={handleNotifyToggle} className={`w-full mt-10 py-4 font-bold rounded-2xl active:scale-95 text-xs uppercase tracking-widest transition-all shadow-xl ${isNotified ? 'bg-surface-variant text-on-surface hover:bg-white/5' : 'bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-primary/20'}`}>
              {isNotified ? 'Cancel Notification' : 'Notify Me of Updates'}
            </button>
          </div>

          {/* Micro Stats Bento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-outline-variant/10 text-center">
              <span className="material-symbols-outlined text-secondary mb-1">thumb_up</span>
              <p className="text-[10px] text-on-surface-variant uppercase font-bold">Upvotes</p>
              <p className="text-xl font-headline font-bold">{issue.upvotes}</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-outline-variant/10 text-center">
              <span className="material-symbols-outlined text-tertiary mb-1">chat</span>
              <p className="text-[10px] text-on-surface-variant uppercase font-bold">Comments</p>
              <p className="text-xl font-headline font-bold">{comments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <section className="max-w-4xl">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-headline font-bold">Discussion</h3>
            <span className="bg-primary/20 text-primary px-3 py-0.5 rounded-full text-xs font-bold">{comments.length} Live</span>
          </div>
        </div>

        <div className="space-y-8">
          {/* Comment Input */}
          <div className="relative flex gap-4 items-start mb-12">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-purple-900/40 font-bold uppercase text-white">
              S
            </div>
            <div className="flex-1 group">
              <textarea 
                 ref={textareaRef}
                 value={newComment} 
                 onChange={(e) => setNewComment(e.target.value)} 
                 className="w-full bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl p-5 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all min-h-[120px] backdrop-blur-sm" 
                 placeholder="Add a comment or update..."></textarea>
              <div className="flex justify-end items-center mt-3">
                <button onClick={handlePostComment} className="px-8 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:shadow-[0_0_20px_rgba(199,153,255,0.4)] transition-all active:scale-95 glow-primary-hover">Post Update</button>
              </div>
            </div>
          </div>

          {/* Live Thread Timeline */}
          <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-primary/30 before:via-outline-variant/10 before:to-transparent">
            {sortedComments.length === 0 && (
              <div className="pl-4 py-8 text-center text-on-surface-variant text-sm">No comments yet. Be the first to update!</div>
            )}
            {sortedComments.map((comment) => (
              <div key={comment.id} className="relative pl-14 group">
                <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl overflow-hidden border border-outline-variant/20 shadow-lg z-10 bg-surface-container-high flex items-center justify-center text-slate-400 capitalize font-bold">
                  {(comment.author || "S")[0]}
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/20 hover:bg-white/5 transition-all duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-bold text-purple-300">{comment.author}</h4>
                    <span className="text-[10px] text-on-surface-variant font-medium opacity-60">{timeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-4 whitespace-pre-line">{comment.content}</p>
                  <div className="flex items-center gap-6 pt-3 border-t border-white/5">
                    <button className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant hover:text-primary transition-all group/btn">
                      <span className="material-symbols-outlined text-sm group-hover/btn:scale-110 transition-transform">thumb_up</span>
                      {comment.likes}
                    </button>
                    <button onClick={() => handleReply(comment.author)} className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant hover:text-primary transition-all">
                      <span className="material-symbols-outlined text-sm">reply</span>
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
