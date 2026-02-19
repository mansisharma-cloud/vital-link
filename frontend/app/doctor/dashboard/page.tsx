"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Users, UserPlus, Calendar, AlertCircle, TrendingUp, ChevronRight } from "lucide-react";

interface Doctor {
    id: number;
    full_name: string;
    hospital_name: string;
    hospital_address: string;
    hospital_contact: string;
    role: string;
    emergency_contact: string;
    consultation_timings: string;
}

interface Patient {
    id: number;
    patient_id: string;
    full_name: string;
}

export default function DoctorDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({
        totalPatients: 0,
        newPatients: 0,
        todayAppointments: 0,
        pendingActions: 2
    });
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);

    const fetchDoctor = useCallback(async (token: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/doctors/me`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) setDoctor(await res.json());
        } catch (err) {
            console.error("Error fetching doctor:", err);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        const token = localStorage.getItem("token");
        try {
            const [patRes, appRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/doctors/patients?limit=10`, {
                    headers: { "Authorization": `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/doctors/appointments`, {
                    headers: { "Authorization": `Bearer ${token}` }
                })
            ]);

            if (patRes.ok) {
                const patientsList = await patRes.json();
                setPatients(patientsList);
                setStats(prev => ({
                    ...prev,
                    totalPatients: patientsList.length,
                    newPatients: patientsList.slice(0, 5).length // Just as a simple metric
                }));
            }
            if (appRes.ok) {
                const apps = await appRes.json();
                setStats(prev => ({ ...prev, todayAppointments: apps.length }));
            }
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            await fetchStats();
            const token = localStorage.getItem("token");
            if (token) await fetchDoctor(token);
        };
        loadData();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, [fetchStats, fetchDoctor]);

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
                        Welcome back, <span className="text-blue-600">Dr. {doctor?.full_name?.split(' ').pop() || "Medical"}</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Here&apos;s what&apos;s happening at {doctor?.hospital_name || "your hospital"} today.</p>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <Calendar size={20} className="text-blue-600" />
                    <span className="font-bold text-slate-700 dark:text-slate-200">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Patients"
                    value={stats.totalPatients.toString()}
                    icon={<Users className="text-blue-600" />}
                    color="blue"
                    trend="+4% from last month"
                />
                <StatCard
                    title="New Patients"
                    value={stats.newPatients.toString()}
                    icon={<UserPlus className="text-emerald-600" />}
                    color="emerald"
                    trend="In last 7 days"
                />
                <StatCard
                    title="Today's Appointments"
                    value={stats.todayAppointments.toString()}
                    icon={<Calendar className="text-amber-600" />}
                    color="amber"
                    trend="Next: 2:00 PM"
                />
                <StatCard
                    title="Pending Actions"
                    value={stats.pendingActions.toString()}
                    icon={<AlertCircle className="text-rose-600" />}
                    color="rose"
                    trend="Requires attention"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">Recent Patients</h2>
                            <button className="text-blue-600 font-bold text-sm hover:underline">View All</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <th className="py-4 font-bold text-slate-400 uppercase text-xs tracking-widest">Patient</th>
                                        <th className="py-4 font-bold text-slate-400 uppercase text-xs tracking-widest">ID</th>
                                        <th className="py-4 font-bold text-slate-400 uppercase text-xs tracking-widest">Status</th>
                                        <th className="py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {patients.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-20 text-center text-slate-400 italic">No recent patient records.</td>
                                        </tr>
                                    ) : patients.map((patient) => (
                                        <tr key={patient.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold">
                                                        {patient.full_name?.charAt(0)}
                                                    </div>
                                                    <div className="font-semibold">{patient.full_name}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 font-mono text-sm text-slate-500">{patient.patient_id}</td>
                                            <td className="py-4">
                                                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">Active</span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <button
                                                    onClick={() => router.push(`/doctor/patients?tab=old&id=${patient.id}`)}
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                                                >
                                                    <ChevronRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Section */}
                <div className="space-y-8">
                    <div className="glass-card p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-blue-500/20">
                        <h3 className="text-xl font-bold mb-4">Quick Action</h3>
                        <p className="text-white/80 text-sm mb-6 leading-relaxed">Add a new patient to your hospital records and generate their unique ID instantly.</p>
                        <button
                            onClick={() => router.push('/doctor/patients?tab=new')}
                            className="w-full py-4 bg-white text-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                        >
                            <UserPlus size={20} /> Add New Patient
                        </button>
                    </div>

                    <div className="glass-card p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-emerald-500" />
                            Quick Insights
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-2 border-emerald-500/20 pl-4">
                                    &quot;Total patient registrations have increased by 12% this week compared to last month.&quot;
                                </p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-2 border-blue-500/20 pl-4">
                                    &quot;Recent check-ups indicate a trend in early hypertension detection in active adults.&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend: string;
    color: "blue" | "emerald" | "amber" | "rose";
}

function StatCard({ title, value, icon, trend, color }: StatCardProps) {
    const colorMap: Record<string, string> = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        rose: "bg-rose-50 text-rose-600"
    };

    return (
        <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl ${colorMap[color] || "bg-slate-50 text-slate-600"}`}>
                    {icon}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</div>
            </div>
            <div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{value}</div>
                <div className="text-xs font-medium text-slate-500 flex items-center gap-1 group">
                    {trend}
                </div>
            </div>
        </div>
    );
}
