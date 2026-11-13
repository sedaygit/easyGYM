/**
 * Segmented control — the theme's nav archetype for small switches
 * (front/back figure, sign up / log in).
 */
export function Segmented({ options, value, onChange, className = '', label }) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={[
        'inline-flex w-full items-center gap-1 rounded-btn border-theme border-line bg-surf p-1',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={[
              'press min-h-[40px] flex-1 rounded-btn px-4 text-[13px] font-semibold',
              'transition-colors duration-theme ease-theme whitespace-nowrap',
              active ? 'bg-grad text-acc-ink' : 'text-mute hover:text-ink',
            ].join(' ')}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
