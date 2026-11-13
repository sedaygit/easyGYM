
import { useState } from 'react'
import { NumberField } from '../ui/NumberField'
import { Button } from '../ui/Button'
import { Plate } from '../ui/Plate'
import { Icon } from '../ui/Icon'
import { ExerciseRow } from './ExerciseRow'
import { WARMUP_EXERCISES, COOLDOWN_EXERCISES } from '../../data/warmups'
import { useTranslation } from '../../i18n/I18nContext'

const SECONDS_PER_REP = 10

function estimateMinutes(
  exerciseCount,
  sets,
  reps,
  restSeconds,
  warmUps,
  coolDowns
) {
  // Ana egzersizlerin çalışma süresi
  const workSeconds =
    exerciseCount * sets * (reps * SECONDS_PER_REP)

  // Isınma hareketlerinin toplam süresi
  const warmupSeconds = warmUps.reduce(
    (total, exercise) =>
      total + (Number(exercise.durationSec) || 30),
    0
  )

  // Soğuma hareketlerinin toplam süresi
  const cooldownSeconds = coolDowns.reduce(
    (total, exercise) =>
      total + (Number(exercise.durationSec) || 30),
    0
  )

  // Ana egzersizler arasındaki dinlenme süresi
  const totalMainSets = exerciseCount * sets
  const totalRest =
    Math.max(0, totalMainSets - 1) * restSeconds

  // Bütün süreleri birleştir
  const totalSeconds =
    workSeconds +
    warmupSeconds +
    cooldownSeconds +
    totalRest

  return Math.max(1, Math.round(totalSeconds / 60))
}

