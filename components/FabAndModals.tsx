"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGlobal } from "./GlobalProvider";
import { useToast } from "./ToastProvider";

export default function FabAndModals() {
  const { addIssue, addFeedback } = useGlobal();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"report" | "feedback" | null>(null);

  // Form states for Report Issue
  const [reportTitle, setReportTitle] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportCat, setReportCat] = useState("Facility");
  const [reportLoc, setReportLoc] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states for Feedback
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleOpenReportModal = () => setActiveModal("report");
    document.addEventListener("openReportModal", handleOpenReportModal);
    return () => document.removeEventListener("openReportModal", handleOpenReportModal);
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const resultUrl = reader.result as string;
        setPreviewUrl(resultUrl);
        await handleAnalyzeImage(resultUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeImage = async (base64Url: string) => {
    setIsAnalyzing(true);
    try {
      showToast("Analyzing image with AI...", "success", "auto_awesome");
      const res = await fetch("/api/issues/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Url })
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      if (data.title) setReportTitle(data.title);
      if (data.description) setReportDesc(data.description);
      showToast("AI automatically drafted description!", "success", "check_circle");
    } catch (error) {
      console.error(error);
      showToast("Failed to analyze image.", "error", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle || !reportDesc || isSubmitting) return;
    setIsSubmitting(true);
    setIsRefining(true);
    
    try {
      let finalTitle = reportTitle;
      let finalDesc = reportDesc;

      // If no image was provided, automatically refine the entered text
      if (!imageFile) {
        showToast("Refining text with AI...", "success", "auto_awesome");
        const res = await fetch("/api/issues/refine-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: reportTitle, description: reportDesc })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.title) finalTitle = data.title;
          if (data.description) finalDesc = data.description;
        }
      }

      const createdItem = await addIssue({
        title: finalTitle,
        description: finalDesc,
        category: reportCat,
        location: reportLoc || "Unknown",
        status: "reported",
      });

      if (createdItem && typeof window !== "undefined") {
        const existing = JSON.parse(localStorage.getItem("my_reported_issues") || "[]");
        localStorage.setItem("my_reported_issues", JSON.stringify([...existing, createdItem.id]));
      }

      setReportTitle("");
      setReportDesc("");
      setReportLoc("");
      clearImage();
      setActiveModal(null);
      setIsOpen(false);
    } finally {
      setIsRefining(false);
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
              <form id="report-form" onSubmit={handleReportSubmit} className="space-y-6">
                
                {/* Image Upload Area */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Evidence (Optional)</label>
                  {!previewUrl ? (
                    <div 
                      className="w-full bg-surface-container-high/50 border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:bg-surface-container-high hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isAnalyzing ? (
                        <>
                          <span className="material-symbols-outlined text-3xl text-primary animate-spin">progress_activity</span>
                          <span className="text-sm font-bold text-primary">Analyzing with AI...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-3xl text-on-surface-variant">add_photo_alternate</span>
                          <span className="text-sm text-on-surface-variant">Click to upload photo. AI will automatically draft details.</span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
                      <img src={previewUrl} alt="Upload preview" className="w-full h-40 object-cover" />
                      <button type="button" onClick={clearImage} className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-error/80 transition-colors backdrop-blur-sm z-10 w-8 h-8 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center flex-col gap-2 z-0">
                          <span className="material-symbols-outlined animate-spin text-white">progress_activity</span>
                          <span className="text-xs font-bold text-white uppercase tracking-widest">Analyzing Image</span>
                        </div>
                      )}
                    </div>
                  )}
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Title</label>
                  <input required value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} type="text" className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors" placeholder="E.g., Broken projector in Hall 4" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Location</label>
                    <select required value={reportLoc} onChange={(e) => setReportLoc(e.target.value)} className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none custom-select">
                      <option value="" disabled>Select location...</option>
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
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Description</label>
                  <textarea required value={reportDesc} onChange={(e) => setReportDesc(e.target.value)} rows={4} className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Provide more details..."></textarea>
                  {!imageFile && (
                    <p className="text-[10px] text-primary mt-2 flex items-center gap-1 font-bold tracking-wide">
                      <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                      AI will refine this description for clarity upon submission.
                    </p>
                  )}
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-white/5 bg-surface-container mt-auto">
              <button form="report-form" type="submit" disabled={isSubmitting || isAnalyzing} className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <><span className="material-symbols-outlined text-xl animate-spin">progress_activity</span> {isRefining ? 'Refining Text...' : 'Submitting...'}</>
                ) : (
                  "Submit Report"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
