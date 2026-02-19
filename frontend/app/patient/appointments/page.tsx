"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Calendar,
    Clock,
    MapPin,
    User,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    Loader2,
    Download
} from "lucide-react";

interface Appointment {
    id: number;
    date: string;
    time: string;
    reason: string;
    status: string;
    doctor_name?: string;
    hospital_name?: string;
}

export default function PatientAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/patients/appointments`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) setAppointments(await res.json());
        } catch (err) {
            console.error("Error fetching appointments:", err);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const load = async () => {
            await fetchAppointments();
        };
        load();
    }, [filter, fetchAppointments]);

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold">Clinical Visits</h1>
                    <p className="text-slate-500 mt-1">Track your scheduled consultations and medical history.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                        {["All", "Upcoming", "Past"].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f.toLowerCase())}
                                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${filter === f.toLowerCase() ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button className="btn-primary flex items-center gap-2 px-6">
                        <MessageSquare size={18} /> Contact Doctor
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-10">
                {/* Appointment List */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="glass-card overflow-hidden">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Calendar className="text-blue-600" />
                                Schedule Timeline
                            </h3>
                            <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600">
                                <Download size={14} /> Export History
                            </button>
                        </div>

                        <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center gap-4">
                                    <Loader2 className="animate-spin text-blue-600" size={32} />
                                    <p className="text-slate-500 font-bold italic">Retrieving clinical records...</p>
                                </div>
                            ) : appointments.length === 0 ? (
                                <div className="py-20 flex flex-col items-center gap-6">
                                    <div className="w-16 h-16 rounded-[2rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                                        <Calendar size={32} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-slate-800 dark:text-white font-bold text-lg">No appointments found</p>
                                        <p className="text-slate-500 text-sm mt-1">There are no records matching your current filter.</p>
                                    </div>
                                </div>
                            ) : (
                                appointments.map(app => (
                                    <AppointmentItem key={app.id} app={app} />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column / FAQ & Support */}
                <div className="space-y-8">
                    <div className="glass-card p-8 border-b-8 border-blue-600">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <AlertCircle className="text-blue-600" />
                            Visit Guidelines
                        </h3>
                        <div className="space-y-6">
                            <GuidelineItem text="Arrive at least 15 minutes before your scheduled appointment time." />
                            <GuidelineItem text="Have your Patient ID (available in your profile) ready at the reception." />
                            <GuidelineItem text="Bring any recent reports or medical records not uploaded to the system." />
                            <GuidelineItem text="Notify the doctor immediately if there are sudden changes in telemetry readings." />
                        </div>
                    </div>

                    <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                            <MessageSquare size={120} />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Patient Support</h3>
                        <p className="text-slate-400 text-xs leading-relaxed mb-8">Need to reschedule or have questions about your visit? Contact our clinic management team directly.</p>
                        <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-bold text-blue-400 transition-all">Support Center</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AppointmentItem({ app }: { app: Appointment }) {
    const dateObj = new Date(app.date);
    const isPast = dateObj < new Date();

    return (
        <div className="p-8 flex items-center gap-8 group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-default">
            <div className="flex flex-col items-center min-w-[64px] py-2 border-r border-slate-100 dark:border-slate-800 pr-8">
                <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white leading-none">{dateObj.getDate()}</span>
            </div>

            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-colors ${isPast ? "bg-slate-100 text-slate-400" : "bg-blue-600 text-white shadow-blue-500/20"
                        }`}>
                        <User size={28} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{app.doctor_name || "Consultation Visit"}</h4>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                <Clock size={14} className="text-blue-500" /> {app.time}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                <MapPin size={14} className="text-emerald-500" /> Clinic Room A-12
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8 self-end md:self-center">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Status</p>
                        <div className={`flex items-center gap-2 font-bold text-sm ${isPast ? "text-slate-400" : "text-emerald-500"}`}>
                            {isPast ? "Completed" : "Confirmed"}
                            <CheckCircle2 size={16} />
                        </div>
                    </div>
                    <button className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-slate-300 hover:text-blue-600 transition-all">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function GuidelineItem({ text }: { text: string }) {
    return (
        <div className="flex gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">{text}</p>
        </div>
    );
}
