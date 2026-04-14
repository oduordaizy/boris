"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, AlertCircle, Clock, ArrowRight, Zap } from "lucide-react";
import { taskApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: Props) {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && token) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const dashboardData = await taskApi.getDashboard(token);
          setData(dashboardData);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, token]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-boris-text/20 backdrop-blur-[2px] z-[110]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-boris-bg shadow-2xl z-[120] border-l border-boris-border flex flex-col"
          >
            <div className="p-8 border-b border-boris-border flex items-center justify-between bg-white/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-boris-primary/10 flex items-center justify-center text-boris-primary">
                   <Zap size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">Awareness Center</h2>
                  <p className="text-[10px] uppercase font-black tracking-widest text-boris-text/40">Real-time Intelligence</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-boris-surface rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-boris-primary"></div>
                </div>
              ) : (
                <>
                  {/* Overdue Section */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-boris-overdue flex items-center gap-2">
                        <AlertCircle size={14} />
                        Overdue Action Required
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-boris-overdue/10 rounded-full text-boris-overdue">
                        {data?.overdue_tasks || 0}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {data?.overdue_list?.length > 0 ? (
                        data.overdue_list.map((task: any) => (
                          <div key={task.id} className="p-4 rounded-2xl bg-boris-overdue/5 border border-boris-overdue/10 group hover:border-boris-overdue/30 transition-all cursor-pointer">
                            <h4 className="font-bold text-sm text-boris-text mb-1">{task.title}</h4>
                            <p className="text-[10px] font-medium text-boris-overdue/60">
                              Deadline Missed {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs font-bold text-boris-text/30 italic">No missed deadlines. Excellence maintained.</p>
                      )}
                    </div>
                  </section>

                  {/* Due Soon Section */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-boris-soon flex items-center gap-2">
                        <Clock size={14} />
                        Imminent Deadlines
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-boris-soon/10 rounded-full text-boris-soon">
                        {data?.due_soon_tasks || 0}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {data?.due_soon_list?.length > 0 ? (
                        data.due_soon_list.map((task: any) => (
                          <div key={task.id} className="p-4 rounded-2xl bg-white/40 border border-boris-border group hover:border-boris-soon/30 transition-all cursor-pointer">
                            <h4 className="font-bold text-sm text-boris-text mb-1">{task.title}</h4>
                            <p className="text-[10px] font-medium text-boris-soon/60">
                              Action required {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs font-bold text-boris-text/30 italic">Clear schedule for the next 24 hours.</p>
                      )}
                    </div>
                  </section>
                </>
              )}
            </div>

            <div className="p-8 bg-boris-surface/50 border-t border-boris-border">
              <button 
                onClick={onClose}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                Clear Awareness
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
