import { useState, useEffect } from 'react'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import Timeline from './components/Timeline'
import { experiences, projects, education, disciplines } from './data/experience'
import './App.css'

export default function App() {
  const [dark, setDark] = useState(true)
  const [activeFilters, setActiveFilters] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const allItems = [...experiences, ...education, ...projects]

  const filtered = activeFilters.length === 0
    ? allItems
    : allItems.filter(item => item.discipline.some(d => activeFilters.includes(d)))

  const toggleFilter = (d) =>
    setActiveFilters(prev =>
      prev.includes(d) ? prev.filter(f => f !== d) : [...prev, d]
    )

  return (
    <div className="min-h-screen w-full bg-stone-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header dark={dark} onToggleDark={() => setDark(d => !d)} />

      <main className="px-8 py-12">
        <div className="flex justify-center mb-12">
          <FilterBar disciplines={disciplines} active={activeFilters} onToggle={toggleFilter} />
        </div>

        <Timeline items={filtered} selected={selected} onSelect={setSelected} />
      </main>
    </div>
  )
}
