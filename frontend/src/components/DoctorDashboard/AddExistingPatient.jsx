import React, { useState } from 'react';
import axios from 'axios';

function AddExistingPatient({ onAdded }) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("/api/doctor/add-existing-patient", { email });
            setMessage({ type: "success", text: res.data.message });
            onAdded();
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.error || "Failed to add patient"
            });
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Add Existing Patient</h2>

            {message && (
                <div className={`p-3 rounded ${message.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="email"
                    placeholder="Enter patient email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                />

                <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                    type="submit"
                >
                    Add Patient
                </button>
            </form>
        </div>
    );
}

export default AddExistingPatient;
