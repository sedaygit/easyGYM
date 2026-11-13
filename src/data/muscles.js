/** The six target groups the body map exposes. */
export const MUSCLE_GROUPS = [
  {
    id: 'chest',
    label: 'Chest',
    latin: 'Pectoralis major',
    blurb: 'The press. Where your breath pushes out.',
  },
  {
    id: 'back',
    label: 'Back',
    latin: 'Latissimus · Trapezius',
    blurb: 'The pull. The long, quiet strength.',
  },
  {
    id: 'shoulders',
    label: 'Shoulders',
    latin: 'Deltoideus',
    blurb: 'The caps. What carries the weight outward.',
  },
  {
    id: 'arms',
    label: 'Arms',
    latin: 'Biceps · Triceps',
    blurb: 'The reach. Small muscles, steady work.',
  },
  {
    id: 'core',
    label: 'Core',
    latin: 'Rectus abdominis',
    blurb: 'The centre. Everything else floats from here.',
  },
  {
    id: 'legs',
    label: 'Legs',
    latin: 'Quadriceps · Hamstrings',
    blurb: 'The ground. Your slow, heavy anchor.',
  },
]

export const MUSCLE_IDS = MUSCLE_GROUPS.map((group) => group.id)

export const muscleLabel = (id) =>
  MUSCLE_GROUPS.find((group) => group.id === id)?.label ?? id

export const musclesLabel = (ids) => ids.map(muscleLabel).join(' · ')
