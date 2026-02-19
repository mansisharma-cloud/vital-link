"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, ArrowLeft, Eye, EyeOff, HelpCircle } from "lucide-react";
import Logo from "@/components/Logo";

export default function DoctorLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/auth/doctor/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Invalid email or password.");
            }

            const { access_token } = await res.json();
            localStorage.setItem("token", access_token);
            localStorage.setItem("role", "doctor");
            if (rememberMe) localStorage.setItem("remember_me", email);

            router.push("/doctor/dashboard");
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
                className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-[var(--primary)] transition-colors font-medium text-sm"
            >
                <ArrowLeft size={18} />
                Back to Home
            </Link>

            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-10 text-center">
                    <Logo className="mb-6" />
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Doctor Login</h1>
                    <p className="text-slate-500 mt-2 font-medium">Welcome back, Please enter your professional credentials</p>
                </div>

                <div className="glass-card p-10 shadow-xl border-slate-200/60">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-12"
                                    placeholder="doctor@hospital.com"
                                    aria-label="Email Address"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2 px-1">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Password</label>
                                <Link href="#" className="text-xs font-bold text-[var(--primary)] hover:underline">Forgot Password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pl-12 pr-12"
                                    placeholder="••••••••"
                                    aria-label="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-1">
                            <input
                                type="checkbox"
                                id="remember-me"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-5 h-5 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                                Remember Me on this device
                            </label>
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
                            className="btn-primary w-full text-lg shadow-blue-500/20"
                        >
                            {loading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/50 text-center space-y-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup/doctor" className="text-[var(--primary)] font-bold hover:underline">
                                Register as a Doctor
                            </Link>
                        </p>
                        <Link
                            href="mailto:support@biosense.live"
                            className="text-xs font-bold text-slate-400 hover:text-[var(--primary)] transition-colors flex items-center justify-center gap-2"
                        >
                            Having trouble? Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
