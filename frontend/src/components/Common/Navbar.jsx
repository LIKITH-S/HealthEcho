import React, { useState } from 'react'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold">
              HealthEcho
            </a>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="hidden md:flex gap-6">
            <a href="/patient-dashboard" className="hover:text-indigo-200">
              Dashboard
            </a>
            <a href="/settings" className="hover:text-indigo-200">
              Settings
            </a>
            <a href="/login" className="hover:text-indigo-200">
              Logout
            </a>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden pb-4">
            <a href="/patient-dashboard" className="block hover:text-indigo-200">
              Dashboard
            </a>
            <a href="/settings" className="block hover:text-indigo-200">
              Settings
            </a>
            <a href="/login" className="block hover:text-indigo-200">
              Logout
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar