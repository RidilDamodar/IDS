"use client";

import { useEffect, useState } from "react";
import { Cpu, Target, Crosshair, BarChart2, Loader2 } from "lucide-react";

export default function ModelPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [features, setFeatures] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8001/api/model/metrics").then(res => res.json()),
      fetch("http://localhost:8001/api/model/features").then(res => res.json())
    ]).then(([metricsData, featuresData]) => {
      setMetrics(metricsData);
      setFeatures(featuresData);
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

  if (!metrics || metrics.detail) {
    return <div className="text-red-400 p-6 bg-red-950/20 border border-red-900 rounded-xl">Error loading model metrics. Ensure the model has been trained.</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Machine Learning Model</h2>
        <p className="text-slate-400 mt-1">Performance metrics and configuration of the active intrusion detection model.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Accuracy</p>
              <h3 className="text-3xl font-bold text-emerald-400 mt-2">{(metrics.accuracy * 100).toFixed(2)}%</h3>
            </div>
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Precision</p>
              <h3 className="text-3xl font-bold text-indigo-400 mt-2">{(metrics.precision * 100).toFixed(2)}%</h3>
            </div>
            <div className="bg-indigo-500/10 p-2 rounded-lg">
              <Crosshair className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Recall</p>
              <h3 className="text-3xl font-bold text-indigo-400 mt-2">{(metrics.recall * 100).toFixed(2)}%</h3>
            </div>
            <div className="bg-indigo-500/10 p-2 rounded-lg">
              <ActivityIcon className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">F1 Score</p>
              <h3 className="text-3xl font-bold text-indigo-400 mt-2">{(metrics.f1_score * 100).toFixed(2)}%</h3>
            </div>
            <div className="bg-indigo-500/10 p-2 rounded-lg">
              <BarChart2 className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Meta */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            Model Configuration
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-slate-400">Algorithm</span>
              <span className="font-medium text-white">{metrics.model_name}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-slate-400">Dataset</span>
              <span className="font-medium text-white">{metrics.dataset_name}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-slate-400">Training Samples</span>
              <span className="font-mono text-slate-300">{metrics.training_samples.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-slate-400">Testing Samples</span>
              <span className="font-mono text-slate-300">{metrics.testing_samples.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-slate-400">Feature Count</span>
              <span className="font-mono text-slate-300">{metrics.feature_count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Last Trained</span>
              <span className="font-medium text-slate-300">{new Date(metrics.trained_at).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Top Features Importance</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {features?.feature_importance?.slice(0, 10).map((f: any, idx: number) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-mono text-slate-300">{f.feature}</span>
                  <span className="text-slate-400">{(f.importance * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${f.importance * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}
