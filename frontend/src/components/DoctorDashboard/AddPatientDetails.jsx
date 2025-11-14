import React, { useState } from 'react'
import axios from 'axios'

function AddPatientDetails({ patient }) {
    const [formData, setFormData] = useState({
        diagnoses: [],
        medications: [],
        clinical_notes: ''
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [newDiagnosis, setNewDiagnosis] = useState('')
    const [newMedication, setNewMedication] = useState('')

    const handleAddDiagnosis = () => {
        if (newDiagnosis.trim()) {
            setFormData({
                ...formData,
                diagnoses: [...formData.diagnoses, newDiagnosis]
            })
            setNewDiagnosis('')
        }
    }

    const handleAddMedication = () => {
        if (newMedication.trim()) {
            setFormData({
                ...formData,
                medications: [...formData.medications, newMedication]
            })
            setNewMedication('')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await axios.post('/api/doctor/patient-details', {
                patient_id: patient.id,
                ...formData
            })

            setMessage({ type: 'success', text: 'Patient details updated successfully!' })
            setFormData({ diagnoses: [], medications: [], clinical_notes: '' })
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update' })
        }

        setLoading(false)
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Add Patient Details</h2>

            {message && (
                <div className={`mb-4 p-4 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                    <input
                        type="text"
                        disabled
                        value={`${patient.first_name} ${patient.last_name}`}
                        className="w-full px-4 py-2 bg-gray-100 rounded-lg"
                    />
                </div>

                {/* Diagnoses */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diagnoses</label>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={newDiagnosis}
                            onChange={(e) => setNewDiagnosis(e.target.value)}
                            placeholder="Enter diagnosis"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddDiagnosis}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Add
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.diagnoses.map((diag, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                <span>{diag}</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        ...formData,
                                        diagnoses: formData.diagnoses.filter((_, i) => i !== idx)
                                    })}
                                    className="text-red-600 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Medications */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medications</label>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={newMedication}
                            onChange={(e) => setNewMedication(e.target.value)}
                            placeholder="Enter medication"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddMedication}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Add
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.medications.map((med, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                <span>{med}</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        ...formData,
                                        medications: formData.medications.filter((_, i) => i !== idx)
                                    })}
                                    className="text-red-600 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Clinical Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Notes</label>
                    <textarea
                        value={formData.clinical_notes}
                        onChange={(e) => setFormData({ ...formData, clinical_notes: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        rows="5"
                        placeholder="Enter clinical observations..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Patient Details'}
                </button>
            </form>
        </div>
    )
}

export default AddPatientDetails
