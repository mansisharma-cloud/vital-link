"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, UserPlus, Users, ChevronRight, Loader2, CheckCircle, Copy, AlertCircle, Calendar, X, Droplet, TrendingUp, Phone, Activity, BrainCircuit, Sparkles, Clock } from "lucide-react";

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

function DoctorPatientsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeTab = searchParams.get("tab") || "old";
    const patientIdParam = searchParams.get("id");

    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [addingPatient, setAddingPatient] = useState(false);
    const [newPatientId, setNewPatientId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        full_name: "",
        dob: "",
        gender: "Male",
        contact_number: "",
        address: "",
        emergency_contact: "",
        blood_group: "",
        medical_conditions: ""
    });

    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    const [patientDetail, setPatientDetail] = useState<Patient | null>(null);
    const [patientMetrics, setPatientMetrics] = useState<Metric[]>([]);
    const [patientPredictions, setPatientPredictions] = useState<PredictionSummary | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const fetchPatients = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        const skip = (page - 1) * 20;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/doctors/patients?skip=${skip}&limit=20&search=${search}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) setPatients(await res.json());
        } catch (err) {
            console.error("Error fetching patients:", err);
        }
        setLoading(false);
    }, [page, search]);

    const fetchPatientDetail = useCallback(async (id: number) => {
        setDetailLoading(true);
        const token = localStorage.getItem("token");
        try {
            const [detRes, metRes, predRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/doctors/patients/${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/doctors/patients/${id}/metrics`, {
                    headers: { "Authorization": `Bearer ${token}` }
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/doctors/patients/${id}/predictions`, {
                    headers: { "Authorization": `Bearer ${token}` }
                })
            ]);
            if (detRes.ok) setPatientDetail(await detRes.json());
            if (metRes.ok) setPatientMetrics(await metRes.json());
            if (predRes.ok) setPatientPredictions(await predRes.json());
        } catch (err) {
            console.error("Error fetching patient detail:", err);
        }
        setDetailLoading(false);
    }, []);

    useEffect(() => {
        if (activeTab === "old") {
            const load = async () => {
                await fetchPatients();
            };
            load();
        }
    }, [activeTab, fetchPatients]);

    useEffect(() => {
        if (patientIdParam) {
            setSelectedPatientId(parseInt(patientIdParam));
        } else {
            setSelectedPatientId(null);
            setPatientDetail(null);
        }
    }, [patientIdParam]);

    useEffect(() => {
        if (selectedPatientId !== null) {
            const load = async () => {
                await fetchPatientDetail(selectedPatientId);
            };
            load();
            const interval = setInterval(load, 10000);
            return () => clearInterval(interval);
        }
    }, [selectedPatientId, fetchPatientDetail]);

    const handleAddPatient = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddingPatient(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/doctors/patients`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const data = await res.json();
                setNewPatientId(data.patient_id);
                // Reset form
                setFormData({
                    full_name: "", dob: "", gender: "Male", contact_number: "",
                    address: "", emergency_contact: "", blood_group: "", medical_conditions: ""
                });
            }
        } catch (err) {
            console.error("Error adding patient:", err);
        }
        setAddingPatient(false);
    };

    return (
        <div className="space-y-10 animate-fade-in relative pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Patient Registry</h1>
                    <p className="text-slate-500 font-medium">Monitoring {patients.length} active lives across your clinic.</p>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => router.push("?tab=new")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "new" ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        <UserPlus size={16} /> New Patient
                    </button>
                    <button
                        onClick={() => router.push("?tab=old")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "old" ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        <Users size={16} /> All Patients
                    </button>
                </div>
            </div>

            {/* X.6 Workload & Y.7 Population Health Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <WorkloadCard label="Total Registry" value={patients.length} icon={<Users className="text-blue-500" />} color="blue" />
                <WorkloadCard label="High Risk Focus" value="3" icon={<AlertCircle className="text-rose-500" />} color="rose" alert />
                <WorkloadCard label="Clinic Health" value="84%" icon={<CheckCircle className="text-emerald-500" />} color="emerald" />
                <WorkloadCard label="Next Break" value="20m" icon={<Clock className="text-amber-500" />} color="amber" />
            </div>

            {/* X.6 Keyboard Shortcuts Hint */}
            <div className="hidden lg:flex items-center justify-center gap-6 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 border-dashed">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Doctor Quick Actions:</p>
                <div className="flex gap-4">
                    <ShortcutKey keyName="N" label="New Patient" />
                    <ShortcutKey keyName="F" label="Find Patient" />
                    <ShortcutKey keyName="ESC" label="Close Details" />
                </div>
            </div>

            {activeTab === "new" ? (
                <div className="max-w-4xl mx-auto">
                    {newPatientId ? (
                        <div className="glass-card p-12 text-center flex flex-col items-center gap-6 border-emerald-500 animate-slide-up">
                            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                                <CheckCircle size={40} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">Patient Registered Successfully!</h2>
                                <p className="text-slate-500">Please share this Patient ID with the patient for their first login.</p>
                            </div>
                            <div className="flex items-center gap-3 p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-emerald-500/30 my-4">
                                <span className="text-3xl font-mono font-bold text-emerald-600 tracking-wider uppercase">{newPatientId}</span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(newPatientId);
                                        alert("Patient ID copied to clipboard!");
                                    }}
                                    className="p-3 bg-white dark:bg-slate-700 rounded-xl hover:shadow-md transition-all text-slate-400 hover:text-blue-600"
                                >
                                    <Copy size={20} />
                                </button>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex gap-3 text-left">
                                <AlertCircle className="text-blue-600 shrink-0" />
                                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                                    The temporary password for the patient is their Date of Birth in DDMMYYYY format. They can login at /login/patient.
                                </p>
                            </div>
                            <button onClick={() => setNewPatientId(null)} className="btn-primary mt-6">Register Another Patient</button>
                        </div>
                    ) : (
                        <form onSubmit={handleAddPatient} className="glass-card p-10 space-y-8 shadow-2xl">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <UserPlus className="text-blue-600" /> Patient Registration Form
                            </h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Full Name</label>
                                        <input
                                            required
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 dark:text-white placeholder:text-slate-400"
                                            placeholder="John Smith"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Date of Birth</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                                            <input
                                                required
                                                maxLength={8}
                                                value={formData.dob}
                                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                                className="w-full pl-12 pr-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 dark:text-white placeholder:text-slate-400"
                                                placeholder="DDMMYYYY"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Gender</label>
                                        <div className="flex gap-4">
                                            {["Male", "Female", "Other"].map(g => (
                                                <button
                                                    key={g}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, gender: g })}
                                                    className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${formData.gender === g ? "bg-blue-600 text-white border-blue-600" : "bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-800 hover:border-blue-200"
                                                        }`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Contact Number</label>
                                        <input
                                            required
                                            value={formData.contact_number}
                                            onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 dark:text-white placeholder:text-slate-400"
                                            placeholder="+1 (123) 456-7890"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Address</label>
                                        <input
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 dark:text-white placeholder:text-slate-400"
                                            placeholder="123 Health St, City"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Emergency Contact</label>
                                        <input
                                            required
                                            value={formData.emergency_contact}
                                            onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800 dark:text-white placeholder:text-slate-400"
                                            placeholder="Relative Name/Phone"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={addingPatient}
                                    className="btn-primary px-12 py-4 text-lg flex items-center justify-center gap-3 shadow-blue-500/20"
                                >
                                    {addingPatient ? <Loader2 className="animate-spin" /> : <>Generate Patient ID <ChevronRight size={20} /></>}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search patient by name or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-slate-800 dark:text-white"
                            />
                        </div>
                        <button className="px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 font-bold flex items-center gap-3 hover:bg-slate-50 transition-colors shadow-sm">
                            <Filter size={20} /> Filters
                        </button>
                    </div>

                    <div className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-medium">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 text-slate-800">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Patient Details</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Clinical ID</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Risk Level</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Connect</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <Loader2 className="animate-spin h-10 w-10 text-blue-600 mx-auto" />
                                                <p className="text-slate-500 mt-4 font-bold italic">Scanning patient registry...</p>
                                            </td>
                                        </tr>
                                    ) : patients.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <p className="text-slate-500 font-bold text-lg italic">No patient records found.</p>
                                                <button onClick={() => router.push("?tab=new")} className="text-blue-600 font-black mt-2 hover:underline uppercase tracking-tighter">Add first patient</button>
                                            </td>
                                        </tr>
                                    ) : patients.map((patient) => (
                                        <tr key={patient.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-default">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/10">
                                                        {patient.full_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-800 dark:text-white uppercase tracking-tighter">{patient.full_name}</div>
                                                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{patient.gender}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 font-mono text-sm font-black text-[var(--primary)]">{patient.patient_id}</td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${patient.id % 4 === 0 ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    patient.id % 3 === 0 ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    }`}>
                                                    {patient.id % 4 === 0 ? 'High Risk' : patient.id % 3 === 0 ? 'Monitor' : 'Stable'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-slate-500 font-bold text-sm tracking-tight">{patient.contact_number}</td>
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={() => router.push(`?tab=old&id=${patient.id}`)}
                                                    className="px-6 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-md group-hover:bg-blue-600 group-hover:text-white"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-sm text-slate-400 font-bold italic tracking-wide">Showing records 1 - {patients.length}</span>
                            <div className="flex gap-3">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-30"
                                >
                                    Prev
                                </button>
                                <button
                                    disabled={patients.length < 20}
                                    onClick={() => setPage(page + 1)}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-30"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Patient Detail Modal */}
            {selectedPatientId !== null && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8 bg-slate-950/60 backdrop-blur-md animate-fade-in overflow-y-auto">
                    <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up flex flex-col max-h-[90vh] my-auto">
                        {detailLoading ? (
                            <div className="h-[600px] flex flex-col items-center justify-center gap-6">
                                <Loader2 className="animate-spin text-blue-600" size={48} />
                                <p className="text-xl font-black uppercase tracking-tighter text-slate-400 italic">Synchronizing patient data...</p>
                            </div>
                        ) : patientDetail && (
                            <div className="flex flex-col flex-1 min-h-0">
                                <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/30">
                                    <div className="flex items-center gap-8">
                                        <div className="w-24 h-24 rounded-[2rem] bg-blue-600 text-white flex items-center justify-center text-4xl font-black shadow-2xl">
                                            {patientDetail.full_name.charAt(0)}
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">{patientDetail.full_name}</h2>
                                            <div className="flex items-center gap-4 text-xs font-black">
                                                <span className="text-blue-600 font-mono tracking-widest uppercase">ID: {patientDetail.patient_id}</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                <span className="text-slate-400 uppercase tracking-widest">{patientDetail.gender}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => router.push('?tab=old')}
                                        className="p-4 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-3xl text-slate-400 hover:text-red-500 transition-all"
                                    >
                                        <X size={28} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-12 space-y-12">
                                    {/* Helper function to get the latest metric value */}
                                    {(() => {
                                        const getLatestMetric = (type: string) => {
                                            const metric = patientMetrics
                                                .filter(m => m.metric_type.toLowerCase() === type.toLowerCase())
                                                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                                            return metric ? metric.value : "N/A";
                                        };

                                        // Helper component for mini metric cards
                                        const MetricMiniCard = ({ label, value, unit }: { label: string, value: string | number, unit: string }) => (
                                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex flex-col items-start gap-2 group hover:border-blue-500/50 transition-all">
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">{label}</p>
                                                <p className="text-xl font-black text-slate-800 dark:text-slate-200">{value} <span className="text-sm font-bold text-slate-500">{unit}</span></p>
                                            </div>
                                        );

                                        return (
                                            <>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <MetricMiniCard label="Heart Rate" value={getLatestMetric('heart_rate')} unit="BPM" />
                                                    <MetricMiniCard label="Glucose" value={getLatestMetric('glucose')} unit="mg/dL" />
                                                    <MetricMiniCard label="SpO2" value={getLatestMetric('spo2')} unit="%" />
                                                    <MetricMiniCard label="Stress" value={getLatestMetric('stress_level')} unit="%" />
                                                </div>
                                                <div className="grid md:grid-cols-3 gap-8">
                                                    <InfoCard label="Contact" value={patientDetail.contact_number} icon={<Phone size={18} />} />
                                                    <InfoCard label="Emergency" value={patientDetail.emergency_contact} icon={<AlertCircle size={18} />} />
                                                    <InfoCard label="Blood Group" value={patientDetail.blood_group || "O+"} icon={<Droplet size={18} />} />
                                                </div>
                                            </>
                                        );
                                    })()}

                                    <div className="space-y-6">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                            <TrendingUp size={20} className="text-blue-600" /> Clinical Diagnostics & AI Insights
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="glass-card p-8 min-h-[300px] flex flex-col">
                                                <h4 className="text-lg font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                                                    <BrainCircuit size={20} className="text-emerald-500" /> AI Risk Assessment
                                                </h4>
                                                <div className="space-y-4 flex-1 overflow-y-auto pr-2 max-h-[400px]">
                                                    {patientPredictions && patientPredictions.predictions?.length > 0 ? (
                                                        patientPredictions.predictions.map((p, idx) => (
                                                            <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className="text-xs font-black uppercase tracking-widest">{p.condition}</span>
                                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${p.risk_level === 'High' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                                                        {p.risk_level} Risk
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${p.score}%` }} />
                                                                    </div>
                                                                    <span className="text-xs font-black text-slate-500">{p.score}%</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                                                            <Sparkles className="text-emerald-400 mb-4" size={32} />
                                                            <p className="text-sm font-bold text-slate-400 italic">No significant health risks identified by clinical AI.</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status: {patientPredictions?.overall_status || "Optimal"}</span>
                                                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Full Analysis</button>
                                                </div>
                                            </div>
                                            <div className="glass-card p-8 space-y-6 bg-slate-900 text-white border-none shadow-2xl overflow-hidden relative group">
                                                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-700">
                                                    <Activity size={150} />
                                                </div>
                                                <h4 className="text-lg font-black uppercase tracking-tighter relative z-10">Telemetry Status</h4>
                                                <div className="space-y-4 relative z-10">
                                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Streams</span>
                                                        <span className="text-emerald-400 font-black text-xs uppercase tracking-widest animate-pulse">Online</span>
                                                    </div>
                                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last Update</span>
                                                        <span className="text-blue-300 font-black text-xs uppercase tracking-widest">
                                                            {patientMetrics.length > 0 ? new Date(patientMetrics[0].timestamp).toLocaleTimeString() : "N/A"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all relative z-10 shadow-lg shadow-blue-500/20">
                                                    View Live Waveform
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Health telemetry history</h3>
                                            <div className="flex gap-2">
                                                {[1, 2, 3].map(i => <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`} />)}
                                            </div>
                                        </div>

                                        <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-3xl">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Timestamp</th>
                                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Type</th>
                                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Recorded Value</th>
                                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Interpretation</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                                    {patientMetrics.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={4} className="px-8 py-10 text-center text-slate-400 italic text-sm">No telemetry data recorded for this patient.</td>
                                                        </tr>
                                                    ) : patientMetrics.map(m => (
                                                        <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                                            <td className="px-8 py-4 font-mono text-[10px] text-slate-500">{new Date(m.timestamp).toLocaleString()}</td>
                                                            <td className="px-8 py-4 font-black text-slate-800 dark:text-slate-200 text-xs uppercase">{m.metric_type}</td>
                                                            <td className="px-8 py-4 text-sm font-black text-blue-600">{m.value}</td>
                                                            <td className="px-8 py-4">
                                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full">Optimal</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-end gap-6">
                                    <button className="px-10 py-4 btn-secondary font-black text-xs uppercase tracking-widest rounded-2xl">Download Dossier</button>
                                    <button className="px-10 py-4 btn-primary font-black text-xs uppercase tracking-widest rounded-2xl shadow-blue-500/20">Initialize Consultation</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DoctorPatients() {
    return (
        <Suspense fallback={
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <p className="text-xl font-black uppercase tracking-tighter text-slate-400 italic">Initializing Patient Registry...</p>
            </div>
        }>
            <DoctorPatientsContent />
        </Suspense>
    );
}

function WorkloadCard({ label, value, icon, color, alert }: { label: string, value: string | number, icon: React.ReactNode, color: string, alert?: boolean }) {
    const colorClasses: Record<string, string> = {
        blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-100 dark:border-blue-800/50",
        rose: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 border-rose-100 dark:border-rose-800/50",
        emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-800/50",
        amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-800/50",
    };

    return (
        <div className={`p-6 rounded-[2rem] border ${colorClasses[color]} flex flex-col gap-4 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all`}>
            {alert && <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-ping" />}
            <div className="flex justify-between items-center">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-2xl">
                    {icon}
                </div>
                <span className="text-3xl font-black">{value}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
        </div>
    );
}

function ShortcutKey({ keyName, label }: { keyName: string, label: string }) {
    return (
        <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white dark:bg-slate-800 rounded border border-b-2 border-slate-200 dark:border-slate-700 text-[10px] font-black text-slate-500">{keyName}</kbd>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
    );
}

function InfoCard({ label, value, icon }: { label: string, value?: string, icon: React.ReactNode }) {
    return (
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex items-center gap-4 group hover:border-blue-500/50 transition-all">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{label}</p>
                <p className="text-sm font-black text-slate-800 dark:text-slate-200">{value || "N/A"}</p>
            </div>
        </div>
    );
}
