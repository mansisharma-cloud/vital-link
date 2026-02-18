import { Brain, AlertTriangle, CheckCircle, Info, TrendingUp } from "lucide-react";

export default function Insights() {
    const risks = [
        { condition: "Diabetes", level: "Low", score: 15, color: "green", advice: "Maintain current glucose levels. Excellent stability." },
        { condition: "Hypertension", level: "Moderate", score: 45, color: "orange", advice: "Sodium intake has been slightly high recently. Monitor stress." },
        { condition: "Arrhythmia", level: "Low", score: 8, color: "green", advice: "Heart rhythm is within normal circadian variance." }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
                    <Brain className="h-10 w-10 text-indigo-600" /> Health Insights
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                    Our AI models analyze your long-term sensor data to provide early warnings and personalized health recommendations.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
                {risks.map((risk) => (
                    <div key={risk.condition} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${risk.color}-500/5 blur-3xl -translate-y-1/2 translate-x-1/2`}></div>

                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold">{risk.condition}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-${risk.color}-100 dark:bg-${risk.color}-900/40 text-${risk.color}-700 dark:text-${risk.color}-400`}>
                                {risk.level} Risk
                            </span>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500">Risk Score</span>
                                <span className="font-bold">{risk.score}%</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-${risk.color}-500 transition-all duration-1000`}
                                    style={{ width: `${risk.score}%` }}
                                ></div>
                            </div>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                            {risk.advice}
                        </p>

                        <button className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                            <Info className="h-4 w-4" /> View Full Report
                        </button>
                    </div>
                ))}
            </div>

            {/* Prediction Log */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-blue-400" /> Analysis History
                </h2>
                <div className="space-y-6">
                    <AnalysisHistoryItem
                        date="Today, 10:45 AM"
                        event="New Prediction Model Updated"
                        status="Complete"
                    />
                    <AnalysisHistoryItem
                        date="Yesterday, 9:20 PM"
                        event="Glucose Trend Anomaly Detected"
                        status="Alert"
                        isAlert
                    />
                    <AnalysisHistoryItem
                        date="Feb 17, 2026"
                        event="Weekly Health Summary Generated"
                        status="Complete"
                    />
                </div>
            </div>
        </div>
    );
}

function AnalysisHistoryItem({ date, event, status, isAlert }: any) {
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
