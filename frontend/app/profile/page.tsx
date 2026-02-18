"use client";

import { useState } from "react";
import { User, Mail, Settings, Bell, Download, ShieldCheck, Save } from "lucide-react";

export default function Profile() {
    const [userData, setUserData] = useState({
        name: "Alex Johnson",
        email: "alex.j@example.com",
        goal: "Maintain heart health",
        notifications: true
    });

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Sidebar */}
                <div className="space-y-2">
                    <SidebarItem icon={<User />} label="Personal Info" active />
                    <SidebarItem icon={<ShieldCheck />} label="Security" />
                    <SidebarItem icon={<Bell />} label="Notifications" />
                    <SidebarItem icon={<Download />} label="Data & Privacy" />
                </div>

                {/* Content */}
                <div className="md:col-span-2 space-y-8">
                    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                        <h2 className="text-xl font-bold mb-6">Profile Information</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-500">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-500">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={userData.email}
                                        readOnly
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-800 text-slate-500 cursor-not-allowed font-medium"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20">
                                    <Save className="h-5 w-5" /> Save Changes
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
                        <h2 className="text-xl font-bold mb-6">Device Management</h2>
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
                                    <Settings className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold">BioLink V2 Patch</p>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Serial: #BSL-9921-X</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">Connected</span>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function SidebarItem({ icon, label, active }: any) {
    return (
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            {icon && <span className="h-5 w-5 opacity-70">{icon}</span>}
            {label}
        </button>
    );
}
