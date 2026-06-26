import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, PanelLeftOpen, PanelLeftClose, Zap, RotateCcw } from 'lucide-react'
import AiMessage from '../../components/chatbot/AiMessage'
import AiChatSidebar from '../../components/chatbot/AiChatSidebar'

import { useNavigate } from 'react-router-dom'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AiChat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/chatbot/login')
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
      setSidebarOpen(false)
    } catch {
      console.error('Failed to load conversation')
    }
  }

  // New chat
  const handleNewChat = () => {
    setMessages([])
    setConversationId(null)
    setInput('')
    setSidebarOpen(false)
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
    <div className="flex h-screen w-screen bg-[#08060d] text-zinc-100 font-sans overflow-hidden chatbot-app m-0 p-0 absolute top-0 left-0 right-0 bottom-0 z-50">
      {/* Sidebar */}
      <AiChatSidebar
        conversations={conversations}
        activeConversationId={conversationId}
        onSelectConversation={loadConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={(id) => {
          if (window.confirm('Delete this conversation?')) {
            deleteMutation.mutate(id)
            if (id === conversationId) handleNewChat()
          }
        }}
        onPinConversation={(id, pinned) => pinMutation.mutate({ id, pinned })}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            >
              {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#c5a059] to-[#d4b982] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-zinc-950" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-zinc-100">AIVA AI Assistant</h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Business Intelligence</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            New Chat
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {showWelcome ? (
            <div className="flex flex-col items-center justify-center h-full px-4 pb-8">
              {/* Welcome Hero */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-2xl"
              >
                <div className="mx-auto mb-6 h-20 w-20 rounded-2xl bg-gradient-to-br from-[#c5a059] to-[#d4b982] flex items-center justify-center shadow-xl shadow-[#c5a059]/20">
                  <Sparkles className="h-10 w-10 text-zinc-950" />
                </div>
                <h2 className="text-3xl font-bold text-zinc-100 mb-2">
                  Welcome to <span className="text-[#c5a059]">AIVA AI</span>
                </h2>
                <p className="text-zinc-500 text-sm mb-8 leading-relaxed max-w-lg mx-auto">
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
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/50 text-left hover:border-[#c5a059]/30 hover:bg-zinc-900 transition-all duration-200"
                    >
                      <span className="text-xl">{s.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-zinc-300 group-hover:text-zinc-100 truncate block">{s.text}</span>
                        <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{s.category}</span>
                      </div>
                      <Zap className="h-3.5 w-3.5 text-zinc-700 group-hover:text-[#c5a059] transition-colors shrink-0" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
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
        <div className="border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-4 shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-[#c5a059]/40 focus-within:border-[#c5a059]/40 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your business..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 resize-none focus:outline-none max-h-[200px]"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#c5a059] text-zinc-950 hover:bg-[#d4b982] disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-zinc-600 text-center mt-2">
              AIVA AI can make mistakes. Always verify important business data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
