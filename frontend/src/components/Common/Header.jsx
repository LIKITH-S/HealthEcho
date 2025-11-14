import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import UserProfileDropdown from './UserProfileDropdown'
// Import your logo (SVG/PNG/JPEG)
import logo from '../../assets/logo.svg' // Change extension/path as required

function Header({ user, onTabChange }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleLogoClick = () => {
        if (user?.role === 'patient' && location.pathname === '/patient-dashboard') {
            if (onTabChange) {
                onTabChange('overview')
            }
        } else if (user?.role === 'doctor' && location.pathname === '/doctor-dashboard') {
            if (onTabChange) {
                onTabChange('overview')
            }
        } else {
            if (user?.role === 'patient') {
                navigate('/patient-dashboard', { state: { tab: 'overview' } })
            } else if (user?.role === 'doctor') {
                navigate('/doctor-dashboard', { state: { tab: 'overview' } })
            } else {
                navigate('/login')
            }
        }
    }

    return (
        <header className="shadow" style={{ background: '#f7f8fa' }}>
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <button
                    onClick={handleLogoClick}
                    className="flex items-center space-x-2 hover:opacity-80 transition"
                    style={{ background: 'transparent' }}
                >
                    <img
                        src={logo}
                        alt="HealthEcho Logo"
                        style={{ height: "80px", width: "auto", background: '#f7faff' }}
                    />
                </button>
                <div className="flex items-center space-x-6">
                    {user && (
                        <UserProfileDropdown user={user} />
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
