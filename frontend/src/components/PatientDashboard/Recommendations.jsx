import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Recommendations() {
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRecommendations()
    }, [])

    const fetchRecommendations = async () => {
        try {
            const response = await axios.get('/api/recommendations')
            setRecommendations(response.data.recommendations)
            setLoading(false)
        } catch (error) {
            console.error('Failed to fetch recommendations:', error)
            setLoading(false)
        }
    }

    if (loading) return <div className="text-center">Loading recommendations...</div>

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Your Health Recommendations</h2>

            {recommendations.length === 0 ? (
                <p className="text-gray-500">No recommendations yet</p>
            ) : (
                <div className="space-y-3">
                    {recommendations.map((rec) => (
                        <div key={rec.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-800">{rec.recommendation_text}</p>
                                    <p className="text-sm text-gray-500 mt-1">Type: {rec.recommendation_type}</p>
                                    {rec.follow_up_date && (
                                        <p className="text-sm text-gray-500">Follow-up: {new Date(rec.follow_up_date).toLocaleDateString()}</p>
                                    )}
                                </div>
                                <span className={`px-3 py-1 rounded text-sm font-semibold ${rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                    }`}>
                                    {rec.priority}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Recommendations
