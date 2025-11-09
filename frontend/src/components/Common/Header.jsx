import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

function Header({ user }) {
    const navigate = useNavigate()
    const { logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl">💊</span>
                    <h1 className="text-2xl font-bold text-indigo-600">HealthEcho</h1>
                </div>

                <div className="flex items-center space-x-6">
                    {user && (
                        <>
                            <div className="text-sm">
                                <p className="font-semibold text-gray-800">{user.first_name} {user.last_name}</p>
                                <p className="text-gray-500 capitalize">{user.role}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
