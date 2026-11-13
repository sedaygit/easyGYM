import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from '../../i18n/I18nContext'
import { BodyFigure } from '../anatomy/BodyFigure'
import { Button, IconButton } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { Plate } from '../ui/Plate'
import { ExerciseDetail } from './ExerciseDetail'
import { RestOverlay } from './RestOverlay'
import { useCountdown } from '../../hooks/useCountdown'
import { playChime, playCountdownTick, playSetClick } from '../../lib/audio'
import { formatClock } from '../../lib/format'

// Isınma ve soğuma adımlarını belirle.
const isTimedExercise = (exercise) => {
  return Boolean(
    exercise?.isTimeBased ||
    exercise?.id?.startsWith('warmup-') ||
    exercise?.id?.startsWith('warmup') ||
    exercise?.id?.startsWith('cooldown-') ||
    exercise?.id?.startsWith('cooldown')
  )
}

// Süreyi güvenli şekilde belirle.
const getDuration = (exercise) => {
  const duration = Number(exercise?.durationSec)

  if (Number.isFinite(duration) && duration > 0) {
    return Math.floor(duration)
  }

  if (typeof exercise?.reps === 'string') {
    const match = exercise.reps.match(/^(\d+)\s*s$/i)

    if (match) {
      return Math.max(1, Number(match[1]))
    }
  }

  return 60
}

