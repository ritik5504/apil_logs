import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { createSocketConnection } from "../services/socket";

const RealtimeContext = createContext(undefined);
const MAX_EVENTS = 50;
const FLUSH_INTERVAL = 100;

export const RealtimeProvider = ({ children, token }) => {
  const [events, setEvents] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const socketRef = useRef(null);
  const eventQueueRef = useRef([]);
  const flushIntervalRef = useRef(null);

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      eventQueueRef.current = [];
      setEvents([]);
      setIncidents([]);
      return;
    }

    console.log("connection token", token);

    const socket = createSocketConnection(token);
    socketRef.current = socket;

    const handleNewEvent = (eventData) => {
      eventQueueRef.current.push(eventData);
    };

    socket.on("new-event", handleNewEvent);
 

    const handleIncidentUpdate = (incidentData) => {
      setIncidents((prev) => {
        const filtered = prev.filter(
          (i) => i._id !== incidentData._id
        );
        return [incidentData, ...filtered];
      });
    };

    socket.on("incident-updated", handleIncidentUpdate);

    flushIntervalRef.current = setInterval(() => {
      if (eventQueueRef.current.length === 0) return;

      const batch = eventQueueRef.current;
      eventQueueRef.current = [];

      setEvents((prev) => {
        const combined = [...prev, ...batch];

        if (combined.length > MAX_EVENTS) {
          return combined.slice(combined.length - MAX_EVENTS);
        }
        return combined;
      });
    }, FLUSH_INTERVAL);

    return () => {
      socket.off("new-event", handleNewEvent);
      socket.off("incident-updated", handleIncidentUpdate);
      socket.disconnect();
      socketRef.current = null;

      clearInterval(flushIntervalRef.current);
      flushIntervalRef.current = null;

      eventQueueRef.current = [];
    };
  }, [token]);



  const initializeEvents = useCallback((initialEvents) => {
    setEvents(initialEvents || []);
  }, []);

  const initializeIncidents = useCallback((initialIncidents) => {
    setIncidents(initialIncidents || []);
  }, []);

  const prependEvents = useCallback((olderEvents) => {
    setEvents((prev) => {
      const existingIds = new Set(prev.map((e) => e._id));

      const filtered = olderEvents.filter(
        (e) => !existingIds.has(e._id)
      );

      const combined = [...filtered, ...prev];

      if (combined.length > MAX_EVENTS) {
        return combined.slice(0, MAX_EVENTS);
      }

      return combined;
    });
  }, []);

  const subscribeToProject = useCallback((projectId) => {
    if (socketRef.current && projectId) {
      setEvents([]);
      eventQueueRef.current = [];
      socketRef.current.emit("subscribe", { projectId });
    }
  }, []);

  const unsubscribeFromProject = useCallback((projectId) => {
    if (socketRef.current && projectId) {
      socketRef.current.emit("unsubscribe", { projectId });
    }
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
    eventQueueRef.current = [];
  }, []);

  return (
    <RealtimeContext.Provider
      value={{
        events,
        incidents,
        subscribeToProject,
        unsubscribeFromProject,
        clearEvents,
        initializeEvents,
        initializeIncidents,
        prependEvents,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

// Move useRealtimeContext to its own file for proper Fast Refresh behavior
export const useRealtimeContext = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtimeContext must be used inside RealtimeProvider");
  }
  return context;
};
