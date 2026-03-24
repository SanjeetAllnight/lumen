"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import BackgroundEffects from "@/components/BackgroundEffects";
import Footer from "@/components/Footer";
import { GlobalProvider } from "@/components/GlobalProvider";
import FabAndModals from "@/components/FabAndModals";
import { useAuth } from "@/components/AuthProvider";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
          <p className="text-on-surface-variant font-medium">Loading Lumen...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <GlobalProvider>
        <div className="min-h-full flex flex-col">
          <BackgroundEffects />
          <Navbar />
          <Sidebar />
          <div className="flex-1 flex flex-col relative z-20 w-full lg:pl-64">
            <main className="flex-1 pt-20 pb-8 min-h-screen">
              {children}
            </main>
            <Footer />
          </div>
        </div>
        <FabAndModals />
      </GlobalProvider>
    </AuthGuard>
  );
}
