import { useEffect, useCallback } from "react";
import { useRealtimeContext } from "../context/RealTimeContext";
import { getProjectEvents } from "../api/event.api";

const useRealtime = (projectId) => {
  const {
    events,
    subscribeToProject,
    unsubscribeFromProject,
    clearEvents,
    initializeEvents,
    prependEvents,
  } = useRealtimeContext();

  const loadOlderEvents = useCallback(async () => {
    if (!projectId || !events.length) {
      return { loaded: 0, done: true, error: null };
    }

    // FIX: Use the last element as the oldest event
    const oldest = events[events.length - 1];
    const before = oldest?.eventTimestamp;

    if (!before) {
      return { loaded: 0, done: true, error: null };
    }

    try {
      const data = await getProjectEvents(projectId, {
        limit: 50,
        before,
      });
      // Filter out any potential duplicates by _id 
      const existingIds = new Set(events.map(e => e._id));
      const toPrepend = data.events
        .reverse()
        .filter(e => !existingIds.has(e._id));

      prependEvents(toPrepend);

      return {
        loaded: toPrepend.length,
        done: toPrepend.length === 0 || data.events.length < 50,
        error: null
      };
    } catch (err) {
      console.error("Failed to load older events:", err);
      return { loaded: 0, done: false, error: err };
    }
  }, [projectId, events, prependEvents]);

  useEffect(() => {
    let isMounted = true;

    if (!projectId) {
      const warningBar = document.createElement("div");
      warningBar.className =
        "fixed top-4 left-1/2 -translate-x-1/2 bg-yellow-100 border border-yellow-300 text-yellow-900 px-4 py-2 rounded-md shadow z-50 animate-pulse";
      warningBar.textContent = "No project selected for realtime updates.";
      document.body.appendChild(warningBar);
      setTimeout(() => {
        warningBar.remove();
      }, 2500);
      return;
    }

    const showBar = (text, className, duration = 2000) => {
      const bar = document.createElement("div");
      bar.className = className;
      bar.textContent = text;
      document.body.appendChild(bar);
      setTimeout(() => {
        bar.remove();
      }, duration);
      return bar;
    };

    const clearBar = showBar(
      "Loading latest events...",
      "fixed top-4 left-1/2 -translate-x-1/2 bg-blue-100 border border-blue-300 text-blue-700 px-4 py-2 rounded-md shadow z-50",
      2000
    );

    const loadHistoryAndSubscribe = async () => {
      try {
        clearEvents();
        const data = await getProjectEvents(projectId, { limit: 50 });
        if (!isMounted) return;
        const reversed = data.events.reverse();
        initializeEvents(reversed);
        setTimeout(() => {
          if (!clearBar) return;
          clearBar.textContent = `Subscribed to project ${projectId} (Live updates enabled)`;
          clearBar.className =
            "fixed top-4 left-1/2 -translate-x-1/2 bg-green-100 border border-green-300 text-green-600 px-4 py-2 rounded-md shadow z-50 transition";
        }, 600);
      } catch (err) {
        showBar(
          "Failed to load events.",
          "fixed top-4 left-1/2 -translate-x-1/2 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-md shadow z-50",
          2500
        );
        console.error("Failed to load history:", err);
      }
    };

    loadHistoryAndSubscribe();
    subscribeToProject(projectId);

    return () => {
      showBar(
        `Unsubscribed from project ${projectId}`,
        "fixed top-4 left-1/2 -translate-x-1/2 bg-gray-100 border border-gray-300 text-gray-600 px-4 py-2 rounded-md shadow z-50",
        1500
      );
      isMounted = false;
      unsubscribeFromProject(projectId);
      clearEvents();
    };
  }, [projectId, subscribeToProject, unsubscribeFromProject, clearEvents, initializeEvents]);

  return { loadOlderEvents };
};

export default useRealtime;
