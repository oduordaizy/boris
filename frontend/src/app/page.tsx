"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RootPage() {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (token) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [loading, token, router]);

  return (
    <div className="min-h-screen bg-boris-bg flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-boris-primary rounded-2xl"></div>
        <p className="text-boris-text/40 font-bold tracking-widest uppercase text-xs">
          Loading Boris Tool...
        </p>
      </div>
    </div>
  );
}
