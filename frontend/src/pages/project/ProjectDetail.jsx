import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useRealtime from "../../hooks/useRealtime";
import ActivityFeed from "../../components/ActivityFeed";
import IncidentSummary from "../../components/Incidents/IncidentSummary";
import IncidentList from "../../components/Incidents/IncidentList";
import { getProjectIncidents } from "../../api/incident.api";
import { useRealtimeContext } from "../../context/RealTimeContext";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [loadingIncidents, setLoadingIncidents] = useState(true);
  const [error, setError] = useState(null);
  const { loadOlderEvents } = useRealtime(projectId);

  // Use incidents from realtime context only; keep local incidents state here
  const {
    incidents,
    initializeIncidents
  } = useRealtimeContext();


  // Initial load: fetch incidents from API and set to local state
  useEffect(() => {
    let cancelled = false;
    const fetchInitialIncidents = async () => {
      setLoadingIncidents(true);
      setError(null);
      try {
        const data = await getProjectIncidents(projectId);
        if (!cancelled) {
          initializeIncidents(data.incidents || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to fetch incidents.");
          initializeIncidents([]);
        }
      } finally {
        if (!cancelled) setLoadingIncidents(false);
      }
    };

    if (projectId) fetchInitialIncidents();
    return () => {
      cancelled = true;
    };
  }, [projectId, initializeIncidents]);

  const refreshIncidents = async () => {
    try {
      const data = await getProjectIncidents(projectId);
      initializeIncidents(data.incidents || []);
    }catch(err){
      console.error("Failed to refresh incidents", err);
    }
  };
 

  return (
    <div className="min-h-screen py-10 px-2 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-blue-100">
        {/* Header Section */}
        <section className="flex items-center gap-6 mb-10">
          <div className="bg-blue-300 rounded-full h-20 w-20 flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-blue-900 text-5xl">event</span>
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight mb-1">Project Events</h2>
            <p className="text-gray-600 text-lg font-medium">
              Centralized real-time event stream, active incidents, and project status overview.
            </p>
          </div>
        </section>
        {/* Main Content: Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Feed */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl px-3 py-4 shadow-inner border border-blue-50 mb-6 transition-shadow duration-150 hover:shadow-lg">
              <h3 className="text-xl font-semibold text-blue-700 pb-4 border-b border-blue-100 mb-4">
                Activity Feed
              </h3>
              <ActivityFeed projectId={projectId} loadOlderEvents={loadOlderEvents} />
            </div>
          </div>
          {/* Right: Incident Summary and List */}
          <aside className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-blue-50 rounded-xl p-6 shadow border border-blue-100 mb-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                Incidents Summary
              </h3>
              {loadingIncidents ? (
                <div className="text-blue-400 py-6 text-center animate-pulse">Loading incidents...</div>
              ) : error ? (
                <div className="text-red-500 py-4 text-center">{error}</div>
              ) : (
                <IncidentSummary incidents={incidents} />
              )}
            </div>
            <div className="bg-white rounded-xl p-6 shadow border border-blue-100">
              <h3 className="text-lg font-bold mb-4 text-blue-700">Incidents List</h3>
              {loadingIncidents ? (
                <div className="text-blue-400 py-6 text-center animate-pulse">Loading...</div>
              ) : error ? (
                <div className="text-red-500 py-3 text-center">{error}</div>
              ) : (
                <IncidentList incidents={incidents} onUpdate={refreshIncidents} />
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
