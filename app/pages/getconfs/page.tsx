'use client';
import React, { useEffect, useState } from "react";

interface Conference {
    _id: string;
    title: string;
    description: string;
    venue: string;
    schedules: string;
}

const ConferencePage: React.FC = () => {
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [responseMessage, setResponseMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const response = await fetch("/api/conference");
                if (!response.ok) {
                    throw new Error("Failed to fetch conferences");
                }
                const data: Conference[] = await response.json();
                setConferences(data);
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchConferences();
    }, []);

    const handleSendConferenceId = async (id: string) => {
        try {
            const response = await fetch("/api/registration", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", 
                body: JSON.stringify({ conferenceId: id }),
            });

            if (!response.ok) {
                throw new Error("Failed to send conference ID");
            }

            const data = await response.json();
            setResponseMessage(`Response: ${data.message}`);
        } catch (err: any) {
            setResponseMessage(`Error: ${err.message}`);
        }
    };

    if (loading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {conferences.map((conf) => (
                    <div
                        key={conf._id}
                        className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{conf.title}</h3>
                        <p className="text-gray-600 mb-2">{conf.description}</p>
                        <p className="text-sm text-gray-500 mb-2">
                            <span className="font-semibold">Venue:</span> {conf.venue}
                        </p>
                        <p className="text-sm text-gray-500">
                            <span className="font-semibold">Schedules:</span> {conf.schedules}
                        </p>
                        <button
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => handleSendConferenceId(conf._id)}
                        >
                            Register 
                        </button>
                    </div>
                ))}
            </div>
            {responseMessage && (
                <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded">
                    <p className="text-gray-700">{responseMessage}</p>
                </div>
            )}
        </div>
    );
};

export default ConferencePage;
