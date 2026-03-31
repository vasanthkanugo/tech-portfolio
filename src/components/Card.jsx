import { motion } from 'framer-motion'
import { DISCIPLINE_COLORS } from '../constants/disciplines'

const TYPE_BORDER = {
  job:       'border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500',
  project:   'border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-500',
  education: 'border-amber-200 dark:border-amber-800/60 hover:border-amber-400 dark:hover:border-amber-500',
}

export default function Card({ item, onClick }) {
  const isPresent = item.endYear === null
  const border = TYPE_BORDER[item.type] || TYPE_BORDER.job

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`relative cursor-pointer w-64 h-52 rounded-xl border bg-stone-50 dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition-all text-center flex flex-col ${border}`}
    >
      {/* Now badge — top right corner */}
      {isPresent && (
        <span className="absolute top-3 right-3 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Now
        </span>
      )}

      {/* Company / title */}
      <div className="mb-2">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-1">
          {item.company || item.title}
        </h3>
        {item.company && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{item.title}</p>
        )}
      </div>

      {/* Location */}
      {item.location && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{item.location}</p>
      )}

      {/* Summary */}
      {item.summary && (
        <p className="text-xs italic text-indigo-400 dark:text-indigo-400 mb-1 flex-1">{item.summary}</p>
      )}

      {/* Discipline tags */}
      <div className="flex flex-wrap justify-center gap-1 mb-2">
        {item.discipline.slice(0, 2).map(d => (
          <span key={d} className={`px-2 py-0.5 rounded-full text-xs font-medium ${DISCIPLINE_COLORS[d] || ''}`}>
            {d}
          </span>
        ))}
      </div>

      {/* Stack */}
      <div className="flex flex-wrap justify-center gap-1">
        {item.stack.slice(0, 3).map(s => (
          <span key={s} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-mono">
            {s}
          </span>
        ))}
        {item.stack.length > 3 && (
          <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs">
            +{item.stack.length - 3}
          </span>
        )}
      </div>
    </motion.div>
  )
}
