import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '../../lib/utils'
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
      "group flex w-full gap-3 px-4 py-4 md:px-8",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-auto shadow-sm",
        isUser ? "bg-gray-200" : "bg-[#3f51b5]"
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-gray-500" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "flex flex-col max-w-[85%] md:max-w-[75%] min-w-0",
        isUser ? "items-end" : "items-start"
      )}>
        {isStreaming ? (
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-1.5 text-gray-500 text-sm">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3f51b5] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3f51b5] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3f51b5] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs ml-1">Analyzing...</span>
          </div>
        ) : (
          <div className={cn(
            "px-5 py-4 shadow-sm",
            isUser 
              ? "bg-[#3f51b5] text-white rounded-2xl rounded-br-sm" 
              : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-sm"
          )}>
            <div className={cn(
              "prose prose-sm max-w-none prose-p:leading-relaxed",
              isUser ? "prose-invert text-white prose-p:text-white prose-strong:text-white" : "prose-p:text-gray-700 prose-headings:text-gray-900 prose-strong:text-gray-900",
              !isUser && "prose-a:text-[#3f51b5] prose-a:no-underline hover:prose-a:underline",
              "prose-code:text-[#3f51b5] prose-code:bg-gray-50 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-xs prose-code:font-mono",
              "prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl",
              !isUser && "prose-li:text-gray-700",
              "prose-table:border-collapse",
              !isUser && "prose-th:bg-gray-50 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-xs prose-th:uppercase prose-th:tracking-wider prose-th:font-bold prose-th:border prose-th:border-gray-200",
              !isUser && "prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-gray-200"
            )}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Copy Button */}
        {!isUser && !isStreaming && content && (
          <button
            onClick={handleCopy}
            className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 pl-1"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  )
}
