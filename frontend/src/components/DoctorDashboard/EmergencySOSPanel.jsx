import React, { useState } from 'react'
import axios from 'axios'

function EmergencySOSPanel({ patient }) {
    const [reason, setReason] = useState('')
    const [location, setLocation] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)

    const handleSOSTrigger = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await axios.post('/api/doctor/emergency-sos', {
                patient_id: patient.id,
                trigger_reason: reason,
                hospital_location: location
            })

            setMessage({
                type: 'success',
                text: `Emergency alert sent to ${response.data.contacts_notified} contacts!`
            })

            setReason('')
            setLocation('')
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to trigger emergency'
            })
        }

        setLoading(false)
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
            <h2 className="text-2xl font-bold text-red-600 mb-4">🚨 Emergency SOS</h2>

            {message && (
                <div className={`mb-4 p-4 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSOSTrigger} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Patient: {patient.first_name} {patient.last_name}
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Reason</label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        placeholder="Describe the emergency situation..."
                        rows="3"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        placeholder="Hospital name and address"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
                >
                    {loading ? 'Triggering...' : '🚨 Trigger Emergency Alert'}
                </button>
            </form>
        </div>
    )
}

export default EmergencySOSPanel
