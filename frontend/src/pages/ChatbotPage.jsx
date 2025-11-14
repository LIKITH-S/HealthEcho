import React from 'react'
import Header from '../components/Common/Header'
import ChatbotUI from '../components/Chatbot/ChatbotUI'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

function ChatbotPage() {
    const { user } = useAuthStore()
    const navigate = useNavigate()

    const handleClose = () => {
        navigate(-1)
    }

    const initials = user ? `${(user.first_name || '').charAt(0)}${(user.last_name || '').charAt(0)}`.toUpperCase() : ''

    return (
        <div className="min-h-screen bg-gray-50">
            <Header user={user} />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-lg shadow mb-4">
                        <div className="grid grid-cols-3 items-center px-4 py-3 border-b">
                            {/* Left: Patient details */}
                            <div className="flex items-center space-x-3">
                                {user ? (
                                    <>
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                                            {initials}
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-semibold text-gray-800">{user.first_name} {user.last_name}</p>
                                            <p className="text-gray-500 capitalize">{user.role}</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-sm text-gray-500">Guest</div>
                                )}
                            </div>

                            {/* Center: Title */}
                            <div className="text-center">
                                <h2 className="text-lg font-semibold">💬 HealthEcho Assistant</h2>
                            </div>

                            {/* Right: Close button */}
                            <div className="flex justify-end">
                                <button
                                    aria-label="Close Chatbot"
                                    onClick={handleClose}
                                    className="ml-4 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <ChatbotUI showHeader={false} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatbotPage
