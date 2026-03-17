import api from "./api";

export const getProjectIncidents = async (projectId) => {
    const res = await api.get(`/incidents/${projectId}`);
    return res.data;
};

export const updateIncidentStatus = async (incidentId, status) => { 
    const res = await api.patch(`/incidents/${incidentId}/status`, { status });
    return res.data;
};