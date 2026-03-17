import React from "react";
import { updateIncidentStatus } from "../../api/incident.api";

// Utility to show error feedback to the user (basic example)
const showError = (msg) => {
    alert(msg || "Something went wrong updating incident status");
};

const IncidentList = ({ incidents, onUpdate }) => {
    const handleStatusChange = async (id, status) => {
        try { 
            await updateIncidentStatus(id, status);
            onUpdate();
        } catch (err) {
            if (err?.response?.status === 404) {
                showError("Incident not found or invalid update. The incident may have been deleted.");
            } else {
                showError(err?.message);
            }
        }
    };

    if (!incidents || incidents.length === 0) {
        return (
            <div className="incident-list-empty" style={{ padding: "2em", textAlign: "center", color: "#777" }}>
                <p>No incidents found.</p>
            </div>
        );
    }

    return (
        <div className="incident-list-container" style={{ maxWidth: 800, margin: "0 auto" }}>
            <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: "0.5em", marginBottom: "1em" }}>Incidents</h3>
            <div>
                {incidents.map((incident) => (
                    <div
                        key={incident._id}
                        className="incident-card"
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: 8,
                            padding: "1em",
                            marginBottom: "1em",
                            background: "#fafbfc",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.7em"
                        }}
                    >
                        <div className="incident-main-info" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{ fontWeight: "bold" }}>
                                Severity: <span style={{ color: "#bf1650" }}>{incident.severity || incident.servity}</span>
                            </span>
                            <span>
                                Status: <span style={{
                                    color:
                                        incident.status === "OPEN"
                                            ? "#f28b25"
                                            : incident.status === "ACKNOWLEDGED"
                                                ? "#2986cc"
                                                : "#29a632"
                                }}>{incident.status}</span>
                            </span>
                            <span>Service: <span style={{ color: "#555" }}>{incident.service}</span></span>
                            <span>Events: <span style={{ color: "#555" }}>{incident.eventCount}</span></span>
                        </div>
                        <div style={{ color: "#777", fontSize: "0.95em" }}>
                            <span>First: {new Date(incident.firstOccurredAt).toLocaleString()}</span>
                            {incident.lastOccurredAt && (
                                <span style={{ marginLeft: '1.5em' }}>Last: {new Date(incident.lastOccurredAt).toLocaleString()}</span>
                            )}
                        </div>
                        {incident.status !== "RESOLVED" && (
                            <div className="incident-actions" style={{ marginTop: "0.8em", display: "flex", gap: "1em" }}>
                                {incident.status === "OPEN" && (
                                    <button
                                        style={{
                                            background: "#2986cc",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: 4,
                                            padding: "0.4em 1.2em",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => handleStatusChange(incident._id, "ACKNOWLEDGED")}
                                    >
                                        Acknowledge
                                    </button>
                                )}
                                <button
                                    style={{
                                        background: "#26a65b",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: 4,
                                        padding: "0.4em 1.2em",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => handleStatusChange(incident._id, "RESOLVED")}
                                >
                                    Resolve
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};



export default IncidentList;