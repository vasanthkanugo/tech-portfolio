import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Card from './Card'
import CardModal from './CardModal'
import { DISCIPLINE_COLORS } from '../constants/disciplines'

const ITEM_WIDTH = 256
const ITEM_GAP = 40
const COL_WIDTH = ITEM_WIDTH + ITEM_GAP
const CARD_AREA_HEIGHT = 260
const DOT_AREA_HEIGHT = 44
const TOTAL_HEIGHT = CARD_AREA_HEIGHT * 2 + DOT_AREA_HEIGHT

const TYPE_BORDER = {
  job:       'border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500',
  project:   'border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-500',
  education: 'border-amber-200 dark:border-amber-800/60 hover:border-amber-400 dark:hover:border-amber-500',
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

function VerticalTimeline({ sorted, onSelect }) {
  return (
    <div className="relative pl-10 pr-4">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

      <div className="space-y-6 pb-8">
        {sorted.map((item, i) => {
          const isPresent = item.endYear === null
          const border = TYPE_BORDER[item.type] || TYPE_BORDER.job

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="relative"
            >
              {/* Dot */}
              <div className="absolute -left-[26px] top-4 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-stone-100 dark:ring-gray-950" />

              {/* Year */}
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 tabular-nums mb-2">
                {item.startYear}
              </p>

              {/* Card */}
              <div
                onClick={() => onSelect(item)}
                className={`relative cursor-pointer rounded-xl border bg-stone-50 dark:bg-gray-900 p-4 shadow-sm active:shadow-md transition-all ${border}`}
              >
                {isPresent && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Now
                  </span>
                )}

                <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug pr-12">
                  {item.company || item.title}
                </h3>
                {item.company && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.title}</p>
                )}
                {item.location && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{item.location}</p>
                )}
                {item.summary && (
                  <p className="text-xs italic text-indigo-400 mt-1">{item.summary}</p>
                )}

                <div className="flex flex-wrap gap-1 mt-3">
                  {item.discipline.slice(0, 3).map(d => (
                    <span key={d} className={`px-2 py-0.5 rounded-full text-xs font-medium ${DISCIPLINE_COLORS[d] || ''}`}>
                      {d}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {item.stack.slice(0, 4).map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-mono">
                      {s}
                    </span>
                  ))}
                  {item.stack.length > 4 && (
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs">
                      +{item.stack.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default function Timeline({ items, selected, onSelect }) {
  const [localSelected, setLocalSelected] = useState(null)
  const activeItem = selected !== undefined ? selected : localSelected
  const handleSelect = onSelect || setLocalSelected
  const isMobile = useIsMobile()

  const sorted = [...items].sort((a, b) => b.startYear - a.startYear)

  // Drag-to-scroll (desktop)
  const containerRef = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const [dragged, setDragged] = useState(false)

  const onMouseDown = (e) => {
    isDragging.current = true
    setDragged(false)
    startX.current = e.pageX - containerRef.current.offsetLeft
    scrollLeft.current = containerRef.current.scrollLeft
    containerRef.current.style.cursor = 'grabbing'
  }

  const onMouseMove = (e) => {
    if (!isDragging.current) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = x - startX.current
    if (Math.abs(walk) > 4) setDragged(true)
    containerRef.current.scrollLeft = scrollLeft.current - walk
  }

  const onMouseUp = () => {
    isDragging.current = false
    if (containerRef.current) containerRef.current.style.cursor = 'grab'
  }

  const handleCardClick = (item) => {
    if (!dragged) handleSelect(item)
  }

  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 dark:text-gray-600 text-sm">
        No items match the selected filters.
      </div>
    )
  }

  return (
    <>
      {isMobile ? (
        <VerticalTimeline sorted={sorted} onSelect={handleSelect} />
      ) : (
        <div
          ref={containerRef}
          className="overflow-x-auto pb-2 select-none"
          style={{
            cursor: 'grab',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <div
            className="relative"
            style={{ height: TOTAL_HEIGHT, width: sorted.length * COL_WIDTH + 64, minWidth: sorted.length * COL_WIDTH + 64 }}
          >
            {/* Horizontal line */}
            <div
              className="absolute left-0 right-0 h-px bg-gray-200 dark:bg-gray-700"
              style={{ top: CARD_AREA_HEIGHT + Math.floor(DOT_AREA_HEIGHT / 2) }}
            />

            {sorted.map((item, i) => {
              const above = i % 2 === 0
              const left = 32 + i * COL_WIDTH

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: above ? -10 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="absolute flex flex-col items-center"
                  style={{ left, width: ITEM_WIDTH, top: 0, height: TOTAL_HEIGHT }}
                >
                  <div className="w-full flex flex-col items-center justify-end" style={{ height: CARD_AREA_HEIGHT }}>
                    {above && (
                      <>
                        <Card item={item} onClick={() => handleCardClick(item)} />
                        <div className="w-px bg-gray-300 dark:bg-gray-600 mt-2" style={{ height: 24 }} />
                      </>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center z-10 flex-shrink-0" style={{ height: DOT_AREA_HEIGHT }}>
                    <div className="w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-stone-100 dark:ring-gray-950 flex-shrink-0" />
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1 tabular-nums select-none">
                      {item.startYear}
                    </span>
                  </div>

                  <div className="w-full flex flex-col items-center justify-start" style={{ height: CARD_AREA_HEIGHT }}>
                    {!above && (
                      <>
                        <div className="w-px bg-gray-300 dark:bg-gray-600 mb-2" style={{ height: 24 }} />
                        <Card item={item} onClick={() => handleCardClick(item)} />
                      </>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      <CardModal item={activeItem} onClose={() => handleSelect(null)} isMobile={isMobile} />
    </>
  )
}
