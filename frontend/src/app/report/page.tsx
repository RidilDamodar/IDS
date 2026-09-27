"use client";

import { useEffect, useState } from "react";
import { FileText, Printer, Loader2 } from "lucide-react";

export default function ReportPage() {
  const [stats, setStats] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8001/api/dashboard/stats").then(res => res.json()),
      fetch("http://localhost:8001/api/model/metrics").then(res => res.json())
    ]).then(([statsData, metricsData]) => {
      setStats(statsData);
      setMetrics(metricsData);
      setLoading(false);
    }).catch(err => {
      console.error(err);
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center hide-on-print">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">IDS Security Report</h2>
          <p className="text-slate-400 mt-1">Generate and export a comprehensive system overview.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Export PDF / Print
        </button>
      </div>

      <div className="bg-white text-slate-900 p-10 rounded-xl printable-area">
        <div className="border-b-2 border-slate-200 pb-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold">Intrusion Detection System Report</h1>
          </div>
          <p className="text-slate-500">Generated on {new Date().toLocaleString()}</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold border-b border-slate-200 pb-2 mb-4">1. System Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-sm font-medium text-slate-500">Total Traffic Analyzed</p>
                <p className="text-2xl font-bold">{stats?.total_analyzed?.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-sm font-medium text-slate-500">Intrusions Detected</p>
                <p className="text-2xl font-bold text-red-600">{stats?.total_attacks?.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-sm font-medium text-slate-500">Active Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{stats?.active_alerts?.toLocaleString()}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold border-b border-slate-200 pb-2 mb-4">2. Machine Learning Model</h2>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-medium">Algorithm</span>
                <span>{metrics?.model_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-medium">Dataset</span>
                <span>{metrics?.dataset_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-medium">Accuracy</span>
                <span>{((metrics?.accuracy || 0) * 100).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">F1 Score</span>
                <span>{((metrics?.f1_score || 0) * 100).toFixed(2)}%</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold border-b border-slate-200 pb-2 mb-4">3. Ethical & Usage Notice</h2>
            <p className="text-slate-600 text-sm italic border-l-4 border-indigo-500 pl-4">
              This system is intended for authorized security testing and educational use in controlled environments. 
              The statistics generated are based on the internal ML model evaluation and simulated/ingested network traffic.
            </p>
          </section>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; }
          .hide-on-print { display: none !important; }
          .printable-area { box-shadow: none !important; }
          aside, header { display: none !important; }
          main { overflow: visible !important; height: auto !important; }
        }
      `}} />
    </div>
  );
}
