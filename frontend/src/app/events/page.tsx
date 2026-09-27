"use client";

import { useEffect, useState } from "react";
import { Activity, Clock, Server, ArrowRight, Loader2, ShieldAlert, CheckCircle } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = () => {
    fetch("http://localhost:8001/api/events/recent")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch events", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && events.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Detection Events Log</h2>
        <p className="text-slate-400 mt-1">Real-time log of all analyzed network traffic flows.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs uppercase bg-slate-950/50 text-slate-500 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Time</th>
                <th className="px-6 py-4 font-semibold">Connection</th>
                <th className="px-6 py-4 font-semibold">Protocol</th>
                <th className="px-6 py-4 font-semibold">Prediction</th>
                <th className="px-6 py-4 font-semibold">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No traffic events analyzed yet.
                  </td>
                </tr>
              )}
              {events.map((event) => (
                <tr key={event.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                      <span>{event.source_ip}:{event.source_port}</span>
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                      <span>{event.destination_ip}:{event.destination_port}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 uppercase text-xs font-semibold text-indigo-300">
                    {event.protocol}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {event.is_attack ? (
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      )}
                      <span className={`font-medium ${event.is_attack ? 'text-red-400' : 'text-emerald-400'}`}>
                        {event.predicted_class}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs">{(event.confidence * 100).toFixed(1)}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
