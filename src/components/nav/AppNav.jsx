
import { Icon } from '../ui/Icon'
import { computeStats } from '../../lib/stats'
import { getStreakLeague } from '../achievements/StreakLeagueCard'
import { useTranslation } from '../../i18n/I18nContext'

// Navigasyon sekmeleri
const TABS = [
  { id: 'train', icon: 'dumbbell' },
  { id: 'achievements', icon: 'chart' },
  { id: 'profile', icon: 'user' },
]

export function AppNav({
  route,
  active,
  onChange,
  user,
  history = [],
  hasActiveWorkout,
  onResetTrain,
  onOpenStreakModal,
}) {
  const { t } = useTranslation()

  const stats = computeStats(history)
  const league = getStreakLeague(stats.streak)

  const handleTabClick = (tabId) => {
    if (onResetTrain && tabId === 'train') {
      onResetTrain()
    }

    onChange(tabId)
  }

  const translatedLeagueName = t(league.name.toLowerCase())

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur-theme">
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-3 px-4 py-3 sm:px-8">

        {/* Logo */}
        <button
          type="button"
          onClick={() => handleTabClick('train')}
          className="press flex items-center gap-2.5"
          aria-label={t('home')}
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-btn"
            style={{ background: 'var(--tp-grad)' }}
          >
            <span
              className="block h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--tp-acc-ink)' }}
            />
          </span>

          <span className="hidden text-[15px] font-semibold tracking-tight text-ink sm:block">
            easyGYM
          </span>
        </button>

        {/* Navigation */}
        <nav
          className="flex items-center gap-1 rounded-btn border-theme border-line bg-surf p-1"
          aria-label={t('navigation')}
        >
          {TABS.map((tab) => {
            const isActive = tab.id === active

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'press flex min-h-[40px] items-center gap-2 rounded-btn px-3 text-[13px] font-semibold',
                  'transition-colors duration-theme ease-theme',
                  isActive
                    ? 'bg-grad text-acc-ink'
                    : 'text-mute hover:text-ink',
                ].join(' ')}
              >
                <Icon name={tab.icon} size={16} />

                <span className="hidden xs:inline sm:inline">
                  {t(tab.id === 'achievements' ? 'progress' : tab.id)}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Sağ üstteki lig rozeti */}
        <div className="hidden shrink-0 sm:flex items-center justify-center">
          {user ? (
            <button
              type="button"
              onClick={() => onChange('league')}
              className={`press flex h-9 w-9 items-center justify-center rounded-full text-base shadow-sm border transition-all cursor-pointer ${
                route === 'league'
                  ? 'ring-2 ring-accent shadow-[0_0_15px_var(--tp-acc)] scale-110'
                  : 'hover:scale-105'
              }`}
              style={{
                backgroundColor: league.bg,
                borderColor: league.color,
              }}
              title={`${stats.streak} ${t('daysStreak')} (${translatedLeagueName} ${t('leagueSuffix')}) - ${t('clickForDetails')}`}
              aria-label={`${translatedLeagueName} ${t('leagueSuffix')}`}
            >
              {league.icon}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
