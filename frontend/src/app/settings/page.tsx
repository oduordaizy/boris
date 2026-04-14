"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import { User, Bell, Shield, Eye, Palette, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user } = useAuth();

  const settingsGroups = [
    {
      title: "Boris Profile",
      icon: User,
      items: [
        { label: "Display Name", value: `${user?.first_name} ${user?.last_name}`, type: "text" },
        { label: "Username", value: user?.username, type: "text" },
        { label: "Email Address", value: user?.email, type: "text" },
      ]
    },
    {
      title: "System Preferences",
      icon: Zap,
      items: [
        { label: "Focus Mode", description: "Mute non-urgent notifications during work hours.", type: "toggle", active: true },
        { label: "Daily Summary", description: "Receive a morning brief of your suggested tasks.", type: "toggle", active: false },
        { label: "Analytics Sharing", description: "Help improve the decision-support algorithm.", type: "toggle", active: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-boris-bg flex p-4 gap-4">
      <Sidebar />

      <main className="flex-1 max-w-4xl mx-auto py-4 px-2 lg:px-6">
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-5xl font-black tracking-tighter mb-4">System Preferences</h2>
            <p className="text-boris-text/40 font-medium italic">
              "Environment dictates efficiency. Optimize your workspace."
            </p>
          </motion.div>
        </header>

        <div className="space-y-8">
          {settingsGroups.map((group, idx) => (
            <motion.div 
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 rounded-[2.5rem]"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-boris-primary/10 flex items-center justify-center text-boris-primary">
                  <group.icon size={22} />
                </div>
                <h3 className="text-xl font-bold">{group.title}</h3>
              </div>

              <div className="space-y-6">
                {group.items.map((item: any) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-boris-border/30 last:border-0">
                    <div>
                      <p className="text-xs font-black uppercase text-boris-text/30 tracking-widest">{item.label}</p>
                      {item.description ? (
                        <p className="text-sm text-boris-text/60 mt-1">{item.description}</p>
                      ) : (
                        <p className="text-lg font-bold mt-1">{item.value}</p>
                      )}
                    </div>
                    {item.type === "toggle" && (
                      <button className={`w-12 h-6 rounded-full transition-colors relative ${item.active ? 'bg-boris-primary' : 'bg-boris-border'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.active ? 'right-1' : 'left-1'}`} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
