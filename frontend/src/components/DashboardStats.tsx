"use client";

import React from "react";
import { motion } from "framer-motion";

interface StatsProps {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  rate: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardStats({ total, completed, pending, overdue, rate }: StatsProps) {
  const stats = [
    { label: "Total Tasks", value: total, color: "text-boris-text" },
    { label: "Completed", value: completed, color: "text-boris-primary" },
    { label: "Pending", value: pending, color: "text-boris-soon" },
    { label: "Overdue", value: overdue, color: "text-boris-overdue" },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
    >
      {stats.map((stat) => (
        <motion.div 
          key={stat.label} 
          variants={item}
          whileHover={{ scale: 1.02 }}
          className="glass-card p-6 rounded-3xl"
        >
          <p className="text-[10px] font-black uppercase text-boris-text/30 tracking-widest mb-1">
            {stat.label}
          </p>
          <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
        </motion.div>
      ))}
      
      <motion.div 
        variants={item}
        className="col-span-2 lg:col-span-4 glass-card p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="text-center md:text-left">
          <p className="text-[10px] font-black uppercase text-boris-text/30 tracking-widest mb-1">
            Overall Completion
          </p>
          <p className="text-5xl font-black text-boris-primary tracking-tighter">{rate}%</p>
        </div>
        <div className="w-full md:w-2/3 bg-boris-surface h-6 rounded-full overflow-hidden border border-boris-border p-1">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${rate}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-boris-primary rounded-full shadow-lg shadow-boris-primary/30"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
