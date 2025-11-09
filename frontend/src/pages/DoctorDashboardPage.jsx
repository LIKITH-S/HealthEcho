import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import Header from '../components/Common/Header'
import DoctorDashboard from '../components/DoctorDashboard/DoctorDashboard'

function DoctorDashboardPage() {
    const { user } = useAuthStore()

    return (
        <div className="min-h-screen bg-gray-50">
            <Header user={user} />
            <div className="container mx-auto px-4 py-8">
                <DoctorDashboard />
            </div>
        </div>
    )
}

export default DoctorDashboardPage
