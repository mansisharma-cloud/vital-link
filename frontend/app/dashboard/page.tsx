"use client";

import { useHealthMetrics } from "@/hooks/useHealthMetrics";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Heart, Activity, Thermometer, Zap } from "lucide-react";

export default function Dashboard() {
    const { metrics, currentMetric } = useHealthMetrics();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Health Dashboard</h1>
                    <p className="text-slate-500">Live monitoring of your non-invasive sensors</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Live Connection Active
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    icon={<Heart className="text-red-500" />}
                    label="Heart Rate"
                    value={currentMetric?.heart_rate || "--"}
                    unit="BPM"
                    color="red"
                />
                <MetricCard
                    icon={<Zap className="text-blue-500" />}
                    label="Glucose Level"
                    value={currentMetric?.glucose || "--"}
                    unit="mg/dL"
                    color="blue"
                />
                <MetricCard
                    icon={<Thermometer className="text-orange-500" />}
                    label="Temperature"
                    value={currentMetric?.temperature || "--"}
                    unit="°C"
                    color="orange"
                />
                <MetricCard
                    icon={<Activity className="text-purple-500" />}
                    label="Stress Level"
                    value={currentMetric?.stress_level || "--"}
                    unit="%"
                    color="purple"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="chart-container">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" /> Heart Rate Trend
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics}>
                                <defs>
                                    <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="timestamp" hide />
                                <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                                <Tooltip />
                                <Area type="monotone" dataKey="heart_rate" stroke="#ef4444" fillOpacity={1} fill="url(#colorHeart)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-500" /> Glucose Monitor
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metrics}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="timestamp" hide />
                                <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                                <Tooltip />
                                <Line type="monotone" dataKey="glucose" stroke="#3b82f6" strokeWidth={2} dot={false} animationDuration={300} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon, label, value, unit, color }: any) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30`}>
                    {icon}
                </div>
                <span className="text-sm text-slate-500 font-medium">{label}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">{value}</span>
                <span className="text-sm text-slate-400 font-medium uppercase">{unit}</span>
            </div>
        </div>
    );
}
