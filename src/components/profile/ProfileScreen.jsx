
import { computeStats } from '../../lib/stats'
import { formatDuration } from '../../lib/format'
import { getStreakLeague } from '../achievements/StreakLeagueCard'
import { useTranslation } from '../../i18n/I18nContext'
import { Button } from '../ui/Button'
import { Plate } from '../ui/Plate'
import { Icon } from '../ui/Icon'

function Row({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="inline-flex items-center gap-3 text-[14px] text-ink">
        <span style={{ color: 'var(--tp-acc)' }}>
          <Icon name={icon} size={16} />
        </span>
        {label}
      </span>
      <span className="text-right text-[13px] text-mute">{value}</span>
    </div>
  )
}

export function ProfileScreen({
  user,
  history,
  soundOn,
  onToggleSound,
  autoPlayAudio = true,
  onToggleAutoPlay,
  onLogout,
  onResetData,
}) {
  const { language, setLanguage, t } = useTranslation()

  const stats = computeStats(history)
  const league = getStreakLeague(stats.streak)

  const providerLabel =
    user?.provider === 'google'
      ? 'Google'
      : user?.provider === 'email' || user?.email
        ? t('email')
        : '—'

  const formatLevel = (lvl) => {
    switch (lvl) {
      case 'intermediate':
        return t('intermediate')
      case 'advanced':
        return t('advanced')
      case 'beginner':
      default:
        return t('beginner')
    }
  }

  const formatJoinedDate = (isoString) => {
    if (!isoString) return '—'

    const date = new Date(isoString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear()).slice(-2)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 pb-16 pt-7 sm:px-8 lg:pt-10">
      <header className="mb-7">
        <p className="eyebrow mb-2">{t('profile')}</p>
        <h1 className="display-xl text-ink">{t('profileTitle')}</h1>
      </header>

      {/* Kullanıcı bilgileri */}
      <Plate className="mb-4 flex items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-4 min-w-0">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[20px] font-semibold"
            style={{ background: 'var(--tp-grad)', color: 'var(--tp-acc-ink)' }}
          >
            {user?.name?.slice(0, 1).toUpperCase() || 'E'}
          </span>

          <div className="min-w-0">
            <p className="truncate text-[17px] font-semibold text-ink">
              {user?.name}
            </p>
            <p className="truncate text-[13px] text-mute">
              {user?.email}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-[var(--tp-surf-2)] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--tp-acc)] border border-[var(--tp-line)]">
          {formatLevel(user?.level)}
        </span>
      </Plate>

      {/* İstatistikler */}
      <Plate className="mb-4 px-5 py-2">
        <div className="divide-y" style={{ borderColor: 'var(--tp-line)' }}>
          <Row icon="user" label={t('signedInWith')} value={providerLabel} />
          <Row icon="target" label={t('fitnessLevel')} value={formatLevel(user?.level)} />
          <Row
            icon="calendar"
            label={t('joined')}
            value={formatJoinedDate(user?.joinedAt)}
          />
          <Row icon="dumbbell" label={t('sessions')} value={stats.totalWorkouts} />
          <Row
            icon="clock"
            label={t('timeInMotion')}
            value={formatDuration(stats.totalSeconds)}
          />
          <Row
            icon="flame"
            label={t('streak')}
            value={`${stats.streak} ${t('days')}`}
          />
          <Row
            icon="trophy"
            label={t('league')}
            value={`${league.icon} ${t(league.name.toLowerCase())} ${t('leagueSuffix')}`}
          />
        </div>
      </Plate>

      {/* Dil seçimi */}
      <Plate className="mb-4 p-5">
        <div className="flex items-center gap-3 mb-4">
          <span style={{ color: 'var(--tp-acc)' }}>
            <Icon name="languages" size={18} />
          </span>
          <p className="text-[14px] font-semibold text-ink">
            {t('language')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setLanguage('tr')}
            aria-pressed={language === 'tr'}
            className="press rounded-btn border-theme px-4 py-3 text-[13px] font-semibold transition-colors"
            style={{
              borderColor: language === 'tr' ? 'var(--tp-acc)' : 'var(--tp-line)',
              background: language === 'tr' ? 'var(--tp-surf-2)' : 'transparent',
              color: language === 'tr' ? 'var(--tp-acc)' : 'var(--tp-mute)',
            }}
          >
            Türkçe {language === 'tr' ? '✓' : ''}
          </button>

          <button
            type="button"
            onClick={() => setLanguage('en')}
            aria-pressed={language === 'en'}
            className="press rounded-btn border-theme px-4 py-3 text-[13px] font-semibold transition-colors"
            style={{
              borderColor: language === 'en' ? 'var(--tp-acc)' : 'var(--tp-line)',
              background: language === 'en' ? 'var(--tp-surf-2)' : 'transparent',
              color: language === 'en' ? 'var(--tp-acc)' : 'var(--tp-mute)',
            }}
          >
            English {language === 'en' ? '✓' : ''}
          </button>
        </div>
      </Plate>

      {/* Dinlenme sayacı sesi */}
      <Plate className="mb-4 flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-[14px] font-semibold text-ink">
            {t('restSound')}
          </p>
          <p className="mt-0.5 text-[12px] text-mute">
            {t('restSoundDescription')}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={soundOn}
          onClick={onToggleSound}
          className="press relative flex h-11 w-[76px] shrink-0 items-center rounded-btn border-theme border-line px-1"
          style={{ background: soundOn ? 'var(--tp-grad)' : 'var(--tp-surf-2)' }}
        >
          <span className="sr-only">{t('toggleSound')}</span>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-btn transition-transform duration-theme ease-theme"
            style={{
              background: soundOn ? 'var(--tp-acc-ink)' : 'var(--tp-surf)',
              color: soundOn ? 'var(--tp-acc)' : 'var(--tp-mute)',
              transform: soundOn ? 'translateX(32px)' : 'translateX(0)',
            }}
          >
            <Icon name={soundOn ? 'sound' : 'mute'} size={16} />
          </span>
        </button>
      </Plate>

      {/* Otomatik egzersiz sesi */}
      <Plate className="mb-4 flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-[14px] font-semibold text-ink">
            {t('autoPlayAudio')}
          </p>
          <p className="mt-0.5 text-[12px] text-mute">
            {t('autoPlayDescription')}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={autoPlayAudio}
          onClick={onToggleAutoPlay}
          className="press relative flex h-11 w-[76px] shrink-0 items-center rounded-btn border-theme border-line px-1"
          style={{ background: autoPlayAudio ? 'var(--tp-grad)' : 'var(--tp-surf-2)' }}
        >
          <span className="sr-only">{t('toggleAutoPlay')}</span>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-btn transition-transform duration-theme ease-theme"
            style={{
              background: autoPlayAudio ? 'var(--tp-acc-ink)' : 'var(--tp-surf)',
              color: autoPlayAudio ? 'var(--tp-acc)' : 'var(--tp-mute)',
              transform: autoPlayAudio ? 'translateX(32px)' : 'translateX(0)',
            }}
          >
            <Icon name={autoPlayAudio ? 'sound' : 'mute'} size={16} />
          </span>
        </button>
      </Plate>

      {/* Hesap işlemleri */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="ghost"
          size="md"
          fullWidth
          onClick={onLogout}
          iconAfter="arrowRight"
        >
          {t('logout')}
        </Button>

        <Button
          variant="quiet"
          size="md"
          fullWidth
          onClick={onResetData}
          icon="refresh"
        >
          {t('eraseHistory')}
        </Button>
      </div>

      <p className="mt-6 text-[11px] leading-relaxed text-mute">
        {t('storageNotice')}
      </p>
    </div>
  )
}
