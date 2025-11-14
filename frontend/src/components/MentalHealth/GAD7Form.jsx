import React, { useState } from 'react'

function GAD7Form() {
  const [responses, setResponses] = useState(Array(7).fill(0))
  const [score, setScore] = useState(null)
  const [severity, setSeverity] = useState(null)

  const questions = [
    'Feeling nervous, anxious or on edge',
    'Not being able to stop or control worrying',
    'Worrying too much about different things',
    'Trouble relaxing',
    'Being so restless that it is hard to sit still',
    'Becoming easily annoyed or irritable',
    'Feeling afraid as if something awful might happen',
  ]

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses]
    newResponses[index] = value
    setResponses(newResponses)
  }

  const calculateScore = () => {
    const totalScore = responses.reduce((a, b) => a + b, 0)
    setScore(totalScore)

    if (totalScore <= 4) setSeverity('Minimal anxiety')
    else if (totalScore <= 9) setSeverity('Mild anxiety')
    else if (totalScore <= 14) setSeverity('Moderate anxiety')
    else setSeverity('Severe anxiety')
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">GAD-7 Anxiety Assessment</h2>
      <p className="text-gray-600 mb-6">Over the last 2 weeks, how often have you been bothered by:</p>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index}>
            <p className="text-gray-700 font-medium mb-3">{index + 1}. {question}</p>
            <div className="flex gap-4">
              {[0, 1, 2, 3].map((value) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={value}
                    checked={responses[index] === value}
                    onChange={() => handleResponseChange(index, value)}
                    className="w-4 h-4 accent-indigo-600"
                  />
                  <span className="text-gray-700">
                    {value === 0 ? 'Not at all' : value === 1 ? 'Several days' : value === 2 ? 'More than half' : 'Nearly every day'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={calculateScore}
        className="mt-6 w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700"
      >
        Calculate Score
      </button>

      {score !== null && (
        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <p className="text-lg font-semibold text-indigo-800">
            Score: {score}/21
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Assessment:</strong> {severity}
          </p>
        </div>
      )}
    </div>
  )
}

export default GAD7Form
