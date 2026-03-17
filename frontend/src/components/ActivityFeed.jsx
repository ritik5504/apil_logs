import React, { useRef, useMemo } from "react";
import { List, useListRef } from "react-window";
import { useRealtimeContext } from "../context/RealTimeContext";
import useRealtime from "../hooks/useRealtime";

const SEVERITY_COLORS = {
  INFO: "bg-blue-100 text-blue-700",
  WARN: "bg-yellow-100 text-yellow-800",
  ERROR: "bg-red-100 text-red-700",
  DEBUG: "bg-purple-100 text-purple-700",
  CRITICAL: "bg-red-200 text-red-900",
};

const ROW_HEIGHT = 110;

/* =========================
   Memoized Row Component
========================= */

const Row = React.memo(({ index, style, ariaAttributes, events }) => {
  const event = events[index];

  // Memoize formatted date
  const formattedDate = useMemo(() => {
    return new Date(event.createdAt).toLocaleString();
  }, [event.createdAt]);

  // Memoize severity class
  const severityClass = useMemo(() => {
    return (
      SEVERITY_COLORS[event.severity] ||
      "bg-gray-100 text-gray-700"
    );
  }, [event.severity]);

  return (
    <div style={style} {...ariaAttributes} className="px-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded font-medium text-xs ${severityClass}`}
          >
            {event.severity}
          </span>

          <span className="text-xs text-gray-400 ml-auto">
            {formattedDate}
          </span>
        </div>

        <div className="text-gray-800 text-sm">
          {event.message}
        </div>

        {event.service && (
          <div className="text-xs text-gray-400">
            <span className="font-semibold">Service:</span> {event.service}
          </div>
        )}

        {event.environment && (
          <div className="text-xs text-gray-400">
            <span className="font-semibold">Env:</span> {event.environment}
          </div>
        )}
      </div>
    </div>
  );
});

/* =========================
   ActivityFeed Component
========================= */

const ActivityFeed = ({ projectId }) => {
  const { events } = useRealtimeContext();
  const listRef = useListRef();

  // outerRef is not passed to List anymore (fix for React DOM warning)
  // const outerRef = useRef(null);

  // Use the custom hook INSIDE the component, with projectId
  // const { loadOlderEvents } = useRealtime(projectId);

  // --- Pagination logic commented out ---
  // const [isAtBottom, setIsAtBottom] = useState(true);
  // const [loadingOlder, setLoadingOlder] = useState(false);
  // const [showLoadingDelay, setShowLoadingDelay] = useState(false);
  // const [olderEventCount, setOlderEventCount] = useState(0); // How many 50s loaded
  // const [canLoadMore, setCanLoadMore] = useState(true);
  // const loadingDelayTimer = useRef(null);

  const containerRef = useRef(null);

  // Memoize rowProps to keep reference stable
  const rowProps = useMemo(() => {
    return { events };
  }, [events]);

  // --- Pagination logic commented out ---
  /*
  // Track if user is at bottom or not
  const handleScroll = async () => {
    const el = containerRef.current;
    if (!el) return;

    const threshold = 50;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;

    setIsAtBottom(atBottom);

    // Only act when at scroll top & more events can be loaded and not already loading
    if (el.scrollTop < 50 && !loadingOlder && canLoadMore) {
      if (olderEventCount === 0) {
        setLoadingOlder(true);
        const previousHeight = el.scrollHeight;
        try {
          const result = await loadOlderEvents();
          if (result?.loaded > 0) {
            setOlderEventCount(olderEventCount + 1);
            setCanLoadMore(!result.done); // If done==true, can't load more
          } else {
            setCanLoadMore(false); // Nothing more
          }
        } finally {
          setLoadingOlder(false);
          // Maintain scroll position when content fills
          requestAnimationFrame(() => {
            const newHeight = el.scrollHeight;
            el.scrollTop += newHeight - previousHeight;
          });
        }
      } else {
        // Only after the first 50, show 2s loader before next 50 loads
        setShowLoadingDelay(true);
        setLoadingOlder(true);
        if (loadingDelayTimer.current) clearTimeout(loadingDelayTimer.current);
        loadingDelayTimer.current = setTimeout(async () => {
          setShowLoadingDelay(false);
          const previousHeight = el.scrollHeight;
          try {
            const result = await loadOlderEvents();
            if (result?.loaded > 0) {
              setOlderEventCount(olderEventCount + 1);
              setCanLoadMore(!result.done); // If done==true, can't load more
            } else {
              setCanLoadMore(false);
            }
          } finally {
            setLoadingOlder(false);
            requestAnimationFrame(() => {
              const newHeight = el.scrollHeight;
              el.scrollTop += newHeight - previousHeight;
            });
          }
        }, 2000);
      }
    }
  };

  // Reset on projectId or events first load
  useEffect(() => {
    setOlderEventCount(0);
    setCanLoadMore(true);
    setShowLoadingDelay(false);
    setLoadingOlder(false);
    if (loadingDelayTimer.current) clearTimeout(loadingDelayTimer.current);
  }, [projectId]);

  // Auto-scroll to bottom when at bottom and new events
  useEffect(() => {
    if (!listRef.current) return;
    if (isAtBottom && events.length > 0) {
      listRef.current.scrollToRow({
        index: events.length - 1,
        align: "top",
        behavior: "auto",
      });
    }
  }, [events.length, isAtBottom, listRef]);
  */

  if (!events || events.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p>No events yet.</p>
      </div>
    );
  }

  return (
    <div className="relative p-4">
      <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center gap-2">
        <span className="material-symbols-outlined text-blue-500">bolt</span>
        Live Activity
      </h3>

      <div
        ref={containerRef}
        // onScroll={handleScroll} // Pagination logic commented
        className="h-[70vh] overflow-y-auto"
      >
        {/* (loadingOlder || showLoadingDelay) && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 rounded bg-blue-50 text-blue-600 px-3 py-1 text-xs shadow whitespace-nowrap animate-pulse">
            {showLoadingDelay
              ? "Loading even older events, please wait..."
              : "Loading older events..."}
          </div>
        ) */}
        <List
          listRef={listRef}
          rowComponent={Row}
          rowCount={events.length}
          rowHeight={ROW_HEIGHT}
          // Removed outerRef to avoid React DOM warning
          // outerRef={outerRef}
          // onScroll={handleScroll}
          rowProps={rowProps}
          style={{ height: "70vh" }}
        />
        {/* 
        {!canLoadMore && (
          <div className="flex justify-center py-4 text-xs text-gray-400">
            No more events to load.
          </div>
        )} 
        */}
      </div>

      {/* 
      {!isAtBottom && (
        <button
          onClick={() =>
            listRef.current?.scrollToRow({
              index: events.length - 1,
              align: "end",
              behavior: "smooth",
            })
          }
          className="absolute bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 transition"
        >
          Jump to Latest
        </button>
      )} 
      */}
    </div>
  );
};

export default ActivityFeed;