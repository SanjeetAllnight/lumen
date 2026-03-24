export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 py-12 px-6 bg-surface-container-lowest/50 relative z-10">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-on-surface-variant text-sm font-medium">
        <div className="flex items-center gap-6">
          <span className="font-headline font-bold text-on-surface tracking-widest uppercase text-xs">Pulse Observatory</span>
          <span className="w-px h-4 bg-white/10 hidden md:block"></span>
          <span>System v2.4.0-kinetic</span>
        </div>
        <div className="flex items-center gap-8">
          <a className="hover:text-primary transition-colors" href="#privacy">Privacy Protocol</a>
          <a className="hover:text-primary transition-colors" href="#governance">Campus Governance</a>
          <a className="hover:text-primary transition-colors" href="#api">API Access</a>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span>Satellite Link Active</span>
        </div>
      </div>
    </footer>
  );
}
