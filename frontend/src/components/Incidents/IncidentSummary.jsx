import React, { useMemo } from "react";

const IncidentSummary = ({ incidents }) => {
    const summary = useMemo(() => {
        const open = incidents.filter(i => i.status === "OPEN");
        const critical = open.filter(i => i.severity === "CRITICAL").length;
        const error = open.filter(i => i.severity === "ERROR").length;

        return {
            totalOpen: open.length,
            critical,
            error
        };
    }, [incidents]);

    const stats = [
        {
            label: "Open Incidents",
            value: summary.totalOpen,
            color: "text-blue-600",
            bg: "bg-blue-100",
            icon: (
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                </svg>
            )
        },
        {
            label: "Critical",
            value: summary.critical,
            color: "text-red-600",
            bg: "bg-red-100",
            icon: (
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            label: "Errors",
            value: summary.error,
            color: "text-yellow-600",
            bg: "bg-yellow-100",
            icon: (
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg mb-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <svg className="w-7 h-7 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m2-4h.01"></path>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                </svg>
                Incident Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat, idx) => (
                    <div key={stat.label} className="flex flex-col items-center py-5 rounded-lg shadow-sm border bg-white transition hover:bg-gray-50">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 ${stat.bg}`}>
                            {stat.icon}
                        </div>
                        <span className={`text-3xl font-bold ${stat.color}`}>
                            {stat.value}
                        </span>
                        <span className="text-md text-gray-700 mt-1 font-medium tracking-tight">{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IncidentSummary;