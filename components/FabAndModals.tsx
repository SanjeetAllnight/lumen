"use client";

import React, { useState, useEffect } from "react";
import { useGlobal } from "./GlobalProvider";

export default function FabAndModals() {
  const { addIssue, addFeedback } = useGlobal();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"report" | "feedback" | null>(null);

  // Form states for Report Issue
  const [reportTitle, setReportTitle] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportCat, setReportCat] = useState("Facility");
  const [reportLoc, setReportLoc] = useState("");

  // Form states for Feedback
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleOpenReportModal = () => setActiveModal("report");
    document.addEventListener("openReportModal", handleOpenReportModal);
    return () => document.removeEventListener("openReportModal", handleOpenReportModal);
  }, []);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle || !reportDesc || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await addIssue({
        title: reportTitle,
        description: reportDesc,
        category: reportCat,
        location: reportLoc || "Unknown",
        status: "reported",
      });
      setReportTitle("");
      setReportDesc("");
      setReportLoc("");
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

  return (
    <>
      {/* FAB and Radial Menu */}
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
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 min-h-screen animate-in fade-in duration-200">
          <div className="bg-surface-container-low border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-container">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-error">campaign</span>
                Report an Issue
              </h2>
              <button onClick={() => setActiveModal(null)} className="text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="report-form" onSubmit={handleReportSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Title</label>
                  <input required value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} type="text" className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors" placeholder="E.g., Broken projector in Hall 4" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Location</label>
                  <input required value={reportLoc} onChange={(e) => setReportLoc(e.target.value)} type="text" className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors" placeholder="Where is this happening?" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Category</label>
                  <select value={reportCat} onChange={(e) => setReportCat(e.target.value)} className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none custom-select">
                    <option value="Facility">Facility & Maintenance</option>
                    <option value="IT">IT & Network</option>
                    <option value="Security">Security</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Description</label>
                  <textarea required value={reportDesc} onChange={(e) => setReportDesc(e.target.value)} rows={4} className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Provide more details..."></textarea>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-white/5 bg-surface-container mt-auto">
              <button form="report-form" type="submit" disabled={isSubmitting} className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <><span className="material-symbols-outlined text-xl animate-spin">progress_activity</span> Submitting...</>
                ) : (
                  "Submit Report"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {activeModal === "feedback" && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 min-h-screen animate-in fade-in duration-200">
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
                  <textarea required value={feedbackMsg} onChange={(e) => setFeedbackMsg(e.target.value)} rows={5} className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-secondary transition-colors resize-none" placeholder="How can we improve?"></textarea>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-white/5 bg-surface-container mt-auto">
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
