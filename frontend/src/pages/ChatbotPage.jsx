import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import Header from '../components/Common/Header'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

function ChatbotUI({ showHeader = true }) {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm HealthEcho. How can I assist you today?", sender: 'bot' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage = { id: Date.now(), text: input, sender: 'user' }
        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const response = await axios.post('/api/chatbot/message', {
                message: input,
                session_id: 'default'
            })
            const botMessage = {
                id: Date.now() + 1,
                text: response?.data?.message || 'Sorry, no response.',
                sender: 'bot'
            }
            setMessages((prev) => [...prev, botMessage])
        } catch (error) {
            console.error('Chatbot error:', error)
            const errorMessage = {
                id: Date.now() + 2,
                text: 'Sorry, I encountered an error. Please try again.',
                sender: 'bot'
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-lg flex flex-col" style={{ minHeight: '500px' }}>
            {showHeader && (
                <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                    <h3 className="font-semibold">💬 HealthEcho Assistant</h3>
                </div>
            )}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-xs px-4 py-3 rounded-lg text-base ${msg.sender === 'user'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-800'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">✍️ Typing...</div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 transition text-base"
                >
                    Send
                </button>
            </form>
        </div>
    )
}

function ChatbotPage() {
    const { user } = useAuthStore()
    const navigate = useNavigate()
    const initials = user
        ? `${(user.first_name || '').charAt(0)}${(user.last_name || '').charAt(0)}`.toUpperCase()
        : ''
    const patientDetails = user ? (
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
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <Header user={user} />
            <div className="flex flex-col items-center justify-center py-8 min-h-[calc(100vh-64px)]">
                <div className="mb-8 w-full max-w-xl flex justify-between items-center">
                    <div className="flex items-center space-x-3">{patientDetails}</div>
                    <button
                        aria-label="Close Chatbot"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                <ChatbotUI showHeader={true} />
            </div>
        </div>
    )
}

export default ChatbotPage
