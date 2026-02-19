"use client";

import { useEffect, useState } from "react";
import {
    Heart,
    Activity,
    Calendar,
    AlertTriangle,
    Stethoscope,
    ArrowRight,
    Clock,
    ExternalLink,
    ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function PatientHome() {
    const [patient, setPatient] = useState<any>(null);
    const [metrics, setMetrics] = useState<any[]>([]);
    const [nextAppointment, setNextAppointment] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchData(token);
        }
    }, []);

    const fetchData = async (token: string) => {
        try {
            // Fetch profile
            const profRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/patients/me`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (profRes.ok) setPatient(await profRes.json());

            // Fetch metrics
            const metRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/patients/metrics`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (metRes.ok) setMetrics(await metRes.json());

            // Fetch appointments
            const appRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/patients/appointments`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (appRes.ok) {
                const apps = await appRes.json();
                // Simple logic to find next appointment
                const now = new Date();
                const futureApps = apps.filter((a: any) => new Date(a.date) >= now);
                if (futureApps.length > 0) setNextAppointment(futureApps[0]);
            }
        } catch (err) { }
    };

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
                        Hello, <span className="text-emerald-600">{patient?.full_name?.split(' ')[0] || "Patient"}</span>
                    </h1>
                    <p className="text-slate-500 font-medium italic">Everything looks good today. Keep up the healthy habits!</p>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <Calendar size={20} className="text-emerald-600" />
                    <span className="font-bold text-slate-700 dark:text-slate-200">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Latest Health Metrics Card */}
                <div className="glass-card p-8 flex flex-col gap-6 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Activity className="text-emerald-500" />
                            Latest Health Metrics
                        </h2>
                        <Link href="/patient/dashboard" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                            View Analytics <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <MetricBox
                            label="Heart Rate"
                            value="72"
                            unit="bpm"
                            icon={<Heart size={18} className="text-rose-500" />}
                            status="Normal"
                        />
                        <MetricBox
                            label="Glucose"
                            value="95"
                            unit="mg/dL"
                            icon={<Activity size={18} className="text-blue-500" />}
                            status="Normal"
                        />
                        <MetricBox
                            label="Blood Pressure"
                            value="120/80"
                            unit="mmHg"
                            icon={<Activity size={18} className="text-emerald-500" />}
                            status="Ideal"
                        />
                    </div>

                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shrink-0">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-emerald-800 dark:text-emerald-400 text-sm">Your average stress levels have dropped by 15% this week.</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5 italic">Great job on maintaining a balanced routine!</p>
                        </div>
                    </div>
                </div>

                {/* Doctor & Hospital Details */}
                <div className="glass-card p-8 flex flex-col items-center text-center gap-6 border-b-4 border-blue-600">
                    <div className="w-20 h-20 rounded-3xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shadow-inner">
                        <Stethoscope size={40} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Assigned Specialist</h3>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{patient?.doctor_name || "Dr. Medical Specialist"}</h2>
                        <p className="text-sm text-blue-600 font-bold mt-1 tracking-wide">{patient?.doctor_specialization || "General Physician"}</p>
                    </div>
                    <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Primary Hospital</p>
                        <p className="font-bold text-slate-700 dark:text-slate-300">{patient?.hospital_name || "Community Health Center"}</p>
                    </div>
                    <Link href="/patient/profile" className="btn-secondary w-full py-3 text-sm">View Full Profile</Link>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Next Appointment Card */}
                <div className="glass-card p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-slate-50 dark:text-slate-800 pointer-events-none group-hover:scale-110 transition-transform">
                        <Calendar size={120} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                <Clock className="text-amber-500" />
                                Next Appointment
                            </h3>
                            <p className="text-slate-500 font-medium">Don't forget your scheduled visit</p>
                        </div>

                        {nextAppointment ? (
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col items-center bg-blue-600 text-white p-4 rounded-3xl shadow-lg border-4 border-white dark:border-slate-800">
                                    <span className="text-xs font-bold uppercase">{new Date(nextAppointment.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                    <span className="text-2xl font-bold leading-none">{new Date(nextAppointment.date).getDate()}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase mb-1">Consultation at</p>
                                    <p className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">{nextAppointment.time}</p>
                                    <p className="text-sm text-slate-500 font-medium mt-1">{nextAppointment.reason}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-slate-400 italic font-medium p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center">
                                No upcoming appointments scheduled.
                            </div>
                        )}

                        <Link href="/patient/appointments" className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all underline decoration-2 underline-offset-4">
                            Manage Appointments <ChevronRight size={18} />
                        </Link>
                    </div>
                </div>

                {/* Recent Alerts Card */}
                <div className="glass-card p-8 flex flex-col gap-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <AlertTriangle className="text-rose-500" />
                        Recent System Alerts
                    </h3>
                    <div className="space-y-4">
                        <AlertBox
                            type="warning"
                            title="Weekly Report Available"
                            message="Your health summary for this week has been generated with AI insights."
                            time="2 hours ago"
                        />
                        <AlertBox
                            type="info"
                            title="Appointment Tomorrow"
                            message="Friendly reminder: You have a follow-up consultation with Dr. John at 2:00 PM."
                            time="1 day ago"
                        />
                    </div>
                    <button className="text-sm text-slate-400 font-bold hover:text-slate-700 transition-colors self-center">Mark all as read</button>
                </div>
            </div>
        </div>
    );
}

function MetricBox({ label, value, unit, icon, status }: any) {
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

function AlertBox({ type, title, message, time }: any) {
    const colors = type === 'warning' ? 'bg-amber-100/50 text-amber-700 border-amber-100' : 'bg-blue-100/50 text-blue-700 border-blue-100';
    return (
        <div className={`p-4 rounded-2xl border ${colors} flex flex-col gap-1`}>
            <div className="flex justify-between items-center">
                <span className="font-bold text-xs uppercase tracking-widest">{title}</span>
                <span className="text-[10px] opacity-70 font-semibold">{time}</span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">{message}</p>
        </div>
    );
}

function TrendingUp(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
    );
}
