import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            navigate("/login", { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans selection:bg-blue-500/30">
            {/* Minimal App Header */}
            <header className="border-b border-slate-800 bg-[#0a0f1c]/80 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                    <div className="bg-blue-500 p-1.5 rounded-md">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">OpsPulse</span>
                </div>
                
                <div className="flex items-center gap-4">
                    {user && (
                        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-full">
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold uppercase">
                                {(user.username || user.email || 'U').charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-slate-300">
                                {user.username || user.email}
                            </span>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors group"
                        title="Logout"
                    >
                        <svg className="w-5 h-5 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-12">
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Overview</h1>
                        <p className="text-slate-400">Manage your monitoring projects and view system health.</p>
                    </div>
                    <button
                        onClick={() => navigate("/create")}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Project
                    </button>
                </div>

                {/* Dashboard Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* View Projects Card */}
                    <div 
                        onClick={() => navigate("/list")}
                        className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-8 rounded-2xl cursor-pointer transition-all hover:bg-slate-800/80 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Project List</h2>
                        <p className="text-slate-400 leading-relaxed mb-6">
                            View all your monitored applications, access their live activity feeds, and manage their individual settings.
                        </p>
                        <div className="flex items-center text-blue-500 font-medium text-sm">
                            View Projects
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Create New Project Card */}
                    <div 
                        onClick={() => navigate("/create")}
                        className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-8 rounded-2xl cursor-pointer transition-all hover:bg-slate-800/80 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Start New Monitor</h2>
                        <p className="text-slate-400 leading-relaxed mb-6">
                            Set up tracking for a new application or microservice. Generate your API key to begin ingesting real-time events.
                        </p>
                        <div className="flex items-center text-emerald-500 font-medium text-sm">
                            Create Project
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Empty State / Welcome Note (if needed in future) */}
                <div className="mt-12 bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
                    <p className="text-slate-400 text-sm">
                        Need help getting started? Check out our <a href="#" className="text-blue-500 hover:underline">documentation</a> on sending your first event.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
