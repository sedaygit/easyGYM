import { Icon } from './Icon'

/**
 * Stepper used for sets and reps. Big mono number, 44px targets either side,
 * and the number itself is editable by typing.
 */
export function NumberField({
  label,
  value,
  onChange,
  min = 1,
  max = 20,
  step = 1,
  unit,
  className = '',
}) {
  const clamp = (next) => Math.min(max, Math.max(min, next))

  const commitTyped = (event) => {
    const parsed = Number.parseInt(event.target.value, 10)
    onChange(Number.isNaN(parsed) ? min : clamp(parsed))
  }

  return (
    <div className={['plate-2 flex flex-col gap-2 px-4 py-3', className].filter(Boolean).join(' ')}>
      <span className="eyebrow">{label}</span>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(clamp(value - step))}
          disabled={value <= min}
          className="press flex h-11 w-11 shrink-0 items-center justify-center rounded-btn border-theme border-line text-ink transition-colors duration-theme ease-theme hover:bg-surf disabled:opacity-35"
        >
          <Icon name="minus" size={16} />
        </button>

        <div className="flex min-w-0 items-baseline justify-center gap-1.5">
          <input
            type="number"
            inputMode="numeric"
            aria-label={label}
            value={value}
            min={min}
            max={max}
            onChange={commitTyped}
            className="num w-full max-w-[64px] border-0 bg-transparent p-0 text-center text-[26px] font-normal leading-none text-ink outline-none [appearance:textfield] focus-visible:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          {unit ? <span className="text-[11px] text-mute">{unit}</span> : null}
        </div>

        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(clamp(value + step))}
          disabled={value >= max}
          className="press flex h-11 w-11 shrink-0 items-center justify-center rounded-btn border-theme border-line text-ink transition-colors duration-theme ease-theme hover:bg-surf disabled:opacity-35"
        >
          <Icon name="plus" size={16} />
        </button>
      </div>
    </div>
  )
}
