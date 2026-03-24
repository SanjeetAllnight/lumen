import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-slate-900/60 backdrop-blur-xl shadow-[0_0_40px_-15px_rgba(199,153,255,0.3)] border-b border-purple-500/10">
      <div className="flex justify-between items-center px-6 py-3 w-full max-w-[1600px] mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent font-['Space_Grotesk'] tracking-tight">Pulse Observatory</Link>
          <div className="hidden md:flex items-center bg-surface-container-lowest px-4 py-1.5 rounded-full border border-outline-variant/20">
            <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder:text-slate-500 text-on-surface" placeholder="Search campus feed..." type="text"/>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 font-['Space_Grotesk'] text-sm tracking-tight">
          <Link className="text-purple-300 transition-all duration-300 hover:bg-white/5 px-3 py-1 rounded-lg" href="/dashboard">Feed</Link>
          <Link className="text-slate-400 transition-all duration-300 hover:bg-white/5 px-3 py-1 rounded-lg" href="/map">Map</Link>
          <Link className="text-slate-400 transition-all duration-300 hover:bg-white/5 px-3 py-1 rounded-lg" href="#reports">Reports</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-slate-400 hover:text-purple-400 transition-colors">notifications</button>
          <button className="material-symbols-outlined text-slate-400 hover:text-purple-400 transition-colors">settings</button>
          <button className="material-symbols-outlined text-slate-400 hover:text-purple-400 transition-colors">account_circle</button>
        </div>
      </div>
    </header>
  );
}
