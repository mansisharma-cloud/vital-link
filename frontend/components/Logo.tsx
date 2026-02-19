import { HeartPulse } from "lucide-react";

export default function Logo({ className = "", showText = true }: { className?: string, showText?: boolean }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
                <HeartPulse className="h-6 w-6" />
                <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900">
                    <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                </div>
            </div>
            {showText && (
                <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                    Data Management of the <span className="text-blue-600">Hospital</span>
                </span>
            )}
        </div>
    );
}
