import React, { useState } from 'react'
import axios from 'axios'

function EmergencySOSPanel({ patient }) {
    const API = "http://localhost:5000/api";

    const [reason, setReason] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSOS = async (e) => {
        e.preventDefault();
        if (!patient) return;

        setLoading(true);
        setMessage(null);

        try {
            const response = await axios.post(`${API}/doctor/emergency-sos`, {
                patient_id: patient.id,
                trigger_reason: reason,
                hospital_location: location
            });

            setMessage({
                type: "success",
                text: `Emergency notification sent to ${response.data.contacts_notified} contacts`
            });

            setReason("");
            setLocation("");
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.error || "Failed to trigger emergency alert"
            });
        }

        setLoading(false);
    };

    if (!patient) return <p>Select a patient to trigger SOS.</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
            <h2 className="text-2xl font-bold text-red-600 mb-4">🚨 Emergency SOS</h2>

            {message && (
                <div className={`p-3 mb-3 rounded ${message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSOS} className="space-y-4">

                <div className="text-gray-700 font-medium">
                    Patient: {patient.first_name} {patient.last_name}
                </div>

                <div>
                    <label className="block text-sm mb-1">Emergency Reason</label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        className="w-full border px-4 py-2 rounded"
                        placeholder="Explain the emergency..."
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Hospital Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="w-full border px-4 py-2 rounded"
                        placeholder="Enter hospital address"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 text-white py-3 rounded-lg">
                    {loading ? "Sending..." : "🚨 Trigger Emergency Alert"}
                </button>
            </form>
        </div>
    );
}

export default EmergencySOSPanel;
