import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import UserProfileDropdown from './UserProfileDropdown'

function Header({ user, onTabChange }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleLogoClick = () => {
        // If already on patient dashboard, just trigger tab change
        if (user?.role === 'patient' && location.pathname === '/patient-dashboard') {
            if (onTabChange) {
                onTabChange('overview')
            }
        } else if (user?.role === 'doctor' && location.pathname === '/doctor-dashboard') {
            if (onTabChange) {
                onTabChange('overview')
            }
        } else {
            // Navigate to appropriate dashboard
            if (user?.role === 'patient') {
                navigate('/patient-dashboard', { state: { tab: 'overview' } })
            } else if (user?.role === 'doctor') {
                navigate('/doctor-dashboard', { state: { tab: 'overview' } })
            } else {
                navigate('/login')
            }
        }
    }

    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <button
                    onClick={handleLogoClick}
                    className="flex items-center space-x-2 hover:opacity-80 transition"
                >
                    <span className="text-2xl">💊</span>
                    <h1 className="text-2xl font-bold text-indigo-600">HealthEcho</h1>
                </button>

                <div className="flex items-center space-x-6">
                    {user && (
                        <UserProfileDropdown user={user} />
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
