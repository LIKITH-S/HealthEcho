import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import PatientDashboardPage from './pages/PatientDashboardPage'
import DoctorDashboardPage from './pages/DoctorDashboardPage'
import SettingsPage from './pages/SettingsPage'
import PrivateRoute from './components/PrivateRoute'
import './styles/globals.css'

function App() {
    const { user, loadUser } = useAuthStore()

    useEffect(() => {
        loadUser()
    }, [loadUser])

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/patient-dashboard"
                    element={
                        <PrivateRoute requiredRole="patient">
                            <PatientDashboardPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/doctor-dashboard"
                    element={
                        <PrivateRoute requiredRole="doctor">
                            <DoctorDashboardPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <PrivateRoute>
                            <SettingsPage />
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    )
}

export default App
