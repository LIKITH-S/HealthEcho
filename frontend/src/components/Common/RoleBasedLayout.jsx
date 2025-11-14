import React, { useState } from 'react'

function RoleBasedLayout({ children, role }) {
  const layouts = {
    patient: {
      bg: 'bg-blue-50',
      accent: 'text-blue-600',
    },
    doctor: {
      bg: 'bg-green-50',
      accent: 'text-green-600',
    },
  }

  const layout = layouts[role] || layouts.patient

  return (
    <div className={`min-h-screen ${layout.bg}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className={`mb-6 p-4 rounded-lg border-l-4 ${layout.accent}`}>
          <h1 className={`text-2xl font-bold ${layout.accent}`}>
            Welcome, {role === 'patient' ? 'Patient' : 'Doctor'}
          </h1>
        </div>
        {children}
      </div>
    </div>
  )
}

export default RoleBasedLayout