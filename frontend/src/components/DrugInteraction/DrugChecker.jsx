import React, { useState } from 'react'

function DrugChecker() {
  const [drug, setDrug] = useState('')
  const [interactions, setInteractions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleCheck = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:5000/api/drug/check?drug=${drug}`)
      const data = await response.json()
      setInteractions(data.interactions || [])
    } catch (err) {
      setError('Failed to check drug interactions')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Drug Interaction Checker</h2>

      <form onSubmit={handleCheck} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Drug Name</label>
          <input
            type="text"
            value={drug}
            onChange={(e) => setDrug(e.target.value)}
            placeholder="Enter drug name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check Interactions'}
        </button>
      </form>

      {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {interactions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Interactions Found:</h3>
          <div className="space-y-3">
            {interactions.map((interaction, index) => (
              <div key={index} className="p-4 border border-yellow-300 bg-yellow-50 rounded">
                <p className="font-semibold text-yellow-800">{interaction.drug_2}</p>
                <p className="text-sm text-gray-700 mt-1">{interaction.interaction_description}</p>
                <p className="text-sm text-indigo-600 mt-2">
                  <strong>Recommendation:</strong> {interaction.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DrugChecker