import React, { useState, useEffect } from 'react'
import axios from 'axios'

function MedicationReminder() {
    const [reminders, setReminders] = useState([])
    const [formData, setFormData] = useState({
        medication_name: '',
        dosage: '',
        frequency: 'daily',
        time_of_day: '09:00',
        start_date: '',
        reminder_method: 'push'
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchReminders()
    }, [])

    const fetchReminders = async () => {
        try {
            const response = await axios.get('/api/medication-reminders')
            setReminders(response.data.reminders)
        } catch (error) {
            console.error('Failed to fetch reminders:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await axios.post('/api/medication-reminders', formData)
            setFormData({
                medication_name: '',
                dosage: '',
                frequency: 'daily',
                time_of_day: '09:00',
                start_date: '',
                reminder_method: 'push'
            })
            fetchReminders()
        } catch (error) {
            console.error('Failed to add reminder:', error)
        }

        setLoading(false)
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">⏰ Medication Reminders</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 border-r pr-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Medication Name</label>
                        <input
                            type="text"
                            value={formData.medication_name}
                            onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
                            required
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Dosage</label>
                        <input
                            type="text"
                            value={formData.dosage}
                            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                            placeholder="e.g., 500mg"
                            required
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Frequency</label>
                        <select
                            value={formData.frequency}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                        >
                            <option>once</option>
                            <option>daily</option>
                            <option>weekly</option>
                            <option>monthly</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Time</label>
                        <input
                            type="time"
                            value={formData.time_of_day}
                            onChange={(e) => setFormData({ ...formData, time_of_day: e.target.value })}
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
                    >
                        {loading ? 'Adding...' : 'Add Reminder'}
                    </button>
                </form>

                {/* List */}
                <div className="space-y-3">
                    {reminders.map((reminder) => (
                        <div key={reminder.id} className="border p-4 rounded bg-gray-50">
                            <p className="font-semibold">{reminder.medication_name}</p>
                            <p className="text-sm text-gray-600">{reminder.dosage} • {reminder.frequency}</p>
                            <p className="text-sm text-gray-600">⏰ {reminder.time_of_day}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MedicationReminder
