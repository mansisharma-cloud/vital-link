import Link from "next/link";
import { Activity, Shield, Heart, Zap, ChevronRight, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in">
            Continuous Health Monitoring, <br />
            <span className="text-blue-600 dark:text-blue-400">Non-Invasively.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            BioSense Live combines the power of bioelectronic sensors and AI to provide real-time metrics and early disease risk detection without a single needle prick.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all hover:scale-105"
            >
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/technology"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-slate-900 dark:text-slate-50 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Discover Our Tech
            </Link>
          </div>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-0 -z-10 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/3"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Activity className="h-8 w-8 text-blue-500" />}
              title="Real-time Streaming"
              description="Monitor heart rate, glucose, and stress levels continuously via secure WebSocket streaming from your device."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-indigo-500" />}
              title="AI Risk Alerts"
              description="Proprietary machine learning models analyze trends to predict early indicators for diabetes and hypertension."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-amber-500" />}
              title="Non-Invasive"
              description="No needles, no discomfort. Our advanced biosensors measure biomarkers through high-fidelity electronic skin patches."
            />
          </div>
        </div>
      </section>

      {/* Trust/Metric Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-white overflow-hidden relative shadow-2xl">
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Taking personalized healthcare to the next level.</h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                We bridge the gap between biomedical engineering and data science to give you a comprehensive look into your daily health trends.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3"><ChevronRight className="h-5 w-5 text-blue-300" /> HIPAA-compliant encryption</li>
                <li className="flex items-center gap-3"><ChevronRight className="h-5 w-5 text-blue-300" /> Clinical grade sensor precision</li>
                <li className="flex items-center gap-3"><ChevronRight className="h-5 w-5 text-blue-300" /> Seamless mobile synchronization</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-100 font-medium uppercase tracking-wider">Current User Status</p>
                  <p className="text-2xl font-bold">Health Score: 94/100</p>
                </div>
              </div>
              <div className="h-32 flex items-end gap-2 px-2">
                {[40, 60, 45, 80, 50, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/40 rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
              </div>
              <p className="text-center text-xs text-white/60 mt-4 uppercase font-bold tracking-[0.2em]">Sample Real-time Pulse</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 shadow-sm hover:shadow-xl">
      <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 inline-block group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-2 border-blue-500 pl-4">
        {description}
      </p>
    </div>
  );
}
