"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { taskApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import DashboardStats from "@/components/DashboardStats";
import AttentionPanel from "@/components/AttentionPanel";
import Sidebar from "@/components/Sidebar";
import TaskModal from "@/components/TaskModal";
import { Plus, CheckCircle2, Circle, Clock, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [authLoading, token, router]);

  const fetchDashboard = async () => {
    if (!token) return;
    try {
      const data = await taskApi.getDashboard(token);
      setDashboard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleToggleComplete = async (id: number) => {
    if (!token) return;
    await taskApi.completeTask(token, id);
    await fetchDashboard();
  };

  useEffect(() => {
    fetchDashboard();
  }, [token]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-boris-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-boris-primary"></div>
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <div className="min-h-screen bg-boris-bg flex p-4 gap-4">
      {/* Premium Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto py-4 px-2 lg:px-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-5xl font-black tracking-tighter mb-4 leading-none">
              Modern Workflow
            </h2>
            <div className="flex items-center gap-4 text-boris-text/40">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest bg-boris-surface px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-boris-primary animate-pulse" />
                System Active
              </span>
              <p className="text-sm font-medium italic">Making Tasks handling easy</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              className="btn-primary flex items-center gap-2 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              New Objective
            </button>
          </div>
        </header>

        {/* Dashboard Sections */}
        <section>
          <DashboardStats 
            total={dashboard.total_tasks}
            completed={dashboard.completed_tasks}
            pending={dashboard.pending_tasks}
            overdue={dashboard.overdue_tasks}
            rate={dashboard.completion_rate}
          />

          <AttentionPanel 
            overdue={dashboard.overdue_list}
            dueSoon={dashboard.due_soon_list}
            suggested={dashboard.suggested_task}
          />

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-black tracking-tight">Recent Stream</h3>
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-boris-text/20" size={16} />
                  <input 
                    placeholder="Search objectives..." 
                    className="pl-10 pr-4 py-2 bg-boris-surface rounded-full border border-boris-border text-xs focus:ring-2 focus:ring-boris-primary/20 outline-none w-64 transition-all"
                  />
                </div>
              </div>
              <button 
                onClick={() => router.push("/tasks")}
                className="text-xs font-black uppercase text-boris-primary tracking-widest hover:bg-boris-primary/5 px-4 py-2 rounded-full transition-colors"
              >
                Registry
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence mode="popLayout">
                {dashboard.recent_tasks.map((task: any) => (
                  <motion.div 
                    layout
                    key={task.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card group p-5 rounded-3xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => task.status !== 'completed' && handleToggleComplete(task.id)}
                        className={`transition-all duration-300 ${
                          task.status === 'completed' 
                            ? 'text-boris-primary scale-110' 
                            : 'text-boris-text/10 hover:text-boris-primary/50'
                        }`}
                      >
                        {task.status === 'completed' ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                      </button>
                      
                      <div>
                        <h4 className={`text-lg font-bold transition-all ${
                          task.status === 'completed' ? 'text-boris-completed/60 line-through decoration-2' : 'text-boris-text'
                        }`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-1.5">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-tighter ${
                            task.priority === 'urgent' ? 'bg-boris-overdue/10 text-boris-overdue' :
                            task.priority === 'high' ? 'bg-boris-soon/10 text-boris-soon' :
                            'bg-boris-surface text-boris-text/40'
                          }`}>
                            {task.priority}
                          </span>
                          {task.category && (
                             <span className="text-[9px] font-bold text-boris-text/30 bg-boris-border/10 px-2 py-0.5 rounded-md uppercase tracking-tight">
                               {task.category}
                             </span>
                          )}
                          {task.due_date && (
                            <span className="text-[10px] text-boris-text/30 flex items-center gap-1.5 font-medium">
                              <Clock size={12} />
                              {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleEditTask(task)}
                      className="opacity-0 group-hover:opacity-100 px-4 py-2 hover:bg-boris-surface rounded-xl text-xs font-bold text-boris-text/40 transition-all"
                    >
                      Configure
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>
      </main>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        initialData={editingTask}
        onSubmit={async (data) => {
          if (editingTask) {
            await taskApi.updateTask(token!, editingTask.id, data);
          } else {
            await taskApi.createTask(token!, data);
          }
          await fetchDashboard();
        }}
      />
    </div>
  );
}
