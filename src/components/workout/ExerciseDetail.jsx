import { useState, useEffect, useRef } from 'react'
import { Icon } from '../ui/Icon'
import { useTranslation } from '../../i18n/I18nContext'

export function ExerciseDetail({ exercise }) {
  const { t, language } = useTranslation()

  const [isPlaying, setIsPlaying] = useState(false)
  const [gifLoaded, setGifLoaded] = useState(true)
  const audioRef = useRef(null)

  // Çeviri bulunamazsa orijinal metni göster.
  const translateContent = (key, fallback) => {
    const translated = t(key)
    return translated === key ? (fallback ?? '') : translated
  }

  const contentKey = `exercise_${exercise?.id}`

  const description = translateContent(
    `${contentKey}_description`,
    exercise?.description
  )

  const steps = (exercise?.steps ?? []).map((step, index) =>
    translateContent(`${contentKey}_step_${index + 1}`, step)
  )

  const tips = (exercise?.tips ?? []).map((tip, index) =>
    translateContent(`${contentKey}_tip_${index + 1}`, tip)
  )

  const warning = exercise?.warning
    ? translateContent(`${contentKey}_warning`, exercise.warning)
    : null

  const alternative = exercise?.alt
    ? translateContent(`${contentKey}_alt`, exercise.alt)
    : null

  // Egzersiz değiştiğinde ses nesnesini oluştur ve tercihe göre oynat.
  useEffect(() => {
    if (!exercise?.id) return

    const isCooldown = exercise.id.includes('cooldown')
    const folder = isCooldown
      ? 'warmups'
      : (exercise.id.includes('warmup') ? 'warmups' : 'exercises')

    const languageFolder = language === 'tr' ? '/tr' : ''
    const audioPath = `/audio${languageFolder}/${folder}/${exercise.id}.mp3`
    const audio = new Audio(audioPath)

    audioRef.current = audio

    audio.onended = () => {
      setIsPlaying(false)
    }

    const autoPlayEnabled =
      localStorage.getItem('easygym_autoplay_audio') !== 'false'

    if (autoPlayEnabled) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }

    return () => {
      audio.pause()
      audio.currentTime = 0
      audioRef.current = null
      setIsPlaying(false)
    }
  }, [exercise, language])

  useEffect(() => {
    setGifLoaded(true)
  }, [exercise])

  const handleTogglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      audio.currentTime = 0
      setIsPlaying(false)
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }
  }

  if (!exercise) return null

  return (
    <div className="flex flex-col gap-5">
      {gifLoaded && (
        <div className="relative flex items-center justify-center overflow-hidden rounded-xl border border-line bg-surf p-3">
          <img
            src={`/images/exercises/${exercise.id}.gif`}
            alt={`${exercise.name} ${t('demonstration')}`}
            className="h-48 w-full object-contain mix-blend-multiply dark:brightness-90 dark:contrast-125"
            onError={() => setGifLoaded(false)}
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <p className="text-[15px] leading-relaxed text-ink">
          {description}
        </p>

        <button
          type="button"
          onClick={handleTogglePlay}
          className="press shrink-0 flex items-center gap-1.5 rounded-btn border border-line bg-surf px-3 py-1.5 text-[12px] font-semibold text-ink transition-colors hover:border-accent/50 hover:text-accent"
          title={isPlaying ? t('stopAudio') : t('listenAudio')}
        >
          <Icon name={isPlaying ? 'close' : 'volume'} size={14} />
          <span>{isPlaying ? t('stop') : t('listen')}</span>
        </button>
      </div>

      <section>
        <h3 className="eyebrow mb-3">{t('howItGoes')}</h3>

        <ol className="flex flex-col gap-2.5">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span
                className="num mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px]"
                style={{
                  background: 'var(--tp-surf-2)',
                  color: 'var(--tp-acc)',
                }}
              >
                {index + 1}
              </span>

              <span className="text-[14px] leading-relaxed text-ink">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3 className="eyebrow mb-3">{t('formTips')}</h3>

        <ul className="flex flex-col gap-2">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <span className="mt-0.5" style={{ color: 'var(--tp-acc)' }}>
                <Icon name="check" size={15} />
              </span>

              <span className="text-[14px] leading-relaxed text-mute">
                {tip}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {warning && (
        <section
          className="flex items-start gap-3 rounded-lg border-theme p-4"
          style={{
            borderColor: 'var(--tp-acc-2)',
            background: 'var(--tp-surf)',
          }}
        >
          <span
            className="mt-0.5 shrink-0"
            style={{ color: 'var(--tp-acc-2)' }}
          >
            <Icon name="alert" size={17} />
          </span>

          <div>
            <p
              className="mb-1 text-[12px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--tp-acc-2)' }}
            >
              {t('careful')}
            </p>

            <p className="text-[14px] leading-relaxed text-ink">
              {warning}
            </p>
          </div>
        </section>
      )}

      {alternative && (
        <p className="text-[12px] leading-relaxed text-mute">
          <span className="text-ink">{t('easier')}: </span>
          {alternative}
        </p>
      )}
    </div>
  )
}