// components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function PrivateRoute({ children, requiredRole }) {
    const { user, loading } = useAuthStore();

    if (loading) return <div className="p-6">Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/login" replace />;
    }

    // if children passed (wrapper usage), return them; otherwise render outlet for nested routes
    if (children) return children;

    return <Outlet />;
}
