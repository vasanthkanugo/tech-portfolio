import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import Card from './Card'
import CardModal from './CardModal'

const ITEM_WIDTH = 256
const ITEM_GAP = 40
const COL_WIDTH = ITEM_WIDTH + ITEM_GAP
const CARD_AREA_HEIGHT = 260
const DOT_AREA_HEIGHT = 44
const TOTAL_HEIGHT = CARD_AREA_HEIGHT * 2 + DOT_AREA_HEIGHT

export default function Timeline({ items, selected, onSelect }) {
  const [localSelected, setLocalSelected] = useState(null)
  const activeItem = selected !== undefined ? selected : localSelected
  const handleSelect = onSelect || setLocalSelected

  // Newest on left, oldest on right
  const sorted = [...items].sort((a, b) => b.startYear - a.startYear)


  // Drag-to-scroll
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

  const totalWidth = sorted.length * COL_WIDTH + 64

  return (
    <>
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
          style={{ height: TOTAL_HEIGHT, width: totalWidth, minWidth: totalWidth }}
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
                {/* Above card zone */}
                <div
                  className="w-full flex flex-col items-center justify-end"
                  style={{ height: CARD_AREA_HEIGHT }}
                >
                  {above && (
                    <>
                      <Card item={item} onClick={() => handleCardClick(item)} />
                      <div className="w-px bg-gray-300 dark:bg-gray-600 mt-2" style={{ height: 24 }} />
                    </>
                  )}
                </div>

                {/* Dot + year */}
                <div
                  className="flex flex-col items-center justify-center z-10 flex-shrink-0"
                  style={{ height: DOT_AREA_HEIGHT }}
                >
                  <div className="w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-stone-100 dark:ring-gray-950 flex-shrink-0" />
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1 tabular-nums select-none">
                    {item.startYear}
                  </span>
                </div>

                {/* Below card zone */}
                <div
                  className="w-full flex flex-col items-center justify-start"
                  style={{ height: CARD_AREA_HEIGHT }}
                >
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

      <CardModal item={activeItem} onClose={() => handleSelect(null)} />
    </>
  )
}
