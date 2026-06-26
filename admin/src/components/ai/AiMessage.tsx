import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { Bot, User, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface AiMessageProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export default function AiMessage({ role, content, isStreaming }: AiMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = role === 'user'

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn(
      "group flex gap-4 px-4 py-6 md:px-8",
      isUser ? "bg-transparent" : "bg-zinc-900/40"
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-md",
        isUser ? "bg-zinc-700" : "bg-gradient-to-br from-[#c5a059] to-[#d4b982]"
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-zinc-300" />
        ) : (
          <Bot className="h-4 w-4 text-zinc-950" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "text-xs font-semibold uppercase tracking-wider",
            isUser ? "text-zinc-400" : "text-[#c5a059]"
          )}>
            {isUser ? 'You' : 'AIVA AI'}
          </span>
        </div>

        {isStreaming ? (
          <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs text-zinc-500">Analyzing your data...</span>
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none
            prose-headings:text-zinc-100 prose-headings:font-bold prose-headings:border-b prose-headings:border-zinc-800 prose-headings:pb-2
            prose-p:text-zinc-300 prose-p:leading-relaxed
            prose-a:text-[#c5a059] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-zinc-100
            prose-code:text-[#c5a059] prose-code:bg-zinc-800/50 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-xs prose-code:font-mono
            prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl
            prose-li:text-zinc-300
            prose-td:text-zinc-300 prose-th:text-zinc-200
            prose-table:border-collapse
            prose-th:bg-zinc-800/60 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-xs prose-th:uppercase prose-th:tracking-wider prose-th:font-bold prose-th:border prose-th:border-zinc-700
            prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-zinc-800
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        )}

        {/* Copy Button */}
        {!isUser && !isStreaming && content && (
          <button
            onClick={handleCopy}
            className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  )
}
