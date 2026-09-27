"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, Check, Clock, Loader2 } from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    fetch("http://localhost:8001/api/alerts/recent")
      .then((res) => res.json())
      .then((data) => {
        setAlerts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch alerts", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const acknowledgeAlert = async (id: number) => {
    try {
      await fetch(`http://localhost:8001/api/alerts/${id}/acknowledge`, { method: "POST" });
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Active Alerts</h2>
        <p className="text-slate-400 mt-1">Review and manage recent intrusion detection alerts.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {alerts.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Check className="w-12 h-12 text-emerald-500 mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-1">No Active Alerts</h3>
            <p className="text-slate-500 text-sm">System is currently operating normally.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="text-xs uppercase bg-slate-950/50 text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Time</th>
                  <th className="px-6 py-4 font-semibold">Attack Type</th>
                  <th className="px-6 py-4 font-semibold">Source IP</th>
                  <th className="px-6 py-4 font-semibold">Severity</th>
                  <th className="px-6 py-4 font-semibold">Confidence</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                        <span className="font-medium text-slate-200">{alert.attack_type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300">
                      {alert.source_ip}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        alert.severity === 'HIGH' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                        alert.severity === 'MEDIUM' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-1.5 rounded-full" 
                            style={{ width: `${alert.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{(alert.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {alert.acknowledged ? (
                        <span className="text-emerald-500 flex items-center justify-end gap-1 text-xs">
                          <Check className="w-3.5 h-3.5" /> Acknowledged
                        </span>
                      ) : (
                        <button 
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="text-indigo-400 hover:text-indigo-300 text-xs font-medium hover:underline transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
