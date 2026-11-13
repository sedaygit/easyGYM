import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthScreen } from './components/auth/AuthScreen'
import { MuscleSelectScreen } from './components/anatomy/MuscleSelectScreen'
import { RoutineScreen } from './components/routine/RoutineScreen'
import { WorkoutScreen } from './components/workout/WorkoutScreen'
import { CompletionScreen } from './components/complete/CompletionScreen'
import { AchievementsScreen } from './components/achievements/AchievementsScreen'
import { ProfileScreen } from './components/profile/ProfileScreen'
import { AppNav } from './components/nav/AppNav'
import { Stage } from './components/fx/FxLayer'
import { Plate } from './components/ui/Plate'
import { Button } from './components/ui/Button'
import { useStoredState } from './hooks/useStoredState'
import { STORAGE_KEYS, getUserStorageKey, writeStored } from './lib/storage'
import { buildExerciseList } from './data/exercises'
import { EXERCISES as exercises } from './data/exercises'
import { computeStats } from './lib/stats'
import { setMuted } from './lib/audio'
import { StreakLeagueCard } from './components/achievements/StreakLeagueCard'
import { WARMUP_EXERCISES, COOLDOWN_EXERCISES } from './data/warmups'
import { useTranslation } from './i18n/I18nContext'

// Default kullanıcı tercihleri ve antrenman uzunluğu
const DEFAULT_PREFS = { sets: 3, reps: 10, restSec: 15 }
const ROUTINE_LENGTH = 6

const NAV_FOR_ROUTE = { // Route'a göre nav bar'da hangi sekmenin aktif olduğunu belirliyoruz
  train: 'train',
  routine: 'train',
  achievements: 'achievements',
  complete: 'achievements',
  profile: 'profile',
  league: null // Lig detay ekranında nav bar'da sekme seçili değil
}

export default function App() {
  const [user, setUser] = useStoredState(STORAGE_KEYS.user, null) // Kullanıcı profili (giriş yapmış kullanıcı)
  const handleAuthenticated = (profile) => { 
    setUser(profile)
  }

  if (!user) {
    return (
      <Stage>
        <main className="relative">
          <AuthScreen onAuthenticated={handleAuthenticated} />
        </main>
      </Stage>
    )
  }

  return (
    <AuthenticatedApp
      key={user.id}
      user={user}
      onLogout={() => setUser(null)}
    />
  )
}

