import React, { useState, useEffect } from 'react'
import PatientsList from './PatientsList'
import EmergencySOSPanel from './EmergencySOSPanel'
import AddPatientDetails from './AddPatientDetails'
import ContactManagement from './ContactManagement'
import HospitalLocationShare from './HospitalLocationShare'
import UploadPatientReport from './UploadPatientReport'
import axios from 'axios'

function DoctorDashboard() {
    const [activeTab, setActiveTab] = useState('patients');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('/api/doctor/patients');
            setPatients(response.data.patients);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full flex flex-wrap space-x-4 border-b bg-white p-4 rounded-lg mt-2">
                <button
                    className={`py-2 px-4 font-semibold border-b-2 transition
            ${activeTab === 'patients' ? 'border-purple-700 text-purple-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                    onClick={() => setActiveTab('patients')}
                >
                    + New Patient
                </button>
                <button
                    className={`py-2 px-4 font-semibold border-b-2 transition
            ${activeTab === 'contacts' ? 'border-purple-700 text-purple-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                    onClick={() => setActiveTab('contacts')}
                >
                    Contacts
                </button>
                <button
                    className={`py-2 px-4 font-semibold border-b-2 transition
            ${activeTab === 'emergency' ? 'border-purple-700 text-purple-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                    onClick={() => setActiveTab('emergency')}
                >
                    Emergency SOS
                </button>
                <button
                    className={`py-2 px-4 font-semibold border-b-2 transition
            ${activeTab === 'upload' ? 'border-purple-700 text-purple-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                    onClick={() => setActiveTab('upload')}
                >
                    Upload Report
                </button>
                <button
                    className={`py-2 px-4 font-semibold border-b-2 transition
            ${activeTab === 'location' ? 'border-purple-700 text-purple-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                    onClick={() => setActiveTab('location')}
                >
                    Share Hospital Location
                </button>
            </div>
            <div className="max-w-4xl mx-auto mt-6">
                {activeTab === 'patients' && <AddPatientDetails patient={{}} />}
                {activeTab === 'contacts' && <ContactManagement />}
                {activeTab === 'emergency' && <EmergencySOSPanel patient={selectedPatient || {}} />}
                {activeTab === 'upload' && <UploadPatientReport />}
                {activeTab === 'location' && <HospitalLocationShare />}
            </div>
        </div>
    );
}

export default DoctorDashboard;
