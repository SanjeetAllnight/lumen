"use client";

import React, { useState } from "react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("jane.doe@university.edu");

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tighter">Profile</h1>
        <p className="text-on-surface-variant max-w-2xl text-lg font-body">Manage your personal information and campus identity.</p>
      </section>

      <div className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-surface-container-low transition-all">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-surface bg-surface-container-highest flex items-center justify-center text-3xl font-bold text-primary overflow-hidden">
            <img alt="profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM4LYXbH5yW4Q2Bo894pz16azlUPsZpeaHbqAba7RPTQBrp5plTCHD1aI1nRzuxxro7RERxmb8NoE5WWo6vF30SWd0LcUAz0Qr6b1ijk2wSgz6QgoJVoDHCsjixeBlzUJH3QLm8wPAUdTzHyTXrsFDhzEPBUCOmKXX1pSN14GYwrdL8hQor4bnnqs-_6C5-a1_sGSVXms51yiQz1Xzmorbd5v4x_tgytsxN61febDSPecmnguyxZvz9o7RDHIS5CAI1CW1jggI6IY" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-2xl font-headline font-bold text-on-surface">{name}</h3>
            <p className="text-on-surface-variant">Class of 2026 • Computer Science</p>
          </div>
        </div>

        <div className="space-y-6 border-t border-white/5 pt-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface disabled:opacity-50 transition-colors focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface disabled:opacity-50 transition-colors focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-4">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="px-6 py-3 text-on-surface-variant font-bold hover:text-on-surface transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:brightness-110 shadow-lg shadow-primary/20 transition-all">Save Changes</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-6 py-3 border border-outline-variant/30 text-on-surface rounded-xl font-bold hover:bg-white/5 transition-colors">Edit Profile</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
