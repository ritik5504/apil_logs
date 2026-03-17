import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../context/Project.Context";

const ProjectList = () => {
  const { projects, fetchProjects, loading, error } = useProject();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0a0f1c]">
        <span className="text-blue-500 text-xl font-medium flex items-center gap-3">
          <svg className="w-6 h-6 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          Loading Projects...
        </span>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0a0f1c] px-4">
        <span className="text-red-500 bg-red-500/10 border border-red-500/20 px-6 py-3 text-sm rounded-lg text-center max-w-md">{error}</span>
      </div>
    );

  const projectList = Array.isArray(projects) ? projects : [];

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans selection:bg-blue-500/30 px-4 py-12 flex justify-center">
      <div className="w-full max-w-2xl mx-auto">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 mb-4">
            <span className="material-symbols-outlined text-blue-500 text-3xl">apps</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">All Projects</h2>
          <p className="text-slate-400 text-sm">Browse and manage all your projects</p>
        </div>

        {projectList.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl px-6 py-12 flex flex-col items-center text-center">
            <div className="bg-slate-800/50 p-4 rounded-2xl mb-4 border border-slate-700/50">
              <span className="material-symbols-outlined text-slate-400 text-4xl">folder_off</span>
            </div>
            <p className="text-slate-300 text-lg font-medium">No projects found.</p>
            <p className="text-slate-500 text-sm mt-1">Get started by creating a new project.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projectList.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/project/${p._id}`)}
                className="cursor-pointer bg-slate-900 border border-slate-800 rounded-2xl shadow-lg hover:border-slate-700 hover:shadow-2xl hover:bg-slate-800/50 transition-all p-6 group focus:outline-none focus:ring-2 focus:ring-blue-500"
                tabIndex={0}
                role="button"
                aria-label={`View project ${p.projectName}`}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                    <span className="material-symbols-outlined text-blue-500 text-2xl">rocket_launch</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
                      {p.projectName}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{p.description || <i className="text-slate-500">No description provided</i>}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
