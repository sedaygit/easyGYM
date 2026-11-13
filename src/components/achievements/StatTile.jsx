import { Icon } from '../ui/Icon'

export function StatTile({ label, value, hint, icon, hero = false }) {
  return (
    <div
      className="flex h-full min-h-[148px] flex-col justify-between gap-3 rounded-lg border-theme border-line p-4"
      style={{
        background: hero ? 'var(--tp-surf-2)' : 'var(--tp-surf)',
      }}
    >
      <div className="flex min-h-[24px] items-center justify-between gap-2">
        <span className="eyebrow leading-tight">{label}</span>

        {icon ? (
          <span className="shrink-0" style={{ color: 'var(--tp-acc)' }}>
            <Icon name={icon} size={15} />
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-end">
        <p
          className="num min-h-[34px] break-words leading-none text-ink"
          style={{
            fontSize: hero ? 'clamp(26px, 4vw, 34px)' : 26,
          }}
        >
          {value}
        </p>

        {hint ? (
          <p className="mt-2 min-h-[30px] text-[12px] leading-snug text-mute">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  )
}