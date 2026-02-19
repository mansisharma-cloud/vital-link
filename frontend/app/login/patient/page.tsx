"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Calendar, Loader2, ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

export default function PatientLogin() {
    const router = useRouter();
    const [patientId, setPatientId] = useState("");
    const [dob, setDob] = useState(""); // DDMMYYYY
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/auth/patient/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ patient_id: patientId, dob }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Login failed");
            }

            const { access_token } = await res.json();
            localStorage.setItem("token", access_token);
            localStorage.setItem("role", "patient");

            router.push("/patient/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-4">
            <Link
                href="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Home
            </Link>

            <div className="w-full max-w-md animate-slide-down">
                <div className="flex flex-col items-center mb-10">
                    <Logo className="mb-4" />
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white mt-4">Patient Login</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-center">Enter your Unique Patient ID and Date of Birth as provided by your doctor</p>
                </div>

                <div className="glass-card p-10 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Patient ID</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={patientId}
                                    onChange={(e) => setPatientId(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. CITY-PID-1001"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date of Birth</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="DDMMYYYY"
                                    maxLength={8}
                                />
                            </div>
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">Format: DDMMYYYY (e.g., 25121990 for Dec 25, 1990)</p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Access Dashboard"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed text-center">
                            <b>Important:</b> Patients cannot register themselves. If you haven't received your Patient ID, please contact your hospital or doctor.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
