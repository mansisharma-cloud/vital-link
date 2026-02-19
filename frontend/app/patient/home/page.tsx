"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Heart,
    Activity,
    Calendar,
    ArrowRight,
    Clock,
    TrendingUp
} from "lucide-react";
import Link from "next/link";

interface Patient {
    full_name: string;
}

interface Metric {
    metric_type: string;
    value: number;
    timestamp: string;
}

interface Appointment {
    date: string;
    time: string;
    reason: string;
}

export default function PatientHome() {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);

    const fetchData = useCallback(async (token: string) => {
        try {
            // Fetch profile
            const profRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/patients/me`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (profRes.ok) setPatient(await profRes.json());

            // Fetch metrics
            const metRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/patients/metrics`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (metRes.ok) setMetrics(await metRes.json());

            // Fetch appointments
            const appRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/patients/appointments`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (appRes.ok) {
                const apps = await appRes.json();
                // Simple logic to find next appointment
                const now = new Date();
                const futureApps = apps.filter((a: Appointment) => new Date(a.date) >= now);
                if (futureApps.length > 0) setNextAppointment(futureApps[0]);
            }
        } catch (err) {
            console.error("Error fetching patient data:", err);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const load = async () => {
                await fetchData(token);
            };
            load();
            const interval = setInterval(() => fetchData(token), 10000);
            return () => clearInterval(interval);
        }
    }, [fetchData]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
                        {getGreeting()}, <span className="text-[var(--primary)]">{patient?.full_name?.split(' ')[0] || "Patient"}</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg">
                        {metrics.length > 0 ? "Everything looks good today. Keep up the healthy habits!" : "Welcome! We're ready to track your health progress today."}
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <Calendar size={22} className="text-[var(--primary)]" />
                    <span className="font-black text-slate-800 dark:text-slate-200">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Latest Health Metrics Card */}
                <div className="glass-card p-10 flex flex-col gap-6 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                            <Activity className="text-blue-500" size={28} />
                            Your Latest Stats
                        </h2>
                        <Link href="/patient/dashboard" className="btn-secondary px-4 py-2 text-xs font-bold">
                            Detailed View <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <MetricBox
                            label="Heart Beat"
                            value="72"
                            unit="bpm"
                            icon={<Heart size={20} className="text-rose-500" />}
                            status="Healthy"
                        />
                        <MetricBox
                            label="Blood Sugar"
                            value="95"
                            unit="mg/dL"
                            icon={<Activity size={20} className="text-amber-500" />}
                            status="Stable"
                        />
                        <MetricBox
                            label="BP Level"
                            value="120/80"
                            unit="mmHg"
                            icon={<Activity size={20} className="text-emerald-500" />}
                            status="Ideal"
                        />
                    </div>

                    <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex gap-5 items-center">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shrink-0">
                            <TrendingUp size={28} />
                        </div>
                        <div>
                            <p className="font-black text-blue-900 dark:text-blue-400">Weekly Health Trend</p>
                            <p className="text-sm text-blue-700 dark:text-blue-500 mt-1">Your stress levels have dropped by 15% this week. Great job!</p>
                        </div>
                    </div>
                </div>

                {/* Y.6 Disease Risk Assessment Card */}
                <div className="glass-card p-10 flex flex-col gap-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-l-4 border-l-blue-500">
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Early Detection System</h3>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">Disease Risk Assessment</h2>
                    </div>

                    <div className="space-y-6">
                        <RiskIndicator label="Diabetes Risk" level="Low" color="emerald" />
                        <RiskIndicator label="Hypertension" level="Minimal" color="blue" />
                        <RiskIndicator label="Heart Health" level="Good" color="emerald" />
                    </div>

                    <Link href="/patient/insights" className="btn-primary w-full py-4 text-sm font-black shadow-blue-500/20">
                        View Detailed Insights
                    </Link>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Next Appointment Card */}
                <div className="glass-card p-10 relative overflow-hidden group border-b-4 border-b-amber-500/50">
                    <div className="absolute top-0 right-0 p-10 text-slate-100 dark:text-slate-800/20 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                        <Calendar size={180} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-10">
                        <div>
                            <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                                <Clock className="text-amber-500" size={28} />
                                Next Meeting
                            </h3>
                            <p className="text-slate-500 font-medium text-lg">Your upcoming doctor consultation</p>
                        </div>

                        {nextAppointment ? (
                            <div className="flex items-center gap-8">
                                <div className="flex flex-col items-center bg-amber-500 text-white p-6 rounded-3xl shadow-xl border-4 border-white dark:border-slate-800">
                                    <span className="text-sm font-black uppercase tracking-widest">{new Date(nextAppointment.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                    <span className="text-4xl font-black leading-none mt-1">{new Date(nextAppointment.date).getDate()}</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Scheduled for</p>
                                    <p className="text-3xl font-black text-slate-800 dark:text-white leading-tight">{nextAppointment.time}</p>
                                    <p className="text-base text-slate-500 font-medium mt-2 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                                        {nextAppointment.reason}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-slate-500 font-bold p-8 bg-slate-100/50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center text-lg">
                                No upcoming appointments.
                            </div>
                        )}

                        <Link href="/patient/appointments" className="btn-secondary self-start px-6 py-3 font-black text-sm">
                            Manage Appointments
                        </Link>
                    </div>
                </div>

                {/* X.5 Health Tips Card */}
                <div className="glass-card p-10 flex flex-col gap-8 bg-[var(--primary)] text-white relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 opacity-10">
                        <Heart size={240} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-3">Daily Health Tip</h3>
                        <h2 className="text-3xl font-black leading-tight mb-4">Drink 8 glasses of water today.</h2>
                        <p className="text-blue-100 font-medium text-lg leading-relaxed">
                            Staying hydrated helps your body maintain a healthy heart rate and keeps your energy levels high throughout the day.
                        </p>
                    </div>

                    <div className="mt-auto relative z-10 flex items-center gap-4 pt-6 border-t border-blue-400/30">
                        <Link href="#" className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all font-black text-sm">
                            Next Tip
                        </Link>
                        <p className="text-xs font-bold text-blue-100">7-day hydration goal in progress 💧</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RiskIndicator({ label, level, color }: { label: string, level: string, color: string }) {
    const colorClasses: Record<string, string> = {
        emerald: "bg-emerald-500",
        blue: "bg-blue-500",
        amber: "bg-amber-500",
        rose: "bg-rose-500"
    };
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-sm font-black text-slate-700 dark:text-slate-300">{label}</span>
                <span className="text-xs font-bold text-slate-500">{level}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${colorClasses[color]} w-1/4 animate-pulse`} />
            </div>
        </div>
    );
}

function MetricBox({ label, value, unit, icon, status }: { label: string, value: string | number, unit: string, icon: React.ReactNode, status: string }) {
    return (
        <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800/50 group hover:border-blue-500 transition-all cursor-default shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-700 shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">{status}</span>
            </div>
            <div>
                <div className="text-xl font-bold text-slate-800 dark:text-white">{value}<span className="text-xs font-medium text-slate-400 ml-1">{unit}</span></div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter mt-1">{label}</div>
            </div>
        </div>
    );
}




