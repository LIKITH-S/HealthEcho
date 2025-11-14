import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const UserProfileDropdown = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()
    const { logout } = useAuthStore()

    const initials = user ? `${(user.first_name || '').charAt(0)}${(user.last_name || '').charAt(0)}`.toUpperCase() : 'U'

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleEditProfile = () => {
        setIsOpen(false)
        navigate('/patient/profile')
    }

    const handleLogout = () => {
        setIsOpen(false)
        logout()
        navigate('/login')
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm">
                    {initials}
                </div>
                <span className="text-sm font-semibold text-gray-800">{user?.first_name} {user?.last_name}</span>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                    <div className="px-4 py-3 border-b">
                        <p className="text-sm font-semibold text-gray-800">{user?.first_name} {user?.last_name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        {user?.role && <p className="text-xs text-gray-500 capitalize mt-1">{user.role}</p>}
                    </div>

                    <button
                        onClick={handleEditProfile}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition"
                    >
                        Edit Profile
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}

export default UserProfileDropdown
