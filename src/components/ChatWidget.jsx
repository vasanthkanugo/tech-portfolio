import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { askClaude } from '../api/claude'
import { jdMatchMetrics, JD_MATCH_INSTRUCTIONS } from '../data/jd-match-metrics'

const WELCOME_MESSAGE = `Hey! I'm Gopala — software engineer with about 8 years across cloud infra, data pipelines, and fullstack.

I've got some good stories if you're curious: there's the time I traced a $2M AWS cost leak to a single NAT Gateway misconfiguration, migrating an entire data pipeline to Kubernetes with zero prior K8s experience, or how I turned a failing research app around by just... putting it in Slack.

Ask me anything — about my experience, a specific role, or drop a job description and I'll tell you how well I'd fit.`

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = () => setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

function useVisualViewportHeight() {
  const [height, setHeight] = useState(() =>
    typeof window !== 'undefined' ? window.visualViewport?.height ?? window.innerHeight : 600
  )
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const handler = () => setHeight(vv.height)
    vv.addEventListener('resize', handler)
    return () => vv.removeEventListener('resize', handler)
  }, [])
  return height
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const isMobile = useIsMobile()
  const viewportHeight = useVisualViewportHeight()

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen])

  async function handleSend() {
    if (!input.trim()) return

    let messageContent = input.trim()
    let displayContent = input.trim()

    if (messageContent.startsWith('/match ')) {
      const jdText = messageContent.slice('/match '.length).trim()
      if (!jdText) return
      displayContent = '📋 Analyzing JD match...'
      const dimensionList = jdMatchMetrics
        .map(d => `- ${d.label} (weight: ${d.weight}): ${d.description}`)
        .join('\n')
      messageContent = `${JD_MATCH_INSTRUCTIONS}\n\nScoring dimensions to use:\n${dimensionList}\n\nJob Description to analyze:\n${jdText}`
    }

    const nextMessages = [...messages, { role: 'user', content: messageContent }]
    const displayMessages = [...messages, { role: 'user', content: displayContent }]

    setMessages(displayMessages)
    setInput('')
    setError(null)
    setIsLoading(true)

    const isMatchRequest = displayContent === '📋 Analyzing JD match...'

    try {
      let reply = await askClaude(nextMessages)
      if (isMatchRequest) {
        reply += '\n\n---\n\n*There\'s a lot more to my story than what fits here. If you\'d like to dig deeper, I\'d love to connect! Reach out via [LinkedIn](https://linkedin.com/in/vasanth-kanugo) or email me at vasanth.kanugo@gmail.com — always happy to chat or jump on a quick call.* 🤝'
      }
      setMessages([...displayMessages, { role: 'assistant', content: reply }])
    } catch (err) {
      setError('Failed to get response. Please try again.')
      console.error('Chat error:', err)
      setMessages(messages)
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Backdrop (desktop only) */}
      <AnimatePresence>
        {isOpen && !isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40"
          />
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.9, y: 10, x: 20 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.9, y: 10, x: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed z-50 ${
              isMobile
                ? 'inset-x-0 bottom-0'
                : 'bottom-24 right-6'
            }`}
            onClick={isMobile ? undefined : (e) => e.stopPropagation()}
          >
            <div
              className={`bg-stone-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl flex flex-col ${
                isMobile
                  ? 'w-full rounded-t-2xl'
                  : 'w-[640px] h-[700px] rounded-2xl'
              }`}
              style={isMobile ? { height: `${Math.round(viewportHeight * 0.88)}px` } : undefined}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
                <h3 className="font-semibold text-gray-900 dark:text-white">Ask Me</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] px-4 py-2.5 rounded-lg rounded-bl-none text-sm leading-relaxed bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        }}
                      >
                        {WELCOME_MESSAGE}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-lg text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-500 text-white rounded-br-none'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            h2: ({ children }) => <h2 className="font-bold text-base mt-3 mb-1 first:mt-0">{children}</h2>,
                            h3: ({ children }) => <h3 className="font-semibold mt-2 mb-1 first:mt-0">{children}</h3>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 mb-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside space-y-0.5 mb-2">{children}</ol>,
                            li: ({ children }) => <li className="leading-snug">{children}</li>,
                            table: ({ children }) => (
                              <div className="overflow-x-auto my-2">
                                <table className="text-xs border-collapse w-full">{children}</table>
                              </div>
                            ),
                            th: ({ children }) => <th className="border border-gray-400 dark:border-gray-600 px-2 py-1 bg-gray-300 dark:bg-gray-700 font-semibold text-left">{children}</th>,
                            td: ({ children }) => <td className="border border-gray-400 dark:border-gray-600 px-2 py-1">{children}</td>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-center text-xs text-red-500 dark:text-red-400 p-2 bg-red-50 dark:bg-red-950/20 rounded">
                    {error}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 space-y-2">
                <button
                  onClick={() => setInput('/match ')}
                  disabled={isLoading}
                  className="text-xs px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Drop a JD — let's see if I'm your hire
                </button>
                <div className="flex gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about my experience..."
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    rows="2"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium text-sm flex-shrink-0 flex items-center justify-center h-16"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg flex items-center justify-center transition-colors ${
          isOpen ? 'hidden' : ''
        }`}
        title="Ask Me"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </motion.button>
    </>
  )
}
