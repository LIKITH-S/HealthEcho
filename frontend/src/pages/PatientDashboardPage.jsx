import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useLocation } from 'react-router-dom'
import Header from '../components/Common/Header'
import PatientDashboard from '../components/PatientDashboard/PatientDashboard'
import PatientHistory from '../components/PatientDashboard/PatientHistory'
import ChatbotToggle from '../components/Chatbot/ChatbotToggle'

function PatientDashboardPage() {
    const { user } = useAuthStore()
    const location = useLocation()
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'overview')

    const handleTabChange = (tab) => {
        setActiveTab(tab)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header user={user} onTabChange={handleTabChange} />
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left: Patient History (Sidebar) */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white p-4 rounded-lg shadow sticky top-24">
                            <PatientHistory />
                        </div>
                    </aside>

                    {/* Right: Main Dashboard Content */}
                    <main className="lg:col-span-3">
                        <PatientDashboard initialTab={activeTab} onTabChange={setActiveTab} />
                    </main>
                </div>

                {/* Chatbot Toggle (floating button) */}
                <ChatbotToggle />
            </div>
        </div>
    )
}

export default PatientDashboardPage
