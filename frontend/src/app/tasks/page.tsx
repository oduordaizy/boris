"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { taskApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TaskModal from "@/components/TaskModal";
import { Plus, CheckCircle2, Circle, Clock, Filter, Trash2, Search, ArrowUpDown, ChevronDown, Calendar, AlertCircle, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow, isPast } from "date-fns";

export default function TasksPage() {
  const { token, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  
  // Advanced Filter States
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [ordering, setOrdering] = useState("-created_at");
  const [search, setSearch] = useState("");
  
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [authLoading, token, router]);

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params: any = { ordering };
      if (status !== "all") params.status = status;
      if (priority !== "all") params.priority = priority;
      if (search) params.search = search;
      
      const data = await taskApi.getTasks(token, params);
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, status, priority, ordering, search]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTasks();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchTasks]);

  const handleToggleComplete = async (id: number) => {
    if (!token) return;
    await taskApi.completeTask(token, id);
    fetchTasks();
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id: number) => {
    if (!token || !confirm("Are you sure you want to remove this objective?")) return;
    await taskApi.deleteTask(token, id);
    fetchTasks();
  };

  const getRelativeTime = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const distance = formatDistanceToNow(date, { addSuffix: true });
    const overdue = isPast(date);
    return { distance, overdue };
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-boris-bg flex p-4 gap-4">
      <Sidebar />

      <main className="flex-1 max-w-7xl mx-auto py-4 px-2 lg:px-6">
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h2 className="text-5xl font-black tracking-tighter mb-4">Objective Registry</h2>
              <p className="text-boris-text/40 font-medium max-w-lg italic">
                "Precision in audit leads to precision in action."
              </p>
            </div>
            <button 
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              New Objective
            </button>
          </motion.div>
        </header>

        {/* Intelligence Controls */}
        <div className="space-y-4 mb-10">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-boris-text/20" size={18} />
              <input 
                type="text"
                placeholder="Search objectives..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-boris pl-12 h-14"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Status Picker */}
              <div className="relative group">
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="appearance-none bg-white/40 border border-boris-border px-6 pr-12 h-14 rounded-2xl font-bold text-sm cursor-pointer hover:bg-white/60 focus:ring-4 focus:ring-boris-primary/10 transition-all outline-none"
                >
                  <option value="all">All States</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-boris-text/40" size={16} />
              </div>

              {/* Priority Picker */}
              <div className="relative">
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="appearance-none bg-white/40 border border-boris-border px-6 pr-12 h-14 rounded-2xl font-bold text-sm cursor-pointer hover:bg-white/60 focus:ring-4 focus:ring-boris-primary/10 transition-all outline-none"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent Only</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-boris-text/40" size={16} />
              </div>

              {/* Sort Order */}
              <div className="relative">
                <select 
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                  className="appearance-none bg-white/40 border border-boris-border px-10 pr-12 h-14 rounded-2xl font-bold text-sm cursor-pointer hover:bg-white/60 focus:ring-4 focus:ring-boris-primary/10 transition-all outline-none"
                >
                  <option value="-created_at">Recently Added</option>
                  <option value="due_date">Upcoming Deadlines</option>
                  <option value="-priority">Highest Priority</option>
                  <option value="title">Alphabetical</option>
                </select>
                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-boris-text/40" size={16} />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-boris-text/40" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Task List Workspace */}
        <div className="relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-boris-bg/20 backdrop-blur-[2px] z-10 flex items-center justify-center">
               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-boris-primary"></div>
            </div>
          )}

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {tasks.length > 0 ? (
                tasks.map((task) => {
                  const timeInfo = getRelativeTime(task.due_date);
                  return (
                    <motion.div 
                      layout
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="glass-card group p-6 rounded-[2rem] flex items-center justify-between"
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
                          {task.status === 'completed' ? <CheckCircle2 size={32} /> : <Circle size={32} />}
                        </button>
                        
                        <div>
                          <h4 className={`text-xl font-bold transition-all ${
                            task.status === 'completed' ? 'text-boris-completed/60 line-through decoration-2' : 'text-boris-text'
                          }`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className={`text-sm mt-1 max-w-2xl line-clamp-1 ${
                              task.status === 'completed' ? 'text-boris-completed/40' : 'text-boris-text/60'
                            }`}>
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 mt-4">
                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider ${
                              task.priority === 'urgent' ? 'bg-boris-overdue/10 text-boris-overdue' :
                              task.priority === 'high' ? 'bg-boris-soon/10 text-boris-soon' :
                              'bg-boris-surface text-boris-text/40'
                            }`}>
                              {task.priority}
                            </span>
                            
                            {timeInfo && (
                              <span className={`text-[10px] flex items-center gap-1.5 font-bold ${
                                timeInfo.overdue && task.status !== 'completed' ? 'text-boris-overdue animate-pulse' : 'text-boris-text/40'
                              }`}>
                                <Calendar size={14} />
                                {timeInfo.distance}
                              </span>
                            )}

                            {task.category && (
                              <span className="text-[10px] text-boris-primary/60 font-black uppercase tracking-tighter bg-boris-primary/5 px-2 py-0.5 rounded">
                                {task.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEditTask(task)}
                          className="p-3 text-boris-text/20 hover:text-boris-primary hover:bg-boris-primary/5 rounded-2xl transition-all"
                        >
                          <Pencil size={20} />
                        </button>
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-3 text-boris-text/20 hover:text-boris-overdue hover:bg-boris-overdue/5 rounded-2xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              ) : !loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-32 bg-white/20 rounded-[3rem] border-2 border-dashed border-boris-border"
                >
                  <div className="flex flex-col items-center gap-4">
                    <Filter className="text-boris-text/10" size={48} />
                    <p className="text-boris-text/30 font-bold italic">No objectives found matching your intelligence parameters.</p>
                    <button 
                      onClick={() => {
                        setSearch("");
                        setStatus("all");
                        setPriority("all");
                        setOrdering("-created_at");
                      }}
                      className="text-xs font-black uppercase text-boris-primary hover:underline"
                    >
                      Reset Registry
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
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
          fetchTasks();
        }}
      />
    </div>
  );
}
