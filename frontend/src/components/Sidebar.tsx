"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Settings, LogOut, Sparkles, Bell, BellRing } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { taskApi } from "@/lib/api";
import NotificationCenter from "./NotificationCenter";

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user, token } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    if (token) {
      const fetchAlerts = async () => {
        try {
          const data = await taskApi.getDashboard(token);
          setAlertCount(data.overdue_tasks + data.due_soon_tasks);
        } catch (err) {
          console.error(err);
        }
      };
      fetchAlerts();
      const interval = setInterval(fetchAlerts, 60000); // Poll every minute
      return () => clearInterval(interval);
    }
  }, [token]);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "My Tasks", icon: CheckSquare, href: "/tasks" },
    { label: "Settings", icon: Settings, href: "/settings" },
    { label: "Reminders", icon: BellRing, href: "/reminders" },
  ];

  return (
    <>
      <aside className="w-64 min-h-[calc(100vh-2rem)] sticky top-4 mb-4 ml-4 glass rounded-3xl p-6 hidden lg:flex flex-col justify-between shadow-2xl shadow-boris-primary/5">
        <div>
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-boris-primary rounded-2xl flex items-center justify-center shadow-lg shadow-boris-primary/30">
                <Sparkles className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-black tracking-tighter">BORIS</h1>
            </div>

            <button 
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 hover:bg-boris-primary/5 rounded-xl transition-all group"
            >
              <Bell className={`${alertCount > 0 ? 'text-boris-overdue animate-pulse' : 'text-boris-text/20 group-hover:text-boris-primary'}`} size={20} />
              {alertCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-boris-overdue rounded-full ring-2 ring-white" />
              )}
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.label} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-300 ${
                      isActive 
                        ? "bg-boris-primary text-white shadow-lg shadow-boris-primary/20" 
                        : "text-boris-text/60 hover:text-boris-primary hover:bg-boris-primary/5"
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-boris-primary/5 border border-boris-primary/10">
            <p className="text-[10px] font-black uppercase text-boris-primary tracking-widest mb-1">Current User</p>
            <p className="text-sm font-bold truncate">{user?.first_name} {user?.last_name}</p>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-bold text-boris-overdue hover:bg-boris-overdue/5 transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      <NotificationCenter 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
    </>
  );
}
