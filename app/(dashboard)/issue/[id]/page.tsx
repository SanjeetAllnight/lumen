"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useGlobal, getStatusConfig, type Issue, type Comment } from '@/components/GlobalProvider';
import { useToast } from '@/components/ToastProvider';
import { useAuth } from '@/components/AuthProvider';

function timeAgo(dateString: string | undefined | null): string {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Just now';
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return 'Just now';
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) > 1 ? 's' : ''} ago`;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'resolved') return (
    <span className="px-3 py-1 bg-secondary/20 backdrop-blur-md border border-secondary/40 text-secondary text-[10px] font-bold rounded-full uppercase tracking-tighter inline-block">Resolved</span>
  );
  if (status === 'in_progress') return (
    <span className="px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/40 text-primary text-[10px] font-bold rounded-full uppercase tracking-tighter inline-block">In Progress</span>
  );
  return (
    <span className="px-3 py-1 bg-error/20 backdrop-blur-md border border-error/30 text-error text-[10px] font-bold rounded-full uppercase tracking-tighter inline-block">Reported</span>
  );
}

export default function IssueDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { upvoteIssue, addComment, getIssue, getComments, issues, currentUserId } = useGlobal();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isNotified, setIsNotified] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Keep upvote count in sync with global optimistic updates
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

  // Seed isNotified from Firestore subscribers array (persists across reload)
  useEffect(() => {
    if (!issue || !user) return;
    setIsNotified((issue.subscribers ?? []).includes(user.uid));
  }, [issue, user]);

  const handleNotifyToggle = async () => {
    if (!user) {
      showToast('Sign in to subscribe to notifications', 'error', 'login');
      return;
    }
    const next = !isNotified;
    setIsNotified(next);  // optimistic
    try {
      const body = next
        ? { addSubscriber: user.uid }
        : { removeSubscriber: user.uid };
      const res = await fetch(`/api/issues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('patch failed');
      showToast(
        next ? 'You will be notified of updates for this issue' : 'Notifications cancelled',
        next ? 'success' : 'info',
        'notifications'
      );
    } catch {
      setIsNotified(!next);  // rollback on error
      showToast('Failed to update notification preference', 'error', 'error');
    }
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

  const currentStatusConf = getStatusConfig(issue.status);
  const timeline = [...(issue.updates || [])].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const fullTimeline = [...timeline, { status: "reported", note: `Issue reported by Alex Rivera`, timestamp: issue.createdAt }];
  const sortedComments = [...comments].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
  const hasUpvoted = issue.upvotedBy?.includes(currentUserId) ?? false;

  return (
    <div className="flex-1 md:p-10 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start">
        {/* LEFT: Main content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Issue hero */}
          <div className="relative rounded-3xl overflow-hidden border border-white/5 min-h-[220px] flex flex-col justify-end">
            {issue.imageUrl ? (
              <>
                <img
                  src={issue.imageUrl}
                  alt={issue.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
                <div className="w-full h-full opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(199,153,255,0.5) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
              </div>
            )}
            <div className="relative p-8">
              <StatusBadge status={issue.status} />
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface leading-tight mt-3">{issue.title}</h1>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-6 py-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary capitalize text-sm">
                {(issue.authorName || "S")[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Reported by</p>
                <p className="text-sm font-semibold">{issue.authorName || "Student Reporter"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-400 text-base">schedule</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Time Elapsed</p>
                <p className="text-sm font-semibold">{timeAgo(issue.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-400 text-base">location_on</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Location</p>
                <p className="text-sm font-semibold">{issue.location}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="glass-panel p-8 rounded-[2rem] border border-outline-variant/10">
            <p className="text-on-surface-variant leading-relaxed font-body whitespace-pre-line">{issue.description}</p>
            <div className="mt-8">
              <button
                onClick={() => upvoteIssue(issue.id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-full transition-all duration-200 group active:scale-95 ${
                  hasUpvoted
                    ? 'bg-red-500/15 hover:bg-red-500/25 border border-red-500/50 hover:border-red-500/70'
                    : 'bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/50 hover:border-emerald-500/70'
                }`}
              >
                <span
                  className={`material-symbols-outlined transition-all group-hover:scale-110 ${
                    hasUpvoted ? 'text-red-400' : 'text-emerald-400'
                  }`}
                  style={{ fontVariationSettings: hasUpvoted ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {hasUpvoted ? 'thumb_down' : 'thumb_up'}
                </span>
                <span className={`text-sm font-bold transition-colors ${
                  hasUpvoted ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {hasUpvoted ? `${issue.upvotes} · Dismiss Issue` : `${issue.upvotes} · Support Issue`}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Status card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-[2rem] border border-outline-variant/10 glow-purple">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-on-surface">Live Status</h3>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${currentStatusConf.bg} shadow-[0_0_10px_currentColor] ${currentStatusConf.color} animate-pulse`}></span>
                <span className={`text-[10px] font-bold ${currentStatusConf.color} uppercase tracking-widest`}>{currentStatusConf.label}</span>
              </div>
            </div>

            <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary before:via-primary/50 before:to-surface-variant">
              {fullTimeline.map((item, idx) => {
                const conf = getStatusConfig(item.status);
                const isLatest = idx === 0;
                
                return (
                  <div key={idx} className={`relative pl-10 ${!isLatest ? 'opacity-60' : ''}`}>
                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full ${isLatest ? conf.bg : conf.bgLight} ${isLatest ? '' : `border-2 ${conf.border}`} flex items-center justify-center z-10 ${isLatest && item.status !== 'dismissed' ? `shadow-[0_0_15px] ${conf.shadow}` : ''}`}>
                      <span className={`material-symbols-outlined text-[14px] ${isLatest ? 'text-on-primary' : conf.color} ${isLatest ? 'font-bold' : ''}`}>{conf.icon}</span>
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isLatest ? conf.color : 'text-on-surface'} uppercase tracking-widest`}>{conf.label}</p>
                      <p className="text-[10px] text-on-surface-variant">
                        {new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                      {item.note && (
                        <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/5">
                          <p className="text-[11px] italic text-slate-400">"{item.note}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleNotifyToggle}
              className={`w-full mt-10 py-4 font-bold rounded-2xl text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 ${
                isNotified
                  ? 'bg-white/5 text-on-surface border border-white/10 hover:bg-white/10'
                  : 'bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-xl shadow-primary/20 hover:brightness-110'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: isNotified ? "'FILL' 0" : "'FILL' 1" }}>
                  {isNotified ? 'notifications_off' : 'notifications'}
                </span>
                {isNotified ? 'Cancel Notification' : 'Notify Me of Updates'}
              </span>
            </button>
          </div>

          {/* Stats */}
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

      {/* Discussion */}
      <section className="max-w-4xl mb-16">
        <div className="flex items-center gap-3 mb-10">
          <h3 className="text-2xl font-headline font-bold">Discussion</h3>
          <span className="bg-primary/20 text-primary px-3 py-0.5 rounded-full text-xs font-bold">{comments.length} comments</span>
        </div>

        {/* Comment input */}
        <div className="flex gap-4 items-start mb-12">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-purple-900/40 font-bold text-white text-sm">
            You
          </div>
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handlePostComment(); }}
              className="w-full bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl p-5 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all min-h-[120px] backdrop-blur-sm resize-none"
              placeholder="Add a comment... (Ctrl+Enter to post)"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handlePostComment}
                disabled={!newComment.trim()}
                className="px-8 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:shadow-[0_0_20px_rgba(199,153,255,0.4)] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>

        {/* Comment thread — Twitter-style */}
        <div className="relative before:absolute before:left-6 before:top-4 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-primary/30 before:via-outline-variant/10 before:to-transparent">
          {sortedComments.length === 0 && (
            <div className="pl-4 py-10 text-center text-on-surface-variant text-sm">No comments yet. Be the first to share an update!</div>
          )}
          {sortedComments.map((comment, idx) => (
            <div
              key={comment.id}
              className="relative pl-16 group"
              style={{ marginBottom: idx < sortedComments.length - 1 ? '1.5rem' : 0 }}
            >
              {/* Avatar */}
              <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl border border-outline-variant/20 shadow-lg z-10 bg-surface-container-high flex items-center justify-center font-bold capitalize text-purple-300 text-sm">
                {(comment.author || "?")[0].toUpperCase()}
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-outline-variant/10 hover:border-primary/20 hover:bg-white/[0.03] transition-all duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-purple-300">{comment.author || "Anonymous"}</span>
                    {idx === 0 && comments.length > 1 && (
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">Top Comment</span>
                    )}
                  </div>
                  <span className="text-[10px] text-on-surface-variant/60">{timeAgo(comment.createdAt)}</span>
                </div>

                {/* Body */}
                <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{comment.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-5 mt-4 pt-3 border-t border-white/5">
                  <button className="flex items-center gap-1.5 text-[11px] font-bold text-on-surface-variant hover:text-primary transition-all group/btn active:scale-95">
                    <span className="material-symbols-outlined text-sm group-hover/btn:scale-110 transition-transform">thumb_up</span>
                    {comment.likes ?? 0}
                  </button>
                  <button
                    onClick={() => handleReply(comment.author)}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-on-surface-variant hover:text-primary transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-sm">reply</span>
                    Reply
                  </button>
                </div>
              </div>

              {/* Twitter-style thread connector line between comments */}
              {idx < sortedComments.length - 1 && (
                <div className="absolute left-6 top-14 bottom-[-1.5rem] w-[2px] bg-gradient-to-b from-outline-variant/30 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
