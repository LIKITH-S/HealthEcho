import React from 'react'
import React from 'react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-4">HealthEcho</h4>
            <p className="text-sm">
              AI-Powered Healthcare Assistant for better patient care and management.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p className="text-sm">Email: support@healthecho.com</p>
            <p className="text-sm">Phone: +1-800-HEALTH</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} HealthEcho. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer