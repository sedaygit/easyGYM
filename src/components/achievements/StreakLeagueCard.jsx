
import { Plate } from '../ui/Plate'
import { useTranslation } from '../../i18n/I18nContext'

// Lig/seviye hesaplama fonksiyonu
export function getStreakLeague(streakCount) {
  if (streakCount >= 2000) {
    return { name: 'Diamond', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', icon: '💎' }
  } else if (streakCount >= 1500) {
    return { name: 'Obsidian', color: '#334155', bg: 'rgba(51, 65, 85, 0.15)', icon: '🖤' }
  } else if (streakCount >= 1200) {
    return { name: 'Pearl', color: '#f472b6', bg: 'rgba(244, 114, 182, 0.15)', icon: '🦪' }
  } else if (streakCount >= 900) {
    return { name: 'Amethyst', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)', icon: '💜' }
  } else if (streakCount >= 600) {
    return { name: 'Emerald', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.15)', icon: '🟢' }
  } else if (streakCount >= 400) {
    return { name: 'Ruby', color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)', icon: '🔴' }
  } else if (streakCount >= 300) {
    return { name: 'Sapphire', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.15)', icon: '🔵' }
  } else if (streakCount >= 200) {
    return { name: 'Gold', color: '#facc15', bg: 'rgba(250, 204, 21, 0.15)', icon: '🟡' }
  } else if (streakCount >= 100) {
    return { name: 'Silver', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)', icon: '⚪' }
  } else {
    return { name: 'Bronze', color: '#d97706', bg: 'rgba(217, 119, 6, 0.15)', icon: '🥉' }
  }
}

// Tüm liglerin eşik listesi
const ALL_LEAGUES = [
  { name: 'Diamond', min: 2000, max: null, icon: '💎', color: '#38bdf8', desc: 'eliteMasteryTier' },
  { name: 'Obsidian', min: 1500, max: 1999, icon: '🖤', color: '#334155', desc: 'legendaryConsistency' },
  { name: 'Pearl', min: 1200, max: 1499, icon: '🦪', color: '#f472b6', desc: 'masterLevel' },
  { name: 'Amethyst', min: 900, max: 1199, icon: '💜', color: '#c084fc', desc: 'advancedDedication' },
  { name: 'Emerald', min: 600, max: 899, icon: '🟢', color: '#4ade80', desc: 'expertDiscipline' },
  { name: 'Ruby', min: 400, max: 599, icon: '🔴', color: '#f87171', desc: 'advancedTier' },
  { name: 'Sapphire', min: 300, max: 399, icon: '🔵', color: '#60a5fa', desc: 'intermediateMilestone' },
  { name: 'Gold', min: 200, max: 299, icon: '🟡', color: '#facc15', desc: 'solidCommitment' },
  { name: 'Silver', min: 100, max: 199, icon: '⚪', color: '#94a3b8', desc: 'growingMomentum' },
  { name: 'Bronze', min: 0, max: 99, icon: '🥉', color: '#d97706', desc: 'startingYourJourney' },
]

// Lig kartı ve lig merdiveni
export function StreakLeagueCard({ streak }) {
  const { t } = useTranslation()
  const currentLeague = getStreakLeague(streak)

  const getLeagueName = (name) => t(name.toLowerCase())

  const getThreshold = (league) => {
    if (league.max === null) {
      return `2000+ ${t('days')}`
    }

    return `${league.min} - ${league.max} ${t('days')}`
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Üst Aktif Lig Kartı */}
      <Plate
        className="p-5 sm:p-6 relative overflow-hidden border transition-all"
        style={{ borderColor: currentLeague.color }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{currentLeague.icon}</span>

              <span
                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                style={{
                  backgroundColor: currentLeague.bg,
                  color: currentLeague.color,
                }}
              >
                {getLeagueName(currentLeague.name)} {t('leagueSuffix')}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-ink">
              {streak} {t('daysStreak')}
            </h2>

            <p className="text-[13px] text-mute mt-1">
              {streak > 0
                ? t('keepGoing')
                : t('firstWorkoutToBronze')}
            </p>
          </div>

          {/* Büyük Lig Rozeti */}
          <div
            className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl shadow-inner text-3xl sm:text-4xl"
            style={{
              backgroundColor: currentLeague.bg,
              border: `2px solid ${currentLeague.color}`,
            }}
          >
            {currentLeague.icon}
          </div>
        </div>
      </Plate>

      {/* Tüm Liglerin Listesi */}
      <div className="border-t border-line pt-6">
        <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-4">
          {t('leagueLadder')}
        </h3>

        <div className="flex flex-col gap-3">
          {ALL_LEAGUES.map((lg) => {
            const isCurrent =
              currentLeague.name.toLowerCase() === lg.name.toLowerCase()

            return (
              <div
                key={lg.name}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-[var(--tp-surf-2)] border-accent shadow-md scale-[1.01]'
                    : 'bg-black/20 border-line opacity-75'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl shadow-inner"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${lg.color}`,
                    }}
                  >
                    {lg.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-ink">
                        {getLeagueName(lg.name)} {t('leagueSuffix')}
                      </h4>

                      {isCurrent && (
                        <span className="text-[10px] font-semibold bg-accent text-accent-ink px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {t('current')}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-mute mt-0.5">
                      {t(lg.desc)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-ink px-3 py-1.5 rounded-lg bg-surf border border-line">
                    {getThreshold(lg)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
