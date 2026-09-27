"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet, Play, Loader2, AlertCircle } from "lucide-react";

export default function TrafficAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadAndAnalyze = () => {
    alert("Batch CSV processing via API to be fully implemented. Currently available via standard /api/detect.");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Traffic Analysis (Batch CSV)</h2>
        <p className="text-slate-400 mt-1">Upload a CSV file containing network flows for batch intrusion detection.</p>
      </div>

      <div 
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="flex justify-center mb-4">
          <div className="bg-slate-800 p-4 rounded-full">
            <Upload className="w-8 h-8 text-indigo-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Upload traffic CSV</h3>
        <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
          Drag and drop your network traffic CSV file here, or click to browse. The file should match the schema of the trained model.
        </p>
        
        <input 
          type="file" 
          id="csv-upload" 
          className="hidden" 
          accept=".csv"
          onChange={onFileChange}
        />
        <label 
          htmlFor="csv-upload" 
          className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors border border-slate-700"
        >
          Select File
        </label>

        {file && (
          <div className="mt-8 p-4 bg-slate-950 rounded-lg border border-slate-800 inline-flex items-center gap-3 text-left">
            <FileSpreadsheet className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="text-sm font-medium text-white">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
            <button className="ml-4 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition-colors flex items-center gap-2" onClick={uploadAndAnalyze}>
              <Play className="w-4 h-4" />
              Run Analysis
            </button>
          </div>
        )}
      </div>

      <div className="bg-blue-950/30 border border-blue-900/50 rounded-xl p-5 flex gap-4">
        <AlertCircle className="w-6 h-6 text-blue-400 shrink-0" />
        <div>
          <h4 className="font-medium text-blue-300">Required CSV Columns</h4>
          <p className="text-sm text-blue-400/80 mt-1">
            Ensure your CSV contains the features used during training: 
            <span className="font-mono text-xs bg-blue-900/40 px-1 py-0.5 rounded ml-1">dur, proto, service, state, spkts, dpkts...</span>
          </p>
        </div>
      </div>
    </div>
  );
}
