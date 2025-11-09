import React, { useState } from 'react'
import axios from 'axios'

function MentalHealthAssessment() {
    const [assessmentType, setAssessmentType] = useState('PHQ9')
    const [scores, setScores] = useState({})
    const [totalScore, setTotalScore] = useState(0)
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

    const phq9Questions = [
        'Little interest or pleasure in doing things',
        'Feeling down, depressed, or hopeless',
        'Trouble falling or staying asleep',
        'Feeling tired or having little energy',
        'Poor appetite or overeating',
        'Feeling bad about yourself',
        'Trouble concentrating on things',
        'Moving or speaking slowly or too fast',
        'Thoughts that you would be better off dead'
    ]

    const handleScoreChange = (index, value) => {
        const newScores = { ...scores, [index]: parseInt(value) }
        setScores(newScores)
        const total = Object.values(newScores).reduce((a, b) => a + b, 0)
        setTotalScore(total)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await axios.post('/api/mental-health/assess', {
                assessment_type: assessmentType,
                scores,
                total_score: totalScore
            })

            setResult(response.data)
        } catch (error) {
            console.error('Assessment failed:', error)
        }

        setLoading(false)
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">🧠 Mental Health Assessment</h2>

            {!result ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-3">
                        {phq9Questions.map((question, idx) => (
                            <div key={idx} className="border p-4 rounded">
                                <p className="font-medium mb-2">{idx + 1}. {question}</p>
                                <select
                                    value={scores[idx] || 0}
                                    onChange={(e) => handleScoreChange(idx, e.target.value)}
                                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="0">Not at all</option>
                                    <option value="1">Several days</option>
                                    <option value="2">More than half the days</option>
                                    <option value="3">Nearly every day</option>
                                </select>
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                    >
                        {loading ? 'Assessing...' : 'Submit Assessment'}
                    </button>
                </form>
            ) : (
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded">
                        <p className="font-semibold">Your Score: {result.total_score}</p>
                        <p className="text-sm text-gray-600 mt-2">Severity: {result.severity_level}</p>
                    </div>

                    {result.is_crisis && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded">
                            <p className="text-red-700 font-semibold">⚠️ Crisis Support Available</p>
                            <p className="text-sm mt-2">Please reach out to mental health professionals immediately.</p>
                        </div>
                    )}

                    <button
                        onClick={() => setResult(null)}
                        className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                    >
                        Take Assessment Again
                    </button>
                </div>
            )}
        </div>
    )
}

export default MentalHealthAssessment
