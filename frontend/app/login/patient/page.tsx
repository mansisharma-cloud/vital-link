"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Calendar, Loader2, ArrowLeft, Eye, EyeOff, HelpCircle } from "lucide-react";
import Logo from "@/components/Logo";

export default function PatientLogin() {
    const router = useRouter();
    const [patientId, setPatientId] = useState("");
    const [dob, setDob] = useState(""); // DDMMYYYY
    const [showPassword, setShowPassword] = useState(false);
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
                throw new Error(data.detail || "Invalid Patient ID or Date of Birth");
            }

            const { access_token } = await res.json();
            localStorage.setItem("token", access_token);
            localStorage.setItem("role", "patient");

            router.push("/patient/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-6 animate-fade-in">
            <Link
                href="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-[var(--primary)] transition-colors font-medium"
            >
                <ArrowLeft size={18} />
                Back to Home
            </Link>

            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-10 text-center">
                    <Logo className="mb-6" />
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Patient Login</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Login with Patient ID and Date of Birth</p>
                </div>

                <div className="glass-card p-10 shadow-xl border-slate-200/60">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Patient ID</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={patientId}
                                    onChange={(e) => setPatientId(e.target.value)}
                                    className="input-field pl-12"
                                    placeholder="e.g. CITY-PID-1001"
                                    aria-label="Patient ID"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Date of Birth (Password)</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="input-field pl-12 pr-12"
                                    placeholder="DDMMYYYY"
                                    maxLength={8}
                                    aria-label="Date of Birth"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                                <b>Example:</b> If DOB is 15/04/1985, password is <b>15041985</b>
                            </p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold border border-red-100 dark:border-red-800/50 flex items-center gap-2">
                                <HelpCircle size={18} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full text-lg"
                        >
                            {loading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                "Access Dashboard"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/50 text-center">
                        <Link
                            href="mailto:support@biosense.live"
                            className="text-sm font-bold text-[var(--primary)] hover:underline flex items-center justify-center gap-2"
                        >
                            Can&apos;t log in? Contact your doctor
                        </Link>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-2">
                            Only registered patients can access this portal
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
