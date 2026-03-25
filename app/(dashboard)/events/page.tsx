"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";

// ─── Types ────────────────────────────────────────────────────────────────────

type Event = {
  id: string;
  title: string;
  description: string;
  date: string | null;
  location: string;
  imageUrl: string;
  coordinatorName: string;
  coordinatorPhone: string;
  coordinatorEmail: string;
  status: "pending" | "approved" | "rejected";
  createdBy: string;
};

// ─── Event Card ───────────────────────────────────────────────────────────────

function EventCard({ event }: { event: Event }) {
  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : "Date TBD";

  return (
    <div className="glass-panel rounded-[2.5rem] overflow-hidden flex flex-col glow-border border border-white/5 group">
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-container-high">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-highest">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant opacity-30">event</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/80 bg-surface-dim/60 backdrop-blur-md px-3 py-1 rounded-full">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="font-headline text-xl font-bold text-on-surface mb-1 leading-snug">{event.title}</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{event.description}</p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-sm text-primary">location_on</span>
          <span>{event.location}</span>
        </div>

        {/* Coordinator Info */}
        <div className="mt-auto pt-4 border-t border-white/5 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Coordinator</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="material-symbols-outlined text-sm text-secondary">person</span>
            <span className="text-on-surface font-semibold">{event.coordinatorName || "—"}</span>
          </div>
          {event.coordinatorPhone && (
            <div className="flex items-center gap-2 text-xs">
              <span className="material-symbols-outlined text-sm text-secondary">call</span>
              <a href={`tel:${event.coordinatorPhone}`} className="text-on-surface-variant hover:text-primary transition-colors">
                {event.coordinatorPhone}
              </a>
            </div>
          )}
          {event.coordinatorEmail && (
            <div className="flex items-center gap-2 text-xs">
              <span className="material-symbols-outlined text-sm text-secondary">mail</span>
              <a href={`mailto:${event.coordinatorEmail}`} className="text-on-surface-variant hover:text-primary transition-colors truncate">
                {event.coordinatorEmail}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add Event Modal ──────────────────────────────────────────────────────────

function AddEventModal({ onClose, onSubmitted, userId }: { onClose: () => void; onSubmitted: () => void; userId: string }) {
  const [form, setForm] = useState({
    title: "", description: "", date: "", location: "",
    coordinatorName: "", coordinatorPhone: "", coordinatorEmail: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) {
      setError("Only JPG and PNG images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }
    setError("");
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.location) {
      setError("Event name and location are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl: imagePreview, createdBy: userId }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSuccess(true);
      onSubmitted();
      setTimeout(onClose, 2000);
    } catch {
      setError("Failed to submit event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full bg-surface-container-high border border-white/10 rounded-2xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/60 transition-colors";
  const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl rounded-[2.5rem] border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-headline text-2xl font-bold text-on-surface">Submit New Event</h2>
              <p className="text-xs text-on-surface-variant mt-1">Your event will be reviewed before publishing.</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full glass-panel border border-white/10 hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">close</span>
            </button>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <span className="material-symbols-outlined text-6xl text-secondary">check_circle</span>
              <p className="font-headline text-xl font-bold text-on-surface">Event Submitted!</p>
              <p className="text-sm text-on-surface-variant text-center">Your event is pending admin approval and will appear in the list once approved.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={labelClass}>Event Name *</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Annual Tech Fest" className={inputClass} required />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Brief description of the event..." rows={3} className={`${inputClass} resize-none`} />
                </div>
                <div>
                  <label className={labelClass}>Date & Time *</label>
                  <input name="date" type="datetime-local" value={form.date} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Location *</label>
                  <div className="relative">
                    <select
                      name="location"
                      value={form.location}
                      onChange={(e) => handleChange(e as any)}
                      className={`${inputClass} appearance-none pr-10`}
                      required
                    >
                      <option value="" disabled>Select a location</option>
                      <option value="Computer Dept">Computer Dept</option>
                      <option value="IT Dept">IT Dept</option>
                      <option value="Civil Dept">Civil Dept</option>
                      <option value="ETC Dept">ETC Dept</option>
                      <option value="ENE Dept">ENE Dept</option>
                      <option value="Mech Dept">Mech Dept</option>
                      <option value="Library">Library</option>
                      <option value="Canteen">Canteen</option>
                      <option value="Main Gate">Main Gate</option>
                      <option value="Admin Block">Admin Block</option>
                      <option value="Academic Block">Academic Block</option>
                      <option value="Mining Dept">Mining Dept</option>
                      <option value="Hostel">Hostel</option>
                      <option value="Ground">Ground</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-on-surface-variant/50">expand_more</span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Event Image <span className="text-primary/60">(JPG / PNG)</span></label>
                  <label className="flex flex-col items-center justify-center w-full cursor-pointer border-2 border-dashed border-white/10 hover:border-primary/40 rounded-2xl transition-colors overflow-hidden bg-surface-container-high">
                    {imagePreview ? (
                      <div className="relative w-full">
                        <img src={imagePreview} alt="preview" className="w-full h-40 object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-bold">Click to change</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-8">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">add_photo_alternate</span>
                        <p className="text-xs text-on-surface-variant/60">Click to upload <span className="text-primary font-semibold">JPG or PNG</span></p>
                        <p className="text-[10px] text-on-surface-variant/40">Max 5MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imageFile && (
                    <p className="text-[10px] text-on-surface-variant mt-1.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-secondary">check_circle</span>
                      {imageFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant border-b border-white/5 pb-3 mb-5">Coordinator Details</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Coordinator Name</label>
                    <input name="coordinatorName" value={form.coordinatorName} onChange={handleChange} placeholder="Full name" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input name="coordinatorPhone" value={form.coordinatorPhone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Email Address</label>
                    <input name="coordinatorEmail" type="email" value={form.coordinatorEmail} onChange={handleChange} placeholder="coordinator@college.edu" className={inputClass} />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-error text-xs bg-error/10 border border-error/20 rounded-xl px-4 py-3">{error}</p>
              )}

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={onClose} className="flex-1 py-3.5 border border-white/10 rounded-2xl text-on-surface-variant font-bold text-sm hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 py-3.5 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? "Submitting…" : "Submit for Review"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────

function AdminPanel() {
  const [pending, setPending] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events/pending");
      if (res.ok) setPending(await res.json());
    } catch (e) {
      console.error("[AdminPanel] fetchPending:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    setProcessing(id);
    try {
      await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setPending((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      console.error("[AdminPanel] handleAction:", e);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6 px-2">
        <span className="material-symbols-outlined text-error">admin_panel_settings</span>
        <h2 className="font-headline text-2xl font-bold text-on-surface">Admin: Pending Approvals</h2>
        <span className="ml-auto text-xs font-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full border border-white/5">
          {pending.length} pending
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
        </div>
      ) : pending.length === 0 ? (
        <div className="glass-panel rounded-[2rem] border border-white/5 p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-secondary mb-2 block">task_alt</span>
          <p className="text-on-surface-variant text-sm">No events pending approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((event) => (
            <div key={event.id} className="glass-panel rounded-[2rem] border border-white/10 p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="font-headline font-bold text-on-surface">{event.title}</h4>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">{event.description}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">location_on</span>{event.location}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">person</span>{event.coordinatorName || "—"}</span>
                  {event.date && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">calendar_today</span>{new Date(event.date).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button
                  disabled={processing === event.id}
                  onClick={() => handleAction(event.id, "rejected")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-error/40 text-error text-xs font-bold hover:bg-error/10 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                  Reject
                </button>
                <button
                  disabled={processing === event.id}
                  onClick={() => handleAction(event.id, "approved")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-secondary/20"
                >
                  <span className="material-symbols-outlined text-sm">check</span>
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Main Events Page ─────────────────────────────────────────────────────────

export default function EventsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      if (res.ok) setEvents(await res.json());
    } catch (e) {
      console.error("[EventsPage] fetchEvents:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  return (
    <div className="md:px-12 w-full pb-12">
      {/* Admin Panel */}
      {isAdmin && <AdminPanel />}

      {/* Page Header */}
      <div className="flex items-end justify-between mb-10 px-2">
        <div>
          <span className="text-primary font-bold tracking-[0.2em] text-[10px] uppercase block mb-2">Campus Life</span>
          <h1 className="font-headline text-4xl font-bold text-on-surface tracking-tight">Events</h1>
          <p className="text-on-surface-variant text-sm mt-1">Discover and explore what's happening on campus</p>
        </div>
        {/* Add Event Button */}
        {user && !isAdmin && (
          <button
            id="add-event-btn"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed px-6 py-3.5 rounded-full font-headline font-bold text-sm tracking-wide shadow-[0_0_30px_-5px_rgba(199,153,255,0.5)] active:scale-95 transition-all hover:shadow-[0_0_40px_-5px_rgba(199,153,255,0.7)]"
          >
            <span className="material-symbols-outlined">add_circle</span>
            ADD EVENT
          </button>
        )}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant opacity-30">event_busy</span>
          <p className="font-headline text-xl font-bold text-on-surface-variant">No events available</p>
          <p className="text-sm text-on-surface-variant/60">Check back later or submit a new event for approval.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Add Event Modal */}
      {showModal && user && (
        <AddEventModal
          onClose={() => setShowModal(false)}
          onSubmitted={fetchEvents}
          userId={user.uid}
        />
      )}
    </div>
  );
}
