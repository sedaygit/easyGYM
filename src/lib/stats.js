import { MUSCLE_GROUPS } from '../data/muscles'
import { dayKey } from './format'

const EMPTY_STATS = {
  totalWorkouts: 0,
  totalSeconds: 0,
  totalSets: 0,
  totalReps: 0,
  streak: 0,
  bestStreak: 0,
  muscleCounts: {},
  lastWorkoutAt: null,
}

/** Consecutive days with at least one finished workout, ending today or yesterday. */
function computeStreak(history) {
  const days = [...new Set(history.map((entry) => dayKey(entry.finishedAt)))].sort().reverse()
  if (!days.length) return { streak: 0, bestStreak: 0 }

  const cursor = new Date()
  const todayKey = dayKey(cursor)
  cursor.setDate(cursor.getDate() - 1)
  const yesterdayKey = dayKey(cursor)

  let streak = 0
  if (days[0] === todayKey || days[0] === yesterdayKey) {
    streak = 1
    for (let index = 1; index < days.length; index += 1) {
      const previous = new Date(`${days[index - 1]}T12:00:00`)
      previous.setDate(previous.getDate() - 1)
      if (dayKey(previous) === days[index]) streak += 1
      else break
    }
  }

  // longest run anywhere in the history
  let bestStreak = 1
  let run = 1
  const ascending = [...days].reverse()
  for (let index = 1; index < ascending.length; index += 1) {
    const previous = new Date(`${ascending[index - 1]}T12:00:00`)
    previous.setDate(previous.getDate() + 1)
    if (dayKey(previous) === ascending[index]) run += 1
    else run = 1
    bestStreak = Math.max(bestStreak, run)
  }

  return { streak, bestStreak }
}


/** Aggregates completed workouts for the Achievements screen. */
export function computeStats(history = []) {
  const completedHistory = history.filter(
    (entry) => entry.isUnfinished !== true
  )

  if (!completedHistory.length) return { ...EMPTY_STATS }

  const totals = completedHistory.reduce(
    (acc, entry) => {
      acc.totalSeconds += entry.durationSec || 0
      acc.totalSets += entry.totalSets || 0
      acc.totalReps += entry.totalReps || 0

      for (const muscle of entry.muscles || []) {
        acc.muscleCounts[muscle] =
          (acc.muscleCounts[muscle] || 0) + 1
      }

      return acc
    },
    {
      totalSeconds: 0,
      totalSets: 0,
      totalReps: 0,
      muscleCounts: {},
    }
  )

  const { streak, bestStreak } = computeStreak(completedHistory)

  const lastWorkoutAt = completedHistory.reduce(
    (latest, entry) =>
      new Date(entry.finishedAt) > new Date(latest)
        ? entry.finishedAt
        : latest,
    completedHistory[0].finishedAt
  )

  return {
    totalWorkouts: completedHistory.length,
    totalSeconds: totals.totalSeconds,
    totalSets: totals.totalSets,
    totalReps: totals.totalReps,
    streak,
    bestStreak,
    muscleCounts: totals.muscleCounts,
    lastWorkoutAt,
  }
}


/** Muscle groups ordered by how often they were trained. */
export function muscleBreakdown(muscleCounts = {}) {
  return MUSCLE_GROUPS.map((group) => ({
    id: group.id,
    label: group.label,
    count: muscleCounts[group.id] || 0,
  })).sort((a, b) => b.count - a.count)
}

/** Newest-first history grouped by calendar day. */
export function groupHistoryByDay(history = []) {
  const sorted = [...history].sort((a, b) => new Date(b.finishedAt) - new Date(a.finishedAt))
  const groups = new Map()
  for (const entry of sorted) {
    const key = dayKey(entry.finishedAt)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(entry)
  }
  return [...groups.entries()].map(([key, entries]) => ({ key, entries }))
}
