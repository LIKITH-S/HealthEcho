import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PatientsList from './PatientsList'
import EmergencySOSPanel from './EmergencySOSPanel'
import AddPatientDetails from './AddPatientDetails'

function DoctorDashboard() {
    const [activeTab, setActiveTab] = useState('patients')
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedPatient, setSelectedPatient] = useState(null)

    useEffect(() => {
        fetchPatients()
    }, [])

    const fetchPatients = async () => {
        try {
            const response = await axios.get('/api/doctor/patients')
            setPatients(response.data.patients)
            setLoading(false)
        } catch (error) {
            console.error('Failed to fetch patients:', error)
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex space-x-4 border-b bg-white p-4 rounded-lg">
                {['patients', 'emergency', 'details'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-4 font-semibold border-b-2 transition ${activeTab === tab
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        {tab === 'patients' && '👥 Patients'}
                        {tab === 'emergency' && '🚨 Emergency'}
                        {tab === 'details' && '📝 Add Details'}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div>
                {activeTab === 'patients' && (
                    <PatientsList
                        patients={patients}
                        loading={loading}
                        onSelectPatient={setSelectedPatient}
                    />
                )}
                {activeTab === 'emergency' && selectedPatient && (
                    <EmergencySOSPanel patient={selectedPatient} />
                )}
                {activeTab === 'details' && selectedPatient && (
                    <AddPatientDetails patient={selectedPatient} />
                )}
            </div>
        </div>
    )
}

export default DoctorDashboard
