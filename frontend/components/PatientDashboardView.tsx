"use client";

import React from 'react';
import {
    Heart, Droplet, Thermometer, Activity,
    TrendingUp, TrendingDown, Clock, Calendar
} from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    Tooltip, CartesianGrid
} from 'recharts';

interface Metric {
    id: number;
    metric_type: string;
    value: string | number;
    timestamp: string;
}

interface PatientDashboardViewProps {
    metrics: Metric[];
}

export default function PatientDashboardView({ metrics }: PatientDashboardViewProps) {
    const getLatestMetric = (type: string) => {
        const m = metrics
            .filter(m => m.metric_type.toLowerCase() === type.toLowerCase())
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
        return m ? m.value : "--";
    };

    const getMetricData = (type: string) => {
        return metrics
            .filter(m => m.metric_type.toLowerCase() === type.toLowerCase())
            .slice(0, 20)
            .reverse()
            .map(m => ({
                time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                value: typeof m.value === 'string' ? parseFloat(m.value) : m.value
            }));
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <MiniSummary
                    label="Pulse rate"
                    value={getLatestMetric('heart_rate')}
                    unit="bpm"
                    icon={<Heart className="text-rose-500" />}
                    color="rose"
                />
                <MiniSummary
                    label="Glucose"
                    value={getLatestMetric('glucose')}
                    unit="mg/dL"
                    icon={<Droplet className="text-blue-500" />}
                    color="blue"
                />
                <MiniSummary
                    label="SpO2"
                    value={getLatestMetric('spo2')}
                    unit="%"
                    icon={<Activity className="text-emerald-500" />}
                    color="emerald"
                />
                <MiniSummary
                    label="Temperature"
                    value={getLatestMetric('temperature')}
                    unit="°F"
                    icon={<Thermometer className="text-amber-500" />}
                    color="amber"
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                            <Heart size={20} className="text-rose-500" /> Cardiac Rhythm History
                        </h3>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">Continuous Telemetry</span>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={getMetricData('heart_rate')}>
                                <defs>
                                    <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="time" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} />
                                <YAxis domain={['auto', 'auto']} fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#f43f5e" fillOpacity={1} fill="url(#colorHr)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-8 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                            <Droplet size={20} className="text-blue-500" /> Glucose Dispersion
                        </h3>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">Real-time Sync</span>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={getMetricData('glucose')}>
                                <defs>
                                    <linearGradient id="colorGl" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="time" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} />
                                <YAxis domain={['auto', 'auto']} fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorGl)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MiniSummary({ label, value, unit, icon, color }: { label: string, value: any, unit: string, icon: any, color: string }) {
    const variants: any = {
        rose: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30",
        blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30",
        amber: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30",
    }
    return (
        <div className="glass-card p-6 flex flex-col gap-4 border-slate-100 dark:border-slate-800 group hover:shadow-lg transition-all">
            <div className="flex justify-between items-center">
                <div className={`p-2.5 rounded-xl ${variants[color]} border`}>
                    {icon}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">{value}</span>
                <span className="text-[10px] font-bold text-slate-400 lowercase">{unit}</span>
            </div>
        </div>
    )
}
