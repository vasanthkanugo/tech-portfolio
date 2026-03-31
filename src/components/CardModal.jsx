import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { DISCIPLINE_COLORS } from '../constants/disciplines'

export default function CardModal({ item, onClose, isMobile = false }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 20 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed z-50 ${isMobile ? 'inset-x-0 bottom-0' : 'inset-0 flex items-center justify-center p-4'}`}
            onClick={isMobile ? undefined : onClose}
          >
            <div
              onClick={e => e.stopPropagation()}
              className={`w-full bg-stone-50 dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${isMobile ? 'rounded-t-2xl max-h-[85vh] flex flex-col' : 'max-w-lg rounded-2xl'}`}
            >
              {/* Mobile drag handle */}
              {isMobile && (
                <div className="flex justify-center pt-3 pb-1" onClick={onClose}>
                  <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                </div>
              )}
              {/* Header */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 mb-1">
                      {item.period}
                    </p>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {item.company || item.title}
                    </h2>
                    {item.company && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.title}</p>
                    )}
                    {item.location && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.location}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {item.discipline.map(d => (
                    <span key={d} className={`px-2.5 py-1 rounded-full text-xs font-medium ${DISCIPLINE_COLORS[d] || ''}`}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 overflow-y-auto flex-1" style={{ maxHeight: isMobile ? undefined : '60vh' }}>
                {/* Highlights */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                    Highlights
                  </h3>
                  <ul className="space-y-2">
                    {item.highlights.map((h, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stack */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.stack.map(s => (
                      <span key={s} className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
