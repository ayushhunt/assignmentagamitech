'use client';

import React, { useEffect, useState } from "react";

interface Conference {
  _id: string;
  title: string;
  description: string;
  venue: string;
  schedules: string;
}

const ConferenceFeedbackPage: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch("/api/conference", {
          method: "GET",
          credentials: "include",
        });
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

  const handleFeedbackChange = (id: string, value: string) => {
    setFeedback({ ...feedback, [id]: value });
  };

  const sendFeedback = async (id: string) => {
    const feedbackText = feedback[id];
    if (!feedbackText) {
      alert("Please enter feedback before submitting.");
      return;
    }

    try {
      const response = await fetch(`/api/conference/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Conference-ID": id,
        },
        credentials: "include",
        body: JSON.stringify({ feedback: feedbackText }),
      });

      if (!response.ok) {
        throw new Error("Failed to send feedback");
      }

      alert("Feedback sent successfully!");
      setFeedback({ ...feedback, [id]: "" });
    } catch (error: any) {
      alert(error.message || "An error occurred while sending feedback.");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          <input
            type="text"
            value={feedback[conf._id] || ""}
            onChange={(e) => handleFeedbackChange(conf._id, e.target.value)}
            placeholder="Enter feedback"
            className="w-full mt-4 p-2 border rounded-lg focus:outline-none text-black focus:ring focus:border-blue-300"
          />
          <button
            onClick={() => sendFeedback(conf._id)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send Feedback
          </button>
        </div>
      ))}
    </div>
  );
};

export default ConferenceFeedbackPage;
