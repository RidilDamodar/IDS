"use client";

import { useEffect, useState } from "react";
import { Activity, ShieldAlert, CheckCircle, Target, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8001/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch stats", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!stats || stats.detail) {
    return <div className="text-red-400 p-6 bg-red-950/20 border border-red-900 rounded-xl">Error loading dashboard data. Ensure backend is running.</div>;
  }

  const pieData = [
    { name: "Normal Traffic", value: stats.total_normal, color: "#10b981" },
    { name: "Intrusions Detected", value: stats.total_attacks, color: "#ef4444" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Security Dashboard</h2>
        <p className="text-slate-400 mt-1">Real-time network traffic analysis and intrusion detection.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Analyzed</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.total_analyzed.toLocaleString()}</h3>
            </div>
            <div className="bg-indigo-500/10 p-2 rounded-lg">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Normal Traffic</p>
              <h3 className="text-3xl font-bold text-emerald-400 mt-2">{stats.total_normal.toLocaleString()}</h3>
            </div>
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Intrusions</p>
              <h3 className="text-3xl font-bold text-red-400 mt-2">{stats.total_attacks.toLocaleString()}</h3>
            </div>
            <div className="bg-red-500/10 p-2 rounded-lg">
              <Target className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Active Alerts</p>
              <h3 className="text-3xl font-bold text-orange-400 mt-2">{stats.active_alerts.toLocaleString()}</h3>
            </div>
            <div className="bg-orange-500/10 p-2 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Traffic Distribution</h3>
          {stats.total_analyzed === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500">No traffic analyzed yet.</div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Model Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
           <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
           <div className="space-y-4">
             <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <span className="text-slate-300">Backend API</span>
                <span className="text-emerald-400 font-medium text-sm px-2 py-1 bg-emerald-400/10 rounded-md">Online</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <span className="text-slate-300">Database Connection</span>
                <span className="text-emerald-400 font-medium text-sm px-2 py-1 bg-emerald-400/10 rounded-md">Connected</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <span className="text-slate-300">ML Model Status</span>
                {stats.model_accuracy > 0 ? (
                  <span className="text-indigo-400 font-medium text-sm px-2 py-1 bg-indigo-400/10 rounded-md">Loaded (Acc: {(stats.model_accuracy * 100).toFixed(1)}%)</span>
                ) : (
                  <span className="text-red-400 font-medium text-sm px-2 py-1 bg-red-400/10 rounded-md">Not Trained</span>
                )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
