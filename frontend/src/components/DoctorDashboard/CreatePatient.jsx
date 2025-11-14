import React, { useState } from "react";
import { createPatient } from "../../services/doctorService";

export default function CreatePatient({ onCreated }) {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        blood_type: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        try {
            const res = await createPatient(formData);
            setMsg({ type: "success", text: "Patient created successfully!" });
            onCreated(); // refresh dashboard
        } catch (error) {
            setMsg({
                type: "error",
                text: error.response?.data?.error || "Failed to create patient",
            });
        }

        setLoading(false);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">➕ Create New Patient</h2>

            {msg && (
                <div
                    className={`p-3 rounded mb-4 ${msg.type === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                >
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="font-medium">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="font-medium">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="font-medium">Phone Number</label>
                    <input
                        type="text"
                        name="phone_number"
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="font-medium">Blood Type</label>
                    <input
                        type="text"
                        name="blood_type"
                        placeholder="A+, O-, B+, AB+"
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="font-medium">Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                    {loading ? "Creating..." : "Create Patient"}
                </button>
            </form>
        </div>
    );
}
