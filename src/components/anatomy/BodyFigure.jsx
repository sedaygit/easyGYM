import { muscleLabel } from '../../data/muscles'

/* Geometry lives here so the silhouette and the hit areas are the same shapes. */
const TORSO_FRONT =
  'M120,74 C100,74 86,80 80,96 C75,120 73,148 77,174 C81,202 81,226 85,252 C99,262 110,266 120,266 C130,266 141,262 155,252 C159,226 159,202 163,174 C167,148 165,120 160,96 C154,80 140,74 120,74 Z'

const TORSO_BACK =
  'M120,78 C102,78 90,84 84,98 C80,124 78,150 82,176 C86,202 88,226 92,250 C103,259 111,263 120,263 C129,263 137,259 148,250 C152,226 154,202 158,176 C162,150 160,124 156,98 C150,84 138,78 120,78 Z'

const ARM_LEFT = 'M80,104 C68,132 62,172 60,206 L58,252'
const ARM_RIGHT = 'M160,104 C172,132 178,172 180,206 L182,252'
const LEG_LEFT = 'M104,268 C99,318 97,376 99,424 L101,470'
const LEG_RIGHT = 'M136,268 C141,318 143,376 141,424 L139,470'

const CHEST_LEFT =
  'M118,98 C108,92 94,92 88,102 C83,113 88,132 101,138 C110,142 116,138 118,132 Z'
const CHEST_RIGHT =
  'M122,98 C132,92 146,92 152,102 C157,113 152,132 139,138 C130,142 124,138 122,132 Z'

const ARM_WIDTH = 26
const LEG_WIDTH = 30

function Silhouette({ view }) {
  const torso = view === 'front' ? TORSO_FRONT : TORSO_BACK
  return (
    <g>
      <circle cx="120" cy="40" r="24" className="body-base" />
      <rect x="109" y="56" width="22" height="22" rx="9" className="body-base" />
      <path d={torso} className="body-base" />
      <path d={ARM_LEFT} className="body-line" style={{ strokeWidth: ARM_WIDTH }} />
      <path d={ARM_RIGHT} className="body-line" style={{ strokeWidth: ARM_WIDTH }} />
      <path d={LEG_LEFT} className="body-line" style={{ strokeWidth: LEG_WIDTH }} />
      <path d={LEG_RIGHT} className="body-line" style={{ strokeWidth: LEG_WIDTH }} />
    </g>
  )
}

/**
 * Front / back anatomical map. Six groups are selectable; the back view swaps
 * the chest hit area for the lats and slides the core down to the lower back.
 */
export function BodyFigure({ view = 'front', selected = [], onToggle, interactive = true }) {
  const regionProps = (id, { limb = false, width } = {}) => {
    const isOn = selected.includes(id)
    const base = {
      className: ['muscle-region', limb ? 'is-limbs' : '', isOn ? 'is-on' : '']
        .filter(Boolean)
        .join(' '),
      style: width ? { strokeWidth: width } : undefined,
    }

    if (!interactive) {
      return { ...base, 'aria-hidden': 'true', style: { ...base.style, pointerEvents: 'none' } }
    }

    return {
      ...base,
      role: 'button',
      tabIndex: 0,
      'aria-pressed': isOn,
      'aria-label': `${muscleLabel(id)} muscle group`,
      onClick: () => onToggle(id),
      onKeyDown: (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onToggle(id)
        }
      },
    }
  }

  return (
    <svg
      viewBox="0 0 240 520"
      className="h-full w-full"
      style={{ overflow: 'visible' }}
      role="group"
      aria-label={`${view} view of the body`}
    >
      <defs>
        <radialGradient id="body-aura" cx="50%" cy="52%" r="52%">
          <stop offset="0%" stopColor="var(--tp-acc)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--tp-acc)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="120" cy="270" rx="118" ry="240" fill="url(#body-aura)" aria-hidden="true" />

      <Silhouette view={view} />

      {view === 'front' ? (
        <>
          <rect x="100" y="146" width="40" height="84" rx="16" {...regionProps('core')} />
          <path d={CHEST_LEFT} {...regionProps('chest')} />
          <path d={CHEST_RIGHT} {...regionProps('chest')} />
        </>
      ) : (
        <>
          <path d={TORSO_BACK} {...regionProps('back')} />
          <rect x="102" y="188" width="36" height="54" rx="14" {...regionProps('core')} />
        </>
      )}

      <ellipse cx="86" cy="102" rx="17" ry="16" {...regionProps('shoulders')} />
      <ellipse cx="154" cy="102" rx="17" ry="16" {...regionProps('shoulders')} />

      <path d={ARM_LEFT} {...regionProps('arms', { limb: true, width: ARM_WIDTH })} />
      <path d={ARM_RIGHT} {...regionProps('arms', { limb: true, width: ARM_WIDTH })} />

      <path d={LEG_LEFT} {...regionProps('legs', { limb: true, width: LEG_WIDTH })} />
      <path d={LEG_RIGHT} {...regionProps('legs', { limb: true, width: LEG_WIDTH })} />
    </svg>
  )
}
