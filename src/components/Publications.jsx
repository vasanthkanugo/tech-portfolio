export default function Publications({ items }) {
  return (
    <section className="mt-20 border-t border-gray-200 dark:border-gray-800 pt-10">
      <h2 className="text-center text-lg font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
        Publications
      </h2>
      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-8">Research & academic work</p>

      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        {items.map(pub => (
          <div
            key={pub.id}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 text-xs font-medium">
                    {pub.type}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{pub.year}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug mb-1">
                  {pub.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{pub.authors}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">{pub.venue}</p>
              </div>
            </div>
            {pub.doi && (
              <a
                href={pub.doi}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-xs text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                View paper →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
