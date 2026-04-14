"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

export default function TaskModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    due_date: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      // Format datetime-local correctly (YYYY-MM-DDThh:mm)
      let formattedDate = "";
      if (initialData.due_date) {
        const d = new Date(initialData.due_date);
        formattedDate = d.toISOString().slice(0, 16);
      }

      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        priority: initialData.priority || "medium",
        status: initialData.status || "pending",
        due_date: formattedDate,
        category: initialData.category || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "pending",
        due_date: "",
        category: "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-boris-text/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-boris-bg rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-boris-surface rounded-full transition-boris text-boris-text/40 hover:text-boris-text"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black mb-6">
          {isEditing ? "Modify Objective" : "Create New Task"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-boris-text/60 mb-2 uppercase tracking-wide">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-boris-surface border border-boris-border focus:ring-2 focus:ring-boris-primary outline-none transition-boris"
              placeholder="What needs to be done?"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-boris-text/60 mb-2 uppercase tracking-wide">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-boris-surface border border-boris-border focus:ring-2 focus:ring-boris-primary outline-none transition-boris h-24 resize-none"
              placeholder="Add some details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-boris-text/60 mb-2 uppercase tracking-wide">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-boris-surface border border-boris-border focus:ring-2 focus:ring-boris-primary outline-none transition-boris"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-boris-text/60 mb-2 uppercase tracking-wide">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-boris-surface border border-boris-border focus:ring-2 focus:ring-boris-primary outline-none transition-boris"
                placeholder="e.g. Work"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-boris-text/60 mb-2 uppercase tracking-wide">Due Date</label>
            <input
              type="datetime-local"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-boris-surface border border-boris-border focus:ring-2 focus:ring-boris-primary outline-none transition-boris"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-boris-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-boris-primary/20 hover:brightness-110 transition-boris disabled:opacity-50 mt-4"
          >
            {loading ? "Processing..." : isEditing ? "Save Changes" : "Add to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
