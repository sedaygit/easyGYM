import { Icon } from './Icon'

const VARIANTS = {
  primary: 'bg-grad text-acc-ink shadow-theme-sm hover:brightness-105',
  solid: 'bg-acc text-acc-ink hover:brightness-105',
  ghost: 'bg-surf text-ink border-theme border-line hover:bg-surf-2',
  quiet: 'bg-transparent text-mute hover:text-ink',
  outline: 'bg-transparent text-ink border-theme border-line hover:bg-surf',
}

const SIZES = {
  sm: 'min-h-[44px] px-4 text-[13px] gap-2',
  md: 'min-h-[48px] px-5 text-[15px] gap-2.5',
  lg: 'min-h-[56px] px-7 text-base gap-3',
}

/**
 * One pressable for the whole app. `icon` renders an Icon by name,
 * `iconAfter` puts it after the label.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconAfter,
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        'press inline-flex items-center justify-center rounded-btn font-semibold',
        'transition-colors duration-theme ease-theme',
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? 'w-full' : '',
        disabled ? 'pointer-events-none opacity-45' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {icon ? <Icon name={icon} size={size === 'lg' ? 20 : 18} /> : null}
      <span className="whitespace-nowrap">{children}</span>
      {iconAfter ? <Icon name={iconAfter} size={size === 'lg' ? 20 : 18} /> : null}
    </button>
  )
}

/** Square icon-only pressable, 44px minimum. */
export function IconButton({
  name,
  label,
  variant = 'ghost',
  size = 44,
  className = '',
  ...rest
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={[
        'press inline-flex items-center justify-center rounded-btn border-theme border-line',
        VARIANTS[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ width: size, height: size }}
      {...rest}
    >
      <Icon name={name} size={Math.round(size * 0.45)} />
    </button>
  )
}
