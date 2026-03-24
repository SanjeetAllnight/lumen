"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGlobal } from "./GlobalProvider";
import { useToast } from "./ToastProvider";

export default function FabAndModals() {
  const { addIssue, addFeedback } = useGlobal();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"report" | "feedback" | null>(null);

  // Report form state
  const [reportTitle, setReportTitle] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportCat, setReportCat] = useState("Facility");
  const [reportLoc, setReportLoc] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Feedback form state
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  useEffect(() => {
    const handleOpenReportModal = () => { setActiveModal("report"); setIsOpen(false); };
    document.addEventListener("openReportModal", handleOpenReportModal);
    return () => document.removeEventListener("openReportModal", handleOpenReportModal);
  }, []);

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newImages = [...images, ...files].slice(0, 3); // max 3
    setImages(newImages);

    const newPreviews = await Promise.all(
      newImages.map(f => new Promise<string>((res) => {
        const reader = new FileReader();
        reader.onloadend = () => res(reader.result as string);
        reader.readAsDataURL(f);
      }))
    );
    setPreviews(newPreviews);

    // Analyze the first new image with AI
    setIsAnalyzing(true);
    showToast("Analyzing image with AI...", "success", "auto_awesome");
    try {
      const base64 = newPreviews[newPreviews.length - 1];
      const res = await fetch("/api/issues/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      if (data.title) setReportTitle(data.title);
      if (data.description) setReportDesc(data.description);
      showToast("AI drafted your report from the image!", "success", "check_circle");
    } catch {
      showToast("Couldn't analyze image. Fill in details manually.", "info", "edit");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeImage = (idx: number) => {
    const newImgs = images.filter((_, i) => i !== idx);
    const newPrevs = previews.filter((_, i) => i !== idx);
    setImages(newImgs);
    setPreviews(newPrevs);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetReport = () => {
    setReportTitle(""); setReportDesc(""); setReportLoc("");
    setImages([]); setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportDesc.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      let finalTitle = reportTitle;
      let finalDesc = reportDesc;

      // If no images, refine text with AI
      if (images.length === 0) {
        showToast("Refining your report with AI...", "success", "auto_awesome");
        try {
          const res = await fetch("/api/issues/refine-text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: reportTitle, description: reportDesc }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.title) finalTitle = data.title;
            if (data.description) finalDesc = data.description;
          }
        } catch { /* fallback to original */ }
      }

      await addIssue({
        title: finalTitle,
        description: finalDesc,
        category: reportCat,
        location: reportLoc || "Unknown",
        status: "reported",
      });

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
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-container flex-shrink-0">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-error">campaign</span>
                Report an Issue
              </h2>
              <button onClick={() => { setActiveModal(null); resetReport(); }} className="text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <form id="report-form" onSubmit={handleReportSubmit} className="space-y-5">

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                    Evidence Photos <span className="normal-case font-normal text-on-surface-variant/60">(optional, up to 3 — AI will auto-fill details)</span>
                  </label>

                  {previews.length > 0 && (
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {previews.map((src, i) => (
                        <div key={i} className="relative">
                          <img src={src} alt="" className="w-20 h-20 object-cover rounded-xl border border-white/10" />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-error rounded-full flex items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-[12px] text-white">close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {previews.length < 3 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-primary/50 hover:bg-surface-container-high transition-all cursor-pointer flex items-center justify-center gap-3"
                    >
                      {isAnalyzing ? (
                        <>
                          <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
                          <span className="text-sm text-primary font-medium">Analyzing with AI...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-on-surface-variant">add_photo_alternate</span>
                          <span className="text-sm text-on-surface-variant">Click to upload photo</span>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleImagesChange}
                    className="hidden"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Title</label>
                  <input
                    required
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    type="text"
                    className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                    placeholder="E.g., Broken projector in Hall 4"
                  />
                </div>

                {/* Location + Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Location</label>
                    <select
                      required
                      value={reportLoc}
                      onChange={(e) => setReportLoc(e.target.value)}
                      className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none custom-select"
                    >
                      <option value="" disabled>Select location...</option>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Category</label>
                    <select
                      value={reportCat}
                      onChange={(e) => setReportCat(e.target.value)}
                      className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none custom-select"
                    >
                      <option value="Facility">Facility & Maintenance</option>
                      <option value="IT">IT & Network</option>
                      <option value="Security">Security</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    required
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    rows={4}
                    className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Describe the issue in detail..."
                  />
                  {images.length === 0 && (
                    <p className="text-[10px] text-primary mt-1.5 flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                      AI will refine this text for clarity on submission.
                    </p>
                  )}
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-white/5 bg-surface-container flex-shrink-0">
              <button
                form="report-form"
                type="submit"
                disabled={isSubmitting || isAnalyzing}
                className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
