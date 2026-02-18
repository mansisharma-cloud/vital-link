"use client";

import Link from "next/link";
import { Mail, Lock, Activity, ArrowRight } from "lucide-react";

export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <Activity className="h-10 w-10 text-blue-600" />
                        <span className="text-2xl font-black italic tracking-tighter">BioSense Live</span>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Welcome back.</h1>
                    <p className="text-slate-500 mt-2">Sign in to access your real-time health data.</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                        Sign In <ArrowRight className="h-5 w-5" />
                    </button>

                    <div className="text-center pt-4">
                        <p className="text-sm text-slate-500">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-blue-600 font-bold hover:underline">Create one for free</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
