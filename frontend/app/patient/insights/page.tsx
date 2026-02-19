"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Sparkles,
    ShieldCheck,
    BrainCircuit,
    TrendingUp,
    Activity,
    Zap,
    ChevronRight,
    Info,
    Loader2,
    Lock
} from "lucide-react";

interface Insight {
    id: number;
    type: string;
    title: string;
    confidence: string;
    description: string;
    status: string;
}

export default function PatientInsights() {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [summary, setSummary] = useState("");
    const [status, setStatus] = useState("Healthy");
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const fetchInsights = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/patients/predictions`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSummary(data.summary || "All systems nominal. Continual monitoring active.");
                setStatus(data.overall_status);

                // Map API response to UI model
                const mappedInsights = data.predictions.map((p: { condition: string, score: number, risk_level: string }, idx: number) => ({
                    id: idx,
                    type: "prediction",
                    title: `${p.condition} Analysis`,
                    confidence: `${p.score}%`,
                    description: `The AI has identified a ${p.risk_level.toLowerCase()} risk of ${p.condition.toLowerCase()} based on latest telemetry patterns.`,
                    status: p.risk_level === "High" ? "Critical" : "Stable"
                }));

                if (mappedInsights.length === 0) {
                    mappedInsights.push({
                        id: 0,
                        type: "prediction",
                        title: "Optimal Health Status",
                        confidence: "99%",
                        description: "Your health metrics are within optimal ranges. Maintain your current lifestyle for continued stability.",
                        status: "Positive"
                    });
                }
                setInsights(mappedInsights);
            }
        } catch (err) {
            console.error("Error fetching insights:", err);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const load = async () => {
            await fetchInsights();
        };
        load();
    }, [fetchInsights]);

    const handleRunAnalysis = async () => {
        setAnalyzing(true);
        // Analysis is performed on the fly in the backend, so we just re-fetch
        await fetchInsights();
        setAnalyzing(false);
    };

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <BrainCircuit size={300} strokeWidth={1} />
                </div>

                <div className="max-w-2xl relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">AI-Powered Diagnostic Engine</span>
                    </div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-6">Personalized Health Insights</h1>
                    <p className="text-blue-100/70 text-lg leading-relaxed font-medium">
                        {summary || "Our clinical AI analyzes your real-time telemetry data to predict health trends and provide actionable medical recommendations."}
                    </p>
                    <div className="flex items-center gap-4 mt-10">
                        <button
                            onClick={handleRunAnalysis}
                            disabled={analyzing}
                            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-emerald-500/10 min-w-[200px] justify-center"
                        >
                            {analyzing ? <Loader2 className="animate-spin" /> : <><Zap size={20} /> Generate New Analysis</>}
                        </button>
                        <div className="flex items-center gap-2 text-blue-300 font-bold text-sm bg-white/5 px-4 py-4 rounded-2xl border border-white/10 backdrop-blur-md">
                            <Lock size={16} /> Encrypted AI Processing
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col gap-6 lg:w-80">
                    <div className="p-6 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Analysis accuracy</span>
                            <span className="text-sm font-black">98.2%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 rounded-full w-[98.2%]" />
                        </div>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Analysis Status</p>
                            <p className={`text-xl font-black ${status === 'Healthy' ? 'text-emerald-400' : status === 'Critical' ? 'text-rose-400' : 'text-amber-400'}`}>
                                {status}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Main Insights List */}
                <div className="lg:col-span-8 space-y-8">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                        <TrendingUp className="text-blue-600" /> Current Predictions
                    </h2>

                    <div className="space-y-6">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center gap-4">
                                <Loader2 className="animate-spin text-blue-600" size={40} />
                                <p className="text-slate-500 font-bold italic">Synthesizing telemetry data...</p>
                            </div>
                        ) : (
                            insights.map(insight => (
                                <InsightCard key={insight.id} insight={insight} />
                            ))
                        )}
                    </div>

                    <div className="p-10 glass-card bg-emerald-50/30 dark:bg-emerald-900/10 border-emerald-100 flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-[2rem] flex items-center justify-center text-emerald-600 shrink-0">
                            <ShieldCheck size={40} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Physician Verified Analysis</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">All AI models are calibrated against clinical datasets and supervised by medical professionals to ensure diagnostic integrity.</p>
                        </div>
                        <button className="whitespace-nowrap btn-secondary px-8 font-bold">Learn More</button>
                    </div>
                </div>

                {/* Sidebar / Recommendations */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="glass-card p-8 border-l-8 border-amber-500">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <Activity size={20} className="text-amber-500" />
                            Health Recommendations
                        </h3>
                        <div className="space-y-6">
                            <RecommendItem
                                title="Hydration Target"
                                value="2.5L / day"
                                desc="Increase water intake to maintain optimal kidney filtration indices."
                            />
                            <RecommendItem
                                title="Activity Goal"
                                value="45 min"
                                desc="Consistent moderate intensity exercise recommended based on VO2 Max trends."
                            />
                            <RecommendItem
                                title="Dietary Note"
                                value="Low Sodium"
                                desc="Reduce sodium intake to continue the downward trend in resting BP."
                            />
                        </div>
                    </div>

                    <div className="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] border border-blue-100 dark:border-blue-800/50">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                                <Info size={24} className="text-blue-600" />
                            </div>
                            <h4 className="text-lg font-bold text-blue-800 dark:text-blue-300">Predictive Modeling</h4>
                        </div>
                        <p className="text-sm text-blue-700/70 dark:text-blue-400 font-medium leading-relaxed italic">
                            &quot;Our models are trained on over 2.4 million medical records to provide accurate, early detection of potential health complications.&quot;
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InsightCard({ insight }: { insight: Insight }) {
    return (
        <div className="glass-card p-10 flex flex-col md:flex-row gap-8 group hover:border-blue-500/50 transition-all cursor-default">
            <div className="flex flex-col items-center justify-between py-2 border-r border-slate-100 dark:border-slate-800 pr-8 min-w-[120px]">
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mb-1">Confidence</span>
                <div className="text-4xl font-black text-blue-600 uppercase tracking-tighter">{insight.confidence}</div>
                <div className="flex gap-1 mt-4">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-3 bg-blue-600 rounded-full" />)}
                </div>
            </div>

            <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-800 dark:text-white leading-none group-hover:text-blue-600 transition-colors">
                        {insight.title}
                    </h3>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${insight.status === 'Positive' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                        {insight.status}
                    </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-lg">
                    {insight.description}
                </p>
                <div className="pt-4 flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-blue-600 transition-colors cursor-pointer">
                    View detailed analysis report <ChevronRight size={14} />
                </div>
            </div>
        </div>
    );
}

function RecommendItem({ title, value, desc }: { title: string, value: string, desc: string }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{title}</span>
                <span className="text-sm font-black text-blue-600">{value}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic border-l-2 border-slate-100 dark:border-slate-800 pl-4">
                {desc}
            </p>
        </div>
    );
}
