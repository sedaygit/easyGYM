
import { useState } from 'react'
import { MUSCLE_GROUPS } from '../../data/muscles'
import { exercisesByMuscle } from '../../data/exercises'
import { BodyFigure } from './BodyFigure'
import { Segmented } from '../ui/Segmented'
import { Button } from '../ui/Button'
import { Plate } from '../ui/Plate'
import { Icon } from '../ui/Icon'
import { useTranslation } from '../../i18n/I18nContext'

function greeting(t) {
  const hour = new Date().getHours()

  if (hour < 5) return t('stillAwake')
  if (hour < 12) return t('goodMorning')
  if (hour < 18) return t('goodAfternoon')

  return t('goodEvening')
}

export function MuscleSelectScreen({ user, selected, onToggle, onAccept }) {
  const [view, setView] = useState('front')
  const { t } = useTranslation()

  const count = selected.length

  const VIEWS = [
    { value: 'front', label: t('front') },
    { value: 'back', label: t('backView') },
  ]

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 pb-40 pt-6 sm:px-8 lg:pb-32 lg:pt-10">
      <header className="mb-7">
        <p className="eyebrow mb-2">
          {greeting(t)}
          {user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </p>

        <h1 className="display-xl max-w-[560px] text-ink">
          {t('whatStrengtheningToday')}
        </h1>

        <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-mute">
          {t('muscleSelectionDescription')}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-10">
        <Plate className="relative p-5 sm:p-7">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="eyebrow">{t('anatomy')}</span>

            <span className="num text-[11px] text-mute">
              {String(count).padStart(2, '0')} {t('selected')}
            </span>
          </div>

          <div className="mx-auto h-[380px] w-full max-w-[260px] sm:h-[440px]">
            <BodyFigure
              view={view}
              selected={selected}
              onToggle={onToggle}
            />
          </div>

          <Segmented
            options={VIEWS}
            value={view}
            onChange={setView}
            label={t('frontBackView')}
            className="mt-5 max-w-[260px]"
          />
        </Plate>

        <div className="flex flex-col gap-3">
          {MUSCLE_GROUPS.map((group, index) => {
            const isOn = selected.includes(group.id)
            const exerciseCount = exercisesByMuscle(group.id).length

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => onToggle(group.id)}
                aria-pressed={isOn}
                className={[
                  'press flex min-h-[72px] w-full items-center gap-4 rounded-lg border-theme px-5 py-4 text-left',
                  'transition-colors duration-theme ease-theme',
                  isOn
                    ? 'border-acc bg-surf-2 glow-edge'
                    : 'border-line bg-surf hover:bg-surf-2',
                ].join(' ')}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-theme"
                  style={{
                    borderColor: isOn ? 'var(--tp-acc)' : 'var(--tp-line)',
                    background: isOn ? 'var(--tp-grad)' : 'transparent',
                    color: isOn ? 'var(--tp-acc-ink)' : 'var(--tp-mute)',
                  }}
                >
                  <Icon name={isOn ? 'check' : 'target'} size={17} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-[16px] font-semibold text-ink">
                      {t(group.id)}
                    </span>

                    <span className="text-[11px] text-mute">
                      {group.latin}
                    </span>
                  </span>

                  <span className="mt-0.5 block text-[13px] leading-snug text-mute">
                    {t(`${group.id}Blurb`)}
                  </span>
                </span>

                <span className="num hidden shrink-0 text-[11px] text-mute sm:block">
                  {exerciseCount} {t('exerciseShort')}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Alt sabit seçim çubuğu */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/90 px-5 py-4 backdrop-blur-theme safe-bottom sm:px-8 lg:pl-[76px]">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4">
          <p className="hidden text-[13px] text-mute sm:block">
            {count === 0
              ? t('nothingSelected')
              : count === 1
                ? `1 ${t('oneGroupSelected')}`
                : `${count} ${t('manyGroupsSelected')}`}
          </p>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            {count > 0 ? (
              <Button
                variant="quiet"
                size="md"
                onClick={() => selected.forEach((id) => onToggle(id))}
                className="hidden sm:inline-flex"
              >
                {t('clear')}
              </Button>
            ) : null}

            <Button
              size="lg"
              fullWidth
              disabled={count === 0}
              onClick={onAccept}
              iconAfter="arrowRight"
              className="sm:w-auto"
            >
              {t('accept')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
