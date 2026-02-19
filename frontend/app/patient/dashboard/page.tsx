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

interface Appointment {
    id: number;
    date: string;
    time: string;
    reason: string;
    status: string;
    doctor_name?: string;
}

export default function PatientDashboard() {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [timeRange] = useState("Last 7 Days");

    const fetchData = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const [metRes, appRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/patients/metrics`, {
                    headers: { "Authorization": `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/patients/appointments`, {
                    headers: { "Authorization": `Bearer ${token}` }
                })
            ]);

            if (metRes.ok) setMetrics(await metRes.json());
            if (appRes.ok) setAppointments(await appRes.json());
        } catch (err) {
            console.error("Error fetching patient data:", err);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [fetchData]);

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-tighter text-slate-900 dark:text-white">Clinical Intelligence</h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Continuous health monitoring and diagnostic oversight.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                        {["7D", "1M", "3M"].map(range => (
                            <button
                                key={range}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${timeRange.includes(range) ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-indigo-600 shadow-sm transition-all">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid lg:grid-cols-4 gap-6">
                <MetricSummary
                    label="Pulse rate"
                    value={metrics.find(m => m.metric_type === "heart_rate")?.value || "72"}
                    unit="bpm"
                    trend="+2.1%" up icon={<Heart className="text-rose-500" />}
                    color="rose"
                />
                <MetricSummary
                    label="Glucose"
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
                    label="SpO2 Index"
                    value={metrics.find(m => m.metric_type === "spo2")?.value || "99"}
                    unit="%"
                    trend="+0.1%" up icon={<Activity className="text-emerald-500" />}
                    color="emerald"
                />
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Heart Rate Visualization */}
                        <div className="glass-card p-8 flex flex-col gap-8 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                                    <Heart className="text-rose-500" size={18} /> Cardiac Rhythm
                                </h3>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg: 70 bpm</span>
                            </div>
                            <div className="h-48 flex items-end justify-between gap-1 mt-4">
                                {(metrics.filter(m => m.metric_type === "heart_rate").length > 0
                                    ? metrics.filter(m => m.metric_type === "heart_rate").slice(0, 14).reverse().map(m => m.value)
                                    : [65, 72, 68, 80, 75, 70, 82, 78, 69, 72, 75, 71, 68, 70]).map((v, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center group relative">
                                            <div
                                                style={{ height: `${(Number(v) / 150) * 100}%` }}
                                                className="w-full bg-indigo-50 dark:bg-indigo-900/20 rounded-t-lg group-hover:bg-indigo-600 transition-all cursor-pointer relative"
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Glucose Visualization */}
                        <div className="glass-card p-8 flex flex-col gap-8 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                                    <Droplet className="text-blue-500" size={18} /> Glucose Flux
                                </h3>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Stable range</span>
                            </div>
                            <div className="h-48 flex items-center justify-between gap-3 mt-4 px-2 relative">
                                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:15px_15px]" />
                                {(metrics.filter(m => m.metric_type === "glucose").length > 0
                                    ? metrics.filter(m => m.metric_type === "glucose").slice(0, 8).reverse().map(m => m.value)
                                    : [95, 102, 98, 110, 105, 98, 92, 95]).map((v, i) => (
                                        <div key={i} className="w-8 h-8 rounded-xl border-2 border-white dark:border-slate-800 bg-indigo-600 shadow-lg flex items-center justify-center text-[9px] font-black text-white group-hover:scale-125 transition-transform cursor-pointer relative z-10">
                                            {v}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Telemetry History Section */}
                    <div className="glass-card p-8 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                                <Activity size={20} className="text-indigo-600" /> Biometric Stream
                            </h3>
                            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Full Analytics</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                                        <th className="py-4 text-[10px] font-black uppercase tracking-widest">Time marker</th>
                                        <th className="py-4 text-[10px] font-black uppercase tracking-widest">Indicator</th>
                                        <th className="py-4 text-[10px] font-black uppercase tracking-widest">Value</th>
                                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {metrics.slice(0, 10).map(m => (
                                        <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                            <td className="py-4 font-mono text-[10px] text-slate-400">{new Date(m.timestamp).toLocaleTimeString()}</td>
                                            <td className="py-4 font-black text-xs uppercase tracking-tight text-slate-600 dark:text-slate-300">{m.metric_type.replace('_', ' ')}</td>
                                            <td className="py-4 font-black text-indigo-600">{m.value}</td>
                                            <td className="py-4 text-right">
                                                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-100 dark:border-emerald-900/30">Stable</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    {/* Appointments Section for Patient */}
                    <div className="glass-card p-8 bg-indigo-950 text-white border-none shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Calendar size={120} strokeWidth={1} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4">
                                <Calendar size={22} className="text-indigo-400" /> Clinical Engagements
                            </h3>
                            <div className="space-y-4">
                                {appointments.length > 0 ? (
                                    appointments.map(app => (
                                        <div key={app.id} className="p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-1">{app.date}</p>
                                                    <p className="text-sm font-black uppercase tracking-tighter">{app.time}</p>
                                                </div>
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${app.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-300'}`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 italic">
                                                <Heart size={10} className="text-indigo-400" /> {app.doctor_name || "Assigned Physician"}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 opacity-30 space-y-4">
                                        <TrendingUp size={32} className="mx-auto" />
                                        <p className="text-[10px] font-black uppercase tracking-widest italic tracking-widest">No scheduled consultations</p>
                                    </div>
                                )}
                                <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 mt-4">
                                    Request Consultation
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Insight Card */}
                    <div className="glass-card p-8 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Health Intelligence</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                                    <TrendingDown size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recovery Index</p>
                                    <p className="text-sm font-black uppercase tracking-tighter text-slate-800 dark:text-white">Optimal Progress</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                                    <Activity size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Monitoring</p>
                                    <p className="text-sm font-black uppercase tracking-tighter text-slate-800 dark:text-white">Continuous Uplink</p>
                                </div>
                            </div>
                        </div>
                    </div>
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
