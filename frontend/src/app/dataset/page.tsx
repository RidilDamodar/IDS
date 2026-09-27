"use client";

import { useEffect, useState } from "react";
import { Database, FileCode2, Layers, Loader2 } from "lucide-react";

export default function DatasetPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8001/api/model/metrics")
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dataset info", err);
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

  if (!metrics || metrics.detail) {
    return <div className="text-red-400 p-6 bg-red-950/20 border border-red-900 rounded-xl">Error loading dataset information.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Dataset Analysis</h2>
        <p className="text-slate-400 mt-1">Information about the training data used for the ML engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center text-center">
          <div className="bg-indigo-500/10 p-4 rounded-full mb-4">
            <Database className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-slate-400 font-medium mb-1">Dataset Origin</h3>
          <p className="text-2xl font-bold text-white">{metrics.dataset_name}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center text-center">
          <div className="bg-emerald-500/10 p-4 rounded-full mb-4">
            <Layers className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-slate-400 font-medium mb-1">Total Training Samples</h3>
          <p className="text-2xl font-bold text-white">{metrics.training_samples.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center text-center">
          <div className="bg-orange-500/10 p-4 rounded-full mb-4">
            <FileCode2 className="w-8 h-8 text-orange-400" />
          </div>
          <h3 className="text-slate-400 font-medium mb-1">Total Features Used</h3>
          <p className="text-2xl font-bold text-white">{metrics.feature_count}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Supported Target Classes</h3>
        <div className="flex flex-wrap gap-3">
          {metrics.classes?.map((cls: string, idx: number) => (
            <div key={idx} className={`px-4 py-2 rounded-lg border text-sm font-medium ${cls === 'Normal' ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400' : 'bg-red-950/30 border-red-900/50 text-red-400'}`}>
              {cls}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
