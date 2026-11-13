
import { Icon } from '../ui/Icon'
import { useTranslation } from '../../i18n/I18nContext'

const EQUIPMENT_KEYS = {
  'Bodyweight': 'equipmentBodyweight',
  'Dumbbells': 'equipmentDumbbells',
  'Dumbbell': 'equipmentDumbbell',
  'Bench': 'equipmentBench',
  'Barbell': 'equipmentBarbell',
  'Parallel bars': 'equipmentParallelBars',
  'Pull-up bar': 'equipmentPullUpBar',
  'Cable machine': 'equipmentCableMachine',
  'Cable': 'equipmentCable',
  'Rope': 'equipmentRope',
  'Plate': 'equipmentPlate',
  'Kettlebell': 'equipmentKettlebell',
  'Step': 'equipmentStep',
}

function formatEquipment(equipment, t) {
  if (!equipment) return t('noEquipment')

  let items = []

  if (Array.isArray(equipment)) {
    items = equipment
  } else if (typeof equipment === 'string') {
    items = equipment.split('·').map((e) => e.trim()).filter(Boolean)
  }

  // Vücut ağırlığı ve None ayrı ekipman gerektirmez.
  items = items.filter((item) => item !== 'None' && item !== 'Bodyweight')

  if (items.length === 0) {
    return t('noEquipment')
  }

  const translatedItems = items.map((item) => {
    const key = EQUIPMENT_KEYS[item]
    return key ? t(key) : item
  })

  const equipmentText = translatedItems.length === 1
    ? translatedItems[0]
    : `${translatedItems.slice(0, -1).join(', ')} ${t('and')} ${translatedItems[translatedItems.length - 1]}`

  return `${t('thisExerciseNeeds')} ${equipmentText}.`
}

export function ExerciseRow({ exercise, index, sets, reps, selected, onToggle }) {
  const { t } = useTranslation()

  const nameKey = `exercise_${exercise.id}`
  const translatedName = t(nameKey) === nameKey
    ? exercise.name
    : t(nameKey)

  const muscleName = t(exercise.muscle)
  const level = t(exercise.level?.toLowerCase() || 'beginner')
  const equipment = formatEquipment(exercise.equipment, t)

  return (
    <li
      className={[
        'flex items-center gap-4 rounded-lg border-theme border-line bg-surf px-4 py-3.5 transition-colors duration-theme ease-theme hover:bg-surf-2',
        selected === false ? 'opacity-40' : '',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={() => onToggle && onToggle(exercise.id || index)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold transition-colors"
        style={{
          background: selected !== false ? 'var(--tp-surf-2)' : 'var(--tp-surf)',
          color: selected !== false ? 'var(--tp-acc)' : 'var(--tp-mute)',
          border: '1px solid var(--tp-line)',
        }}
        title={selected !== false ? t('removeFromRoutine') : t('includeInRoutine')}
      >
        {selected !== false ? String(index + 1).padStart(2, '0') : '✕'}
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-ink">
          {translatedName}
        </p>

        <p className="truncate text-[12px] text-mute">
          {muscleName} · {level} · {equipment}
        </p>
      </div>

      <div className="hidden shrink-0 items-center gap-1.5 text-[12px] text-mute sm:flex">
        <Icon name="layers" size={14} />
        <span className="num">
          {sets} × {reps}
        </span>
      </div>
    </li>
  )
}
