/** Themed text input with a label, optional hint and inline error. */
export function TextField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  hint,
  required = false,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          'min-h-[52px] w-full rounded-btn border-theme bg-surf-2 px-5 text-[15px] text-ink',
          'placeholder:text-mute/70 transition-colors duration-theme ease-theme',
          'focus:border-acc focus:outline-none',
          error ? 'border-acc-2' : 'border-line',
        ].join(' ')}
      />

      {error ? (
        <p id={`${id}-error`} className="text-[12px] text-acc-2">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[12px] text-mute">{hint}</p>
      ) : null}
    </div>
  )
}
