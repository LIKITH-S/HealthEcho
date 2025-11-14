import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function PrivateRoute({ children, requiredRole }) {
    const { user } = useAuthStore()

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default PrivateRoute
