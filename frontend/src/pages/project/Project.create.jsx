import React, { useState } from "react";
import { useProject } from "../../context/Project.Context";

const ProjectCreate = () => {
    const { createProject } = useProject();
    const [form, setForm] = useState({
        projectName: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await createProject(form);
        } catch (err) {
            setError(err?.response?.data?.error || "Project is not created");
        } finally {
            setLoading(false);
            setForm({
                projectName: "",
                description: "",
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c] text-slate-200 font-sans selection:bg-blue-500/30 px-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 mb-4">
                        <span className="material-symbols-outlined text-blue-500 text-3xl">rocket_launch</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Create Project</h1>
                    <p className="text-slate-400 text-sm">Start a new project to organize your events and teams.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="projectName"
                            className="block text-slate-300 text-sm font-medium mb-2"
                        >
                            Project Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="projectName"
                            type="text"
                            name="projectName"
                            value={form.projectName}
                            placeholder="Enter project name"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-white placeholder:text-slate-600"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-slate-300 text-sm font-medium mb-2"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            placeholder="Enter project description"
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-white placeholder:text-slate-600 resize-none"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-6 w-full py-3 px-4 rounded-lg text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.2)]
                        ${loading ? "bg-blue-600/70 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"}`}
                    >
                        {loading && (
                            <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                        )}
                        {loading ? "Creating Project..." : "Create Project"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProjectCreate;