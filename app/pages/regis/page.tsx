"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; 

interface Approval {
    _id: string;
    conferenceId: string;
    userId: string;
    approved: boolean;
    createdAt: string;
    updatedAt: string;
}

const ApprovalsPage: React.FC = () => {
    const [approvals, setApprovals] = useState<Approval[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        const checkUserRole = () => {
            const role = Cookies.get("role"); 
            setIsAdmin(role === "admin");
        };

        const fetchApprovals = async () => {
            try {
                const response = await fetch("/api/registration/all", {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch approvals");
                }
                const data: Approval[] = await response.json();
                setApprovals(data);
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        checkUserRole();
        fetchApprovals();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            const response = await fetch(`/api/registration/${id}`, {
                method: "PATCH",
                credentials: "include", // Include cookies
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ approved: true }),
            });
            if (!response.ok) {
                throw new Error("Failed to approve registration");
            }
            // Update the UI after approval
            setApprovals((prev) =>
                prev.map((approval) =>
                    approval._id === id ? { ...approval, approved: true } : approval
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/registration/${id}`, {
                method: "DELETE",
                credentials: "include", // Include cookies
            });
            if (!response.ok) {
                throw new Error("Failed to delete registration");
            }
            // Update the UI after deletion
            setApprovals((prev) => prev.filter((approval) => approval._id !== id));
        } catch (err) {
            console.error(err);
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
            {approvals.map((approval) => (
                <div
                    key={approval._id}
                    className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Approval ID: {approval._id}
                    </h3>
                    <p className="text-gray-600 mb-2">
                        <span className="font-semibold">Conference ID:</span> {approval.conferenceId}
                    </p>
                    <p className="text-gray-600 mb-2">
                        <span className="font-semibold">User ID:</span> {approval.userId}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                        <span className="font-semibold">Approved:</span>{" "}
                        {approval.approved ? "Yes" : "No"}
                    </p>
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold">Created At:</span>{" "}
                        {new Date(approval.createdAt).toLocaleString()}
                    </p>
                    {isAdmin && (
                        <div className="mt-4 flex space-x-4">
                            {!approval.approved && (
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    onClick={() => handleApprove(approval._id)}
                                >
                                    Approve
                                </button>
                            )}
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={() => handleDelete(approval._id)}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ApprovalsPage;
