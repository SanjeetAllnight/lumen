"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useGlobal, getStatusConfig, type Issue, type Comment } from '@/components/GlobalProvider';

export default function IssueDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { upvoteIssue, addComment, getIssue, getComments, issues } = useGlobal();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="flex-1 md:p-10 max-w-7xl mx-auto w-full">
      {/* Issue Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start">
        {/* Left Column: Media & Core Info */}
        <div className="lg:col-span-8 space-y-8">
          <div className="relative rounded-3xl overflow-hidden group">
            <img 
              className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" 
              alt="broken elevator" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ1vZVAPBxZG0qHMWM1LGx8-ilepevop4Qdgw84Vf-VdF1RYEWPZGDEZargpGLnAGU73sxTeuiD4wReEZ_RMig-STa_AA_3mZOOVwQoQme4VSYEerWSFo4LzA7cVssQ4pcG1J9CZmoHTAbLQjIxSCeeDl2DzrqK9AbW5kK5XtIjHFTBBfy5OAqdXcV49ncpKnCrTvDdQ5jZ4bbPya6XzxtaX8Ee2zdds_LQAXJXKi72ixYa6WpbbBUWFpHharY6zCnsnp0rIUn1d4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-6 left-6">
              <span className={`px-3 py-1 ${currentStatusConf.bgLight} backdrop-blur-md border ${currentStatusConf.border}/30 ${currentStatusConf.color} text-[10px] font-bold rounded-full uppercase tracking-tighter mb-3 inline-block`}>{currentStatusConf.label}</span>
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface leading-tight">{issue.title}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 py-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-400">person</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Reported by</p>
                <p className="text-sm font-semibold">Alex Rivera</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-400">schedule</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Time Elapsed</p>
                <p className="text-sm font-semibold">4 hours ago</p>
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
            <h3 className="text-lg font-headline font-bold mb-4 text-purple-200">Summary from multiple reports</h3>
            {issue.aiSummary && (
              <div className="flex items-start gap-3 mb-5 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <span className="material-symbols-outlined text-primary mt-0.5">auto_awesome</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">AI Summary</p>
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
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-700"></div>
                <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-600"></div>
                <div className="w-8 h-8 rounded-full border-2 border-background bg-slate-500"></div>
                <div className="w-8 h-8 rounded-full border-2 border-background bg-surface-variant flex items-center justify-center text-[10px] font-bold">+21</div>
              </div>
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

            <button className="w-full mt-10 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-2xl active:scale-95 transition-all shadow-xl shadow-primary/20">
              Notify Me of Updates
            </button>
          </div>

          {/* Micro Stats Bento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-outline-variant/10 text-center">
              <span className="material-symbols-outlined text-secondary mb-1">group</span>
              <p className="text-[10px] text-on-surface-variant uppercase font-bold">Affected</p>
              <p className="text-xl font-headline font-bold">{issue.affectedCount ?? 0}</p>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-outline-variant/10 text-center">
              <span className="material-symbols-outlined text-tertiary mb-1">timer</span>
              <p className="text-[10px] text-on-surface-variant uppercase font-bold">Est. Fix</p>
              <p className="text-xl font-headline font-bold">2h</p>
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
          <div className="flex p-1 bg-surface-container-highest/50 rounded-full border border-white/5">
            <button className="px-5 py-1.5 text-xs font-bold bg-white/10 rounded-full shadow-lg transition-all">Newest</button>
            <button className="px-5 py-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-all">Trending</button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Comment Input */}
          <div className="relative flex gap-4 items-start mb-12">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-purple-900/40">
              <span className="material-symbols-outlined text-white">person</span>
            </div>
            <div className="flex-1 group">
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className="w-full bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl p-5 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all min-h-[120px] backdrop-blur-sm" placeholder="Add a comment or update..."></textarea>
              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-2">
                  <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-white/5">
                    <span className="material-symbols-outlined text-xl">image</span>
                  </button>
                  <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-white/5">
                    <span className="material-symbols-outlined text-xl">alternate_email</span>
                  </button>
                </div>
                <button onClick={handlePostComment} className="px-8 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:shadow-[0_0_20px_rgba(199,153,255,0.4)] transition-all active:scale-95 glow-primary-hover">Post Update</button>
              </div>
            </div>
          </div>

          {/* Live Thread Timeline */}
          <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-primary/30 before:via-outline-variant/10 before:to-transparent">
            {comments.length === 0 && (
              <div className="pl-4 py-8 text-center text-on-surface-variant text-sm">No comments yet. Be the first to update!</div>
            )}
            {comments.map((comment) => (
              <div key={comment.id} className="relative pl-14 group">
                <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl overflow-hidden border border-outline-variant/20 shadow-lg z-10 bg-surface-container-high flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined">{comment.avatar || "person"}</span>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/20 hover:bg-white/5 transition-all duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-bold text-purple-300">{comment.author}</h4>
                    <span className="text-[10px] text-on-surface-variant font-medium opacity-60">{comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{comment.content}</p>
                  <div className="flex items-center gap-6 pt-3 border-t border-white/5">
                    <button className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant hover:text-primary transition-all group/btn">
                      <span className="material-symbols-outlined text-sm group-hover/btn:scale-110 transition-transform">thumb_up</span>
                      {comment.likes}
                    </button>
                    <button className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant hover:text-primary transition-all">
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
