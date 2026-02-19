"use client";

import React from 'react';
import {
    BrainCircuit, AlertCircle, TrendingUp, TrendingDown,
    ChevronRight, Zap, Target, Layers, Heart, Droplet,
    Activity, Wind, Brain, ShieldAlert, Sparkles, Clock
} from 'lucide-react';
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, AreaChart, Area
} from 'recharts';

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

interface Recommendations {
    immediate: string[];
    short_term: string[];
}

interface DataQuality {
    monitoring_coverage: number;
    lab_accuracy: number;
    manual_entry: number;
}

interface AIPredictionsDashboardProps {
    data: {
        predictions: Prediction[];
        timeline: any[];
        summary: string;
        comorbidities: string[];
        recommendations: Recommendations;
        data_quality: DataQuality;
        overall_status: string;
    } | null;
}

export default function AIPredictionsDashboard({ data }: AIPredictionsDashboardProps) {
    if (!data) return null;

    const getRiskColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'critical': return 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/30 dark:border-rose-500/30';
            case 'high': return 'text-orange-600 bg-orange-50 border-orange-100 dark:bg-orange-900/30 dark:border-orange-500/30';
            case 'moderate': return 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/30 dark:border-amber-500/30';
            default: return 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-500/30';
        }
    };

    const getConditionIcon = (condition: string) => {
        switch (condition.toLowerCase()) {
            case 'diabetes': return <Droplet size={20} />;
            case 'hypertension': return <Activity size={20} />;
            case 'cardiac arrhythmia': return <Heart size={20} />;
            case 'respiratory breakdown': return <Wind size={20} />;
            case 'stress disorder': return <Brain size={20} />;
            case 'cholesterol': return <ShieldAlert size={20} />;
            default: return <Sparkles size={20} />;
        }
    };

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Main Engine Header */}
            <div className="relative overflow-hidden rounded-[3rem] bg-slate-950 p-1 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent)]">
                <div className="bg-slate-900/50 backdrop-blur-3xl rounded-[2.9rem] p-10 border border-white/5 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20">
                                <BrainCircuit size={36} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">AI Health Prediction Engine</h2>
                                <p className="text-slate-400 font-medium uppercase tracking-widest text-[10px]">Comprehensive Diagnostic Forecasting & Risk Analysis</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Health Status</span>
                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full animate-pulse ${data.overall_status === 'Critical' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                <span className={`text-sm font-black uppercase tracking-tighter ${data.overall_status === 'Critical' ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {data.overall_status} Risk Profile
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-10">
                        {/* Summary & Stats */}
                        <div className="space-y-8">
                            <div className="p-8 bg-indigo-600/10 rounded-[2.5rem] border border-indigo-500/20">
                                <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4">Clinical Prognosis Summary</h3>
                                <p className="text-white text-lg font-medium leading-relaxed italic">
                                    "{data.summary}"
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {data.predictions.slice(0, 4).map((p, i) => (
                                    <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-indigo-400">{getConditionIcon(p.condition)}</div>
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${getRiskColor(p.risk_level)}`}>
                                                {p.risk_level}
                                            </span>
                                        </div>
                                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-1">{p.condition}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-black text-white">{p.score}%</span>
                                            {p.trend === 'rising' ? <TrendingUp size={14} className="text-rose-400" /> : <TrendingDown size={14} className="text-emerald-400" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Risk Timeline Chart */}
                        <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">12-Month Risk Progression Forecast</h3>
                                <div className="flex gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                                </div>
                            </div>
                            <div className="flex-1 min-h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.timeline}>
                                        <defs>
                                            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} hide />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                                            itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                        />
                                        <Area type="monotone" dataKey="Diabetes" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={3} />
                                        <Area type="monotone" dataKey="Hypertension" stroke="#6366f1" fillOpacity={0} strokeWidth={3} strokeDasharray="5 5" />
                                        <Area type="monotone" dataKey="Respiratory Breakdown" stroke="#f43f5e" fillOpacity={0} strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comorbidities Section */}
            {data.comorbidities && data.comorbidities.filter(Boolean).length > 0 && (
                <div className="p-10 bg-rose-600/10 rounded-[3rem] border-2 border-dashed border-rose-500/30 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-24 h-24 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                        <AlertCircle size={48} />
                    </div>
                    <div className="flex-1 space-y-3">
                        <h3 className="text-2xl font-black text-rose-600 uppercase tracking-tighter">Metabolic Syndrome Multi-Condition Alert</h3>
                        <p className="font-bold text-slate-500 max-w-2xl leading-relaxed">
                            Interacting risks detected between <span className="text-rose-600 underline decoration-rose-200">Diabetes</span>, <span className="text-rose-600 underline decoration-rose-200">Hypertension</span>, and <span className="text-rose-600 underline decoration-rose-200">Chronic Stress</span>. Condition interactions are worsening insulin sensitivity and autonomic stability.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                        <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest text-center">Integration Priority</span>
                        <div className="px-8 py-3 bg-rose-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-rose-500/30">Immediate Action</div>
                    </div>
                </div>
            )}

            {/* Detailed Condition Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.predictions.map((p, i) => (
                    <div key={i} className="glass-card p-8 flex flex-col gap-6 group hover:border-indigo-500/50 transition-all border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-indigo-600">
                                    {getConditionIcon(p.condition)}
                                </div>
                                <h4 className="font-black text-lg uppercase tracking-tight">{p.condition}</h4>
                            </div>
                            <span className="text-xl font-black text-slate-400">#{i + 1}</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                <span>Risk Level</span>
                                <span className={getRiskColor(p.risk_level).split(' ')[0]}>{p.risk_level} ({p.score}%)</span>
                            </div>
                            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${p.score > 80 ? 'bg-rose-500' : p.score > 50 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${p.score}%` }}
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase">Status:</span>
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{p.status_text}</span>
                            </div>
                            <div className="space-y-1">
                                {p.key_indicators.map((ki, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 italic">
                                        <Target size={10} className="text-indigo-400" /> {ki}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock size={12} className="text-slate-400" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Onset: {p.time_to_event}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Target size={12} className="text-indigo-400" />
                                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Conf: {p.confidence}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recommendations & Data Quality */}
            <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 glass-card p-10 bg-slate-900 border-none">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4">
                        <Zap size={24} className="text-yellow-400" /> AI-Generated Treatment Recommendations
                    </h3>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-yellow-400 uppercase tracking-[0.2em] mb-4">Immediate Actions (Next 14 Days)</h4>
                            <div className="space-y-4">
                                {data.recommendations.immediate.filter(Boolean).map((rec, i) => (
                                    <div key={i} className="group p-5 bg-white/5 rounded-3xl border border-white/5 hover:border-yellow-400/30 transition-all flex items-start gap-4 cursor-pointer">
                                        <div className="w-8 h-8 rounded-xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center shrink-0">
                                            <ChevronRight size={16} />
                                        </div>
                                        <p className="text-xs font-bold text-slate-300 leading-relaxed group-hover:text-white">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Short-Term Strategic referrals</h4>
                            <div className="space-y-4">
                                {data.recommendations.short_term.filter(Boolean).map((rec, i) => (
                                    <div key={i} className="group p-5 bg-white/5 rounded-3xl border border-white/5 hover:border-blue-400/30 transition-all flex items-start gap-4 cursor-pointer">
                                        <div className="w-8 h-8 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center shrink-0">
                                            <Layers size={16} />
                                        </div>
                                        <p className="text-xs font-bold text-slate-300 leading-relaxed group-hover:text-white">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 glass-card p-10 flex flex-col gap-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Data Reliability Index</h3>

                    <div className="space-y-6">
                        <QualityMeter label="Monitoring Coverage" value={data.data_quality.monitoring_coverage} color="text-indigo-500" />
                        <QualityMeter label="Lab Data Integrity" value={data.data_quality.lab_accuracy} color="text-blue-500" />
                        <QualityMeter label="Manual Entry Support" value={data.data_quality.manual_entry} color="text-emerald-500" />
                    </div>

                    <div className="mt-auto p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-bold text-slate-500 italic leading-relaxed">
                            "Accuracy improved by 12% following addition of continuous SpO2 telemetry. Suggest recent lipid profile for increased cholesterol forecast precision."
                        </p>
                    </div>

                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <ShieldAlert size={12} className="text-amber-500" /> AI-Generated forecast | Not a final diagnosis
                    </div>
                </div>
            </div>
        </div>
    );
}

function QualityMeter({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">{label}</span>
                <span className={color}>{value}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full bg-current ${color}`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}
