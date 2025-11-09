import React, { useState, useEffect } from 'react'
import axios from 'axios'

function EmergencyContactSetup() {
    const [contacts, setContacts] = useState([])
    const [formData, setFormData] = useState({
        contact_name: '',
        contact_phone: '',
        relationship: '',
        priority: 1
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchContacts()
    }, [])

    const fetchContacts = async () => {
        try {
            const response = await axios.get('/api/emergency-contacts')
            setContacts(response.data.contacts)
        } catch (error) {
            console.error('Failed to fetch contacts:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await axios.post('/api/emergency-contacts', formData)
            setFormData({
                contact_name: '',
                contact_phone: '',
                relationship: '',
                priority: 1
            })
            fetchContacts()
        } catch (error) {
            console.error('Failed to add contact:', error)
        }

        setLoading(false)
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">👥 Emergency Contacts</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 border-r pr-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Contact Name</label>
                        <input
                            type="text"
                            value={formData.contact_name}
                            onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                            required
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <input
                            type="tel"
                            value={formData.contact_phone}
                            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                            required
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Relationship</label>
                        <input
                            type="text"
                            value={formData.relationship}
                            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                            placeholder="e.g., Mother, Friend"
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Priority</label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="1">High (Call First)</option>
                            <option value="2">Medium</option>
                            <option value="3">Low</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
                    >
                        {loading ? 'Adding...' : 'Add Contact'}
                    </button>
                </form>

                {/* List */}
                <div className="space-y-3">
                    {contacts.map((contact) => (
                        <div key={contact.id} className="border p-4 rounded bg-gray-50">
                            <p className="font-semibold">{contact.contact_name}</p>
                            <p className="text-sm text-gray-600">📞 {contact.contact_phone}</p>
                            <p className="text-sm text-gray-600">{contact.relationship}</p>
                            <p className="text-xs mt-2 font-medium text-indigo-600">Priority: {contact.priority}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default EmergencyContactSetup
