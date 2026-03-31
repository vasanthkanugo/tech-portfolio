export default function ViewToggle({ view, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit">
      {['jobs', 'projects'].map(v => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            view === v
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {v === 'jobs' ? 'Experience' : 'Projects'}
        </button>
      ))}
    </div>
  )
}
