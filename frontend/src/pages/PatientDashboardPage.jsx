import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import Header from '../components/Common/Header'
import PatientDashboard from '../components/PatientDashboard/PatientDashboard'
import ChatbotUI from '../components/Chatbot/ChatbotUI'

function PatientDashboardPage() {
    const { user } = useAuthStore()

    return (
        <div className="min-h-screen bg-gray-50">
            <Header user={user} />
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <PatientDashboard />
                    </div>
                    <div>
                        <ChatbotUI />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PatientDashboardPage
