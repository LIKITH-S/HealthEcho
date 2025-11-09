import api from './api'

// Send a message to the chatbot service and receive a reply
export async function sendMessage(text, context = {}){
  try{
    const res = await api.post('/chatbot/message', { text, context })
    return res.data
  }catch(err){
    console.error('chatbot.sendMessage error', err)
    throw err
  }
}

// Lightweight polling/chat history fetch
export async function fetchChatHistory(conversationId){
  try{
    const res = await api.get(`/chatbot/history/${conversationId}`)
    return res.data
  }catch(err){
    console.error('chatbot.fetchChatHistory error', err)
    return { messages: [] }
  }
}
