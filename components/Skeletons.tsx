export function IssueSkeleton() {
  return (
    <div className="glass-panel rounded-3xl border border-outline-variant/10 p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-16 h-5 bg-white/10 rounded-full" />
        <div className="w-20 h-5 bg-white/5 rounded-full" />
      </div>
      <div className="w-3/4 h-6 bg-white/10 rounded-xl mb-3" />
      <div className="w-full h-4 bg-white/5 rounded-xl mb-2" />
      <div className="w-2/3 h-4 bg-white/5 rounded-xl mb-6" />
      <div className="flex items-center justify-between">
        <div className="w-28 h-10 bg-white/10 rounded-full" />
        <div className="w-16 h-5 bg-white/5 rounded-full" />
      </div>
    </div>
  );
}

export function HeroIssueSkeleton() {
  return (
    <div className="glass-panel rounded-[2rem] border border-outline-variant/10 p-8 animate-pulse mb-8">
      <div className="w-24 h-5 bg-white/10 rounded-full mb-4" />
      <div className="w-3/4 h-10 bg-white/10 rounded-2xl mb-4" />
      <div className="w-full h-4 bg-white/5 rounded-xl mb-2" />
      <div className="w-2/3 h-4 bg-white/5 rounded-xl mb-8" />
      <div className="flex items-center gap-4">
        <div className="w-36 h-14 bg-white/10 rounded-2xl" />
        <div className="w-40 h-5 bg-white/5 rounded-full" />
      </div>
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="relative pl-14 animate-pulse">
      <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-white/10" />
      <div className="glass-panel p-6 rounded-2xl border border-outline-variant/10">
        <div className="flex justify-between mb-3">
          <div className="w-24 h-4 bg-white/10 rounded-full" />
          <div className="w-12 h-4 bg-white/5 rounded-full" />
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full mb-2" />
        <div className="w-3/4 h-3 bg-white/5 rounded-full" />
      </div>
    </div>
  );
}

export function IssueListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <IssueSkeleton key={i} />
      ))}
    </div>
  );
}

export function EmptyIssues() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
        <span className="material-symbols-outlined text-5xl text-primary">inbox</span>
      </div>
      <h3 className="text-xl font-headline font-bold text-on-surface mb-2">No Issues Yet</h3>
      <p className="text-sm text-on-surface-variant max-w-xs">
        The campus feed is quiet right now. Use the <span className="text-primary font-bold">+</span> button to report the first issue.
      </p>
    </div>
  );
}

export function EmptyComments() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
        <span className="material-symbols-outlined text-3xl text-primary">forum</span>
      </div>
      <h3 className="text-base font-headline font-bold text-on-surface mb-1">Start the Discussion</h3>
      <p className="text-xs text-on-surface-variant max-w-xs">
        No comments yet. Be the first to share an update or your experience with this issue.
      </p>
    </div>
  );
}
