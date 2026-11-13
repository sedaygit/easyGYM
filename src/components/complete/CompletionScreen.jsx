import { useMemo } from 'react'
import { Confetti } from './Confetti'
import { Button } from '../ui/Button'
import { Plate } from '../ui/Plate'
import { Icon } from '../ui/Icon'
import { formatDuration } from '../../lib/format'
import { useTranslation } from '../../i18n/I18nContext'

// Ana CompletionScreen bileşeni
export function CompletionScreen({
  summary,
  streak,
  onAchievements,
  onAgain,
  isCompleted = true,
}) {
  const { t, language } = useTranslation()

  const totalRoutineExercises = summary?.exercises?.length ?? 0 
  const currentExIndex = summary?.exerciseIndex ?? 0 

  // Tamamlanma durumuna göre rastgele motivasyon mesajı
  const randomTitle = useMemo(() => {
    const titles = isCompleted
      ? [
          'successTitle1',
          'successTitle2',
          'successTitle3',
          'successTitle4',
          'successTitle5',
          'successTitle6',
        ]
      : [
          'pausedTitle1',
          'pausedTitle2',
          'pausedTitle3',
          'pausedTitle4',
          'pausedTitle5',
        ]

    const index = Math.floor(Math.random() * titles.length)

    return titles[index]
  }, [isCompleted])

  // Otomatik oluşturulan rutin adını seçili dile çevir.
  // Özel rutin isimleri değiştirilmez.
  const displayWorkoutName = summary?.name
    ?.replace(/\s*\(Unfinished\)$/, '') || ''

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[720px] flex-col justify-center px-5 py-16 sm:px-8">

      {isCompleted && <Confetti />}

      {/* Başlık ve özet */}
      <div className="animate-up text-center">
        <span
          className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full animate-float"
          style={{
            background: 'var(--tp-grad)',
            color: 'var(--tp-acc-ink)',
          }}
        >
          <Icon name={isCompleted ? 'trophy' : 'clock'} size={28} />
        </span>

        <p className="eyebrow mb-3">
          {isCompleted ? t('sessionComplete') : t('sessionPaused')}
        </p>

        <h1 className="display-hero mb-4 text-ink">
          {t(randomTitle)}
        </h1>

        <p className="mx-auto mb-9 max-w-[420px] text-[15px] leading-relaxed text-mute">
          {isCompleted
            ? t('exercisesFinished').replace(
                '{count}',
                String(totalRoutineExercises)
              )
            : t('pausedAtExercise')
                .replace('{current}', String(currentExIndex + 1))
                .replace('{total}', String(totalRoutineExercises))
          }

          {displayWorkoutName ? ` · ${displayWorkoutName}` : ''}.
          {' '}{t('everythingSaved')}
        </p>
      </div>

      {/* Özet istatistikler */}
      <Plate className="mb-6 p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          <Stat
            label={t('time')}
            value={formatDuration(summary?.durationSec ?? 0, language)}
          />
          <Stat label={t('sets')} value={summary?.totalSets ?? 0} />
          <Stat label={t('reps')} value={summary?.totalReps ?? 0} />
          <Stat
            label={t('streak')}
            value={`${streak ?? 1}${language === 'tr' ? ' gün' : 'd'}`}
          />
        </div>
      </Plate>

      {/* Butonlar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          variant="ghost"
          fullWidth
          onClick={onAchievements}
          icon="chart"
        >
          {t('seeAchievements')}
        </Button>

        <Button
          size="lg"
          fullWidth
          onClick={onAgain}
          iconAfter="arrowRight"
        >
          {isCompleted ? t('oneMoreDrift') : t('resumeWorkout')}
        </Button>
      </div>
    </div>
  )
}

// İstatistik göstermek için küçük yardımcı bileşen
function Stat({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="eyebrow">{label}</span>
      <span className="num text-[22px] leading-none text-ink">
        {value}
      </span>
    </div>
  )
}
