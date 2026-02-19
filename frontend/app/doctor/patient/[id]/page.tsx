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
    trend: string;
    time_to_event: string;
    confidence: number;
    key_indicators: string[];
    status_text: string;
}

interface PredictionSummary {
    predictions: Prediction[];
    timeline: any[];
    summary: string;
    comorbidities: string[];
    recommendations: {
        immediate: string[];
        short_term: string[];
    };
    data_quality: {
        monitoring_coverage: number;
        lab_accuracy: number;
        manual_entry: number;
    };
    overall_status: string;
}

import AIPredictionsDashboard from "@/components/AIPredictionsDashboard";
import PatientDashboardView from "@/components/PatientDashboardView";

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
    const [error, setError] = useState<string | null>(null);

    const fetchAllData = useCallback(async () => {
        const token = localStorage.getItem("token");
        try {
            // 1. Fetch patient details by clinical ID
            const detRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/doctors/patients/by-clinical-id/${encodeURIComponent(clinicalId)}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!detRes.ok) {
                const errorData = await detRes.json().catch(() => ({}));
                throw new Error(errorData.detail || `Clinical dossier for ${clinicalId} could not be retrieved.`);
            }
            const patientData = await detRes.json();
            setPatient(patientData);

            // 2. Fetch metrics and predictions using the clinical ID for predictions
            const [metRes, predRes, appRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/doctors/patients/${patientData.id}/metrics`, {
                    headers: { "Authorization": `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/predictions/patient/${encodeURIComponent(clinicalId)}/all`, {
                    headers: { "Authorization": `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/doctors/appointments`, {
                    headers: { "Authorization": `Bearer ${token}` }
                })
            ]);

            if (metRes.ok) setMetrics(await metRes.json());
            if (predRes.ok) {
                const pData = await predRes.json();
                setPredictions(pData);
            }
            if (appRes.ok) {
                const allApps = await appRes.json();
                setAppointments(allApps.filter((a: any) => a.patient_id === patientData.id));
            }
        } catch (err: any) {
            console.error("Error fetching data:", err);
            setError(err.message || "An unexpected error occurred while fetching clinical data.");
        } finally {
            setLoading(false);
        }
    }, [clinicalId]);

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 15000);
        return () => clearInterval(interval);
    }, [fetchAllData]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 dark:bg-slate-950">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
                <p className="text-xl font-black uppercase tracking-tighter text-slate-400 italic">Syncing Clinical Dossier...</p>
            </div>
        );
    }

    if (error || !patient) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 dark:bg-slate-950 p-6 text-center">
                <AlertCircle size={64} className="text-rose-500" />
                <div className="space-y-2">
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Clinical Access Error</h2>
                    <p className="text-slate-500 font-medium max-w-md mx-auto">{error || "The requested patient profile could not be located in the clinical registry."}</p>
                </div>
                <button
                    onClick={() => router.push('/doctor/patients')}
                    className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                >
                    Return to Registry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-32">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between pt-8">
                <button
                    onClick={() => router.push('/doctor/patients')}
                    className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                >
                    <ChevronLeft size={18} /> Back to Registry
                </button>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:border-indigo-500/50 transition-all shadow-sm">
                        <Edit3 size={14} /> Update EHR
                    </button>
                    <button
                        onClick={() => router.push('/doctor/appointments')}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                    >
                        <Calendar size={14} /> Schedule Visit
                    </button>
                </div>
            </div>

            {/* Profile Overview Card */}
            <div className="glass-card p-12 bg-slate-950 text-white relative overflow-hidden border-none shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <User size={240} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="w-40 h-40 rounded-[4rem] bg-indigo-600 text-white flex items-center justify-center text-6xl font-black shadow-2xl border-4 border-white/10 shrink-0">
                        {patient.full_name.charAt(0)}
                    </div>
                    <div className="space-y-6 text-center md:text-left flex-1">
                        <div>
                            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-3">{patient.full_name}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-6">
                                <span className="px-4 py-1.5 bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-indigo-300 border border-white/5">Clinical ID: {patient.patient_id}</span>
                                <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                                <span className="text-slate-400 uppercase font-black text-xs tracking-[0.2em]">{patient.gender} • DOB {patient.dob}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 border-t border-white/10">
                            <InfoItem label="Primary Contact" value={patient.contact_number} />
                            <InfoItem label="Blood Index" value={patient.blood_group || "O+"} />
                            <InfoItem label="Risk Status" value={predictions?.overall_status || "Stabilizing"} highlight />
                            <InfoItem label="E-Contact" value={patient.emergency_contact} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Patient View Section (Telemetry) */}
            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Patient Dashboard Overview</h2>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Syncing Live</span>
                </div>
                <PatientDashboardView metrics={metrics} />
            </section>

            {/* AI Prediction Section */}
            <section className="space-y-8">
                <AIPredictionsDashboard data={predictions} />
            </section>

            {/* Doctor Workflow Extensions */}
            <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    {/* History Table */}
                    <div className="glass-card overflow-hidden">
                        <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-600 rounded-xl text-white">
                                    <Activity size={20} />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tighter">Clinical Telemetry Stream</h3>
                            </div>
                            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">Export clinical data</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/80 dark:bg-slate-800/20 text-slate-400">
                                    <tr>
                                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest">Temporal marker</th>
                                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest">Biometric indicator</th>
                                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-center">Observed Value</th>
                                        <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-right">Interpretation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {metrics.map(m => (
                                        <tr key={m.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors group">
                                            <td className="px-10 py-5 font-mono text-[10px] text-slate-400">{new Date(m.timestamp).toLocaleString()}</td>
                                            <td className="px-10 py-5 font-black text-xs uppercase tracking-tight text-slate-600 dark:text-slate-300">{m.metric_type.replace('_', ' ')}</td>
                                            <td className="px-10 py-5 text-center">
                                                <span className="text-sm font-black text-indigo-600 group-hover:scale-110 transition-transform inline-block">{m.value}</span>
                                            </td>
                                            <td className="px-10 py-5 text-right">
                                                <span className="px-4 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Optimal Baseline</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {metrics.length === 0 && (
                                <div className="p-20 text-center opacity-30">
                                    <Sparkles size={48} className="mx-auto mb-4" />
                                    <p className="font-black uppercase tracking-widest text-xs italic">Waiting for telemetry uplink...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    {/* Visits */}
                    <div className="glass-card p-10 border-t-8 border-indigo-600">
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4">
                            <Calendar size={22} className="text-indigo-600" /> Clinical Engagements
                        </h3>
                        <div className="space-y-6">
                            {appointments.length > 0 ? (
                                appointments.map(app => (
                                    <div key={app.id} className="group p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 transition-all cursor-pointer">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    <Clock size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter">{app.date}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.time}</p>
                                                </div>
                                            </div>
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${app.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-500 leading-relaxed italic line-clamp-2">"{app.reason}"</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 opacity-50 space-y-4">
                                    <List size={32} className="mx-auto" />
                                    <p className="text-xs font-black uppercase tracking-widest italic">No clinical visits logged</p>
                                </div>
                            )}
                            <button className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all hover:scale-[1.02] shadow-xl">
                                Book New Consultation
                            </button>
                        </div>
                    </div>

                    {/* Medical Conditions Table */}
                    <div className="glass-card p-10 bg-indigo-950 text-white border-none shadow-2xl">
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4 text-indigo-300">
                            <AlertCircle size={22} /> Documented Comorbidities
                        </h3>
                        <div className="space-y-4">
                            <div className="p-6 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-colors">
                                <p className="text-sm font-medium leading-relaxed italic text-indigo-100">
                                    {patient.medical_conditions || "Standard clinical baseline. No significant prior comorbidities recorded."}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                <CheckCircle size={16} className="text-emerald-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Allergies: None Documented</span>
                            </div>
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
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 leading-none mb-2">{label}</p>
            <p className={`text-sm font-black uppercase tracking-tighter ${highlight ? 'text-indigo-400' : 'text-white'}`}>{value || "Evaluating..."}</p>
        </div>
    );
}
