"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, GraduationCap, Stethoscope, Building2, Phone, Clock, FileText, Loader2, ArrowLeft, Plus } from "lucide-react";
import Logo from "@/components/Logo";

export default function DoctorSignup() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        qualification: "",
        role: "",
        hospital_id: "",
        new_hospital_name: "",
        new_hospital_address: "",
        new_hospital_contact: "",
        new_hospital_code: "",
        emergency_contact: "",
        consultation_timings: "",
        license_number: "",
    });

    const [hospitals, setHospitals] = useState<{ id: number; name: string }[]>([]);
    const [isAddingHospital, setIsAddingHospital] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/hospitals/`);
            if (res.ok) {
                const data = await res.json();
                setHospitals(data);
            }
        } catch (err) {
            console.error("Failed to fetch hospitals", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Prepare payload
        const payload = {
            ...formData,
            hospital_id: isAddingHospital ? null : (formData.hospital_id ? parseInt(formData.hospital_id) : null)
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/doctor/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Signup failed:", res.status, errorText);
                throw new Error(`Signup failed: ${res.status} ${errorText}`);
            }

            router.push("/login/doctor");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Registration failed";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4 flex flex-col items-center">
            <Link
                href="/login/doctor"
                className="self-start ml-24 mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Login
            </Link>

            <div className="w-full max-w-4xl animate-slide-down">
                <div className="flex flex-col items-center mb-10 text-center">
                    <Logo className="mb-4" />
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mt-4">Doctor Registration</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Join our medical network and start managing your patients efficiently</p>
                </div>

                <form onSubmit={handleSignup} className="grid md:grid-cols-2 gap-8 glass-card p-10 shadow-2xl relative">
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold border-l-4 border-blue-500 pl-3 mb-6">Personal Details</h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input name="full_name" required value={formData.full_name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-none" placeholder="Dr. John Doe" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-none" placeholder="john.doe@example.com" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Qualification</label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input name="qualification" required value={formData.qualification} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-none" placeholder="MBBS, MD" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Specialization</label>
                                <div className="relative">
                                    <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input name="role" required value={formData.role} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-none" placeholder="Cardiologist" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-none" placeholder="••••••••" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold border-l-4 border-emerald-500 pl-3 mb-6">Clinic/Hospital Info</h2>

                        {!isAddingHospital ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex justify-between">
                                    Select Hospital
                                    <button type="button" onClick={() => setIsAddingHospital(true)} className="text-blue-600 flex items-center gap-1 hover:underline text-xs">
                                        <Plus size={14} /> Add New
                                    </button>
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <select name="hospital_id" value={formData.hospital_id} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-none appearance-none">
                                        <option value="">-- Choose existing hospital --</option>
                                        {hospitals.map(h => (
                                            <option key={h.id} value={h.id}>{h.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider">New Hospital Details</h3>
                                    <button type="button" onClick={() => setIsAddingHospital(false)} className="text-slate-400 hover:text-red-500 text-xs">Cancel</button>
                                </div>
                                <input name="new_hospital_name" required value={formData.new_hospital_name} onChange={handleChange} className="w-full px-4 py-2 bg-white dark:bg-slate-800 rounded-lg text-sm outline-none border border-emerald-100 dark:border-emerald-800 focus:border-emerald-500" placeholder="Hospital Name" />
                                <input name="new_hospital_address" required value={formData.new_hospital_address} onChange={handleChange} className="w-full px-4 py-2 bg-white dark:bg-slate-800 rounded-lg text-sm outline-none border border-emerald-100 dark:border-emerald-800 focus:border-emerald-500" placeholder="Hospital Address" />
                                <div className="grid grid-cols-2 gap-2">
                                    <input name="new_hospital_contact" required value={formData.new_hospital_contact} onChange={handleChange} className="w-full px-4 py-2 bg-white dark:bg-slate-800 rounded-lg text-sm outline-none border border-emerald-100 dark:border-emerald-800 focus:border-emerald-500" placeholder="Contact Number" />
                                    <input name="new_hospital_code" required value={formData.new_hospital_code} onChange={handleChange} className="w-full px-4 py-2 bg-white dark:bg-slate-800 rounded-lg text-sm outline-none border border-emerald-100 dark:border-emerald-800 focus:border-emerald-500" placeholder="Code (e.g. CITY)" />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Emergency Contact</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input name="emergency_contact" required value={formData.emergency_contact} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-none" placeholder="+1..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Consultation Timings</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input name="consultation_timings" required value={formData.consultation_timings} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-none" placeholder="Mon-Fri 9-5" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">License Number (Optional)</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input name="license_number" value={formData.license_number} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-none" placeholder="LIC-123456" />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-6">
                        {error && (
                            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold text-center border border-red-200 dark:border-red-900/50">
                                {error}
                            </div>
                        )}
                        <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3">
                            {loading ? <Loader2 className="animate-spin" /> : "Complete Registration"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
