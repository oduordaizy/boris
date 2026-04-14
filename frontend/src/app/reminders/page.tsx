"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { taskApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TaskModal from "@/components/TaskModal";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BellRing, AlarmClock, Calendar, CheckSquare, 
  ChevronRight, Brain, Zap, Clock, AlertTriangle, Pencil 
} from "lucide-react";
import { format, isToday, isTomorrow, isPast, formatDistanceToNow } from "date-fns";

export default function RemindersPage() {
  const { token, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [authLoading, token, router]);

  const fetchReminders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Fetch all tasks and filter for reminders (overdue or due soon)
      const data = await taskApi.getTasks(token, { ordering: "due_date" });
      const reminders = data.filter((t: any) => t.due_date && !t.completed_at && t.status !== "completed");
      setTasks(reminders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCompleteTask = async (id: number) => {
    await taskApi.completeTask(token!, id);
    fetchReminders();
  };

  // Grouping tasks into Intelligence Tiers
  const overdue = tasks.filter(t => isPast(new Date(t.due_date)));
  const today = tasks.filter(t => !isPast(new Date(t.due_date)) && isToday(new Date(t.due_date)));
  const tomorrow = tasks.filter(t => isTomorrow(new Date(t.due_date)));
  const upcoming = tasks.filter(t => !isPast(new Date(t.due_date)) && !isToday(new Date(t.due_date)) && !isTomorrow(new Date(t.due_date)));

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-boris-bg flex p-4 gap-4 overflow-hidden">
      <Sidebar />

      <main className="flex-1 max-w-5xl mx-auto py-4 px-2 lg:px-6 relative">
        {/* Background Visual Flair */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-boris-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-boris-soon/5 rounded-full blur-[80px] pointer-events-none" />

        <header className="mb-16 relative">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-4 text-boris-primary">
                <Brain size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Contextual Awareness</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter leading-none mb-4 italic">
                  Task Reminders
              </h2>
              {/* <p className="text-boris-text/40 font-medium max-w-lg">
                Your imminent objectives synchronized with system intelligence. Precision execution starts here.
              </p> */}
            </div>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-boris-primary"></div>
          </div>
        ) : (
          <div className="space-y-16 pb-20">
            {/* TIER: Critical & Overdue */}
            {(overdue.length > 0 || today.length > 0) && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-[2px] w-12 bg-boris-overdue" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-boris-overdue">Immediate Execution</h3>
                </div>
                
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {[...overdue, ...today].map((task) => (
                      <TaskReminderCard 
                        key={task.id} 
                        task={task} 
                        isUrgent={isPast(new Date(task.due_date))}
                        onEdit={() => handleEditTask(task)}
                        onComplete={() => handleCompleteTask(task.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}

            {/* TIER: Tomorrow */}
            {tomorrow.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-[2px] w-12 bg-boris-soon" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-boris-soon">Upcoming Horizon</h3>
                </div>
                
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {tomorrow.map((task) => (
                      <TaskReminderCard 
                        key={task.id} 
                        task={task} 
                        onEdit={() => handleEditTask(task)}
                        onComplete={() => handleCompleteTask(task.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}

            {/* TIER: Future */}
            {upcoming.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-[2px] w-12 bg-boris-text/10" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-boris-text/30">Future Awareness</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcoming.map((task) => (
                    <TaskReminderCard 
                      key={task.id} 
                      task={task} 
                      compact
                      onEdit={() => handleEditTask(task)}
                      onComplete={() => handleCompleteTask(task.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {tasks.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-40 border-2 border-dashed border-boris-border rounded-[3rem]"
              >
                <BellRing className="mx-auto text-boris-text/10 mb-4" size={48} />
                <p className="text-boris-text/40 font-bold italic">No imminent deadlines on your horizon.</p>
              </motion.div>
            )}
          </div>
        )}
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
          fetchReminders();
        }}
      />
    </div>
  );
}

function TaskReminderCard({ task, isUrgent, compact, onEdit, onComplete }: any) {
  const diffTime = formatDistanceToNow(new Date(task.due_date), { addSuffix: true });
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={`glass-card p-6 rounded-[2rem] group flex items-center justify-between border-l-4 ${
        isUrgent ? 'border-boris-overdue bg-boris-overdue/[0.02]' : 'border-boris-primary bg-white/40'
      } ${compact ? 'md:p-4' : 'p-6'}`}
    >
      <div className="flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-boris ${
          isUrgent ? 'bg-boris-overdue shadow-lg shadow-boris-overdue/20' : 'bg-boris-primary shadow-lg shadow-boris-primary/20'
        }`}>
          {isUrgent ? <AlertTriangle className="text-white" size={24} /> : <Clock className="text-white" size={24} />}
        </div>
        
        <div>
          <h4 className="text-xl font-black tracking-tight text-boris-text uppercase line-clamp-1">{task.title}</h4>
          <div className="flex items-center gap-4 mt-2">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded tracking-widest ${
               isUrgent ? 'bg-boris-overdue/10 text-boris-overdue animate-pulse' : 'bg-boris-primary/10 text-boris-primary'
            }`}>
               {isUrgent ? "MISSING WINDOW" : diffTime.toUpperCase()}
            </span>
            <span className="text-[10px] font-bold text-boris-text/30 flex items-center gap-1.5 capitalize">
              <Calendar size={12} />
              {format(new Date(task.due_date), "MMM d, h:mm a")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={onEdit}
          className="p-3 bg-boris-surface rounded-xl text-boris-text/40 hover:text-boris-primary hover:bg-boris-primary/10 transition-all"
        >
          <Pencil size={18} />
        </button>
        <button 
          onClick={onComplete}
          className="p-3 bg-boris-primary text-white rounded-xl shadow-lg shadow-boris-primary/10 hover:scale-105 transition-all"
        >
          <Zap size={18} />
        </button>
      </div>
    </motion.div>
  );
}
