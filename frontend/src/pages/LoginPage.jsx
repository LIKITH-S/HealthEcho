import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import UnifiedLogin from '../components/Auth/UnifiedLogin'

function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuthStore()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleLogin = async (email, password, role) => {
        setLoading(true)
        setError(null)

        try {
            const success = await login(email, password, role)

            if (success) {
                navigate(role === 'patient' ? '/patient-dashboard' : '/doctor-dashboard')
            } else {
                setError('Login failed. Please try again.')
            }
        } catch (err) {
            setError(err.message || 'An error occurred during login.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-md">
                <UnifiedLogin onLogin={handleLogin} loading={loading} error={error} />
                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage