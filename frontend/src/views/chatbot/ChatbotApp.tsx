"use client";
import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, PanelLeftOpen, PanelLeftClose, Zap, RotateCcw, ArrowLeft, Mic, VolumeX, Bot } from 'lucide-react'
import AiMessage from '../../components/chatbot/AiMessage'
import {  useRouter  } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AiChat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const queryClient = useQueryClient()
  const navigate = useRouter()

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate.push('/chatbot/login')
    }
  }, [navigate])

  // Fetch conversations for sidebar
  const { data: conversations = [] } = useQuery({
    queryKey: ['aiConversations'],
    queryFn: async () => {
      const res = await api.get('/ai/conversations')
      return res.data.data
    }
  })

  // Fetch suggestions
  const { data: suggestions = [] } = useQuery({
    queryKey: ['aiSuggestions'],
    queryFn: async () => {
      const res = await api.get('/ai/suggestions')
      return res.data.data
    }
  })

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await api.post('/ai/chat', { message, conversationId })
      return res.data.data
    },
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev.filter(m => m.content !== '...streaming...'),
        { role: 'assistant', content: data.response }
      ])
      setConversationId(data.conversationId)
      setIsStreaming(false)
      queryClient.invalidateQueries({ queryKey: ['aiConversations'] })
    },
    onError: (error: any) => {
      setMessages(prev => [
        ...prev.filter(m => m.content !== '...streaming...'),
        { role: 'assistant', content: `❌ Error: ${error?.response?.data?.message || 'Failed to get response. Please try again.'}` }
      ])
      setIsStreaming(false)
    }
  })

  // Delete conversation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/ai/conversations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiConversations'] })
    }
  })

  // Pin conversation
  const pinMutation = useMutation({
    mutationFn: async ({ id, pinned }: { id: string, pinned: boolean }) =>
      api.patch(`/ai/conversations/${id}`, { pinned }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aiConversations'] })
  })

  // Load conversation
  const loadConversation = async (id: string) => {
    try {
      const res = await api.get(`/ai/conversations/${id}`)
      const conv = res.data.data
      setMessages(conv.messages.map((m: any) => ({ role: m.role, content: m.content })))
      setConversationId(id)
    } catch {
      console.error('Failed to load conversation')
    }
  }

  // New chat
  const handleNewChat = () => {
    setMessages([])
    setConversationId(null)
    setInput('')
    inputRef.current?.focus()
  }

  // Send message
  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || isStreaming) return

    setMessages(prev => [...prev, { role: 'user', content: trimmed }])
    setInput('')
    setIsStreaming(true)
    chatMutation.mutate(trimmed)
  }

  // Keyboard
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + 'px'
    }
  }, [input])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  // Quick action
  const handleSuggestion = (text: string) => {
    setInput(text)
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'user', content: text }])
      setInput('')
      setIsStreaming(true)
      chatMutation.mutate(text)
    }, 100)
  }

  const showWelcome = messages.length === 0

  return (
    <div className="flex h-screen w-screen bg-gray-50 text-gray-900 font-sans overflow-hidden chatbot-app m-0 p-0 absolute top-0 left-0 right-0 bottom-0 z-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate.push('/dashboard')}
              className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#3f51b5] flex items-center justify-center shadow-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900">AI Business Assistant</h1>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <p className="text-xs text-green-500 font-medium">Online & Analyzing</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <VolumeX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          {showWelcome ? (
            <div className="flex flex-col items-center justify-center h-full px-4 pb-8">
              {/* Welcome Hero */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-2xl"
              >
                <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-[#3f51b5] flex items-center justify-center shadow-lg">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to <span className="text-[#3f51b5]">AIVA AI</span>
                </h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-lg mx-auto">
                  Your intelligent business assistant. Ask me anything about leads, customers, purchase orders, inventory, quotations, revenue, and more.
                </p>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                  {suggestions.slice(0, 6).map((s: any, i: number) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => handleSuggestion(s.text)}
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm text-left hover:border-[#3f51b5]/50 hover:bg-gray-50 transition-all duration-200"
                    >
                      <span className="text-xl">{s.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 truncate block font-medium">{s.text}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{s.category}</span>
                      </div>
                      <Zap className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#3f51b5] transition-colors shrink-0" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto py-6">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AiMessage role={msg.role} content={msg.content} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Streaming indicator */}
              {isStreaming && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <AiMessage role="assistant" content="" isStreaming />
                </motion.div>
              )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 shrink-0 pb-6 relative z-10">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
              <Mic className="h-5 w-5" />
            </button>
            
            <div className="flex-1 relative flex items-center gap-2 bg-white border border-[#d4b982] rounded-full px-5 py-3 focus-within:ring-2 focus-within:ring-[#d4b982]/40 focus-within:border-[#d4b982] shadow-sm transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your business..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 resize-none focus:outline-none max-h-[120px] pt-0.5"
              />
            </div>
            
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="flex items-center justify-center h-12 w-12 rounded-full bg-[#8c9eff] text-white hover:bg-[#7986cb] shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <Send className="h-5 w-5 ml-0.5" />
            </button>
          </div>
          <p className="text-[11px] text-gray-400 text-center mt-3">
            AI can make mistakes. Verify important business metrics from your reports.
          </p>
        </div>
      </div>
    </div>
  )
}
