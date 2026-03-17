import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEvent } from "../../context/EventContext";

const ProjectIngest = () => {
    const { projectId } = useParams();
    const { ingestEvent, loading, error, success, setError, setSuccess } = useEvent();

    const [formData, setFormData] = useState({
        service: "",
        severity: "INFO",
        message: "", 
        environment: "production", 
        metadata: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev, 
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError(null);
            setSuccess(null);

            let parsedMetadata = {};
            if (formData.metadata) {
                try {
                    parsedMetadata = JSON.parse(formData.metadata);
                } catch (err) {
                    setError("Invalid JSON in metadata field.");
                    return;
                }
            }

            await ingestEvent(projectId, {
                service: formData.service,
                severity: formData.severity,
                message: formData.message,
                environment: formData.environment,
                metadata: parsedMetadata,
            });
            setFormData({
                service: "",
                severity: "INFO", 
                message: "", 
                environment: "production",
                metadata: "",
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-8">
            <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
                <div className="flex flex-col items-center mb-7">
                    <span className="material-symbols-outlined text-blue-600 text-5xl mb-2">integration_instructions</span>
                    <h2 className="text-2xl font-bold text-gray-800">Send Event to Project</h2>
                    <p className="text-gray-500 text-center text-base mt-2">Quickly send an event to your project for testing and troubleshooting.</p>
                </div>

                {error && (
                    <div className="mb-4">
                        <p className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm text-center border border-red-200">
                            {error}
                        </p>
                    </div>
                )}
                {success && (
                    <div className="mb-4">
                        <p className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm text-center border border-green-200">
                            {success}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="service"
                            className="block text-gray-700 text-sm font-medium mb-1"
                        >
                            Service
                        </label>
                        <input
                            id="service"
                            type="text"
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-gray-50"
                            placeholder="e.g. backend-api"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="severity"
                            className="block text-gray-700 text-sm font-medium mb-1"
                        >
                            Severity
                        </label>
                        <select
                            id="severity"
                            name="severity"
                            value={formData.severity}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-gray-50"
                        >
                            <option value="INFO">INFO</option>
                            <option value="WARN">WARN</option>
                            <option value="ERROR">ERROR</option>
                            <option value="CRITICAL">CRITICAL</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="message"
                            className="block text-gray-700 text-sm font-medium mb-1"
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={3}
                            placeholder="Describe the event, error or log message."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-gray-50 resize-y"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="environment"
                            className="block text-gray-700 text-sm font-medium mb-1"
                        >
                            Environment
                        </label>
                        <select
                            id="environment"
                            name="environment"
                            value={formData.environment}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-gray-50"
                        >
                            <option value="development">development</option>
                            <option value="staging">staging</option>
                            <option value="production">production</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="metadata"
                            className="block text-gray-700 text-sm font-medium mb-1"
                        >
                            Metadata <span className="text-gray-400 font-normal">(JSON format)</span>
                        </label>
                        <textarea
                            id="metadata"
                            name="metadata"
                            value={formData.metadata}
                            onChange={handleChange}
                            rows={2}
                            placeholder='{"ip": "127.0.0.1"}'
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-400 transition bg-gray-50 resize-y"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold shadow-sm transition 
                            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                            ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? "Sending..." : (
                            <span className="flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-white text-base">send</span>
                                Send Event
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProjectIngest;