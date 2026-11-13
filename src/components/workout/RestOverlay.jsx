import { Button } from '../ui/Button'
import { useTranslation } from '../../i18n/I18nContext'

const RING_RADIUS = 54
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

export function RestOverlay({
  secondsLeft,
  total = 5,
  restType,
  currentExercise,
  currentSetIndex,
  totalSetsPerExercise,
  nextExercise,
  onSkip,
}) {
  const { t } = useTranslation()

  const progress = Math.max(0, Math.min(1, secondsLeft / total))
  const dash = RING_LENGTH * progress

  const isSetRest = restType === 'set'

  const translateExerciseName = (exercise) => {
    if (!exercise) return ''

    const key = `exercise_${exercise.id}`
    const translated = t(key)

    return translated === key ? exercise.name : translated
  }

  const translateLevel = (level) => {
    if (!level) return ''

    const key = level.toLowerCase()
    const translated = t(key)

    return translated === key ? level : translated
  }

  const translateEquipment = (equipment) => {
    if (!equipment) return ''

    const equipmentKeys = {
      Bodyweight: 'equipmentBodyweight',
      Dumbbells: 'equipmentDumbbells',
      Dumbbell: 'equipmentDumbbell',
      Bench: 'equipmentBench',
      'Parallel bars': 'equipmentParallelBars',
      'Pull-up bar': 'equipmentPullUpBar',
      Barbell: 'equipmentBarbell',
      'Cable machine': 'equipmentCableMachine',
      Cable: 'equipmentCable',
      Rope: 'equipmentRope',
      Plate: 'equipmentPlate',
      Kettlebell: 'equipmentKettlebell',
      Step: 'equipmentStep',
    }

    const items = Array.isArray(equipment)
      ? equipment
      : String(equipment).split('·').map((item) => item.trim())

    return items
      .map((item) => {
        const key = equipmentKeys[item]
        return key ? t(key) : item
      })
      .join(' · ')
  }

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center px-6"
      style={{
        background: 'rgba(1,8,18,0.82)',
        backdropFilter: 'var(--tp-blur)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t('restCountdown')}
    >
      <p className="eyebrow mb-8">
        {isSetRest
          ? t('restBreatheOut')
          : t('nextExerciseGetReady')}
      </p>

      <div className="relative mb-8 flex items-center justify-center">
        <svg
          width="168"
          height="168"
          viewBox="0 0 128 128"
          className="-rotate-90"
        >
          <circle
            cx="64"
            cy="64"
            r={RING_RADIUS}
            fill="none"
            stroke="var(--tp-line)"
            strokeWidth="6"
          />

          <circle
            cx="64"
            cy="64"
            r={RING_RADIUS}
            fill="none"
            stroke="var(--tp-acc)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${RING_LENGTH}`}
            style={{ transition: 'stroke-dasharray 900ms linear' }}
          />
        </svg>

        <span
          key={secondsLeft}
          className="num animate-pop absolute text-[64px] font-normal leading-none text-ink"
          aria-live="polite"
        >
          {secondsLeft}
        </span>
      </div>

      {isSetRest ? (
        <div className="mb-9 max-w-[320px] text-center">
          <p className="eyebrow mb-2">{t('upNext')}</p>

          <p className="text-[20px] font-semibold text-ink">
            {t('set')} {currentSetIndex + 2} {t('of')} {totalSetsPerExercise}
          </p>

          <p className="mt-1 text-[13px] text-mute">
            {translateExerciseName(currentExercise)}
          </p>
        </div>
      ) : nextExercise ? (
        <div className="mb-9 max-w-[320px] text-center">
          <p className="eyebrow mb-2">{t('nextExercise')}</p>

          <p className="text-[20px] font-semibold text-ink">
            {translateExerciseName(nextExercise)}
          </p>

          <p className="mt-1 text-[13px] text-mute">
            {translateEquipment(nextExercise.equipment)} · {translateLevel(nextExercise.level)}
          </p>
        </div>
      ) : null}

      <Button
        variant="ghost"
        size="md"
        onClick={onSkip}
        iconAfter="arrowRight"
      >
        {t('goNow')}
      </Button>
    </div>
  )
}