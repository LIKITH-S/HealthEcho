import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

        const success = await login(email, password, role)

        if (success) {
            navigate(role === 'patient' ? '/patient-dashboard' : '/doctor-dashboard')
        } else {
            setError('Login failed. Please try again.')
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <UnifiedLogin onLogin={handleLogin} loading={loading} error={error} />
        </div>
    )
}

export default LoginPage
