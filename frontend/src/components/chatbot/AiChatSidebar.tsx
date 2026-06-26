import { cn } from '../../lib/utils'
import { MessageSquarePlus, Pin, Trash2, Search, X } from 'lucide-react'
import { useState } from 'react'

interface ConversationItem {
  _id: string
  title: string
  pinned: boolean
  messageCount: number
  lastMessage: string
  updatedAt: string
}

interface AiChatSidebarProps {
  conversations: ConversationItem[]
  activeConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewChat: () => void
  onDeleteConversation: (id: string) => void
  onPinConversation: (id: string, pinned: boolean) => void
  isOpen: boolean
  onClose: () => void
}

export default function AiChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onPinConversation,
  isOpen,
  onClose,
}: AiChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pinnedConversations = filteredConversations.filter(c => c.pinned)
  const recentConversations = filteredConversations.filter(c => !c.pinned)

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString()
  }

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-80 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h2 className="text-sm font-bold text-[#c5a059] uppercase tracking-widest">Conversations</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onNewChat}
            className="p-2 rounded-lg bg-[#c5a059] text-zinc-950 hover:bg-[#d4b982] transition-colors"
            title="New Chat"
          >
            <MessageSquarePlus className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 transition-colors lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-[#c5a059]/50 focus:border-[#c5a059]/50"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {/* Pinned Section */}
        {pinnedConversations.length > 0 && (
          <div className="mb-3">
            <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-1.5">
              <Pin className="h-3 w-3" /> Pinned
            </div>
            {pinnedConversations.map(conv => (
              <ConversationRow
                key={conv._id}
                conv={conv}
                isActive={conv._id === activeConversationId}
                onSelect={onSelectConversation}
                onDelete={onDeleteConversation}
                onPin={onPinConversation}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

        {/* Recent Section */}
        {recentConversations.length > 0 && (
          <div>
            <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              Recent
            </div>
            {recentConversations.map(conv => (
              <ConversationRow
                key={conv._id}
                conv={conv}
                isActive={conv._id === activeConversationId}
                onSelect={onSelectConversation}
                onDelete={onDeleteConversation}
                onPin={onPinConversation}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

        {filteredConversations.length === 0 && (
          <div className="px-4 py-10 text-center text-zinc-600 text-sm">
            {searchQuery ? 'No conversations found.' : 'No conversations yet.\nStart a new chat!'}
          </div>
        )}
      </div>
    </div>
  )
}

function ConversationRow({
  conv,
  isActive,
  onSelect,
  onDelete,
  onPin,
  formatDate,
}: {
  conv: ConversationItem
  isActive: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onPin: (id: string, pinned: boolean) => void
  formatDate: (d: string) => string
}) {
  return (
    <button
      onClick={() => onSelect(conv._id)}
      className={cn(
        "group w-full text-left rounded-lg px-3 py-2.5 mb-0.5 transition-all duration-200",
        isActive
          ? "bg-[#c5a059]/10 border border-[#c5a059]/20 text-zinc-100"
          : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium truncate flex-1">{conv.title}</span>
        <span className="text-[10px] text-zinc-600 shrink-0 mt-0.5">{formatDate(conv.updatedAt)}</span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-zinc-600 truncate flex-1">{conv.lastMessage || 'No messages'}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onPin(conv._id, !conv.pinned); }}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-[#c5a059]"
            title={conv.pinned ? 'Unpin' : 'Pin'}
          >
            <Pin className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(conv._id); }}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </button>
  )
}