function AuthenticatedApp({ user, onLogout }) {  
  const { t } = useTranslation()
  const [selection, setSelection] = useStoredState(getUserStorageKey(user.id, 'selection'), []) // Seçili kaslar (muscles)
  const [prefs, setPrefs] = useStoredState(getUserStorageKey(user.id, 'prefs'), DEFAULT_PREFS) // Kullanıcı tercihleri (sets, reps, restSec)
  const [history, setHistory] = useStoredState(getUserStorageKey(user.id, 'history'), []) // Antrenman geçmişi (tamamlanan ve yarım kalan seanslar)
  const [soundOn, setSoundOn] = useStoredState(getUserStorageKey(user.id, 'sound'), true) // Ses durumu (açık/kapalı)
  const [autoPlayAudio, setAutoPlayAudio] = useStoredState(`easygym.autoplay_audio.${user.id}`, true) // Sesli yönergelerin otomatik oynatılıp oynatılmayacağı
  const [unfinishedList, setUnfinishedList] = useStoredState(`easygym.unfinished_workouts.${user.id}`, []) // Yarım kalan antrenmanların listesi (en fazla 10 adet saklanır)
  const [activeUnfinished, setActiveUnfinished] = useState(() => { return unfinishedList?.[0] || null}) // Şu anda devam ettirilen yarım kalan antrenman
  const [route, setRoute] = useState('train') // Mevcut ekran route'u (train, routine, workout, complete, achievements, profile, league)
  const [routine, setRoutine] = useState(null) // Mevcut antrenman rutini (egzersiz listesi ve adı)
  const [summary, setSummary] = useState(null) // Son antrenman özet bilgisi (tamamlanan veya yarım kalan)
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false)
  const favoritesKey = `easygym.favorites.${user.id}`

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(favoritesKey)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  // Nav bar'da train sekmesine tıklayınca train ekranındaki seçili kasları ve aktif yarım kalan antrenmanı sıfırlamak için bir fonksiyon
  const hasActiveWorkout = !!(routine && routine.exercises?.length > 0) || !!activeUnfinished
  // Antrenman ekranına geçmeden önce train ekranındaki seçili kasları ve aktif yarım kalan antrenmanı sıfırlıyoruz
  const resetTrainState = () => {
    setRoutine(null) // Train ekranındaki mevcut antrenmanı sıfırlıyoruz
    setActiveUnfinished(null) // Train ekranındaki aktif yarım kalan antrenmanı sıfırlıyoruz
    setSelection([]) // Train ekranındaki seçili kasları sıfırlıyoruz
    setSummary(null) // Son antrenman özetini sıfırlıyoruz
    setRoute('train') // Train ekranına yönlendiriyoruz
  }
  // Favorilere ekleme / çıkarma fonksiyonu
  const handleToggleFavorite = (workoutItem) => {
    setFavorites((current) => {
      const exists = current.some(fav => fav.id === workoutItem.id || fav.name === workoutItem.name)
      const updated = exists 
        ? current.filter(fav => fav.id !== workoutItem.id && fav.name !== workoutItem.name)
        : [workoutItem, ...current]
      
      localStorage.setItem(favoritesKey, JSON.stringify(updated))
      return updated
    })
  }

  useEffect(() => { // Ses durumu değiştiğinde setMuted fonksiyonunu çağırıyoruz
    setMuted(!soundOn)
  }, [soundOn])

  useEffect(() => { // Route değiştiğinde sayfayı en üste kaydırıyoruz
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [route])

  const stats = useMemo(() => computeStats(history), [history]) // Geçmişe göre istatistikleri hesaplıyoruz
  
  // Seçili kasları toggle etmek için bir fonksiyon
  const toggleMuscle = useCallback( 
    (id) => {
      setSelection((current) =>
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
      )
    },
    [setSelection]
  )

  
  // Seçili kaslar ile antrenman rutini oluşturup routine ekranına yönlendiriyoruz
  const handleAccept = () => {
    if (!selection.length) return
    setActiveUnfinished(null)
    setRoutine({
      name: selection.map((muscle) => t(muscle)).join(' · '),
      muscles: [...selection],
      exercises: buildExerciseList(selection, ROUTINE_LENGTH, user?.level),
    })

    setRoute('routine')
  }
  
  // Antrenmanı başlatırken seçili egzersizleri ve kullanıcı tercihini kaydedip workout ekranına yönlendiriyoruz
  const handleStart = (selectedExercises, newPrefs) => { 
    if (!selectedExercises?.length) return
    
    // Kullanıcının güncellediği set/reps/rest tercihini kaydediyoruz
    setPrefs(newPrefs)
    
    // Sadece seçili (aktif) olan egzersizleri routine içerisine atıyoruz
    setRoutine((current) => ({
      ...current,
      exercises: selectedExercises,
    }))
    setRoute('workout')
  }

  
  // Antrenman tamamlandığında veya yarım kaldığında özet bilgiyi kaydet.
  const handleFinish = (sessionSummary) => {
    const isUnfinished =
      sessionSummary.isUnfinished === true ||
      sessionSummary.name?.includes('(Unfinished)')

    const sessionId = sessionSummary.id || `session-${Date.now()}`

    const newEntry = {
      ...sessionSummary,
      id: sessionId,
      isUnfinished,
      name: sessionSummary.name || t('workout'),
      muscles: sessionSummary.muscles || selection,
      exercises: sessionSummary.exercises || routine?.exercises || [],
      totalSets: sessionSummary.totalSets || 0,
      totalReps: sessionSummary.totalReps || 0,
      durationSec: sessionSummary.durationSec || 0,
      finishedAt: sessionSummary.finishedAt || new Date().toISOString(),
    }

    if (isUnfinished) {
      const fullEntry = {
        routine: {
          ...routine,
          muscles: routine?.muscles?.length
            ? routine.muscles
            : [
                ...new Set(
                  (sessionSummary.muscles?.length
                    ? sessionSummary.muscles
                    : routine?.exercises?.map((ex) => ex.muscle) || selection
                  ).filter(Boolean)
                ),
              ],
        },
        exerciseIndex: sessionSummary.exerciseIndex ?? 0,
        setIndex: sessionSummary.setIndex ?? 0,
        summary: newEntry,
      }

      setUnfinishedList((current) => [
        fullEntry,
        ...(current || []).filter(
          (item) => item.summary?.id !== sessionId
        ),
      ].slice(0, 10))

      setHistory((current) => [
        newEntry,
        ...(current || []).filter((item) => item.id !== sessionId),
      ])

      setActiveUnfinished(fullEntry)
    } else {
      setUnfinishedList((current) =>
        (current || []).filter(
          (item) => item.summary?.id !== sessionId
        )
      )

      setHistory((current) => [
        newEntry,
        ...(current || []).filter((item) => item.id !== sessionId),
      ])

      setActiveUnfinished((current) =>
        current?.summary?.id === sessionId ? null : current
      )
    }

    setSummary(newEntry)
    setRoute('complete')
  }



  // Yarım kalan antrenmanı devam ettirmek için routine ve workout ekranına yönlendiriyoruz
  const handleContinueUnfinished = (item) => {
    if (!item) return
    setActiveUnfinished(item) // tıkladığımız yarım kalan antrenmanı aktif olarak işaretliyoruz
    setRoutine(item.routine)
    setRoute('workout')
  }
  
  // Yarım kalan antrenmanı listeden kaldırmak için handleDismissUnfinished fonksiyonunu kullanıyoruz
  const handleDismissUnfinished = (targetId) => {
    setUnfinishedList((current) => current.filter((item) => item.summary?.id !== targetId))
    if (activeUnfinished && activeUnfinished.summary?.id === targetId) {
      setActiveUnfinished(null)
    }
  }

  // Kullanıcı çıkış yaptığında tüm kullanıcıya özel verileri sıfırlayıp auth ekranına yönlendiriyoruz
  const handleLogout = () => {
    writeStored(getUserStorageKey(user.id, 'selection'), []) // Çıkışta, seçim doğrudan kullanıcın kaydına yazılır
    setRoutine(null)
    setSummary(null)
    setActiveUnfinished(null)
    setSelection([])
    onLogout()
  }

 // ProfileScreen'den gelen "Reset Data" butonuna tıklayınca tüm geçmişi ve yarım kalan antrenmanı siliyoruz. 
  const handleResetHistory = () => {
    setHistory([])
    setUnfinishedList([])
    setSummary(null)
    setActiveUnfinished(null)
  }

  // Nav bar'ı sadece auth, workout ve complete ekranlarında gizliyoruz
  const showNav = route !== 'auth' && route !== 'workout' && route !== 'complete'
  
  // Route'a göre uygun ekranı render ediyoruz
  const screen = (() => {
    switch (route) {
      case 'train':
        const maxVisibleCards = 3
        const allUnfinished = unfinishedList || []
        const visibleUnfinished = allUnfinished.slice(0, maxVisibleCards)
        const remainingCount = allUnfinished.length - maxVisibleCards

        return (
          <div className="mx-auto w-full max-w-[1180px] px-4 pt-4 sm:px-8">
            
            {allUnfinished.length > 0 ? (
              <div className="mb-6 flex flex-col gap-3">
                {visibleUnfinished.map((item) => (
                  <Plate
                    key={item.summary?.id}
                    className="border-accent/40 bg-surf p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[var(--tp-acc)] animate-pulse" />
                          <h3 className="text-[15px] font-semibold text-ink">
                            {t('unfinishedWorkoutWaiting')}
                          </h3>
                        </div>

                        <p className="text-[13px] text-mute">
                          {t('unfinishedWorkoutMessage')}{' '}
                          <span className="font-medium text-ink">
                            {item.routine?.muscles?.length
                              ? item.routine.muscles.map((muscle) => t(muscle)).join(' · ')
                              : item.routine?.name || t('aSession')}                         
                          </span>
                          {' '}{t('unfinishedWorkoutContinueQuestion')}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDismissUnfinished(item.summary?.id)}
                        >
                          {t('dismiss')}
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handleContinueUnfinished(item)}
                          icon="check"
                        >
                          {t('continue')}
                        </Button>
                      </div>
                    </div>
                  </Plate>
                ))}

                {remainingCount > 0 && (
                  <p className="text-center text-[12px] text-mute mt-1">
                    {t('and')} {remainingCount} {t('moreSessionsWaiting')}
                  </p>
                )}
              </div>
            ) : null}


            <MuscleSelectScreen
              user={user}
              selected={selection}
              onToggle={toggleMuscle}
              onAccept={handleAccept}
            />
          </div>
        )
      
      {/* ROUTINE, WORKOUT, COMPLETE, ACHIEVEMENTS ve PROFILE ekranları */}
      case 'routine':
        return (
          <RoutineScreen
            muscles={selection}
            exercises={routine?.exercises ?? []}
            prefs={prefs}
            onPrefsChange={setPrefs}
            onStart={handleStart}
            onBack={() => setRoute('train')}
          />
        )
      case 'workout':
        return (
          <WorkoutScreen
            exercises={routine?.exercises ?? []}
            prefs={prefs}
            routineName={routine?.name}
            routineMuscles={routine?.muscles || []}
            resumeSessionId={activeUnfinished?.summary?.id || null}
            initialElapsed={activeUnfinished?.summary?.durationSec || 0}
            initialExerciseIndex={activeUnfinished?.exerciseIndex || 0} // <-- Kaldığı egzersiz
            initialSetIndex={activeUnfinished?.setIndex || 0}          // <-- Kaldığı set
            onFinish={handleFinish}
            onExit={() => {
              setActiveUnfinished(null) // Workout ekranından çıkınca aktif yarım kalan antrenmanı sıfırlıyoruz
              setRoute('train')
            }}
          />
        )
      case 'complete':
        return (
          <CompletionScreen
            summary={summary}
            streak={stats.streak}
            isCompleted={!summary?.isUnfinished} // <-- Yarım kalmış mı kontrolü
            onAchievements={() => setRoute('achievements')}
            onAgain={() => {
              const isUnfinished = summary?.isUnfinished === true || summary?.name?.includes('(Unfinished)') // veya kontrol şeklin
              
              if (isUnfinished) {
                if (activeUnfinished?.routine) {
                  setRoutine(activeUnfinished.routine)
                }
                setRoute('workout')
              } else {
                setSelection([])
                setRoute('train')
              }
            }}
          />
        )
      case 'achievements':
        return (
          <AchievementsScreen
            history={history}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            stats={stats}
            onBack={() => setRoute('train')}
            onStart={() => setRoute('train')}
            onContinueUnfinished={handleContinueUnfinished} 
            unfinishedList={unfinishedList}
            onRepeatWorkout={(session) => {
              if (!session) return

              const cleanName = session.name
                ? session.name.replace(/\(Unfinished\)/g, '').trim()
                : 'Workout'

              const recordedExercises = (session.exercises || []).map((ex) => {
                const fullExercise =
                  exercises.find(item => item.id === ex.id || item.name === ex.name) ||
                  Object.values(WARMUP_EXERCISES).find(item => item.id === ex.id) ||
                  Object.values(COOLDOWN_EXERCISES).find(item => item.id === ex.id)

                const mergedExercise = fullExercise
                  ? {
                      ...fullExercise,
                      ...ex,
                      steps: ex.steps?.length ? ex.steps : fullExercise.steps,
                      tips: ex.tips?.length ? ex.tips : fullExercise.tips,
                      description: ex.description || fullExercise.description,
                      warning: ex.warning || fullExercise.warning,
                      alt: ex.alt || fullExercise.alt,
                    }
                  : { ...ex }

                return fullExercise
                  ? { ...fullExercise, ...ex }
                  : { ...ex }
              })

              // Kas gruplarını belirle.
              const muscles = (
                session.muscles?.length
                  ? session.muscles
                  : recordedExercises.map(ex => ex.muscle).filter(Boolean)
              ).map(m => typeof m === 'object' ? m.id : m)

              // Warmup ve cooldown verilerini al.
              const warmups = [...new Map(
                muscles.map(m => {
                  const key = (m || 'core').toLowerCase()
                  const exercise = WARMUP_EXERCISES[key] ||
                    WARMUP_EXERCISES.core ||
                    Object.values(WARMUP_EXERCISES)[0]

                  return exercise ? [exercise.id, exercise] : [null, null]
                }).filter(([id]) => id)
              ).values()]

              const cooldowns = [...new Map(
                muscles.map(m => {
                  const key = (m || 'core').toLowerCase()
                  const exercise = COOLDOWN_EXERCISES[key] ||
                    COOLDOWN_EXERCISES.core ||
                    Object.values(COOLDOWN_EXERCISES)[0]

                  return exercise ? [exercise.id, exercise] : [null, null]
                }).filter(([id]) => id)
              ).values()]

              // Geçmiş kaydındaki warmup/cooldown adımlarını tekrar ekleme.
              const existingIds = new Set(recordedExercises.map(ex => ex.id))

              const missingWarmups = warmups.filter(ex => !existingIds.has(ex.id))
              const missingCooldowns = cooldowns.filter(ex => !existingIds.has(ex.id))

              // Doğru sırada birleştir.
              const enrichedExercises = [
                ...missingWarmups,
                ...recordedExercises,
                ...missingCooldowns,
              ].map(ex => {
                const isTimed =
                  ex.isTimeBased === true ||
                  ex.id?.startsWith('warmup') ||
                  ex.id?.startsWith('cooldown')

                return {
                  ...ex,
                  ...(isTimed
                    ? {
                        isTimeBased: true,
                        durationSec: Number(ex.durationSec) || 60,
                        sets: 1,
                        setCount: 1,
                      }
                    : {}),
                }
              })
              
              setRoutine({
                name: cleanName,
                exercises: enrichedExercises,
              })

              setActiveUnfinished(null)
              setRoute('workout')
            }}


          />
        )
      case 'profile':
        return (
          <ProfileScreen
            user={user}
            history={history}
            soundOn={soundOn}
            onToggleSound={() => setSoundOn((value) => !value)}
            autoPlayAudio={autoPlayAudio}
            onToggleAutoPlay={() => setAutoPlayAudio((value) => !value)}
            onResetTrain={() => setSelection([])}
            onLogout={handleLogout}
            onResetData={handleResetHistory}
          />
        )
      case 'league': {
        const stats = computeStats(history)

        return (
          <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-8 animate-fadeIn">
            {/* Sola dayalı Back tuşu */}
            <div className="mb-6">
              <button
                onClick={() => setRoute('train')}
                className="flex items-center gap-2 text-mute hover:text-ink text-sm font-medium transition-colors w-fit cursor-pointer"
              >
                <span>←</span> {t('backToTrain')}
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-ink">{t('streakLeagueDetails')}</h2>
              <p className="text-xs text-mute mt-0.5">{t('streakLeagueDescription')}</p>
            </div>
            
            {/* Lig Kartı ve Tüm Ligler Merdiveni */}
            <div className="bg-surf border-theme border-line rounded-3xl p-6 sm:p-8 shadow-xl">
              <StreakLeagueCard streak={stats.streak} />
            </div>
          </div>
        )
      }
      default:
        return null
    }
  }) () // IIFE (Immediately Invoked Function Expression) ile route'a göre ekran seçimi

  // Render edilen ekranı Stage bileşeni içine alıyoruz ve nav bar'ı durumuna göre gösteriyoruz
  return (
    <Stage>
      {showNav ? (
        <AppNav
          route={route}
          active={NAV_FOR_ROUTE[route] || route}
          onChange={setRoute}
          user={user}
          history={history}
          hasActiveWorkout={hasActiveWorkout}
          onResetTrain={resetTrainState}
        />
      ) : null}

      <main className="relative">{screen}</main>
    </Stage>
  )
}