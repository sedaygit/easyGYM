import { useEffect, useMemo, useState } from 'react'
import { computeStats, groupHistoryByDay, muscleBreakdown } from '../../lib/stats'
import { formatDuration, formatTimeOfDay, formatDate } from '../../lib/format'
import { StatTile } from './StatTile'
import { HistoryList } from './HistoryList'
import { Button } from '../ui/Button'
import { Plate } from '../ui/Plate'
import { useTranslation } from '../../i18n/I18nContext'


function Skeleton({ rows = 3 }) {
  return (
    <div className="flex flex-col gap-2.5" aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-[74px] animate-pulse rounded-lg border-theme border-line"
          style={{ background: 'var(--tp-surf)', opacity: 1 }}
        />
      ))}
    </div>
  )
}

function getWorkoutTitle(entry, t) {
  if (entry?.muscles?.length) {
    return entry.muscles.map((id) => t(id)).join(' · ')
  }

  return entry?.name?.replace(/\s*\(Unfinished\)$/, '') || t('customWorkout')
}

export function AchievementsScreen({ history, favorites, onToggleFavorite, onBack, onStart, onContinueUnfinished, unfinishedList, onRepeatWorkout }) {
  const { t, language } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [selectedSessionModal, setSelectedSessionModal] = useState(null)
  const [currentPage, setCurrentPage] = useState(1) // Sayfa numarasını state olarak tutuyoruz
  const itemsPerPage = 5 // Her sayfada gösterilecek öğe sayısı
  const totalPages = Math.ceil(history.length / itemsPerPage) // Toplam sayfa sayısını hesaplıyoruz
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedHistory = history.slice(startIndex, startIndex + itemsPerPage) // Geçerli sayfa için öğeleri alıyoruz
  

  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), 420)
    return () => window.clearTimeout(id)
  }, [])

  const stats = useMemo(() => computeStats(history), [history])
  const groups = useMemo(() => groupHistoryByDay(paginatedHistory), [paginatedHistory])
  const breakdown = useMemo(() => muscleBreakdown(stats.muscleCounts), [stats.muscleCounts])
  const peak = Math.max(1, ...breakdown.map((item) => item.count))

  return (
    <div className="mx-auto w-full max-w-[980px] px-5 pb-16 pt-7 sm:px-8 lg:pt-10">
      <header className="mb-7">
        <p className="eyebrow mb-2">{t('yourProgress')}</p>
        <h1 className="display-xl text-ink">{t('achievements')}</h1>
        <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-mute">
          {t('achievementsDescription')}
        </p>
      </header>

      {loading ? (
        <div className="mb-8 grid grid-cols-2 items-stretch gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[104px] animate-pulse rounded-lg border-theme border-line"
              style={{ background: 'var(--tp-surf)' }}
            />
          ))}
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            label={t('streakLabel')}
            value={`${stats.streak} ${t('days')}`}
            hint={
              stats.streak > 0
                ? `${t('bestStreak')} ${stats.bestStreak} ${t('daysInARow')}`
                : t('finishOneSession')
            }
            icon="flame"
            
          />
          <StatTile label={t('sessionsLabel')} value={stats.totalWorkouts} hint={t('sessionsFinished')} icon="dumbbell" />
          <StatTile
            label={t('inMotion')}
            value={formatDuration(stats.totalSeconds, language)}
            hint={t('totalTrainingTime')}
            icon="clock"
          />
          <StatTile label={t('setsLabel')} value={stats.totalSets} hint={`${stats.totalReps} ${t('repsTotal')}`} icon="layers" />
        </div>
      )}

      <Plate className="mb-8 p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold text-ink">{t('muscleActivity')}</h2>
          <span className="num text-[11px] text-mute">{t('sessionsPerGroup')}</span>
        </div>

        <div className="flex flex-col gap-3">
          {breakdown.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <span className="w-[86px] shrink-0 text-[13px] text-mute">{t(item.id)}</span>
              <span
                className="h-2 flex-1 overflow-hidden rounded-btn"
                style={{ background: 'var(--tp-surf-2)' }}
              >
                <span
                  className="block h-full rounded-btn"
                  style={{
                    width: `${(item.count / peak) * 100}%`,
                    minWidth: item.count ? 8 : 0,
                    background: 'var(--tp-grad)',
                    transition: 'width var(--tp-dur-slow) var(--tp-ease)',
                  }}
                />
              </span>
              <span className="num w-6 shrink-0 text-right text-[12px] text-ink">{item.count}</span>
            </div>
          ))}
        </div>
      </Plate>

      {/* Favoriler bölümü */}
      {favorites && favorites.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-[15px] font-semibold text-ink">{t('favoriteWorkouts')}</h2>
            <span className="num text-[11px] text-mute">
              {favorites.length} {t('saved')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favorites.filter(Boolean).map((fav, idx) => (
              <Plate 
                key={fav.id || idx} 
                className="p-4 flex items-center justify-between border-theme border-line hover:border-[var(--tp-acc)] transition-all cursor-pointer"
                onClick={() => setSelectedSessionModal(fav)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--tp-acc)]">
                      {t('favorite')}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-ink">{getWorkoutTitle(fav, t)}</h3>
                  <p className="text-xs text-mute mt-0.5">
                    {fav.exercises?.length || 0} {t('exercises')} • {formatDuration(fav.durationSec, language)}
                  </p>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Modalın açılmasını engellemek için
                    onToggleFavorite(fav);
                  }}
                  className="text-amber-400 hover:text-mute p-2 text-lg"
                  title={t('removeFromFavorites')}
                >
                  ★
                </button>
              </Plate>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-[15px] font-semibold text-ink">{t('history')}</h2>
        <span className="num text-[11px] text-mute">
          {history.length} {history.length === 1 ? t('session') : t('sessionsPlural')}
        </span>
      </div>

      
      {loading ? (
        <Skeleton rows={3} />
      ) : groups.length ? (
        <div className="flex flex-col gap-6">
          <HistoryList 
            groups={groups}
            onSelectSession={(session) => setSelectedSessionModal(session)}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onRepeatWorkout={onRepeatWorkout}
          />

          {/* Sayfalama Kontrolleri (Pagination) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              {/* Önceki Sayfa */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-xl bg-surf border border-line text-xs font-bold text-ink disabled:opacity-40 cursor-pointer"
              >
                ← {t('prev')}
              </button>

              {/* Sayfa Numaraları */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === page
                      ? 'bg-accent text-accent-ink shadow-md scale-105'
                      : 'bg-surf border border-line text-mute hover:text-ink'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Sonraki Sayfa */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-xl bg-surf border border-line text-xs font-bold text-ink disabled:opacity-40 cursor-pointer"
              >
                {t('next')} →
              </button>
            </div>
          )}
        </div>
      ) : (
        <Plate className="flex flex-col items-center px-6 py-12 text-center">
          <span
            className="mb-5 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: 'var(--tp-surf-2)', color: 'var(--tp-acc)' }}
          >
            <span className="text-[20px]" aria-hidden="true">
              ◌
            </span>
          </span>
          <p className="mb-1 text-[17px] font-semibold text-ink">{t('theWaterIsStill')}</p>
          <p className="mb-6 max-w-[340px] text-[14px] leading-relaxed text-mute">
            {t('noSessionsYet')}
          </p>
          <Button size="md" onClick={onStart} icon="dumbbell">
            {t('chooseMuscles')}
          </Button>
        </Plate>
      )}

      {/* SEANS DETAY / YARIM KALAN KONTROL MODALI */}
      {selectedSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <Plate className="w-full max-w-lg p-6 bg-surf border-theme border-line shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Kapatma Butonu */}
            <button 
              onClick={() => setSelectedSessionModal(null)}
              className="absolute top-4 right-4 text-mute hover:text-ink text-sm font-bold z-10"
            >
              ✕
            </button>

            {/* Kaydırılabilir İçerik Alanı */}
            <div className="overflow-y-auto flex-1 pr-1">
              {/* Başlık */}
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--tp-acc)]">
                  {selectedSessionModal.name?.includes('(Unfinished)') ? t('unfinishedSession') : t('completedSession')}
                </span>
                <h3 className="text-xl font-bold text-ink mt-1">
                  {getWorkoutTitle(selectedSessionModal, t)}
                </h3>
                <p className="text-xs text-mute mt-0.5">
                  {formatDate(selectedSessionModal.finishedAt, language)}{' · '}{formatTimeOfDay(selectedSessionModal.finishedAt, language)}
                </p>
              </div>

              {/* Özet Bilgiler */}
              <div className="grid grid-cols-3 gap-3 mb-5 p-3 rounded-lg bg-[var(--tp-surf-2)] text-center">
                <div>
                  <p className="text-[11px] text-mute uppercase">{t('duration')}</p>
                  <p className="text-sm font-semibold text-ink">{formatDuration(selectedSessionModal.durationSec)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-mute uppercase">{t('sets')}</p>
                  <p className="text-sm font-semibold text-ink">{selectedSessionModal.totalSets || 0}</p>
                </div>
                <div>
                  <p className="text-[11px] text-mute uppercase">{t('exercises')}</p>
                  <p className="text-sm font-semibold text-ink">{selectedSessionModal.exercises?.length || 0}</p>
                </div>
              </div>

              {/* Egzersiz Listesi Önizlemesi */}
              <div className="mb-6 flex flex-col gap-2">
                <p className="text-xs font-semibold text-mute uppercase">{t('exercisesPerformed')}</p>
                {selectedSessionModal.exercises && selectedSessionModal.exercises.length > 0 ? (
                  selectedSessionModal.exercises.map((ex, idx) => {
                    const isTimed =
                      ex.isTimeBased ||
                      ex.id?.startsWith('warmup') ||
                      ex.id?.startsWith('cooldown')

                    const setCount = isTimed
                      ? 1
                      : (
                          (Array.isArray(ex.sets) ? ex.sets.length : 0) ||
                          ex.setCount ||
                          0
                        )

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1.5 px-3 rounded bg-surf border border-line"
                      >
                        <span className="font-medium text-ink">
                          {t(`exercise_${ex.id}`) !== `exercise_${ex.id}`
                            ? t(`exercise_${ex.id}`)
                            : ex.name || `${t('exercise')} ${idx + 1}`}
                        </span>
                        <span className="text-mute">{setCount} {t('sets')}</span>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-xs text-mute italic"> {t('noExerciseBreakdown')} </p>
                )}
              </div>
            </div>

            {/* Modal İçindeki Sabit Alt Butonlar Alanı */}
            <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-line shrink-0">
              {/* Favori Ekle/Çıkar Butonu */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => selectedSessionModal && onToggleFavorite(selectedSessionModal)}
                icon="star"
              >
                {favorites && favorites.some(fav => fav && selectedSessionModal && (fav.id === selectedSessionModal.id || fav.name === selectedSessionModal.name)) 
                  ? t('removeFromFavorites')
                  : t('addToFavorites')}
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedSessionModal(null)}>
                  {t('close')}
                </Button>

                {/* Yarım kalmışsa Resume, tamamlanmışsa Repeat Workout */}
                {selectedSessionModal.name?.includes('(Unfinished)') ? (
                  <Button 
                    size="sm" 
                    icon="check"
                    onClick={() => {
                      const targetUnfinished = unfinishedList?.find(item => item.summary?.id === selectedSessionModal.id) || {
                        routine: { name: selectedSessionModal.name, exercises: selectedSessionModal.exercises },
                        summary: selectedSessionModal,
                        exerciseIndex: selectedSessionModal.exerciseIndex || 0,
                        setIndex: selectedSessionModal.setIndex || 0
                      }
                      
                      if (onContinueUnfinished) {
                        onContinueUnfinished(targetUnfinished)
                      }
                      setSelectedSessionModal(null)
                    }}
                  >
                    {t('resumeWorkout')}
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    icon="dumbbell"
                    onClick={() => {
                      onRepeatWorkout?.(selectedSessionModal)
                      setSelectedSessionModal(null)
                    }}
                  >
                    {t('repeatWorkout')}
                  </Button>
                )}
              </div>
            </div>

          </Plate>
        </div>
      )}

    </div>
  )}