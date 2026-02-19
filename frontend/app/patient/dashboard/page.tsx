"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Activity,
    Heart,
    Thermometer,
    Droplet,
    Calendar,
    Download,
    TrendingUp,
    TrendingDown,
} from "lucide-react";

interface Metric {
    id: number;
    patient_id: number;
    metric_type: string;
    value: number;
    timestamp: string;
}

export default function PatientDashboard() {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [loading, setLoading] = useState(false);
    const [timeRange] = useState("Last 7 Days");

    const fetchMetrics = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/patients/metrics`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) setMetrics(await res.json());
        } catch (err) {
            console.error("Error fetching metrics:", err);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const load = async () => {
            await fetchMetrics();
        };
        load();
    }, [timeRange, fetchMetrics]);

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold">Health Analytics</h1>
                    <p className="text-slate-500 mt-1">Interactive visualization of your continuous health data.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                        {["7D", "1M", "3M"].map(range => (
                            <button
                                key={range}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${timeRange.includes(range) ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-blue-600 shadow-sm transition-all">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                <MetricSummary
                    label="Pulse Rate"
                    value={metrics.find(m => m.metric_type === "heart_rate")?.value || "72"}
                    unit="bpm"
                    trend="+2.1%" up icon={<Heart className="text-rose-500" />}
                    color="rose"
                />
                <MetricSummary
                    label="Blood Glucose"
                    value={metrics.find(m => m.metric_type === "glucose")?.value || "98"}
                    unit="mg/dL"
                    trend="-0.5%" icon={<Droplet className="text-blue-500" />}
                    color="blue"
                />
                <MetricSummary
                    label="Temperature"
                    value={metrics.find(m => m.metric_type === "temperature")?.value || "98.6"}
                    unit="°F"
                    trend="Stable" icon={<Thermometer className="text-amber-500" />}
                    color="amber"
                />
                <MetricSummary
                    label="SpO2 Levels"
                    value={metrics.find(m => m.metric_type === "spo2")?.value || "99"}
                    unit="%"
                    trend="+0.1%" up icon={<Activity className="text-emerald-500" />}
                    color="emerald"
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Heart Rate Visualization */}
                <div className="glass-card p-8 flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Heart className="text-rose-500" /> Heart Rate Trend
                        </h3>
                        <span className="text-xs font-bold text-slate-400">Avg: 70 bpm</span>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-1 mt-4">
                        {(metrics.filter(m => m.metric_type === "heart_rate").length > 0
                            ? metrics.filter(m => m.metric_type === "heart_rate").slice(0, 14).reverse().map(m => m.value)
                            : [65, 72, 68, 80]).map((v, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center group relative">
                                    <div
                                        style={{ height: `${(v / 150) * 100}%` }}
                                        className="w-full bg-blue-100 dark:bg-blue-900/40 rounded-t-lg group-hover:bg-blue-600 transition-all cursor-pointer relative"
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">{v} bpm</div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Glucose Visualization */}
                <div className="glass-card p-8 flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Droplet className="text-blue-500" /> Glucose Levels
                        </h3>
                        <span className="text-xs font-bold text-slate-400">Range: 70 - 140</span>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-3 mt-4 px-4 overflow-hidden relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-500/10 border-t border-dashed border-blue-500/20" />
                        {(metrics.filter(m => m.metric_type === "glucose").length > 0
                            ? metrics.filter(m => m.metric_type === "glucose").slice(0, 10).reverse().map(m => m.value)
                            : [95, 102, 98, 110]).map((v, i) => (
                                <div key={i} className="flex-1 flex items-center justify-center group">
                                    <div className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-blue-600 shadow-lg shadow-blue-500/30 flex items-center justify-center text-[10px] font-bold text-white group-hover:scale-125 transition-transform cursor-pointer relative z-10">
                                        {v}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Calendar size={20} className="text-blue-600" /> History Logs
                    </h3>
                    <button className="text-sm font-bold text-blue-600 hover:underline">View All Logs</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Value</th>
                                <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Interpretation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {loading ? (
                                <tr><td colSpan={4} className="py-10 text-center text-slate-400 italic font-medium">Loading history logs...</td></tr>
                            ) : metrics.length === 0 ? (
                                <tr><td colSpan={4} className="py-10 text-center">
                                    <p className="text-slate-500">No telemetry logs found for the selected period.</p>
                                    <div className="mt-4 flex gap-2 justify-center">
                                        {[1, 2, 3, 4].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-200 animate-pulse" />)}
                                    </div>
                                </td></tr>
                            ) : metrics.map(m => (
                                <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="py-4 font-mono text-xs text-slate-500">{new Date(m.timestamp).toLocaleString()}</td>
                                    <td className="py-4 font-bold text-slate-700 dark:text-slate-300">{m.metric_type}</td>
                                    <td className="py-4 font-black">{m.value}</td>
                                    <td className="py-4">
                                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">Normal Range</span>
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

interface MetricSummaryProps {
    label: string;
    value: string | number;
    unit: string;
    trend: string;
    up?: boolean;
    icon: React.ReactNode;
    color: "rose" | "blue" | "amber" | "emerald";
}

function MetricSummary({ label, value, unit, trend, up, icon, color }: MetricSummaryProps) {
    const colorMap: Record<string, string> = {
        rose: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/50",
        blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50",
        amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50",
        emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50"
    };

    return (
        <div className="glass-card p-6 flex flex-col gap-4 group hover:shadow-xl transition-all">
            <div className="flex justify-between items-center">
                <div className={`p-2.5 rounded-xl ${colorMap[color]} shadow-sm group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</div>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <div className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                        {value}<span className="text-xs font-bold text-slate-400 ml-1 lowercase">{unit}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {up ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-rose-500" />}
                    <span className={`text-xs font-bold ${up ? "text-emerald-500" : "text-rose-500"}`}>{trend}</span>
                </div>
            </div>
        </div>
    );
}
