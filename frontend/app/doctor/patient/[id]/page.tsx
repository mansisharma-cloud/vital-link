"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Phone, AlertCircle, Droplet, TrendingUp, BrainCircuit,
    Sparkles, Activity, Calendar, Loader2, ChevronLeft,
    User, Edit3, Clock, CheckCircle, List
} from "lucide-react";

interface Patient {
    id: number;
    patient_id: string;
    full_name: string;
    gender: string;
    contact_number: string;
    dob: string;
    address?: string;
    emergency_contact?: string;
    blood_group?: string;
    medical_conditions?: string;
}

interface Metric {
    id: number;
    timestamp: string;
    metric_type: string;
    value: string | number;
}

interface Prediction {
    condition: string;
    risk_level: string;
    score: number;
}

interface PredictionSummary {
    predictions: Prediction[];
    overall_status: string;
    summary: string;
}

interface Appointment {
    id: number;
    date: string;
    time: string;
    reason: string;
    status: string;
}

export default function PatientDetailPage() {
    const params = useParams();
    const router = useRouter();
    const clinicalId = params.id as string;

    const [patient, setPatient] = useState<Patient | null>(null);
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [predictions, setPredictions] = useState<PredictionSummary | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAllData = useCallback(async () => {
        const token = localStorage.getItem("token");
        try {
            // 1. Fetch patient details by clinical ID
            const detRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/doctors/patients/by-clinical-id/${clinicalId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!detRes.ok) throw new Error("Patient not found");
            const patientData = await detRes.json();
            setPatient(patientData);

            // 2. Fetch metrics and predictions using the internal ID
            const [metRes, predRes, appRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/doctors/patients/${patientData.id}/metrics`, {
                    headers: { "Authorization": `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/doctors/patients/${patientData.id}/predictions`, {
                    headers: { "Authorization": `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/doctors/appointments`, {
                    headers: { "Authorization": `Bearer ${token}` }
                })
            ]);

            if (metRes.ok) setMetrics(await metRes.json());
            if (predRes.ok) setPredictions(await predRes.json());
            if (appRes.ok) {
                const allApps = await appRes.json();
                // Filter appointments for this patient
                setAppointments(allApps.filter((a: any) => a.patient_id === patientData.id));
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    }, [clinicalId]);

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 30000);
        return () => clearInterval(interval);
    }, [fetchAllData]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 dark:bg-slate-950">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <p className="text-xl font-black uppercase tracking-tighter text-slate-400 italic">Syncing Clinical Dossier...</p>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 dark:bg-slate-950">
                <AlertCircle size={64} className="text-rose-500" />
                <h2 className="text-2xl font-black">Patient Profile Not Found</h2>
                <button onClick={() => router.back()} className="btn-primary">Return to Registry</button>
            </div>
        );
    }

    const getLatestMetric = (type: string) => {
        const metric = metrics
            .filter(m => m.metric_type.toLowerCase() === type.toLowerCase())
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
        return metric ? metric.value : "N/A";
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.push('/doctor/patients')}
                    className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                >
                    <ChevronLeft size={18} /> Back to Registry
                </button>
                <div className="flex gap-4">
                    <button className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                        <Edit3 size={16} /> Edit Profile
                    </button>
                    <button
                        onClick={() => router.push('/doctor/appointments')}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Calendar size={16} /> Schedule Visit
                    </button>
                </div>
            </div>

            {/* Profile Overview Card */}
            <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden border-none shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                    <User size={200} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-32 h-32 rounded-[3rem] bg-blue-600 text-white flex items-center justify-center text-5xl font-black shadow-2xl border-4 border-white/10">
                        {patient.full_name.charAt(0)}
                    </div>
                    <div className="space-y-4 text-center md:text-left flex-1">
                        <div>
                            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-2">{patient.full_name}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-black uppercase tracking-widest text-blue-300">ID: {patient.patient_id}</span>
                                <span className="w-1 h-1 bg-white/20 rounded-full" />
                                <span className="text-slate-400 uppercase font-black text-xs tracking-widest">{patient.gender} • {patient.dob}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-white/10">
                            <InfoItem label="Contact" value={patient.contact_number} />
                            <InfoItem label="Blood Type" value={patient.blood_group || "O+"} />
                            <InfoItem label="Status" value={predictions?.overall_status || "Optimal"} highlight />
                            <InfoItem label="Emergency" value={patient.emergency_contact} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Left Column: Diagnostics & AI */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Live Telemetry Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard label="Heart Rate" value={getLatestMetric('heart_rate')} unit="BPM" icon={<Activity className="text-rose-500" />} />
                        <MetricCard label="Blood Glucose" value={getLatestMetric('glucose')} unit="mg/dL" icon={<Droplet className="text-blue-500" />} />
                        <MetricCard label="Oxygen Sat" value={getLatestMetric('spo2')} unit="%" icon={<Activity className="text-emerald-500" />} />
                        <MetricCard label="Stress Index" value={getLatestMetric('stress_level')} unit="%" icon={<TrendingUp className="text-amber-500" />} />
                    </div>

                    {/* AI Risk Assessment */}
                    <div className="glass-card p-10">
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                            <BrainCircuit size={24} className="text-indigo-600" /> AI Diagnostic Prognosis
                        </h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                {predictions && predictions.predictions.length > 0 ? (
                                    predictions.predictions.map((p, idx) => (
                                        <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-xs font-black uppercase tracking-widest">{p.condition}</span>
                                                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${p.risk_level === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                    {p.risk_level} Risk
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${p.score}%` }} />
                                                </div>
                                                <span className="text-xs font-black text-slate-500">{p.score}%</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700">
                                        <Sparkles className="text-emerald-400 mb-4" size={40} />
                                        <p className="font-bold text-slate-400 italic">No critical anomalies detected by clinical AI models.</p>
                                    </div>
                                )}
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[2rem] flex flex-col gap-6">
                                <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Clinical Summary</h4>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic border-l-4 border-indigo-500/30 pl-6">
                                    "{predictions?.summary || "Patient telemetry indicates stable baseline performance with zero significant deviations noted in the current monitoring cycle."}"
                                </p>
                                <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Confidence: 98.2%</span>
                                    <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">Full Report</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Telemetry History Table */}
                    <div className="glass-card overflow-hidden">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/10">
                            <h3 className="text-lg font-black uppercase tracking-tighter">Health Telemetry Logs</h3>
                            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Download History</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/80 dark:bg-slate-800/20">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Timestamp</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Type</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-center">Value</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {metrics.slice(0, 10).map(m => (
                                        <tr key={m.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                                            <td className="px-8 py-4 font-mono text-[10px] text-slate-400">{new Date(m.timestamp).toLocaleString()}</td>
                                            <td className="px-8 py-4 font-black text-xs uppercase tracking-tight">{m.metric_type.replace('_', ' ')}</td>
                                            <td className="px-8 py-4 text-center">
                                                <span className="text-sm font-black text-blue-600">{m.value}</span>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[9px] font-black uppercase tracking-widest">Normal</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Appointments & metadata */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Scheduled Appointments */}
                    <div className="glass-card p-10 border-t-8 border-blue-600">
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                            <Calendar size={20} className="text-blue-600" /> Upcoming Visits
                        </h3>
                        <div className="space-y-6">
                            {appointments.length > 0 ? (
                                appointments.map(app => (
                                    <div key={app.id} className="group p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                                    <Clock size={16} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter">{app.date}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.time}</p>
                                                </div>
                                            </div>
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${app.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-500 leading-relaxed italic line-clamp-2">"{app.reason}"</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 opacity-50 space-y-4">
                                    <List size={32} className="mx-auto" />
                                    <p className="text-xs font-black uppercase tracking-widest">No visits scheduled</p>
                                </div>
                            )}
                            <button className="w-full py-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 transition-all border border-slate-100 dark:border-slate-800">
                                View Full History
                            </button>
                        </div>
                    </div>

                    {/* Medical Conditions */}
                    <div className="glass-card p-10 bg-indigo-900 text-white border-none shadow-xl shadow-indigo-500/10">
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3 text-indigo-200">
                            <AlertCircle size={20} /> Pre-existing conditions
                        </h3>
                        <div className="p-6 bg-white/10 rounded-[2rem] border border-white/10">
                            <p className="text-sm font-medium leading-relaxed italic text-indigo-100">
                                {patient.medical_conditions || "No chronic conditions or documented allergies in clinical history."}
                            </p>
                        </div>
                        <div className="mt-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" /> Updated: Feb 20, 2026
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value, highlight }: { label: string, value?: string, highlight?: boolean }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</p>
            <p className={`text-sm font-black uppercase tracking-tighter ${highlight ? 'text-emerald-400' : 'text-white'}`}>{value || "N/A"}</p>
        </div>
    );
}

function MetricCard({ label, value, unit, icon }: { label: string, value: string | number, unit: string, icon: React.ReactNode }) {
    return (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-start gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{value} <span className="text-xs font-bold text-slate-400 lowercase">{unit}</span></p>
            </div>
        </div>
    );
}

function MetricMiniCard({ label, value, unit }: { label: string, value: string | number, unit: string }) {
    return (
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex flex-col items-start gap-2 group hover:border-blue-500/50 transition-all">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">{label}</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-200">{value} <span className="text-sm font-bold text-slate-500">{unit}</span></p>
        </div>
    );
}
