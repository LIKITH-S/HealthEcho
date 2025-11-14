// frontend/src/components/DoctorDashboard/DoctorDashboard.jsx

import React, { useEffect, useState, useCallback } from "react";
import { getDoctorPatients } from "../../services/doctorService";

import PatientsList from "./PatientsList";
import AddPatientDetails from "./AddPatientDetails";
import EmergencySOSPanel from "./EmergencySOSPanel";
import ContactManagement from "./ContactManagement";
import HospitalLocationShare from "./HospitalLocationShare";
import UploadPatientReport from "./UploadPatientReport";
import CreatePatient from "./CreatePatient";
import AddExistingPatient from "./AddExistingPatient";   // ✅ FIX: You forgot this import

function DoctorDashboard() {
    const [patients, setPatients] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // patients | details | contacts | sos | upload | share | newpatient
    const [activeTab, setActiveTab] = useState("patients");

    /** Load all patients for logged-in doctor */
    const loadPatients = useCallback(async () => {
        setLoadingPatients(true);

        try {
            const res = await getDoctorPatients();
            const list = res.patients || res || [];
            setPatients(list);

            // Auto-select first patient if none selected
            if (!selectedPatient && list.length > 0) {
                setSelectedPatient(list[0]);
            }
        } catch (err) {
            console.error("Failed to load patients:", err);
        } finally {
            setLoadingPatients(false);
        }
    }, [selectedPatient]);

    useEffect(() => {
        loadPatients();
    }, [loadPatients]);

    /** When clicking a patient card */
    const onSelectPatient = (p) => {
        setSelectedPatient(p);
        setActiveTab("details");
    };

    const refreshAll = () => loadPatients();

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-indigo-700">Doctor Dashboard</h1>

                <button
                    onClick={refreshAll}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Refresh
                </button>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                {/* LEFT SIDEBAR */}
                <aside className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-bold mb-3 text-lg">Patients</h3>

                        <PatientsList
                            patients={patients}
                            loading={loadingPatients}
                            onSelectPatient={onSelectPatient}
                        />
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="md:col-span-3 space-y-4">

                    {/* Tabs */}
                    <div className="bg-white p-4 rounded-lg shadow flex gap-2 flex-wrap">

                        <button
                            className={`px-3 py-2 rounded ${activeTab === "newpatient"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100"
                                }`}
                            onClick={() => setActiveTab("newpatient")}
                        >
                            ➕ New Patient
                        </button>

                        {/*
                        <button
                            className={`px-3 py-2 rounded ${activeTab === "existing"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100"
                                }`}
                            onClick={() => setActiveTab("existing")}
                        >
                            🔍 Add Existing Patient
                        </button>
                        */}

                        <button
                            className={`px-3 py-2 rounded ${activeTab === "details"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100"
                                }`}
                            onClick={() => setActiveTab("details")}
                        >
                            📝 Add Details
                        </button>

                        <button
                            className={`px-3 py-2 rounded ${activeTab === "contacts"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100"
                                }`}
                            onClick={() => setActiveTab("contacts")}
                        >
                            📞 Contacts
                        </button>

                        <button
                            className={`px-3 py-2 rounded ${activeTab === "sos"
                                ? "bg-red-600 text-white"
                                : "bg-gray-100"
                                }`}
                            onClick={() => setActiveTab("sos")}
                        >
                            🚨 Emergency SOS
                        </button>

                        <button
                            className={`px-3 py-2 rounded ${activeTab === "upload"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100"
                                }`}
                            onClick={() => setActiveTab("upload")}
                        >
                            📄 Upload Report
                        </button>

                        <button
                            className={`px-3 py-2 rounded ${activeTab === "share"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100"
                                }`}
                            onClick={() => setActiveTab("share")}
                        >
                            🏥 Share Hospital Location
                        </button>
                    </div>

                    {/* Dynamic content */}
                    <div className="bg-white rounded-lg shadow p-4">

                        {/* NEW PATIENT DOES NOT REQUIRE SELECTED PATIENT */}
                        {activeTab === "newpatient" && (
                            <CreatePatient onCreated={refreshAll} />
                        )}

                        {/* OTHER TABS NEED A SELECTED PATIENT */}
                        {activeTab !== "newpatient" && !selectedPatient && (
                            <div className="text-gray-600">
                                Select a patient from the left list.
                            </div>
                        )}

                        {selectedPatient && (
                            <>
                                {activeTab === "details" && (
                                    <AddPatientDetails
                                        patient={selectedPatient}
                                        onSaved={refreshAll}
                                    />
                                )}

                                {activeTab === "contacts" && (
                                    <ContactManagement
                                        patient={selectedPatient}
                                        onChanged={refreshAll}
                                    />
                                )}

                                {activeTab === "sos" && (
                                    <EmergencySOSPanel
                                        patient={selectedPatient}
                                        onTriggered={refreshAll}
                                    />
                                )}

                                {activeTab === "upload" && (
                                    <UploadPatientReport
                                        patient={selectedPatient}
                                        onUploaded={refreshAll}
                                    />
                                )}

                                {activeTab === "share" && (
                                    <HospitalLocationShare
                                        patient={selectedPatient}
                                        onShared={refreshAll}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DoctorDashboard;
