"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authApi.login({ username, password });
      login(data.user, data.access);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-boris-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md glass p-8 rounded-2xl shadow-xl transition-boris">
        <h1 className="text-3xl font-bold text-boris-text mb-2 text-center tracking-tight">Welcome Back</h1>
        <p className="text-boris-text/60 text-center mb-8">Sign in to stay on top of your tasks.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-boris-overdue/10 text-boris-overdue p-3 rounded-lg text-sm font-medium border border-boris-overdue/20">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-boris-text/80 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-boris-surface border border-boris-border focus:ring-2 focus:ring-boris-primary focus:border-transparent outline-none transition-boris"
              placeholder="boris_adams"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-boris-text/80 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-boris-surface border border-boris-border focus:ring-2 focus:ring-boris-primary focus:border-transparent outline-none transition-boris"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-boris-primary text-white py-3 rounded-xl font-bold hover:brightness-110 active:scale-[0.98] transition-boris disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-boris-text/60">
          Don't have an account?{" "}
          <Link href="/register" className="text-boris-primary font-bold hover:underline">
            Register for free
          </Link>
        </p>
      </div>
    </div>
  );
}
