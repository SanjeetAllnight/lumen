"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

type Notification = {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
};

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
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const showSearch = ["/complaints", "/events", "/activity"].includes(pathname);
  const isAdminMode = pathname.startsWith("/admin");
  const { user } = useAuth();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const notifs: Notification[] = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      setNotifications(notifs);
    });
    return () => unsub();
  }, [user]);

  const markAsRead = async (id: string, read: boolean) => {
    if (read) return;
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
    } catch (e) {
      console.error("Failed to mark notification as read", e);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className={`fixed top-0 w-full z-50 bg-slate-900/60 backdrop-blur-xl ${isAdminMode ? 'shadow-[0_0_40px_-15px_rgba(239,68,68,0.3)] border-b border-red-500/20' : 'shadow-[0_0_40px_-15px_rgba(199,153,255,0.3)] border-b border-purple-500/10'}`}>
      <div className="flex justify-between items-center px-6 py-3 w-full max-w-[1600px] mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent font-['Space_Grotesk'] tracking-tight">Lumen</Link>
          {isAdminMode && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-[10px] font-black tracking-[0.2em] text-red-400 uppercase">Admin Mode</span>
            </div>
          )}
          {showSearch && (
            <div className="hidden md:flex items-center bg-surface-container-lowest px-4 py-1.5 rounded-full border border-outline-variant/20">
              <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder:text-slate-500 text-on-surface" placeholder="Search campus feed..." type="text"/>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 relative">
          <div ref={dropdownRef} className="relative flex items-center">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
              className={`material-symbols-outlined transition-colors relative ${unreadCount > 0 ? 'text-primary' : 'text-slate-400 hover:text-purple-400'}`}
              style={unreadCount > 0 ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              notifications
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[9px] font-bold text-white shadow-lg shadow-error/40 border border-slate-900 border-opacity-60">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 top-full mt-4 w-80 bg-surface-container-high border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden glass-panel z-50">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-surface-container">
                  <h4 className="text-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">notifications</span>
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>
                  )}
                </div>
                <div className="p-2 space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-on-surface-variant flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-4xl opacity-30">notifications_paused</span>
                      <p className="text-sm text-on-surface-variant">You're all caught up!</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => markAsRead(n.id, n.read)}
                        className={`p-3 rounded-xl cursor-default transition-all flex flex-col gap-1 border ${
                          n.read 
                            ? 'bg-transparent border-transparent opacity-60' 
                            : 'bg-primary/5 hover:bg-primary/10 border-primary/20 cursor-pointer'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className={`text-xs ${n.read ? 'text-on-surface-variant' : 'text-on-surface font-semibold'}`}>
                            {n.message}
                          </p>
                          {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1 shadow-[0_0_8px_0_rgba(199,153,255,0.8)]" />}
                        </div>
                        <p className="text-[10px] text-on-surface-variant/70 font-medium tracking-wide">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                    ))
                  )}
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
