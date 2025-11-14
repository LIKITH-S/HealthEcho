import React from 'react'

const PatientHistory = () => {
    // Placeholder history data - will be replaced with real data from backend
    const historyItems = [
        { id: 1, type: 'Report Upload', description: 'Blood Test Report', date: '2025-11-10', status: 'completed' },
        { id: 2, type: 'Consultation', description: 'General Checkup', date: '2025-11-08', status: 'completed' },
        { id: 3, type: 'Medication', description: 'Prescribed Aspirin', date: '2025-11-05', status: 'active' },
        { id: 4, type: 'Lab Test', description: 'ECG Test', date: '2025-11-03', status: 'completed' }
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-blue-50 text-blue-700 border-blue-200'
            case 'completed':
                return 'bg-green-50 text-green-700 border-green-200'
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200'
        }
    }

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Report Upload':
                return '📄'
            case 'Consultation':
                return '👨‍⚕️'
            case 'Medication':
                return '💊'
            case 'Lab Test':
                return '🧪'
            default:
                return '📋'
        }
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical History</h3>
            <div className="space-y-3">
                {historyItems.map((item) => (
                    <div
                        key={item.id}
                        className={`p-3 rounded-lg border ${getStatusColor(item.status)}`}
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-xl">{getTypeIcon(item.type)}</span>
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{item.type}</p>
                                <p className="text-xs opacity-75">{item.description}</p>
                                <p className="text-xs opacity-50 mt-1">{item.date}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PatientHistory
