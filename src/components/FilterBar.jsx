const LABELS = {
  frontend:  'Frontend',
  backend:   'Backend',
  fullstack: 'Fullstack',
  infra:     'Infra',
  data:      'Data',
  mobile:    'Mobile',
  ml:        'ML',
}

export default function FilterBar({ disciplines, active, onToggle }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">Filter:</span>
      {disciplines.map(d => (
        <button
          key={d}
          onClick={() => onToggle(d)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
            active.includes(d)
              ? 'bg-indigo-500 border-indigo-500 text-white'
              : 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-400'
          }`}
        >
          {LABELS[d]}
        </button>
      ))}
    </div>
  )
}
