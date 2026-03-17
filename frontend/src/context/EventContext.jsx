import React, { createContext, useContext, useState } from "react";
import { ingestEvent as ingestEventApi } from "../api/event.api";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const ingestEvent = async (projectId, data) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const response = await ingestEventApi(projectId, data);
            setSuccess("Event ingested successfully");
            return response;
        } catch (err) { 
            const message =
                err.response?.data?.message ||
                (Array.isArray(err.response?.data?.error) ? err.response.data.error[0] : undefined) ||
                "Failed to ingest event";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        ingestEvent,
        loading,
        error,
        success,
        setError,
        setSuccess,
    };

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvent = () => {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error("useEvent must be used within an EventProvider");
    }
    return context;
};