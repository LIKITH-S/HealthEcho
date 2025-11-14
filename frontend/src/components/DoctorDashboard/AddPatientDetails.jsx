import React, { useState } from 'react'
import axios from 'axios'

function AddPatientDetails({ patient }) {
    const API = "http://localhost:5000/api";

    const [formData, setFormData] = useState({
        diagnoses: [],
        medications: [],
        clinical_notes: ''
    });

    const [newDiagnosis, setNewDiagnosis] = useState('');
    const [newMedication, setNewMedication] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleAddDiagnosis = () => {
        if (!newDiagnosis.trim()) return;
        setFormData(prev => ({
            ...prev,
            diagnoses: [...prev.diagnoses, newDiagnosis.trim()]
        }));
        setNewDiagnosis('');
    };

    const handleAddMedication = () => {
        if (!newMedication.trim()) return;
        setFormData(prev => ({
            ...prev,
            medications: [...prev.medications, newMedication.trim()]
        }));
        setNewMedication('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await axios.post(`${API}/doctor/patient-details`, {
                patient_id: patient.id,
                diagnoses: formData.diagnoses,
                medications: formData.medications,
                clinical_notes: formData.clinical_notes
            });

            setMessage({ type: 'success', text: "Patient details updated successfully!" });

            // Reset
            setFormData({ diagnoses: [], medications: [], clinical_notes: '' });
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.error || "Failed to update patient details"
            });
        }

        setLoading(false);
    };

    if (!patient) return <p className="text-gray-500">Select a patient to continue.</p>;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Add Patient Details</h2>

            {message && (
                <div className={`p-3 mb-4 rounded ${message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient name */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Patient</label>
                    <input
                        type="text"
                        disabled
                        value={`${patient.first_name} ${patient.last_name}`}
                        className="w-full px-4 py-2 bg-gray-100 rounded-lg"
                    />
                </div>

                {/* Diagnoses */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Diagnoses</label>

                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={newDiagnosis}
                            onChange={(e) => setNewDiagnosis(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-lg"
                            placeholder="Enter diagnosis"
                        />
                        <button type="button" onClick={handleAddDiagnosis}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                            Add
                        </button>
                    </div>

                    {formData.diagnoses.map((d, i) => (
                        <div key={i} className="flex justify-between bg-gray-100 p-2 rounded mb-1">
                            <span>{d}</span>
                            <button
                                type="button"
                                onClick={() =>
                                    setFormData(prev => ({
                                        ...prev,
                                        diagnoses: prev.diagnoses.filter((_, idx) => idx !== i)
                                    }))
                                }
                                className="text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {/* Medications */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Medications</label>

                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={newMedication}
                            onChange={(e) => setNewMedication(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-lg"
                            placeholder="Enter medication"
                        />
                        <button type="button" onClick={handleAddMedication}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                            Add
                        </button>
                    </div>

                    {formData.medications.map((m, i) => (
                        <div key={i} className="flex justify-between bg-gray-100 p-2 rounded mb-1">
                            <span>{m}</span>
                            <button
                                type="button"
                                onClick={() =>
                                    setFormData(prev => ({
                                        ...prev,
                                        medications: prev.medications.filter((_, idx) => idx !== i)
                                    }))
                                }
                                className="text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Clinical Notes</label>
                    <textarea
                        value={formData.clinical_notes}
                        onChange={(e) =>
                            setFormData(prev => ({ ...prev, clinical_notes: e.target.value }))
                        }
                        rows="4"
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Enter clinical notes..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg">
                    {loading ? "Saving..." : "Save Patient Details"}
                </button>
            </form>
        </div>
    );
}

export default AddPatientDetails;
