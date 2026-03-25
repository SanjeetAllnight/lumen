"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGlobal } from "./GlobalProvider";
import { useToast } from "./ToastProvider";
import { useAuth } from "./AuthProvider";

export default function FabAndModals() {
  const { addIssue, addFeedback } = useGlobal();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"report" | "feedback" | null>(null);

  // Report form state
  const [reportTitle, setReportTitle] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportLoc, setReportLoc] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [shakeKey, setShakeKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Feedback form state
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Admins cannot create issues/events
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const handleOpenReportModal = () => {
      if (isAdmin) return; // Admin cannot report issues
      setActiveModal("report");
      setIsOpen(false);
    };
    document.addEventListener("openReportModal", handleOpenReportModal);
    return () => document.removeEventListener("openReportModal", handleOpenReportModal);
  }, [isAdmin]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetReport = () => {
    setReportTitle("");
    setReportDesc("");
    setReportLoc("");
    setImage(null);
    setPreview("");
    setFieldErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Inline validation
    const errors: Record<string, boolean> = {};
    if (!reportTitle.trim()) errors.title = true;
    if (!reportDesc.trim()) errors.desc = true;
    if (!reportLoc) errors.loc = true;
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setShakeKey(k => k + 1); // trigger re-shake
      return;
    }
    setFieldErrors({});
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await addIssue(
        {
          title: reportTitle.trim(),
          description: reportDesc.trim(),
          category: "Facility", // AI will override this server-side
          location: reportLoc,
          status: "reported",
        },
        image ?? undefined
      );

      resetReport();
      setActiveModal(null);
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMsg) return;
    addFeedback(feedbackType, feedbackMsg);
    setFeedbackMsg("");
    setActiveModal(null);
    setIsOpen(false);
  };

  const LOCATIONS = [
    "Computer Dept", "IT Dept", "Civil Dept", "ETC Dept", "ENE Dept",
    "Mech Dept", "Library", "Canteen", "Main Gate", "Admin Block",
    "Academic Block", "Mining Dept", "Hostel", "Ground",
  ];

  // Hide FAB entirely from admins — they have no issue/event creation rights
  if (isAdmin) return null;

  return (
    <>
      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
        {isOpen && (
          <div className="flex flex-col gap-3 mb-2 items-end animate-in slide-in-from-bottom-5 fade-in duration-200">
            <button
              onClick={() => { setActiveModal("report"); setIsOpen(false); }}
              className="flex items-center gap-3 bg-surface-container-high text-on-surface px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors shadow-lg"
            >
              <span className="text-sm font-bold">Report Issue</span>
              <div className="w-8 h-8 rounded-full bg-error/20 text-error flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">report_problem</span>
              </div>
            </button>
            <button
              onClick={() => { setActiveModal("feedback"); setIsOpen(false); }}
              className="flex items-center gap-3 bg-surface-container-high text-on-surface px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors shadow-lg"
            >
              <span className="text-sm font-bold">Feedback</span>
              <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
              </div>
            </button>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center transition-all ${
            isOpen ? "bg-surface-container text-white rotate-45" : "bg-gradient-to-br from-primary to-primary-container text-on-primary hover:scale-110 active:scale-95"
          }`}
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>

      {/* Report Issue Modal */}
      {activeModal === "report" && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-low border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-container flex-shrink-0">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-error">campaign</span>
                Report an Issue
              </h2>
              <button onClick={() => { setActiveModal(null); resetReport(); }} className="text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* AI Classification notice */}
            <div className="mx-6 mt-5 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">auto_awesome</span>
              <p className="text-xs text-primary font-medium">
                AI will automatically classify the priority and category after you submit.
              </p>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <form id="report-form" onSubmit={handleReportSubmit} className="space-y-5">

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                    Evidence Photo <span className="normal-case font-normal text-on-surface-variant/60">(optional)</span>
                  </label>
                  {preview ? (
                    <div className="relative inline-block">
                      <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-xl border border-white/10" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 w-7 h-7 bg-error rounded-full flex items-center justify-center shadow-lg"
                      >
                        <span className="material-symbols-outlined text-[14px] text-white">close</span>
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-white/10 rounded-xl p-5 text-center hover:border-primary/50 hover:bg-surface-container-high transition-all cursor-pointer flex items-center justify-center gap-3"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant">add_photo_alternate</span>
                      <span className="text-sm text-on-surface-variant">Click to upload photo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Title *</label>
                  <input
                    value={reportTitle}
                    onChange={(e) => { setReportTitle(e.target.value); setFieldErrors(p => ({ ...p, title: false })); }}
                    type="text"
                    key={fieldErrors.title ? `title-${shakeKey}` : 'title'}
                    className={`w-full bg-surface-container-high border rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors ${fieldErrors.title ? 'field-error field-shake' : 'border-white/10'}`}
                    placeholder="E.g., Broken projector in Hall 4"
                  />
                  {fieldErrors.title && <p className="text-error text-[11px] mt-1.5 flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">error</span>Title is required</p>}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Location *</label>
                  <select
                    value={reportLoc}
                    onChange={(e) => { setReportLoc(e.target.value); setFieldErrors(p => ({ ...p, loc: false })); }}
                    key={fieldErrors.loc ? `loc-${shakeKey}` : 'loc'}
                    className={`w-full bg-surface-container-high border rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none custom-select ${fieldErrors.loc ? 'field-error field-shake' : 'border-white/10'}`}
                  >
                    <option value="" disabled>Select location...</option>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  {fieldErrors.loc && <p className="text-error text-[11px] mt-1.5 flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">error</span>Location is required</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Description *</label>
                  <textarea
                    value={reportDesc}
                    onChange={(e) => { setReportDesc(e.target.value); setFieldErrors(p => ({ ...p, desc: false })); }}
                    rows={4}
                    key={fieldErrors.desc ? `desc-${shakeKey}` : 'desc'}
                    className={`w-full bg-surface-container-high border rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none ${fieldErrors.desc ? 'field-error field-shake' : 'border-white/10'}`}
                    placeholder="Describe the issue in detail..."
                  />
                  {fieldErrors.desc && <p className="text-error text-[11px] mt-1.5 flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">error</span>Description is required</p>}
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-white/5 bg-surface-container flex-shrink-0">
              <button
                form="report-form"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-tap"
              >
                {isSubmitting ? (
                  <><span className="material-symbols-outlined text-xl animate-spin">progress_activity</span> Submitting...</>
                ) : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {activeModal === "feedback" && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-low border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-container">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-secondary">chat_bubble</span>
                System Feedback
              </h2>
              <button onClick={() => setActiveModal(null)} className="text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="feedback-form" onSubmit={handleFeedbackSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Type</label>
                  <select value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)} className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-secondary transition-colors appearance-none custom-select">
                    <option value="suggestion">Suggestion / Feature Request</option>
                    <option value="bug">Report a Bug</option>
                    <option value="data">Data Issue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Message</label>
                  <textarea required value={feedbackMsg} onChange={(e) => setFeedbackMsg(e.target.value)} rows={5} className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-secondary transition-colors resize-none" placeholder="How can we improve?" />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-white/5 bg-surface-container">
              <button form="feedback-form" type="submit" className="w-full py-4 bg-secondary text-on-secondary rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-secondary/20">
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
