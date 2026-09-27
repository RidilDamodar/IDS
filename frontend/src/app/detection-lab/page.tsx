"use client";

import { useState } from "react";
import { Play, ShieldAlert, CheckCircle, RefreshCcw, Loader2 } from "lucide-react";

export default function DetectionLab() {
  const [formData, setFormData] = useState({
    srcip: "192.168.1.100",
    dstip: "10.0.0.5",
    sport: "54321",
    dsport: "80",
    proto: "tcp",
    dur: "0.5",
    Spkts: "10",
    Dpkts: "8",
    sbytes: "1500",
    dbytes: "2000",
    sttl: "254",
    dttl: "252",
    sloss: "0",
    dloss: "0",
    Sload: "12000",
    Dload: "16000"
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateNormal = () => {
    setFormData({
      srcip: "192.168.1.100", dstip: "8.8.8.8", sport: "49152", dsport: "443", proto: "tcp",
      dur: "0.05", Spkts: "15", Dpkts: "12", sbytes: "1800", dbytes: "5400",
      sttl: "64", dttl: "64", sloss: "1", dloss: "1", Sload: "25000", Dload: "80000"
    });
  };

  const generateAttack = () => {
    setFormData({
      srcip: "10.0.0.42", dstip: "192.168.1.10", sport: "12345", dsport: "22", proto: "tcp",
      dur: "0.0001", Spkts: "2", Dpkts: "0", sbytes: "120", dbytes: "0",
      sttl: "254", dttl: "0", sloss: "0", dloss: "0", Sload: "960000", Dload: "0"
    });
  };

  const submitAnalysis = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Convert string inputs to correct types
    const features = { ...formData };

    try {
      const response = await fetch("http://localhost:8001/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Analysis failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Detection Lab</h2>
        <p className="text-slate-400 mt-1">Manually inject network traffic features to test the ML model.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form Panel */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Traffic Features</h3>
            <div className="flex gap-2 text-sm">
              <button onClick={generateNormal} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors">Load Normal</button>
              <button onClick={generateAttack} className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded transition-colors border border-red-900/50">Load Attack</button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {Object.entries(formData).map(([key, value]) => (
               <div key={key} className="space-y-1">
                 <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block">{key}</label>
                 <input 
                   type="text" 
                   name={key}
                   value={value}
                   onChange={handleChange}
                   className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                 />
               </div>
             ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <button 
              onClick={submitAnalysis} 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              Analyze Traffic
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="w-full lg:w-1/3 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6">Analysis Result</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
            {error ? (
              <div className="text-red-400 text-center p-4 bg-red-400/10 rounded-lg border border-red-400/20">
                {error}
              </div>
            ) : !result ? (
              <div className="text-slate-500 flex flex-col items-center">
                <ShieldAlert className="w-12 h-12 mb-3 opacity-20" />
                <p>Submit traffic to see ML prediction</p>
              </div>
            ) : (
              <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`p-6 rounded-xl border flex flex-col items-center text-center mb-6 ${result.is_attack ? 'bg-red-950/40 border-red-900/50' : 'bg-emerald-950/40 border-emerald-900/50'}`}>
                  {result.is_attack ? (
                    <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
                  ) : (
                    <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
                  )}
                  
                  <h4 className={`text-2xl font-bold mb-1 ${result.is_attack ? 'text-red-400' : 'text-emerald-400'}`}>
                    {result.prediction}
                  </h4>
                  <span className={`text-sm px-3 py-1 rounded-full font-medium ${result.is_attack ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    {result.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-sm">Confidence</span>
                    <span className="text-white font-medium">{(result.confidence * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-sm">Severity</span>
                    <span className={`font-bold ${result.severity === 'HIGH' ? 'text-red-500' : result.severity === 'MEDIUM' ? 'text-orange-400' : 'text-emerald-400'}`}>
                      {result.severity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-sm">Event ID</span>
                    <span className="text-slate-300 font-mono text-sm">#{result.event_id}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
