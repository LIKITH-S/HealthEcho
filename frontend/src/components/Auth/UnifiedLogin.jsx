import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function UnifiedLogin({ onLogin, loading, error }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isDoctor, setIsDoctor] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        const role = isDoctor ? 'doctor' : 'patient'
        onLogin(email, password, role)
    }

    return (
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h1 className="text-3xl font-bold text-center mb-2 text-indigo-600">HealthEcho</h1>
            <p className="text-center text-gray-600 mb-6">AI-Powered Healthcare Assistant</p>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="your@email.com"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-500"
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>

                {/* Role Selector */}
                <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <input
                        type="checkbox"
                        id="doctor-checkbox"
                        checked={isDoctor}
                        onChange={(e) => setIsDoctor(e.target.checked)}
                        className="w-4 h-4 rounded"
                    />
                    <label htmlFor="doctor-checkbox" className="text-sm font-medium text-gray-700">
                        {isDoctor ? '🩺 Doctor Login' : '👤 Patient Login'}
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {/* Register Link */}
            <p className="text-center mt-6 text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-indigo-600 hover:underline font-semibold">
                    Register here
                </Link>
            </p>
        </div>
    )
}

export default UnifiedLogin
