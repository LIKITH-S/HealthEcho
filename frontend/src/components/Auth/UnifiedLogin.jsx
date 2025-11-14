
UnifiedLogin.jsx
import React, { useState } from 'react'

function UnifiedLogin({ onLogin, loading, error }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('patient')

    const handleSubmit = (e) => {
        e.preventDefault()
        onLogin(email, password, role)
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">HealthEcho</h1>
            <p className="text-center text-gray-600 mb-6">AI-Powered Healthcare Assistant</p>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Login as</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div className="mt-4 text-center">
                <a href="#" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    Forgot Password?
                </a>
            </div>
        </div>
    )
}

export default UnifiedLogin