"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { name: "Live Map", href: "/map", icon: "explore" },
    { name: "Complaints", href: "/complaints", icon: "report_problem" },
    { name: "Events", href: "/events", icon: "event_note" },
    { name: "Activity", href: "/activity", icon: "insights" },
  ];

  const adminLinks = [
    { name: "Issue Management", href: "/admin", icon: "gavel" },
    { name: "Pending Events", href: "/admin/pending-events", icon: "pending_actions" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-40 bg-slate-950/40 backdrop-blur-2xl border-r border-slate-800/50 hidden lg:flex flex-col pt-20 pb-8 px-4 shadow-2xl shadow-purple-900/20">
      <nav className="flex-1 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-['Manrope'] font-medium text-sm transition-all ease-out duration-300 ${
                isActive
                  ? "text-purple-400 border-r-2 border-purple-500 bg-purple-500/10 shadow-[inset_-10px_0_20px_-10px_rgba(199,153,255,0.2)]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined" data-icon={link.icon}>{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          );
        })}

        {user?.role === "admin" && (
          <div className="mt-8 mb-2">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-red-500/80 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              Admin Panel
            </h3>
            <div className="space-y-1">
              {adminLinks.map((link) => {
                const isActive = pathname === link.href || (link.href === "/admin" && pathname === "/admin") || pathname.startsWith(link.href + "/")|| (link.href !== "/admin" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-['Manrope'] font-medium text-sm transition-all ease-out duration-300 ${
                      isActive
                        ? "text-red-400 border-r-2 border-red-500 bg-red-500/10 shadow-[inset_-10px_0_20px_-10px_rgba(239,68,68,0.2)]"
                        : "text-slate-500 hover:text-red-300 hover:bg-white/5"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]" data-icon={link.icon}>{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User info + logout */}
      <div className="mt-auto px-2 space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-sm">person</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-300 truncate">{user.displayName || "User"}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to sign out?")) {
              logout();
            }
          }}
          className="w-full py-3 flex items-center justify-center gap-2 bg-error-container text-on-error-container rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-error/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
