"use client";

import React from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, AlertTriangle, Clock, ArrowRight } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  is_overdue: boolean;
  is_due_soon: boolean;
}

interface Props {
  overdue: Task[];
  dueSoon: Task[];
  suggested: Task | null;
}

export default function AttentionPanel({ overdue, dueSoon, suggested }: Props) {
  if (overdue.length === 0 && dueSoon.length === 0 && !suggested) return null;

  return (
    <div className="space-y-8 mb-12">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-black tracking-tight">Active Awareness</h2>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="px-3 py-1 bg-boris-primary/10 text-boris-primary text-[10px] font-black rounded-full uppercase tracking-widest"
        >
          Priority focus
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Suggested Next Action Hero */}
        <AnimatePresence>
          {suggested && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.01 }}
              className="lg:col-span-1 min-h-[300px] bg-boris-primary p-8 rounded-[2.5rem] shadow-2xl shadow-boris-primary/20 relative overflow-hidden group border border-white/20"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap className="w-48 h-48 text-white" />
              </div>

              <div className="relative h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Decision Support</p>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3 leading-none tracking-tight">
                    {suggested.title}
                  </h3>
                  <p className="text-white/70 text-sm font-medium line-clamp-3">
                    {suggested.description || "The algorithm suggests this is your most impactful move right now."}
                  </p>
                </div>

                <button className="bg-white text-boris-primary w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-boris-bg transition-boris group/btn">
                  Move to Action
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overdue Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-6 text-boris-overdue">
            <AlertTriangle size={18} />
            <p className="text-[10px] font-black uppercase tracking-widest">Tactical Audit Required</p>
          </div>

          <div className="space-y-6">
            {overdue.length > 0 ? (
              overdue.slice(0, 3).map((task) => {
                const diff = (new Date().getTime() - new Date(task.due_date).getTime()) / (1000 * 3600);
                return (
                  <div key={task.id} className="relative pl-6 border-l-2 border-boris-overdue/20 hover:border-boris-overdue transition-colors cursor-pointer group">
                    <h4 className="font-bold text-boris-text group-hover:text-boris-overdue transition-colors">{task.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-[10px] font-medium text-boris-text/40 uppercase">
                        Missed {format(new Date(task.due_date), "MMM d")}
                      </p>
                      {diff > 24 && (
                        <span className="text-[9px] font-black bg-boris-overdue/10 px-2 py-0.5 rounded text-boris-overdue animate-pulse">
                          Audit Now
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm font-bold text-boris-text/30 italic">Registry is currently within parameters.</p>
            )}
          </div>
        </motion.div>

        {/* Due Soon Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-6 text-boris-soon">
            <Clock size={18} />
            <p className="text-[10px] font-black uppercase tracking-widest">Upcoming Focus</p>
          </div>

          <div className="space-y-6">
            {dueSoon.length > 0 ? (
              dueSoon.slice(0, 3).map((task) => (
                <div key={task.id} className="relative pl-6 border-l-2 border-boris-soon/20 hover:border-boris-soon transition-colors cursor-pointer group">
                  <h4 className="font-bold text-boris-text group-hover:text-boris-soon transition-colors">{task.title}</h4>
                  <p className="text-[10px] font-medium text-boris-text/40 mt-1 uppercase">
                    Execution Window: {format(new Date(task.due_date), "h:mm a")}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm font-bold text-boris-text/30 italic">No imminent deadlines detected.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
