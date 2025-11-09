import React, { useState } from 'react'
import axios from 'axios'

function DrugChecker() {
    const [medications, setMedications] = useState([])
    const [newMedication, setNewMedication] = useState('')
    const [interactions, setInteractions] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleAddMedication = () => {
        if (newMedication.trim()) {
            setMedications([...medications, newMedication])
            setNewMedication('')
        }
    }

    const handleCheckInteractions = async () => {
        setLoading(true)
        try {
            const response = await axios.post('/api/drug-interaction/check', {
                medication_list: medications
            })
            setInteractions(response.data)
        } catch (error) {
            console.error('Check failed:', error)
        }
        setLoading(false)
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">💊 Drug Interaction Checker</h2>

            <div className="space-y-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMedication}
                        onChange={(e) => setNewMedication(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddMedication()}
                        placeholder="Enter medication name"
                        className="flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleAddMedication}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Add
                    </button>
                </div>

                <div className="space-y-2">
                    {medications.map((med, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                            <span>{med}</span>
                            <button
                                onClick={() => setMedications(medications.filter((_, i) => i !== idx))}
                                className="text-red-600 hover:underline"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleCheckInteractions}
                    disabled={medications.length < 2 || loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                >
                    {loading ? 'Checking...' : 'Check Interactions'}
                </button>

                {interactions && (
                    <div className="mt-6 space-y-3">
                        <h3 className="font-semibold text-lg">Interaction Results:</h3>
                        {interactions.interactions_found === 0 ? (
                            <div className="p-4 bg-green-50 rounded">
                                <p className="text-green-700">✅ No interactions found</p>
                            </div>
                        ) : (
                            interactions.interactions?.map((inter, idx) => (
                                <div key={idx} className={`p-4 rounded ${inter.severity === 'severe' ? 'bg-red-50 border border-red-200' :
                                        inter.severity === 'moderate' ? 'bg-yellow-50 border border-yellow-200' :
                                            'bg-green-50 border border-green-200'
                                    }`}>
                                    <p className="font-semibold">{inter.drug_pair}</p>
                                    <p className="text-sm mt-2">{inter.interaction_description}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default DrugChecker
