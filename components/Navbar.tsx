"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const showSearch = ["/complaints", "/events", "/activity"].includes(pathname);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-slate-900/60 backdrop-blur-xl shadow-[0_0_40px_-15px_rgba(199,153,255,0.3)] border-b border-purple-500/10">
      <div className="flex justify-between items-center px-6 py-3 w-full max-w-[1600px] mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent font-['Space_Grotesk'] tracking-tight">Lumen</Link>
          {showSearch && (
            <div className="hidden md:flex items-center bg-surface-container-lowest px-4 py-1.5 rounded-full border border-outline-variant/20">
              <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder:text-slate-500 text-on-surface" placeholder="Search campus feed..." type="text"/>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 relative">
          <div ref={dropdownRef} className="relative flex items-center">
            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="material-symbols-outlined text-slate-400 hover:text-purple-400 transition-colors">notifications</button>
            {isNotificationsOpen && (
              <div className="absolute right-0 top-full mt-4 w-72 bg-surface-container-high border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-panel">
                <div className="p-4 border-b border-white/5">
                  <h4 className="text-sm font-bold text-on-surface">Notifications</h4>
                </div>
                <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                  <div className="p-3 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors">
                    <div className="text-xs font-bold text-on-surface">Main Gate Resolved</div>
                    <div className="text-[10px] text-on-surface-variant mt-1">WiFi Connectivity is back to 100%.</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors">
                    <div className="text-xs font-bold text-on-surface">New Event Match</div>
                    <div className="text-[10px] text-on-surface-variant mt-1">Jazz night added based on your interests.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button onClick={() => router.push('/settings')} className="material-symbols-outlined text-slate-400 hover:text-purple-400 transition-colors flex items-center">settings</button>
          <button onClick={() => router.push('/profile')} className="material-symbols-outlined text-slate-400 hover:text-purple-400 transition-colors flex items-center">account_circle</button>
        </div>
      </div>
    </header>
  );
}
