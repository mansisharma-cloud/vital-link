"use client";

import { useHealthMetrics } from "@/hooks/useHealthMetrics";
import { useHealthPredictions, HealthRisk } from "@/hooks/useHealthPredictions";
import { Brain, AlertTriangle, CheckCircle, Info, TrendingUp, Activity } from "lucide-react";

export default function Insights() {
    const { currentMetric } = useHealthMetrics();
    const { prediction, loading } = useHealthPredictions(currentMetric);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
                    <Brain className="h-10 w-10 text-indigo-600" /> Health Insights
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                    Our AI models analyze your long-term sensor data to provide early warnings and personalized health recommendations.
                </p>
                {loading && <div className="mt-4 animate-pulse text-indigo-500 font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Analyzing live stream...
                </div>}
            </div>

            {!prediction ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                    <Activity className="h-16 w-16 text-indigo-500 animate-pulse mb-6" />
                    <h2 className="text-2xl font-bold mb-2">Initializing AI Engine</h2>
                    <p className="text-slate-500">Waiting for live sensor data to start analysis...</p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {prediction.predictions.length === 0 ? (
                        <div className="lg:col-span-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-12 rounded-[3rem] text-center">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                            <h2 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-4">You&apos;re in Great Shape!</h2>
                            <p className="text-green-700 dark:text-green-300 text-lg max-w-xl mx-auto">
                                Our AI models haven&apos;t detected any significant health risks. Continue your healthy lifestyle and regular monitoring.
                            </p>
                        </div>
                    ) : (
                        prediction.predictions.map((risk: HealthRisk, i: number) => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                                <div className={`absolute top-0 right-0 w-32 h-32 ${risk.risk_level === "High" ? "bg-red-500/5" : "bg-amber-500/5"} blur-3xl -translate-y-1/2 translate-x-1/2`}></div>

                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-xl font-bold">{risk.condition}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${risk.risk_level === "High" ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400" :
                                            "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
                                        }`}>
                                        {risk.risk_level} Risk
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-500">Confidence Score</span>
                                        <span className="font-bold">{risk.score}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${risk.risk_level === "High" ? "bg-red-500" : "bg-amber-500"} transition-all duration-1000`}
                                            style={{ width: `${risk.score}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                                    {risk.risk_level === "High" ?
                                        `Significant anomalies detected in your ${risk.condition.toLowerCase()} markers. We recommend consulting a healthcare professional.` :
                                        `Slight variations detected in ${risk.condition.toLowerCase()} trends. Keep monitoring and maintain a balanced diet.`
                                    }
                                </p>

                                <button className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                                    <Info className="h-4 w-4" /> Detailed Analysis
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Prediction Log */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-blue-400" /> Analysis History
                </h2>
                <div className="space-y-6">
                    <AnalysisHistoryItem
                        date="Today, 10:45 AM"
                        event="Real-time Prediction Model Updated"
                        status="Live"
                    />
                    <AnalysisHistoryItem
                        date="Yesterday, 9:20 PM"
                        event="Health Baseline Recalibrated"
                        status="Complete"
                    />
                </div>
            </div>
        </div>
    );
}

interface AnalysisHistoryItemProps {
    date: string;
    event: string;
    status: string;
    isAlert?: boolean;
}

function AnalysisHistoryItem({ date, event, status, isAlert }: AnalysisHistoryItemProps) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
            <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isAlert ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}>
                    {isAlert ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                </div>
                <div>
                    <p className="font-medium">{event}</p>
                    <p className="text-xs text-white/40">{date}</p>
                </div>
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest ${isAlert ? 'text-orange-500' : 'text-blue-400'}`}>
                {status}
            </span>
        </div>
    );
}