export function WorkoutScreen({
  exercises = [],
  prefs,
  routineName,
  routineMuscles,
  resumeSessionId = null,
  initialElapsed = 0,
  initialExerciseIndex = 0,
  initialSetIndex = 0,
  onFinish,
  onExit,
  restTime = prefs?.restTime ?? prefs?.restSec ?? 15,
}) {
  const { t } = useTranslation()

  const translateExerciseName = (item) => {
    if (!item) return ''

    const key = `exercise_${item.id}`
    const translated = t(key)

    return translated === key ? item.name : translated
  }

  const translateMuscle = (muscle) => {
    if (!muscle) return ''

    const translated = t(muscle)

    return translated === muscle ? muscle : translated
  }
  const displayRoutineName = routineMuscles?.length
    ? routineMuscles.map(translateMuscle).join(' · ')
    : routineName || t('todayDrift')

  const translateLevel = (level) => {
    if (!level) return ''

    const key = level.toLowerCase()
    const translated = t(key)

    return translated === key ? level : translated
  }
  const [exerciseIndex, setExerciseIndex] = useState(initialExerciseIndex)
  const [setIndex, setSetIndex] = useState(initialSetIndex)
  const [resting, setResting] = useState(false)
  const [elapsed, setElapsed] = useState(initialElapsed)
  const [showExitModal, setShowExitModal] = useState(false)
  const [restType, setRestType] = useState('exercise')
  const [timeLeft, setTimeLeft] = useState(() => getDuration(exercises[initialExerciseIndex]))

  const startedAtRef = useRef(Date.now() - initialElapsed * 1000)
  
  const finishedRef = useRef(false)
  const timedStepCompletedRef = useRef(false)

  const exercise = exercises[exerciseIndex]

  const isTimeBased = isTimedExercise(exercise)

  const durationSec = getDuration(exercise)

  const configuredSets = prefs?.sets || 3

  const sets = isTimeBased
    ? 1
    : configuredSets

  const reps = isTimeBased
    ? `${durationSec}s`
    : (prefs?.reps || 10)

  const restSeconds = restTime

  const nextExercise = exercises[exerciseIndex + 1] ?? null

  // Gerçek toplam set sayısı.
  const totalSets = exercises.reduce(
    (total, item) =>
      total + (isTimedExercise(item) ? 1 : configuredSets),
    0
  )

  const doneSets =
    exercises.slice(0, exerciseIndex).reduce(
      (total, item) =>
        total + (isTimedExercise(item) ? 1 : sets),
      0
    ) + setIndex

  const progress = totalSets === 0
    ? 0
    : doneSets / totalSets

  // Antrenmanın toplam süresini takip et.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsed(
        Math.floor(
          (Date.now() - startedAtRef.current) / 1000
        )
      )
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])


  // Antrenmanı tamamla.
  const finishSession = useCallback((isUnfinished = false) => {
    if (finishedRef.current) return

    finishedRef.current = true

    if (!isUnfinished) {
      playChime()
    }

    const uniqueMuscles = Array.from(
      new Set(
        exercises
          .map((item) => item.muscle)
          .filter(Boolean)
      )
    )

    const exerciseRecords = exercises.map((item) => {
      const timed = isTimedExercise(item)
      const duration = getDuration(item)

      return {
        // Egzersizin kimliğini ve türünü koru
        id: item.id,
        name: item.name,
        muscle: item.muscle,

        // Warmup / cooldown bilgilerini geçmişe kaydet
        isTimeBased: timed,
        durationSec: timed ? duration : null,

        // Set ve tekrar bilgileri
        sets: timed ? 1 : configuredSets,
        setCount: timed ? 1 : configuredSets,
        reps: timed ? `${duration}s` : (prefs?.reps || 10),
      }
    })

    let savedExerciseIndex = exerciseIndex
    let savedSetIndex = setIndex

    if (isUnfinished && resting) {
      if (restType === 'set') {
        savedSetIndex = setIndex + 1
      } else if (restType === 'exercise') {
        savedExerciseIndex = Math.min(
          exerciseIndex + 1,
          exercises.length - 1
        )
        savedSetIndex = 0
      }
    }

    onFinish?.({
      id: resumeSessionId || undefined,
      isUnfinished, // Yarım kalan antrenman bilgisi artık açıkça kaydediliyor.

      startedAt: new Date(startedAtRef.current).toISOString(),

      finishedAt: new Date().toISOString(),

      durationSec: Math.max(1,Math.round((Date.now() - startedAtRef.current) / 1000)),

      exercises: exerciseRecords,
      muscles: uniqueMuscles,
      totalSets,

      totalReps: exercises.reduce(
        (total, item) =>
          total +
          (isTimedExercise(item)
            ? 0
            : configuredSets * (prefs?.reps || 10)),
        0
      ),

      // İsim artık dil bağımsız; durum isUnfinished alanında tutuluyor.
      name: routineName || t('workout'),

      exerciseIndex: savedExerciseIndex,
      setIndex: savedSetIndex,
    })
      }, [
        exercises,
        onFinish,
        prefs,
        routineName,
        totalSets,
        exerciseIndex,
        setIndex,
        configuredSets,
        isTimedExercise,
        getDuration,
        playChime,
        t,
        resting,
        restType,
        resumeSessionId,
      ])


  // Bir sonraki egzersize doğrudan geç.
  const advanceExercise = useCallback(() => {
    if (finishedRef.current) return

    setResting(false)
    setSetIndex(0)

    if (exerciseIndex + 1 >= exercises.length) {
      finishSession()
      return
    }

    setExerciseIndex((previous) => previous + 1)
  }, [
    exerciseIndex,
    exercises.length,
    finishSession,
  ])

  // Isınma/soğuma için tek geçiş noktası.
  const advanceTimedStep = useCallback(() => {
    if (timedStepCompletedRef.current || finishedRef.current) {
      return
    }

    timedStepCompletedRef.current = true

    setResting(false)

    playSetClick()

    advanceExercise()
  }, [advanceExercise])

  // Normal egzersiz dinlenme sayacı.
  const countdown = useCountdown({
    onTick: (left) => playCountdownTick(left),

    onComplete: () => {
      if (restType === 'set') {
        setSetIndex((previous) => previous + 1)
        setResting(false)
      } else {
        advanceExercise()
      }
    },
  })

  // Isınma ve soğuma için bağımsız sayaç.
  // RestOverlay ve useCountdown bu sayaca dahil değildir.
  useEffect(() => {
    timedStepCompletedRef.current = false

    if (!exercise || !isTimedExercise(exercise)) {
      setTimeLeft(0)
      return undefined
    }

    const seconds = getDuration(exercise)

    setTimeLeft(seconds)

    const deadline = Date.now() + seconds * 1000

    const timer = window.setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((deadline - Date.now()) / 1000)
      )

      setTimeLeft(remaining)

      if (remaining <= 0) {
        window.clearInterval(timer)
        advanceTimedStep()
        return
      }

      if (remaining <= 3) {
        playCountdownTick(remaining)
      }
    }, 200)

    return () => window.clearInterval(timer)

  }, [
    exerciseIndex,
    exercise,
    advanceTimedStep,
  ])

  // Normal set tamamlandığında çalışır.
  const handleSetDone = () => {
    if (finishedRef.current) return

    // Isınma ve soğuma: dinlenme ekranı açma.
    if (isTimedExercise(exercise)) {
      advanceTimedStep()
      return
    }

    playSetClick()

    const isLastSet = setIndex + 1 >= sets
    const isLastExercise = exerciseIndex + 1 >= exercises.length

    // Son set ve son egzersiz.
    if (isLastSet && isLastExercise) {
      finishSession()
      return
    }

    // Aynı egzersizin sonraki setine geç.
    if (!isLastSet) {
      setRestType('set')
    } else {
      setRestType('exercise')
    }

    // Normal egzersiz dinlenmesi.
    setResting(true)
    playChime()
    countdown.start(restSeconds)
  }

  // Dinlenmeyi atla.
  const skipRest = () => {
    if (!resting) return

    countdown.stop()
    setResting(false)

    if (restType === 'set') {
      setSetIndex((previous) => previous + 1)
    } else {
      advanceExercise()
    }
  }

  // Egzersizi doğrudan atla.
  const skipExercise = () => {
    if (finishedRef.current) return

    countdown.stop()

    if (isTimedExercise(exercise)) {
      advanceTimedStep()
    } else {
      advanceExercise()
    }
  }

  const handleAttemptExit = () => {
    setShowExitModal(true)
  }

  const confirmSaveAndExit = () => {
    setShowExitModal(false)
    countdown.stop()
    finishSession(true)
  }

  const confirmDiscardAndExit = () => {
    setShowExitModal(false)
    countdown.stop()
    onExit?.()
  }

  const figureView = useMemo(
    () => exercise?.muscle === 'back' ? 'back' : 'front',
    [exercise]
  )

  if (!exercise) return null

  const isLastSet = setIndex + 1 >= sets
  const isLastExercise = exerciseIndex + 1 >= exercises.length

  const actionLabel = isTimeBased
    ? (isLastExercise ? t('finishWorkout') : t('nextStep'))
    : (isLastSet && isLastExercise
        ? t('finishWorkout')
        : t('setDone'))

  const equipmentKey = `equipment_${String(exercise.equipment ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')}`

  const equipmentLabel =
    t(equipmentKey) === equipmentKey
      ? exercise.equipment
      : t(equipmentKey)

  return (
    <div className="min-h-screen pb-36">
      {/* top chrome */}
      <div className="sticky top-0 z-30 border-b border-line bg-bg/85 px-4 py-3 backdrop-blur-theme sm:px-8">
        <div className="mx-auto flex w-full max-w-[1020px] items-center justify-between gap-4">
          <IconButton
            name="close"
            label={t('leaveWorkout')}
            onClick={handleAttemptExit}
          />

          <div className="min-w-0 text-center">
            <p className="num text-[11px] text-mute">
              {String(exerciseIndex + 1).padStart(2, '0')} / {String(exercises.length).padStart(2, '0')}
            </p>

            <p className="truncate text-[13px] font-semibold text-ink">
              {displayRoutineName}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[13px] text-mute">
            <Icon name="clock" size={15} />
            <span className="num">{formatClock(elapsed)}</span>
          </div>
        </div>

        <div className="mx-auto mt-3 w-full max-w-[1020px]">
          <div
            className="h-1 w-full overflow-hidden rounded-btn"
            style={{ background: 'var(--tp-surf-2)' }}
          >
            <div
              className="h-full rounded-btn"
              style={{
                width: `${Math.min(100, Math.max(2, progress * 100))}%`,
                background: 'var(--tp-grad)',
                transition: 'width var(--tp-dur-slow) var(--tp-ease)',
              }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1020px] gap-6 px-5 pt-6 sm:px-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-10 lg:pt-9">
        {/* illustration + set tracker */}
        <div className="flex flex-col gap-4">
          <Plate className="relative overflow-hidden p-4">
            <div className="mx-auto h-[300px] w-full max-w-[220px] sm:h-[340px]">
              <BodyFigure
                view={figureView}
                selected={[exercise.muscle]}
                interactive={false}
              />
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="eyebrow">{t('target')}</span>

              <span className="text-[13px] font-semibold text-ink">
                {translateMuscle(exercise.muscle)}
              </span>
            </div>
          </Plate>

          <Plate className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="eyebrow">
                {isTimeBased ? t('timedStep') : t('sets')}
              </span>

              <span className="num text-[11px] text-mute">
                {isTimeBased ? '1 / 1' : `${setIndex + 1} / ${sets}`}
              </span>
            </div>

            <div className="flex gap-2">
              {Array.from({ length: sets }).map((_, index) => {
                const done = index < setIndex
                const active = index === setIndex

                return (
                  <div
                    key={index}
                    className="h-2 flex-1 rounded-btn"
                    style={{
                      background: done || active
                        ? 'var(--tp-grad)'
                        : 'var(--tp-surf-2)',
                      opacity: done ? 1 : active ? 0.9 : 1,
                      boxShadow: active ? 'var(--tp-sh-sm)' : 'none',
                    }}
                    aria-hidden="true"
                  />
                )
              })}
            </div>

            <p className="mt-3 text-[12px] text-mute">
              {isTimeBased
                ? `${t('duration')}: ${durationSec}s`
                : `${reps} ${t('repsThisSet')} · ${t('then')} ${restSeconds}s ${t('rest')}`}
            </p>
          </Plate>
        </div>

        {/* exercise content */}
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span
              className="rounded-btn px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
              style={{
                background: 'var(--tp-grad)',
                color: 'var(--tp-acc-ink)',
              }}
            >
              {translateMuscle(exercise.muscle)}
            </span>

            <span className="rounded-btn border-theme border-line px-3 py-1 text-[11px] text-mute">
              {equipmentLabel}
            </span>

            <span className="rounded-btn border-theme border-line px-3 py-1 text-[11px] text-mute">
              {translateLevel(exercise.level)}
            </span>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h1 className="display-xl text-ink">
              {translateExerciseName(exercise)}
            </h1>

            {isTimeBased && (
              <div className="flex items-center gap-2 rounded-full border border-theme border-line bg-surface px-3.5 py-1.5">
                <span className="num text-sm font-bold text-primary">
                  {timeLeft}s
                </span>
              </div>
            )}
          </div>

          <Plate className="p-5 sm:p-6">
            <ExerciseDetail exercise={exercise} />
          </Plate>

          <button
            type="button"
            onClick={skipExercise}
            className="press mt-5 inline-flex items-center gap-2 text-[12px] text-mute transition-colors duration-theme ease-theme hover:text-ink"
          >
            <Icon name="chevronRight" size={14} />
            {t('skipThisExercise')}
          </button>
        </div>
      </div>

      {/* action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/90 px-5 py-4 backdrop-blur-theme safe-bottom sm:px-8">
        <div className="mx-auto flex w-full max-w-[1020px] items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="eyebrow">{t('now')}</p>

            <p className="num text-[13px] text-mute">
              {isTimeBased
                ? `${t('timedExercise')} · ${timeLeft}s`
                : `${t('set')} ${setIndex + 1} ${t('of')} ${sets} · ${reps}`}
            </p>
          </div>

          <Button
            size="lg"
            fullWidth
            onClick={handleSetDone}
            icon="check"
            className="sm:w-auto"
          >
            {actionLabel}
          </Button>
        </div>
      </div>

      {/* RestOverlay yalnızca normal egzersizlerde açılır. */}
      {resting && !isTimeBased && (
        <RestOverlay
          secondsLeft={countdown.remaining}
          total={restSeconds}
          restType={restType}
          currentExercise={exercise}
          currentSetIndex={setIndex}
          totalSetsPerExercise={sets}
          nextExercise={nextExercise}
          onSkip={skipRest}
        />
      )}

      
      {/* Exit modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md">
          <div className="w-full max-w-[400px] min-w-0 rounded-2xl border border-line bg-bg p-5 sm:p-6 shadow-2xl">
            <h3 className="mb-2 text-[17px] font-semibold text-ink">
              {t('leaveWorkout')}
            </h3>

            <p className="mb-6 text-[14px] leading-relaxed text-mute">
              {t('leaveWorkoutDescription')}
            </p>

            <div className="flex flex-col gap-2.5">
              <Button
                size="md"
                onClick={confirmSaveAndExit}
              >
                {t('saveUnfinished')}
              </Button>

              <Button
                variant="quiet"
                size="md"
                onClick={confirmDiscardAndExit}
              >
                {t('discard')}
              </Button>

              <Button
                variant="ghost"
                size="md"
                onClick={() => setShowExitModal(false)}
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
