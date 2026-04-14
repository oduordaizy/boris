"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.register(formData);
      login(data.user, data.access);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-boris-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md glass p-8 rounded-2xl shadow-xl transition-boris">
        <h1 className="text-3xl font-bold text-boris-text text-center mb-2 tracking-tight">Create Account</h1>
        <p className="text-boris-text/60 mb-8 text-center">Join the productivity movement today.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-boris-overdue/10 text-boris-overdue p-3 rounded-lg text-sm font-medium border border-boris-overdue/20">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-boris-text/80 mb-2">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-boris-surface border border-boris-border focus:ring-2 focus:ring-boris-primary focus:border-transparent outline-none transition-boris"
                placeholder="Boris"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-boris-text/80 mb-2">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-boris-surface border border-boris-border focus:ring-2 focus:ring-boris-primary focus:border-transparent outline-none transition-boris"
                placeholder="Adams"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-boris-text/80 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-boris-surface border border-boris-border focus:ring-2 focus:ring-boris-primary focus:border-transparent outline-none transition-boris"
              placeholder="boris_adams"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-boris-text/80 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-boris-surface border border-boris-border focus:ring-2 focus:ring-boris-primary focus:border-transparent outline-none transition-boris"
              placeholder="boris@outlook.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-boris-text/80 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-boris-surface border border-boris-border focus:ring-2 focus:ring-boris-primary focus:border-transparent outline-none transition-boris"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-boris-text/80 mb-2">Confirm Password</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-boris-surface border border-boris-border focus:ring-2 focus:ring-boris-primary focus:border-transparent outline-none transition-boris"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-boris-primary text-white py-3 rounded-xl font-bold hover:brightness-110 active:scale-[0.98] transition-boris disabled:opacity-50 mt-4"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-boris-text/60">
          Already have an account?{" "}
          <Link href="/login" className="text-boris-primary font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
