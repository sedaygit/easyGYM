
import { formatDayLabel, formatDuration, formatTimeOfDay } from '../../lib/format'
import { Icon } from '../ui/Icon'
import { useTranslation } from '../../i18n/I18nContext'

function getWorkoutTitle(entry, t) {
  if (entry?.muscles?.length) {
    return entry.muscles
      .map((id) => t(id))
      .join(' · ')
  }

  return entry?.name?.replace(/\s*\(Unfinished\)$/, '') || t('workout')
}

export function HistoryList({
  groups,
  onSelectSession,
  favorites,
  onToggleFavorite,
  onRepeatWorkout,
}) {
  const { t, language } = useTranslation()

  const handleRepeatWorkout = (event, entry) => {
    event.stopPropagation()

    if (!onRepeatWorkout || !entry) return

    onRepeatWorkout({
      ...entry,
      exercises: (entry.exercises || []).map((exercise) => ({
        ...exercise,
      })),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.key}>
          <h3 className="eyebrow mb-3">
            {formatDayLabel(
              group.entries[0].finishedAt,
              language,
              t('today'),
              t('yesterday')
            )}
          </h3>

          <ul className="flex flex-col gap-2.5">
            {group.entries.map((entry) => {
              const isFav = favorites?.some(
                (fav) =>
                  fav &&
                  (fav.id === entry.id || fav.name === entry.name)
              )

              const muscleIds = entry.muscles ||
                Array.from(
                  new Set(
                    entry.exercises?.map((exercise) => exercise.muscle).filter(Boolean) || []
                  )
                )

              return (
                <li
                  key={entry.id}
                  onClick={() => onSelectSession?.(entry)}
                  className="cursor-pointer rounded-lg border-theme border-line bg-surf px-4 py-3.5 transition-all hover:scale-[1.01] hover:border-accent/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-[14px] font-semibold text-ink">
                          {getWorkoutTitle(entry, t)}
                        </p>

                        <span
                          className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            entry.isUnfinished === true
                              ? 'bg-amber-500/10 text-amber-500'
                              : 'bg-emerald-500/10 text-emerald-500'
                          }`}
                        >
                          {entry.isUnfinished === true
                            ? language === 'tr' ? 'Yarım kaldı' : 'Unfinished'
                            : language === 'tr' ? 'Tamamlandı' : 'Completed'}
                        </span>
                      </div>

                      <p className="mt-0.5 truncate text-[12px] text-mute">
                        {muscleIds.map((id) => t(id)).join(' · ')}
                      </p>
                    </div>

                    <div
                      className="flex shrink-0 items-center gap-2"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <span className="num text-[12px] text-mute">
                        {formatTimeOfDay(entry.finishedAt, language)}
                      </span>

                      <button
                        type="button"
                        onClick={(event) => handleRepeatWorkout(event, entry)}
                        className="rounded-md p-1.5 text-mute transition-colors hover:bg-[var(--tp-surf-2)] hover:text-ink"
                        title={t('repeatWorkout')}
                      >
                        <Icon name="refresh" size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleFavorite?.(entry)}
                        className={`rounded-md p-1.5 text-base transition-colors ${
                          isFav
                            ? 'text-amber-400'
                            : 'text-mute hover:bg-[var(--tp-surf-2)] hover:text-ink'
                        }`}
                        title={isFav ? t('removeFavorite') : t('addFavorite')}
                      >
                        {isFav ? '★' : '☆'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-mute">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="clock" size={13} />
                      {formatDuration(entry.durationSec, language)}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="layers" size={13} />
                      {entry.totalSets} {t('setsCount')}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="dumbbell" size={13} />
                      {entry.exercises?.length ?? 0} {t('exercises')}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
