import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PatientDashboardPage from './pages/PatientDashboardPage'
import ProfileEditPage from './pages/ProfileEditPage'
import ChatbotPage from './pages/ChatbotPage'
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
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/patient-dashboard"
                    element={
                        <PrivateRoute requiredRole="patient">
                            <PatientDashboardPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/patient/profile"
                    element={
                        <PrivateRoute requiredRole="patient">
                            <ProfileEditPage />
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
                <Route
                    path="/chatbot"
                    element={
                        <PrivateRoute>
                            <ChatbotPage />
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    )
}

export default App