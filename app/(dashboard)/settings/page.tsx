"use client";

import React from "react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tighter">Settings</h1>
        <p className="text-on-surface-variant max-w-2xl text-lg font-body">Manage your dashboard preferences and account security.</p>
      </section>

      <div className="space-y-6">
        {/* Profile/Account Box */}
        <div className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-surface-container-low transition-all">
          <h3 className="text-xl font-headline font-bold text-on-surface mb-6">Account Settings</h3>
          <div className="space-y-6 border-t border-white/5 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-on-surface">Change Password</p>
                <p className="text-sm text-on-surface-variant">Update your security credentials.</p>
              </div>
              <button className="px-6 py-2 border border-outline-variant/30 text-on-surface rounded-full font-bold hover:bg-white/5 transition-colors text-xs">Update</button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-surface-container-low transition-all">
          <h3 className="text-xl font-headline font-bold text-on-surface mb-6">Notifications</h3>
          <div className="space-y-6 border-t border-white/5 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-on-surface">Push Notifications</p>
                <p className="text-sm text-on-surface-variant">Receive alerts on your device.</p>
              </div>
              <button className="w-12 h-6 rounded-full bg-primary flex items-center px-1 transition-all">
                <div className="w-4 h-4 rounded-full bg-surface-container-lowest translate-x-6"></div>
              </button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div>
                <p className="font-bold text-on-surface">Email Digests</p>
                <p className="text-sm text-on-surface-variant">Weekly summaries of campus activity.</p>
              </div>
              <button className="w-12 h-6 rounded-full bg-surface-container-highest flex items-center px-1 transition-all border border-white/10">
                <div className="w-4 h-4 rounded-full bg-on-surface-variant"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-surface-container-low transition-all">
          <h3 className="text-xl font-headline font-bold text-on-surface mb-6">Appearance</h3>
          <div className="space-y-6 border-t border-white/5 pt-6">
            <div className="flex gap-4">
              <button className="flex-1 py-4 rounded-xl font-bold bg-primary text-on-primary">Dark</button>
              <button className="flex-1 py-4 rounded-xl font-bold border border-outline-variant/30 text-on-surface hover:bg-white/5">Light</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
