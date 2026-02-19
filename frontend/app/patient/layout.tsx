"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    Home,
    LayoutDashboard,
    Calendar,
    UserCircle,
    LogOut,
    ChevronRight,
    Menu,
    X,
    Bell,
    Activity,
    ChevronDown,
    Phone
} from "lucide-react";
import Logo from "@/components/Logo";

interface Patient {
    full_name: string;
    patient_id?: string;
    hospital_name?: string;
    doctor_emergency_contact?: string;
    doctor_name?: string;
    doctor_specialization?: string;
}

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const fetchPatientData = useCallback(async (token: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/patients/me`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setPatient(await res.json());
            } else {
                router.push("/login/patient");
            }
        } catch (err) {
            console.error("Failed to fetch patient profile", err);
        }
    }, [router]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "patient") {
            router.push("/login/patient");
            return;
        }

        const load = async () => {
            await fetchPatientData(token);
        };
        load();
    }, [router, fetchPatientData]);

    const handleLogout = () => {
        localStorage.clear();
        router.push("/");
    };

    const navItems = [
        { name: "Home", icon: <Home size={20} />, href: "/patient/home" },
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/patient/dashboard" },
        { name: "Insights", icon: <Activity size={20} />, href: "/patient/insights" },
        { name: "Appointments", icon: <Calendar size={20} />, href: "/patient/appointments" },
        { name: "Profile", icon: <UserCircle size={20} />, href: "/patient/profile" },
    ];

    return (
        <div className="min-h-screen bg-[var(--background)] flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}>
                <div className="h-full flex flex-col p-6">
                    <Logo className="mb-10" showText={false} />

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === item.href
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600"
                                    }`}
                            >
                                {item.icon}
                                <span className="font-semibold">{item.name}</span>
                                {pathname === item.href && <ChevronRight size={16} className="ml-auto" />}
                            </Link>
                        ))}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-semibold"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-bottom border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        >
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <div className="hidden lg:block">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Registration Location</h2>
                            <p className="font-bold text-slate-800 dark:text-white leading-none">
                                {patient?.hospital_name || "General Hospital"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* X.5 Emergency Contact Display */}
                        <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800/50">
                            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center animate-pulse">
                                <Phone size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest leading-none">Emergency Contact</p>
                                <p className="text-sm font-black text-rose-700 dark:text-rose-400 leading-none mt-1">
                                    {patient?.doctor_emergency_contact || "+1 (555) 000-应急"}
                                </p>
                            </div>
                        </div>

                        <button className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-[var(--primary)] transition-colors relative" aria-label="Notifications">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 p-1.5 pl-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[var(--primary)] transition-all shadow-sm"
                                aria-expanded={isProfileOpen}
                                aria-label="User Profile"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-black text-slate-800 dark:text-white leading-none">{patient?.full_name?.split(' ')[0] || "Patient"}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">{patient?.patient_id || "ID: --"}</p>
                                </div>
                                <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-md">
                                    {patient?.full_name?.charAt(0) || "P"}
                                </div>
                                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 animate-slide-down">
                                    <div className="flex flex-col gap-1 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                                        <p className="text-xs font-bold text-slate-400 uppercase">Assigned Doctor</p>
                                        <p className="text-sm font-semibold">{patient?.doctor_name || "Dr. Medical"}</p>
                                        <p className="text-xs text-slate-500 italic">{patient?.doctor_specialization || "General Physician"}</p>
                                    </div>
                                    <Link href="/patient/profile" className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium">
                                        <UserCircle size={16} /> View Profile
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 text-sm font-medium mt-1">
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
