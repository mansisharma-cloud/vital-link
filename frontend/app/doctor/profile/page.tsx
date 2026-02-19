"use client";

import { useEffect, useState, useCallback } from "react";
import {
    User,
    Mail,
    GraduationCap,
    Stethoscope,
    Hospital as HospitalIcon,
    MapPin,
    Phone,
    Clock,
    FileText,
    Edit2,
    Save,
    Loader2,
    CheckCircle2,
    Camera
} from "lucide-react";

interface Doctor {
    id: number;
    doctor_id: string;
    full_name: string;
    specialization: string;
    qualification: string;
    hospital_name: string;
    hospital_address: string;
    contact_number: string;
    consultation_timings: string;
    role?: string;
    email?: string;
    license_number?: string;
    emergency_contact?: string;
    hospital_contact?: string;
}

export default function DoctorProfile() {
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Doctor>>({});

    const fetchProfile = useCallback(async (token: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/doctors/me`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDoctor(data);
                setFormData(data);
            }
        } catch (err) {
            console.error("Error fetching doctor profile:", err);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const load = async () => {
                await fetchProfile(token);
            };
            load();
        }
    }, [fetchProfile]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/doctors/me`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const updatedDoctor = await res.json();
                setDoctor(updatedDoctor);
                setEditing(false);
            }
        } catch { }
        setLoading(false);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold">Doctor Profile</h1>
                    <p className="text-slate-500 mt-1">Manage your professional identity and clinic preferences.</p>
                </div>
                <div className="px-6 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-2xl flex items-center gap-2 border border-blue-200 dark:border-blue-800 shadow-sm">
                    <CheckCircle2 size={20} />
                    <span className="font-bold text-sm tracking-wide">Verified Practitioner</span>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 relative">
                    <div className="absolute -bottom-16 left-12 group cursor-pointer">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-slate-900 border-8 border-[var(--background)] flex items-center justify-center text-blue-600 text-4xl font-black shadow-2xl transition-transform group-hover:scale-105">
                            {doctor?.full_name?.charAt(0) || "D"}
                        </div>
                        <div className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera size={16} />
                        </div>
                    </div>
                </div>

                <div className="pt-24 p-12 space-y-12">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">{doctor?.full_name || "Doctor Name"}</h2>
                            <p className="text-blue-600 font-bold tracking-widest uppercase text-sm mt-1">{doctor?.role || "Medical Specialist"}</p>
                            <div className="flex items-center gap-4 mt-6">
                                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl">
                                    <Mail size={14} /> {doctor?.email}
                                </div>
                                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl">
                                    <FileText size={14} /> License: {doctor?.license_number || "N/A"}
                                </div>
                            </div>
                        </div>
                        {!editing ? (
                            <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2 shadow-sm">
                                <Edit2 size={18} /> Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button onClick={() => setEditing(false)} className="btn-secondary px-6">Cancel</button>
                                <button onClick={handleUpdate} disabled={loading} className="btn-primary flex items-center gap-2 px-8 shadow-blue-500/20">
                                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                    Save Profile
                                </button>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 border-t border-slate-100 dark:border-slate-800 pt-12">
                        <ProfileInput
                            icon={<User />} label="Full Name"
                            value={formData?.full_name} editing={editing}
                            onChange={(v: string) => setFormData({ ...formData, full_name: v })}
                        />
                        <ProfileInput
                            icon={<GraduationCap />} label="Qualification"
                            value={formData?.qualification} editing={editing}
                            onChange={(v: string) => setFormData({ ...formData, qualification: v })}
                        />
                        <ProfileInput
                            icon={<Stethoscope />} label="Specialization"
                            value={formData?.role} editing={editing}
                            onChange={(v: string) => setFormData({ ...formData, role: v })}
                        />
                        <ProfileInput
                            icon={<Phone />} label="Emergency Contact"
                            value={formData?.emergency_contact} editing={editing}
                            onChange={(v: string) => setFormData({ ...formData, emergency_contact: v })}
                        />
                        <ProfileInput
                            icon={<Clock />} label="Consultation Timings"
                            value={formData?.consultation_timings} editing={editing}
                            onChange={(v: string) => setFormData({ ...formData, consultation_timings: v })}
                        />

                        <div className="space-y-4 md:col-span-2">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Clinic / Hospital Information</h3>
                            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex flex-col md:flex-row gap-12">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3 text-blue-600 font-bold">
                                        <HospitalIcon size={20} />
                                        <span className="text-xl">{doctor?.hospital_name || "Medical Center"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <MapPin size={18} />
                                        <span className="text-sm font-medium">{doctor?.hospital_address || "Hospital Address, City"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 py-4 px-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Facility Contact</p>
                                        <p className="font-bold text-slate-700 dark:text-slate-200">{doctor?.hospital_contact || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function ProfileInput({ icon, label, value, editing, onChange }: { icon: React.ReactNode, label: string, value?: string, editing?: boolean, onChange: (v: string) => void }) {
    return (
        <div className="space-y-3 group">
            <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] group-hover:text-blue-500 transition-colors">
                {icon} {label}
            </div>
            {editing ? (
                <input
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-5 py-3.5 bg-white dark:bg-slate-900 border-2 border-blue-500/10 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-800 dark:text-white transition-all shadow-sm"
                />
            ) : (
                <p className="text-lg font-bold text-slate-700 dark:text-slate-200 pl-1 border-b border-transparent">
                    {value || "Not specified"}
                </p>
            )}
        </div>
    );
}
