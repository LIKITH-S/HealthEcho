import React, { useState } from 'react'

function RoleSelector({ selectedRole, onRoleChange }) {
  return (
    <div className="flex gap-4 mb-6">
      {['patient', 'doctor'].map((role) => (
        <label key={role} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="role"
            value={role}
            checked={selectedRole === role}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-4 h-4 accent-indigo-600"
          />
          <span className="text-gray-700 font-medium capitalize">
            {role}
          </span>
        </label>
      ))}
    </div>
  )
}

export default RoleSelector