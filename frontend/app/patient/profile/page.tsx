"use client";

import { useEffect, useState } from "react";
import {
    User,
    Dna,
    MapPin,
    Phone,
    Calendar,
    Stethoscope,
    Hospital,
    Clock,
    ShieldCheck,
    Activity,
    GraduationCap,
    Edit2,
    Save,
    Loader2,
    Lock
} from "lucide-react";

export default function PatientProfile() {
    const [patient, setPatient] = useState<any>(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [contactNumber, setContactNumber] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) fetchProfile(token);
    }, []);

    const fetchProfile = async (token: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/patients/me`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPatient(data);
                setContactNumber(data.contact_number);
            }
        } catch (err) { }
    };

    const handleUpdateContact = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/patients/me`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ contact_number: contactNumber })
            });
            if (res.ok) {
                const updatedPatient = await res.json();
                setPatient(updatedPatient);
                setEditing(false);
            }
        } catch (err) { }
        setLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold">Personal Profile</h1>
                    <p className="text-slate-500 mt-1">Manage your identity and medical provider information.</p>
                </div>
                <div className="px-6 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck size={20} />
                    <span className="font-bold text-sm tracking-wide">Identity Verified</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Left Column: Personal Info */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="glass-card overflow-hidden">
                        <div className="h-40 bg-gradient-to-r from-emerald-600 to-blue-600 relative">
                            <div className="absolute -bottom-12 left-10">
                                <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-900 border-4 border-[var(--background)] flex items-center justify-center text-emerald-600 text-3xl font-bold shadow-xl">
                                    {patient?.full_name?.charAt(0) || "P"}
                                </div>
                            </div>
                        </div>

                        <div className="pt-20 p-10 space-y-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">{patient?.full_name || "Patient Name"}</h2>
                                    <div className="flex items-center gap-2 mt-2 font-mono text-blue-600 font-bold bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full w-fit text-sm">
                                        ID: {patient?.patient_id || "LOADING-ID"}
                                    </div>
                                </div>
                                {!editing ? (
                                    <button onClick={() => setEditing(true)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-white transition-all shadow-sm">
                                        <Edit2 size={20} />
                                    </button>
                                ) : (
                                    <button onClick={handleUpdateContact} disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg">
                                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                        Save Changes
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <ProfileField icon={<Calendar />} label="Date of Birth" value={patient?.dob_display || "Not specified"} locked />
                                <ProfileField icon={<Dna />} label="Gender" value={patient?.gender || "Not specified"} locked />

                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                        <Phone size={14} /> Contact Number
                                    </div>
                                    {editing ? (
                                        <input
                                            value={contactNumber}
                                            onChange={(e) => setContactNumber(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/10 border-2 border-blue-500/20 rounded-xl focus:border-blue-500 outline-none font-bold"
                                        />
                                    ) : (
                                        <p className="text-lg font-bold text-slate-800 dark:text-white pl-1">{patient?.contact_number || "Not specified"}</p>
                                    )}
                                </div>

                                <ProfileField icon={<MapPin />} label="Address" value={patient?.address || "Not specified"} locked />
                                <ProfileField icon={<Phone />} label="Emergency Contact" value={patient?.emergency_contact || "Not specified"} locked />
                                <ProfileField icon={<Activity />} label="Blood Group" value={patient?.blood_group || "Unknown"} locked />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-10 bg-rose-50/30 dark:bg-rose-900/10 border-rose-100/50">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-rose-700 dark:text-rose-400">
                            <AlertCircle className="shrink-0" />
                            Current Medical Conditions
                        </h3>
                        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-rose-100 dark:border-rose-800 shadow-sm leading-relaxed text-slate-600 dark:text-slate-400 italic">
                            {patient?.medical_conditions || "No recorded medical conditions at this time."}
                        </div>
                    </div>
                </div>

                {/* Right Column: Provider info */}
                <div className="space-y-10">
                    <div className="glass-card p-10 border-l-8 border-blue-600 bg-blue-50/20 dark:bg-blue-900/10">
                        <h3 className="text-lg font-bold mb-10 text-blue-800 dark:text-blue-400 flex items-center gap-2">
                            <Stethoscope size={20} /> Professional Healthcare Provider
                        </h3>

                        <div className="space-y-8">
                            <div className="flex gap-5">
                                <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-lg">
                                    {patient?.doctor_name?.charAt(0) || "D"}
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-slate-800 dark:text-white">{patient?.doctor_name || "Dr. Medical Specialist"}</h4>
                                    <p className="font-bold text-blue-600 dark:text-blue-400 text-sm mt-1">{patient?.doctor_specialization || "General Medicine"}</p>
                                </div>
                            </div>

                            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-blue-100 dark:border-blue-800/50 shadow-sm">
                                <div className="space-y-6">
                                    <ProviderDetail icon={<GraduationCap />} label="Qualification" value={patient?.doctor_qualification || "MD, General Specialist"} />
                                    <ProviderDetail icon={<Hospital />} label="Facility" value={patient?.hospital_name || "Hospital Medical Center"} />
                                    <ProviderDetail icon={<MapPin />} label="Location" value={patient?.hospital_address || "Medical District, Building 4"} />
                                    <ProviderDetail icon={<Clock />} label="Hours" value={patient?.consultation_timings || "Mon-Fri 09:00 - 17:00"} />
                                    <ProviderDetail icon={<Phone />} label="ER Contact" value={patient?.emergency_contact || "N/A"} color="text-rose-500" />
                                </div>
                            </div>

                            <button className="w-full py-4 btn-primary rounded-2xl font-bold mt-4 shadow-blue-500/20">
                                Request Consultation Appointment
                            </button>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
                            <ShieldCheck size={120} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 relative z-10">Secure Records</h3>
                        <p className="text-slate-400 text-sm leading-relaxed relative z-10">Your medical data is encrypted using clinical grade standards. Only you and your authorized provider can access these records.</p>
                        <button className="flex items-center gap-2 mt-8 font-bold text-emerald-400 hover:text-emerald-300 transition-colors text-sm relative z-10">
                            Privacy Policy & Data Rights <ExternalLink size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileField({ icon, label, value, locked }: any) {
    return (
        <div className="space-y-2 group">
            <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest group-hover:text-slate-500 transition-colors">
                {icon && <span className="opacity-70">{icon}</span>}
                {label}
                {locked && <Lock size={10} className="ml-1 opacity-40" />}
            </div>
            <p className={`text-lg font-bold ${locked ? "text-slate-700 dark:text-slate-300" : "text-slate-800 dark:text-white"} pl-1`}>
                {value}
            </p>
        </div>
    );
}

function ProviderDetail({ icon, label, value, color }: any) {
    return (
        <div className="flex gap-4">
            <div className={`p-2 rounded-xl bg-slate-50 dark:bg-slate-800 ${color || "text-blue-600"}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{label}</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">{value}</p>
            </div>
        </div>
    );
}

// Custom icons missed in lucide imports would be added here or fixed in imports above
function AlertCircle(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
    );
}

function ExternalLink(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
    );
}
