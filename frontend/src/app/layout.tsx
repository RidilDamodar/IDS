import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Activity, ShieldAlert, BarChart3, Database, Cpu, FileText, Settings, Shield } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IDS Security Console",
  description: "Intrusion Detection System ML Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-50 flex h-screen overflow-hidden`}>
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">IDS Engine</h1>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              <li>
                <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                  <Activity className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="/detection-lab" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                  <Cpu className="w-5 h-5" />
                  <span>Detection Lab</span>
                </Link>
              </li>
              <li>
                <Link href="/traffic-analysis" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                  <BarChart3 className="w-5 h-5" />
                  <span>Traffic Analysis</span>
                </Link>
              </li>
              <li className="pt-4 pb-2 px-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monitoring</p>
              </li>
              <li>
                <Link href="/alerts" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                  <span>Alerts</span>
                </Link>
              </li>
              <li>
                <Link href="/events" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                  <Activity className="w-5 h-5" />
                  <span>Events</span>
                </Link>
              </li>
              <li className="pt-4 pb-2 px-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">System</p>
              </li>
              <li>
                <Link href="/dataset" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                  <Database className="w-5 h-5" />
                  <span>Dataset</span>
                </Link>
              </li>
              <li>
                <Link href="/model" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                  <Cpu className="w-5 h-5" />
                  <span>ML Model</span>
                </Link>
              </li>
              <li>
                <Link href="/report" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                  <span>Reports</span>
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
            Authorized educational use only.
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
          <header className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-medium text-slate-300">System Active</span>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-full border border-slate-700">Educational IDS Lab</span>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