export function RoutineScreen({
  muscles,
  exercises: initialExercises,
  prefs,
  onPrefsChange,
  onStart,
  onBack,
}) {
  const { t } = useTranslation()

  const { sets, reps, restSec = 15, restTime: prefsRestTime } = prefs
  const restTime = prefsRestTime ?? restSec

  // Başlangıçta tüm egzersizler seçili gelir.
  const [selectedIds, setSelectedIds] = useState(() =>
    initialExercises.map((ex, i) => ex.id || i)
  )

  // Aktif egzersizler.
  const activeExercises = initialExercises.filter((ex, i) =>
    selectedIds.includes(ex.id || i)
  )

  // Seçili kas gruplarını ID listesine dönüştür.
  const selectedMuscles = Array.isArray(muscles)
    ? muscles.map((m) => typeof m === 'object' ? m.id : m)
    : [muscles || 'core']

  // Isınma hareketleri.
  const warmUpsList = selectedMuscles.flatMap((m) => {
    const key = (m || 'core').toLowerCase()
    const found =
      WARMUP_EXERCISES[key] ||
      WARMUP_EXERCISES.core ||
      Object.values(WARMUP_EXERCISES)[0]

    return found ? (Array.isArray(found) ? found : [found]) : []
  })

  // Soğuma hareketleri.
  const coolDownsList = selectedMuscles.flatMap((m) => {
    const key = (m || 'core').toLowerCase()
    const found =
      COOLDOWN_EXERCISES[key] ||
      COOLDOWN_EXERCISES.core ||
      Object.values(COOLDOWN_EXERCISES)[0]

    return found ? (Array.isArray(found) ? found : [found]) : []
  })

  // Tekrarlanan ısınma ve soğuma hareketlerini kaldır.
  const uniqueWarmUps = Array.from(
    new Map(
      warmUpsList.filter(Boolean).map((item) => [item.id || item.name, item])
    ).values()
  )

  const uniqueCoolDowns = Array.from(
    new Map(
      coolDownsList.filter(Boolean).map((item) => [item.id || item.name, item])
    ).values()
  )

  // Görüntüleme ve antrenman listeleri.
  const displayRoutineList = [
    ...uniqueWarmUps,
    ...initialExercises,
    ...uniqueCoolDowns,
  ]

  const finalWorkoutList = [
    ...uniqueWarmUps,
    ...activeExercises,
    ...uniqueCoolDowns,
  ]

  // Toplam set hesabı.
  const totalSets = finalWorkoutList.reduce((acc, ex) => {
    const isWarmupOrCooldown =
      ex.id?.startsWith('warmup') || ex.id?.startsWith('cooldown')

    return acc + (isWarmupOrCooldown ? 1 : sets)
  }, 0)

  const minutes = estimateMinutes(
    activeExercises.length,
    sets,
    reps,
    restTime,
    uniqueWarmUps,
    uniqueCoolDowns
  )

  const handleToggleExercise = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    )
  }

  const handleRestChange = (nextRest) => {
    onPrefsChange({
      ...prefs,
      restSec: nextRest,
      restTime: nextRest,
    })
  }

  const handleStartWorkout = () => {
    onStart(finalWorkoutList, { sets, reps, restTime })
  }

  const muscleNames = selectedMuscles.map((id) => t(id)).join(' · ')

  return (
    <div className="mx-auto w-full max-w-[980px] px-5 pb-40 pt-6 sm:px-8 lg:pb-32 lg:pt-10">
      <button
        type="button"
        onClick={onBack}
        className="press mb-6 inline-flex items-center gap-2 text-[13px] text-mute transition-colors duration-theme ease-theme hover:text-ink"
      >
        <Icon name="arrowLeft" size={16} />
        {t('changeMuscles')}
      </button>

      <header className="mb-6">
        <p className="eyebrow mb-2">{t('stepTwo')}</p>

        <h1 className="display-xl text-ink">
          {t('yourDriftShaped')}
        </h1>

        <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-mute">
          {muscleNames}. {t('routineIntro')}
        </p>
      </header>

      <Plate className="mb-6 p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="grid w-full grid-cols-1 sm:grid-cols-3 gap-3">
            <NumberField
              label={t('sets')}
              value={sets}
              min={1}
              max={10}
              onChange={(next) => onPrefsChange({ ...prefs, sets: next })}
            />

            <NumberField
              label={t('reps')}
              value={reps}
              min={1}
              max={50}
              step={1}
              onChange={(next) => onPrefsChange({ ...prefs, reps: next })}
              unit={t('perSet')}
            />

            <NumberField
              label={t('restTime')}
              value={restTime}
              min={0}
              max={60}
              step={5}
              onChange={handleRestChange}
              unit={t('seconds')}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border-theme border-line px-4 py-3 sm:px-5">
            <div>
              <p className="eyebrow">{t('total')}</p>

              <p className="num mt-0.5 text-[15px] text-ink">
                {activeExercises.length} {t('mainExercises')} · {totalSets} {t('setsCount')}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[12px] text-mute">
              <Icon name="clock" size={14} />
              <span>
                {t('about')} {minutes} {t('minutes')}
              </span>
            </div>
          </div>
        </div>
      </Plate>

      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-[15px] font-semibold text-ink">
          {t('workoutStructure')} ({displayRoutineList.length} {t('stepsTotal')})
        </h2>

        <span className="num text-[11px] text-mute">
          {restTime}{t('secondsRest')}
        </span>
      </div>

      <ul className="flex flex-col gap-2.5">
        {displayRoutineList.map((exercise, index) => {
          const isWarmupOrCooldown =
            exercise.id?.startsWith('warmup') ||
            exercise.id?.startsWith('cooldown')

          const id = exercise.id || index
          const isSelected = isWarmupOrCooldown
            ? true
            : selectedIds.includes(id)

          return (
            <ExerciseRow
              key={`${id}-${index}`}
              exercise={exercise}
              index={index}
              sets={isWarmupOrCooldown ? 1 : sets}
              reps={isWarmupOrCooldown
                ? `${exercise.durationSec || 30}s`
                : reps}
              selected={isSelected}
              onToggle={
                isWarmupOrCooldown
                  ? undefined
                  : () => handleToggleExercise(id)
              }
            />
          )
        })}
      </ul>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/90 px-5 py-4 backdrop-blur-theme safe-bottom sm:px-8 lg:pl-[76px]">
        <div className="mx-auto flex w-full max-w-[980px] items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="eyebrow">{t('readyWhenYouAre')}</p>

            <p className="text-[13px] text-mute">
              {activeExercises.length} {t('activeExercises')} · {minutes} {t('minutes')}
            </p>
          </div>

          <Button
            size="lg"
            icon="play"
            onClick={handleStartWorkout}
            fullWidth
            disabled={activeExercises.length === 0}
            className="sm:w-auto"
          >
            {t('startWorkout')}
          </Button>
        </div>
      </div>
    </div>
  )
}
