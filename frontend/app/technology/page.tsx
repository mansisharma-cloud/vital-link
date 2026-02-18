import { Microscope, Cpu, Zap, Beaker, Layers, Pocket } from "lucide-react";

export default function Technology() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-20 animate-fade-in">
                <h1 className="text-5xl font-extrabold mb-6">Our Innovation</h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                    BioSense Live is built at the intersection of bioelectronic engineering, material science, and deep learning.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
                <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <Cpu className="text-blue-500" /> Electronic Skin Patches
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                        Our high-fidelity biosensors are printed on flexible, biocompatible substrates that adhere to the skin. These patches use
                        <strong> electrochemical impedance spectroscopy</strong> to measure biomarkers through interstitial fluid without breaking the skin barrier.
                    </p>
                    <div className="space-y-4">
                        <TechFeature icon={<Layers />} text="Multi-layer graphene circuitry" />
                        <TechFeature icon={<Beaker />} text="Enzymatic biomarker recognition" />
                        <TechFeature icon={<Zap />} text="Low-power Bluetooth SoC integration" />
                    </div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-slate-800 dark:to-slate-900 rounded-3xl border-4 border-white dark:border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden">
                    <div className="relative animate-pulse">
                        <Cpu className="h-32 w-32 text-blue-600/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-16 w-16 bg-blue-500 rounded-full blur-xl opacity-30"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                <TechCard
                    icon={<Microscope className="h-8 w-8 text-indigo-500" />}
                    title="Material Science"
                    description="Developing Stretchable conductors that maintain connectivity even during intense physical activity."
                />
                <TechCard
                    icon={<BrainIcon />}
                    title="Neural Architectures"
                    description="Edge-optimized convolutional neural networks that filter noise and extract meaningful signals in real-time."
                />
                <TechCard
                    icon={<Pocket className="h-8 w-8 text-amber-500" />}
                    title="Clinical Validation"
                    description="Rigorous calibration against traditional invasive gold standards to ensure >98% correlation in results."
                />
            </div>
        </div>
    );
}

function TechFeature({ icon, text }: any) {
    return (
        <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                {icon}
            </div>
            <span className="font-medium underline decoration-blue-500/30 underline-offset-4">{text}</span>
        </div>
    );
}

function TechCard({ icon, title, description }: any) {
    return (
        <div className="p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:-translate-y-2 transition-transform shadow-sm">
            <div className="mb-6">{icon}</div>
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

function BrainIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z" />
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z" />
        </svg>
    );
}
