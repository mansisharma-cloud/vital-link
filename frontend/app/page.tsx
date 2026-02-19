import Link from "next/link";
import { User, Stethoscope } from "lucide-react";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center gap-12 animate-fade-in">
        <Logo className="scale-125 mb-8" />

        <div className="grid md:grid-cols-2 gap-8 w-full px-4">
          <Link
            href="/login/patient"
            className="group glass-card p-10 flex flex-col items-center text-center gap-6 hover:border-blue-500 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
          >
            <div className="w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-500">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-3 text-slate-800 dark:text-white">Login as Patient</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-[250px]">
                Access your health records, insights, and manage appointments.
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:w-full group-hover:rounded-xl transition-all duration-500 overflow-hidden font-semibold">
              <span className="whitespace-nowrap px-4 opacity-0 group-hover:opacity-100 transition-opacity">Continue as Patient</span>
              <span className="group-hover:hidden group-hover:w-0 transition-all">-&gt;</span>
            </div>
          </Link>

          <Link
            href="/login/doctor"
            className="group glass-card p-10 flex flex-col items-center text-center gap-6 hover:border-emerald-500 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
          >
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-500">
              <Stethoscope size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-3 text-slate-800 dark:text-white">Login as Doctor</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-[250px]">
                Manage patients, view health data, and schedule appointments.
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center group-hover:w-full group-hover:rounded-xl transition-all duration-500 overflow-hidden font-semibold">
              <span className="whitespace-nowrap px-4 opacity-0 group-hover:opacity-100 transition-opacity">Continue as Doctor</span>
              <span className="group-hover:hidden group-hover:w-0 transition-all">-&gt;</span>
            </div>
          </Link>
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Professional Medical Data Management System
        </p>
      </div>
    </div>
  );
}
