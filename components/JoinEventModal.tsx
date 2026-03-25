"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ToastProvider";

const DEPARTMENTS = ["COMP", "IT", "ENE", "ETC", "MECH", "CIVIL"];

type Props = {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
  onJoined: () => void; // called after successful join to refresh count
};

export default function JoinEventModal({ eventId, eventTitle, onClose, onJoined }: Props) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [department, setDepartment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deptError, setDeptError] = useState(false);

  // Prevent body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department) {
      setDeptError(true);
      return;
    }
    if (!user) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${eventId}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          name: user.displayName || "User",
          email: user.email || "",
          department,
        }),
      });

      if (res.status === 409) {
        showToast("You've already registered for this event.", "error", "info");
        onClose();
        return;
      }
      if (!res.ok) throw new Error("registration failed");

      showToast("Successfully registered for event! 🎉", "success", "check_circle");
      onJoined();
      onClose();
    } catch {
      showToast("Failed to register. Please try again.", "error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase = "w-full bg-surface-container-high border rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none transition-colors";

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-surface-container-low border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col modal-enter">

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-container">
          <div>
            <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">group_add</span>
              I&apos;m Interested
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">{eventTitle}</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Name — read-only */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
              Name
            </label>
            <div className={`${inputBase} border-white/10 bg-surface-container cursor-not-allowed flex items-center gap-2`}>
              <span className="material-symbols-outlined text-sm text-primary">person</span>
              <span className="text-on-surface">{user?.displayName || "—"}</span>
              <span className="ml-auto text-[9px] text-on-surface-variant/50 font-bold uppercase tracking-widest">Auto</span>
            </div>
          </div>

          {/* Email — read-only */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
              Email
            </label>
            <div className={`${inputBase} border-white/10 bg-surface-container cursor-not-allowed flex items-center gap-2`}>
              <span className="material-symbols-outlined text-sm text-primary">mail</span>
              <span className="text-on-surface">{user?.email || "—"}</span>
              <span className="ml-auto text-[9px] text-on-surface-variant/50 font-bold uppercase tracking-widest">Auto</span>
            </div>
          </div>

          {/* Department — required */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
              Department <span className="text-error">*</span>
            </label>
            <select
              value={department}
              onChange={(e) => { setDepartment(e.target.value); setDeptError(false); }}
              className={`${inputBase} appearance-none custom-select ${deptError ? "field-error field-shake" : "border-white/10"}`}
            >
              <option value="" disabled>Select your department…</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {deptError && (
              <p className="text-error text-[11px] mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">error</span>
                Please select your department
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-tap"
          >
            {submitting ? (
              <><span className="material-symbols-outlined text-xl animate-spin">progress_activity</span> Registering…</>
            ) : (
              <><span className="material-symbols-outlined">how_to_reg</span> Confirm Registration</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
