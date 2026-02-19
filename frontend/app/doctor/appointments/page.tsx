"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Calendar as CalendarIcon,
    Clock,
    Plus,
    MoreVertical,
    XCircle,
    Clock3,
    User,
    AlertCircle,
    Loader2
} from "lucide-react";

interface Patient {
    id: number;
    patient_id: string;
    full_name: string;
}

interface Appointment {
    id: number;
    patient_id: number;
    date: string;
    time: string;
    reason: string;
    status: string;
}

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);

    const [formData, setFormData] = useState({
        patient_id: "",
        date: "",
        time: "",
        reason: "",
        status: "Scheduled"
    });

    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const [appRes, patRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/doctors/appointments`, {
                    headers: { "Authorization": `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/doctors/patients`, {
                    headers: { "Authorization": `Bearer ${token}` }
                })
            ]);

            if (appRes.ok) setAppointments(await appRes.json());
            if (patRes.ok) setPatients(await patRes.json());
        } catch (err) {
            console.error("Error fetching initial data:", err);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const load = async () => {
            await fetchInitialData();
        };
        load();
    }, [fetchInitialData]);

    const handleBookAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        setBookingLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/doctors/appointments`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowBookingForm(false);
                fetchInitialData(); // Refresh list
                setFormData({ patient_id: "", date: "", time: "", reason: "", status: "Scheduled" });
            }
        } catch (err) {
            console.error("Error booking appointment:", err);
        }
        setBookingLoading(false);
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/doctors/appointments/${id}?status=${status}`, {
                method: "PATCH",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchInitialData();
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold">Appointment Management</h1>
                    <p className="text-slate-500 mt-1">Schedule and track patient consultations.</p>
                </div>
                <button
                    onClick={() => setShowBookingForm(true)}
                    className="btn-primary flex items-center gap-3 px-8 shadow-blue-500/30"
                >
                    <Plus size={20} /> New Appointment
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Left: Upcoming Appointments List */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card overflow-hidden">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                            <h2 className="text-xl font-bold flex items-center gap-3">
                                <CalendarIcon className="text-blue-600" /> Upcoming Visits
                            </h2>
                            <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-sm">All</button>
                                <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700">Today</button>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center">
                                    <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                                    <p className="text-slate-500 font-medium italic">Synchronizing your calendar...</p>
                                </div>
                            ) : appointments.length === 0 ? (
                                <div className="py-20 flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <CalendarIcon size={32} />
                                    </div>
                                    <p className="text-slate-500 font-medium">No appointments scheduled for this period.</p>
                                </div>
                            ) : (appointments.map(app => (
                                <AppointmentRow
                                    key={app.id}
                                    appointment={app}
                                    patients={patients}
                                    onUpdate={(status) => handleUpdateStatus(app.id, status)}
                                />
                            )))
                            }
                        </div>
                    </div>

                    {/* Calendar View Placeholder (As per requirement, a 'Calendar view' mentioned) */}
                    <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden h-64 border-none shadow-2xl">
                        <div className="relative z-10 flex flex-col h-full justify-center items-center text-center gap-4">
                            <CalendarIcon size={48} className="text-blue-400 opacity-50" />
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter">Integrated Calendar</h3>
                                <p className="text-slate-400 font-medium max-w-sm mt-2">Synchronize your appointments with clinical workflows and hospital schedules.</p>
                            </div>
                            <button className="px-6 py-2 border border-slate-700 rounded-full text-xs font-bold hover:bg-slate-800 transition-all uppercase tracking-widest text-blue-400">Expand Full View</button>
                        </div>
                        <div className="absolute inset-0 opacity-10 pointer-events-none grid grid-cols-7 grid-rows-4 gap-4 p-8">
                            {[...Array(28)].map((_, i) => (
                                <div key={i} className="border border-white rounded-lg" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Summary / Quick Form Toggle */}
                <div className="space-y-8">
                    <div className="glass-card p-8 border-b-8 border-emerald-500">
                        <h3 className="text-lg font-bold mb-6">Today&apos;s Performance</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Scheduled</span>
                                <span className="text-2xl font-black text-slate-800 dark:text-white">{appointments.length}</span>
                            </div>
                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full w-[0%]" />
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed italic">
                                &quot;Appointment density is low for today. Consider reviewing pending follow-up reports.&quot;
                            </p>
                        </div>
                    </div>

                    <div className="p-8 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
                        <div className="absolute -right-8 -bottom-8 p-12 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <Clock3 size={180} />
                        </div>
                        <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter relative z-10">Smart Scheduling</h3>
                        <p className="text-blue-100 leading-relaxed text-sm relative z-10">AI-optimized time slots help reduce patient wait-times and maximize clinic utilization.</p>
                        <div className="mt-8 flex items-center gap-3 relative z-10">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-900 bg-blue-400 flex items-center justify-center text-[10px] font-bold">P{i}</div>
                                ))}
                            </div>
                            <span className="text-xs font-bold text-blue-300">+12 Patients Managed today</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
                    <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 animate-slide-up flex flex-col max-h-full">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 flex-shrink-0">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter">Book Consultation</h2>
                                <p className="text-slate-500 text-sm mt-1 font-medium">Initialize a new patient visit record.</p>
                            </div>
                            <button onClick={() => setShowBookingForm(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-slate-400 hover:text-red-500 transition-all">
                                <XCircle size={28} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 lg:p-10">
                            <form onSubmit={handleBookAppointment} className="space-y-8 pb-4">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4 md:col-span-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Select Patient</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <select
                                                required
                                                value={formData.patient_id}
                                                onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-bold text-slate-800 dark:text-white"
                                            >
                                                <option value="">-- Choose patient from records --</option>
                                                {patients.map(p => (
                                                    <option key={p.id} value={p.id}>{p.full_name} ({p.patient_id})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Visit Date</label>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="date"
                                                required
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Preferred Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="time"
                                                required
                                                value={formData.time}
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-4">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Reason for Visit</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.reason}
                                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                            placeholder="Briefly describe the clinical reason..."
                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-medium resize-none shadow-inner min-h-[120px]"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-4 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
                                    <button type="button" onClick={() => setShowBookingForm(false)} className="flex-1 py-4 btn-secondary rounded-2xl font-bold uppercase tracking-widest text-[10px]">Cancel</button>
                                    <button
                                        type="submit"
                                        disabled={bookingLoading}
                                        className="flex-[2] py-4 btn-primary rounded-2xl font-bold flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
                                    >
                                        {bookingLoading ? <Loader2 className="animate-spin" /> : "Confirm Reservation"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function AppointmentRow({ appointment, patients, onUpdate }: { appointment: Appointment, patients: Patient[], onUpdate: (status: string) => void }) {
    const [showMenu, setShowMenu] = useState(false);
    const patient = patients.find(p => p.id === appointment.patient_id);
    const dateObj = new Date(appointment.date);

    const statusColors: Record<string, string> = {
        Scheduled: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
        Completed: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600",
        Cancelled: "bg-rose-100 dark:bg-rose-900/30 text-rose-600"
    };

    return (
        <div className="flex items-center gap-8 p-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
            <div className="flex flex-col items-center min-w-[60px]">
                <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white leading-none">{dateObj.getDate()}</span>
            </div>

            <div className="h-12 w-[1px] bg-slate-200 dark:bg-slate-800" />

            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                        <User size={28} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{patient?.full_name || "Patient Record"}</h4>
                        <div className="flex items-center gap-3 mt-1 underline decoration-blue-500/20 underline-offset-4">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                <Clock size={14} className="text-blue-500" /> {appointment.time}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                <AlertCircle size={14} className="text-amber-500" /> {appointment.reason}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8 self-end sm:self-center relative">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-transparent group-hover:border-white/20 ${statusColors[appointment.status]}`}>
                        {appointment.status}
                    </span>
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-slate-300 hover:text-blue-600 transition-all"
                        >
                            <MoreVertical size={20} />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-3 z-50 animate-fade-in">
                                {["Scheduled", "Completed", "Cancelled"].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => { onUpdate(s); setShowMenu(false); }}
                                        className="w-full text-left px-6 py-2.5 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
                                    >
                                        Mark as {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
