import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'

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
        <div className="bg-white rounded-lg shadow flex flex-col h-96">
            {/* Header (optional) */}
            {showHeader && (
                <div className="bg-indigo-600 text-white p-4 rounded-t-lg">
                    <h3 className="font-semibold">💬 HealthEcho Assistant</h3>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'user'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-800'
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                            ✍️ Typing...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 transition"
                >
                    Send
                </button>
            </form>
        </div>
    )
}

export default ChatbotUI
