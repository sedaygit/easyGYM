/**
 * Every exercise carries what the workout screen needs:
 * a plain description, ordered steps, form tips and one safety warning.
 */

export const EXERCISES = [
  /* ------------------------------- CHEST ------------------------------- */
  {
    id: 'push-up',
    muscle: 'chest',
    name: 'Push-Up',
    equipment: 'Bodyweight',
    level: 'Beginner',
    description:
      'The oldest press there is. Body straight as a line, chest lowering to the floor and floating back up.',
    steps: [
      'Hands under the shoulders, slightly wider than the chest, fingers spread.',
      'Step the feet back into one straight line from head to heels.',
      'Bend the elbows to about 45 degrees and lower until the chest is a fist above the floor.',
      'Press the floor away and return to the start without locking the elbows.',
    ],
    tips: [
      'Squeeze the glutes and the abs so the hips never sag.',
      'Exhale on the way up — the breath leads the movement.',
    ],
    warning: 'Stop if you feel pinching in the front of the shoulder.',
    alt: 'Elevate the hands on a bench to lower the load.',
  },
  {
    id: 'db-bench-press',
    muscle: 'chest',
    name: 'Dumbbell Bench Press',
    equipment: 'Dumbbells · Bench',
    level: 'Intermediate',
    description:
      'Two weights, one slow press. A deeper range than the barbell and a more honest stretch.',
    steps: [
      'Sit with the dumbbells on the thighs, then roll back one knee at a time.',
      'Set the shoulder blades down and back; plant the feet flat.',
      'Lower the dumbbells to chest level with the elbows at roughly 45 degrees.',
      'Press up and slightly inward until the arms are straight but not locked.',
    ],
    tips: [
      'Keep the wrists stacked over the elbows the whole way.',
      'Lower for three seconds; press for one.',
    ],
    warning: 'Never drop the dumbbells to the side — bring them to the chest and sit up.',
    alt: 'Floor press if no bench is available.',
  },
  {
    id: 'incline-fly',
    muscle: 'chest',
    name: 'Incline Dumbbell Fly',
    equipment: 'Dumbbells · Bench',
    level: 'Intermediate',
    description:
      'A wide, open arc. Light weight, long arms, a long stretch across the upper chest.',
    steps: [
      'Set the bench to a low incline and lie back with the dumbbells above the chest.',
      'Soften the elbows, palms facing each other.',
      'Open the arms outward in a slow arc until the chest stretches.',
      'Close the arc back to the top, as if hugging a wide tree.',
    ],
    tips: [
      'Go light — this is a stretch, not a press.',
      'Keep the elbow angle fixed from start to finish.',
    ],
    warning: 'Stop the descent the moment you feel the shoulder joint rather than the chest.',
    alt: 'Cable fly for constant tension.',
  },
  {
    id: 'chest-dip',
    muscle: 'chest',
    name: 'Chest Dip',
    equipment: 'Parallel bars',
    level: 'Advanced',
    description:
      'Bodyweight on the bars. A lean forward turns a triceps dip into a chest builder.',
    steps: [
      'Grip the bars and lift yourself to straight arms.',
      'Lean the torso forward and cross the ankles.',
      'Lower until the upper arms are level with the floor.',
      'Press back up while keeping the forward lean.',
    ],
    tips: [
      'Keep the chest lifted, never rounded.',
      'Shorten the depth before you shorten the quality.',
    ],
    warning: 'Skip this one entirely with a history of shoulder injury.',
    alt: 'Assisted dip machine or a band under the knees.',
  },

  /* -------------------------------- BACK -------------------------------- */
  {
    id: 'pull-up',
    muscle: 'back',
    name: 'Pull-Up',
    equipment: 'Pull-up bar',
    level: 'Advanced',
    description:
      'Hang, breathe, pull. The truest measure of how much weight your back can carry.',
    steps: [
      'Hang with the palms facing away, hands just wider than the shoulders.',
      'Pull the shoulder blades down first, then bend the elbows.',
      'Drive the chest toward the bar until the chin clears it.',
      'Lower slowly to a full hang.',
    ],
    tips: ['Think of pulling the bar down to you.', 'No swinging — the hips stay quiet.'],
    warning: 'Never drop into a relaxed dead hang at speed.',
    alt: 'Band under the knee, or an assisted machine.',
  },
  {
    id: 'bent-over-row',
    muscle: 'back',
    name: 'Bent-Over Row',
    equipment: 'Barbell',
    level: 'Intermediate',
    description:
      'Hinged at the hips, a barbell rowed to the navel. Heavy, slow and grounded.',
    steps: [
      'Stand with the feet hip-width and hinge until the torso is about 45 degrees.',
      'Let the bar hang at arm’s length below the chest.',
      'Row the bar to the lower ribs, elbows brushing the sides.',
      'Lower under control to full extension.',
    ],
    tips: [
      'Keep a neutral spine — long from tailbone to crown.',
      'Squeeze at the top for one full breath.',
    ],
    warning: 'If the lower back rounds, the weight is too heavy.',
    alt: 'Chest-supported row to remove the lower-back demand.',
  },
  {
    id: 'lat-pulldown',
    muscle: 'back',
    name: 'Lat Pulldown',
    equipment: 'Cable machine',
    level: 'Beginner',
    description:
      'The pull-up, softened. Seated, guided, and easy to feel in the lats.',
    steps: [
      'Sit tall with the thighs locked under the pad, hands wider than the shoulders.',
      'Lean back no more than ten degrees.',
      'Pull the bar to the collarbone, leading with the elbows.',
      'Return slowly until the arms are straight.',
    ],
    tips: [
      'Keep the chest proud and the ribs down.',
      'Let the shoulders rise on the way up — full range.',
    ],
    warning: 'Do not pull the bar behind the neck.',
    alt: 'Band pulldown anchored to a door frame.',
  },
  {
    id: 'cable-row',
    muscle: 'back',
    name: 'Seated Cable Row',
    equipment: 'Cable machine',
    level: 'Beginner',
    description:
      'A horizontal pull with a long, steady squeeze at the end of every rep.',
    steps: [
      'Sit with a soft knee bend and the feet braced.',
      'Hold the handle at arm’s length with the spine tall.',
      'Row to the lower ribs, drawing the shoulder blades together.',
      'Extend the arms slowly, letting the shoulder blades travel forward.',
    ],
    tips: [
      'The torso stays still — no rowing with the lower back.',
      'Pause one second at the squeeze.',
    ],
    warning: 'Stop if the neck juts forward to meet the handle.',
    alt: 'Resistance band around a solid post.',
  },
/* ----------------------------- SHOULDERS ----------------------------- */
  {
    id: 'overhead-press',
    muscle: 'shoulders',
    name: 'Overhead Press',
    equipment: 'Dumbbells',
    level: 'Intermediate',
    description:
      'Weight lifted straight up, over the crown. The shoulder in its purest job.',
    steps: [
      'Stand tall with the dumbbells at shoulder height, palms forward.',
      'Brace the ribs down so the lower back stays long.',
      'Press the weights overhead until the arms are straight.',
      'Lower slowly back to shoulder height.',
    ],
    tips: [
      'The head drifts slightly back, never the lower back.',
      'Finish with the biceps beside the ears.',
    ],
    warning: 'Do not arch the lower back to finish a rep — lower the weight instead.',
    alt: 'Seated press with back support.',
  },
  {
    id: 'lateral-raise',
    muscle: 'shoulders',
    name: 'Lateral Raise',
    equipment: 'Dumbbells',
    level: 'Beginner',
    description:
      'A small, bright gesture outward. Light weight, wide arms, slow descent.',
    steps: [
      'Stand with a light dumbbell in each hand at the sides.',
      'Soften the elbows and keep a slight forward lean.',
      'Raise the arms out to shoulder height, leading with the elbows.',
      'Lower over three full seconds.',
    ],
    tips: [
      'Stop at shoulder height — higher is not better.',
      'Imagine pouring water from a jug, thumb-side down.',
    ],
    warning: 'Never swing the weight up with the torso.',
    alt: 'Cable lateral raise for constant tension.',
  },
  {
    id: 'face-pull',
    muscle: 'shoulders',
    name: 'Face Pull',
    equipment: 'Cable · Rope',
    level: 'Beginner',
    description:
      'A pull toward the forehead that keeps the back of the shoulder alive and the posture tall.',
    steps: [
      'Set the cable at face height with a rope attachment.',
      'Hold the rope with the palms facing in, arms extended.',
      'Pull the rope toward the forehead, splitting the hands apart.',
      'Squeeze the rear shoulders, then return slowly.',
    ],
    tips: [
      'Elbows stay above the wrists the whole way.',
      'Light weight — this is posture work, not strength work.',
    ],
    warning: 'Shrug-free: if the neck shortens, reduce the load.',
    alt: 'Band anchored at head height.',
  },
  {
    id: 'arnold-press',
    muscle: 'shoulders',
    name: 'Arnold Press',
    equipment: 'Dumbbells',
    level: 'Advanced',
    description:
      'A press that rotates. The palms open outward as the weights rise overhead.',
    steps: [
      'Start seated with the dumbbells in front of the shoulders, palms toward you.',
      'Press upward while rotating the palms to face forward.',
      'Finish with the arms straight overhead.',
      'Reverse the rotation on the way down.',
    ],
    tips: [
      'Rotate smoothly — the turn is part of the press.',
      'Keep the ribs down and the back against the bench.',
    ],
    warning: 'Use far less weight than a standard press.',
    alt: 'Standard dumbbell press with a pause at the top.',
  },

  /* -------------------------------- CORE -------------------------------- */
  {
    id: 'plank',
    muscle: 'core',
    name: 'Plank',
    equipment: 'Bodyweight',
    level: 'Beginner',
    description:
      'Stillness, held. The whole body as one long, breathing line.',
    steps: [
      'Forearms on the floor, elbows directly under the shoulders.',
      'Step the feet back, tucking the toes.',
      'Tighten the glutes and draw the navel gently inward.',
      'Breathe slowly and hold while the line stays straight.',
    ],
    tips: [
      'Quality beats duration — end the hold when the hips drop.',
      'Push the floor away to keep the upper back active.',
    ],
    warning: 'Never let the lower back sag — that is where planks hurt people.',
    alt: 'Knees down, or hands on a bench.',
  },
  {
    id: 'dead-bug',
    muscle: 'core',
    name: 'Dead Bug',
    equipment: 'Bodyweight',
    level: 'Beginner',
    description:
      'Opposite arm and leg reaching away while the back stays pinned to the floor.',
    steps: [
      'Lie on your back with the arms straight up and the knees over the hips.',
      'Press the lower back gently into the floor.',
      'Lower one arm overhead and the opposite leg toward the floor.',
      'Return and repeat on the other side.',
    ],
    tips: [
      'Move only as far as the lower back stays flat.',
      'Exhale as the limbs reach away.',
    ],
    warning: 'If the back lifts off the floor, reduce the range.',
    alt: 'Heel taps instead of full leg extension.',
  },
  {
    id: 'hanging-knee-raise',
    muscle: 'core',
    name: 'Hanging Knee Raise',
    equipment: 'Pull-up bar',
    level: 'Advanced',
    description:
      'Hanging from the bar, the knees curl up toward the ribs and the abs take the load.',
    steps: [
      'Hang from the bar with the shoulders gently engaged.',
      'Draw the knees up toward the chest.',
      'Pause for a breath at the top.',
      'Lower slowly, without letting the body swing.',
    ],
    tips: [
      'Curl the pelvis — the hips rotate, not just the knees.',
      'Stop the set when the swing starts.',
    ],
    warning: 'Come down if the grip is failing — grip fails before abs do.',
    alt: 'Lying knee raise for the same pattern without the hang.',
  },
  {
    id: 'russian-twist',
    muscle: 'core',
    name: 'Russian Twist',
    equipment: 'Bodyweight · Plate',
    level: 'Intermediate',
    description:
      'A slow rotation, seated. The obliques turning the ribcage over a still pelvis.',
    steps: [
      'Sit with the knees bent and the heels lightly down.',
      'Lean back to about 45 degrees with a long spine.',
      'Bring the hands together at the chest.',
      'Rotate the ribcage to one side, then the other, pausing at each end.',
    ],
    tips: [
      'The turn comes from the ribs, not the arms.',
      'Slow is the whole point — no bouncing.',
    ],
    warning: 'Avoid this movement while pregnant or with a lower-back injury.',
    alt: 'Seated rotation without the lean-back.',
  },
/* -------------------------------- ARMS -------------------------------- */
  {
    id: 'biceps-curl',
    muscle: 'arms',
    name: 'Dumbbell Biceps Curl',
    equipment: 'Dumbbells',
    level: 'Beginner',
    description:
      'Elbows pinned to the ribs, the forearms fold upward and unfold slowly.',
    steps: [
      'Stand tall with a dumbbell in each hand, palms forward.',
      'Pin the elbows against the ribs.',
      'Curl the weights to the shoulders without moving the upper arms.',
      'Lower over three seconds to full extension.',
    ],
    tips: [
      'The elbows do not travel forward.',
      'Squeeze at the top for a beat, then let go slowly.',
    ],
    warning: 'No swinging the torso to lift the weight.',
    alt: 'Band curl or a single-arm cable curl.',
  },
  {
    id: 'triceps-pushdown',
    muscle: 'arms',
    name: 'Triceps Pushdown',
    equipment: 'Cable · Rope',
    level: 'Beginner',
    description:
      'A straightening of the elbow against a cable. Quiet, controlled, and easy on the joints.',
    steps: [
      'Stand at the cable with the rope at chest height.',
      'Tuck the elbows at the sides and hold the rope.',
      'Press the rope down until the arms are straight.',
      'Let the rope rise slowly back to chest height.',
    ],
    tips: [
      'Elbows stay glued to the ribs.',
      'Split the rope apart at the bottom for a longer squeeze.',
    ],
    warning: 'Do not lean over the cable to push the weight down.',
    alt: 'Bench dip or band pushdown.',
  },
  {
    id: 'hammer-curl',
    muscle: 'arms',
    name: 'Hammer Curl',
    equipment: 'Dumbbells',
    level: 'Intermediate',
    description:
      'A curl with the palms facing each other. It builds the arm that carries things.',
    steps: [
      'Stand with the dumbbells at the sides, palms facing in.',
      'Keep the elbows still and curl to shoulder height.',
      'Pause at the top.',
      'Lower slowly to a full stretch.',
    ],
    tips: [
      'The wrist stays neutral, like holding a hammer.',
      'Alternate arms if the back starts to sway.',
    ],
    warning: 'Stop if the elbow joint aches rather than the muscle.',
    alt: 'Rope hammer curl on a cable.',
  },
  {
    id: 'overhead-triceps',
    muscle: 'arms',
    name: 'Overhead Triceps Extension',
    equipment: 'Dumbbell',
    level: 'Intermediate',
    description:
      'One weight held overhead, lowered behind the head. The long head of the triceps at full stretch.',
    steps: [
      'Hold a single dumbbell with both hands above the head.',
      'Keep the elbows narrow and pointing forward.',
      'Lower the weight behind the head until the elbows are fully bent.',
      'Press back up to straight arms.',
    ],
    tips: [
      'Ribs down — do not let the lower back arch.',
      'The upper arms stay almost vertical.',
    ],
    warning: 'Move slowly behind the head; the shoulder is in a stretched position.',
    alt: 'Seated version with back support.',
  },

  /* -------------------------------- LEGS -------------------------------- */
  {
    id: 'goblet-squat',
    muscle: 'legs',
    name: 'Goblet Squat',
    equipment: 'Dumbbell · Kettlebell',
    level: 'Beginner',
    description:
      'One weight at the chest, sitting down between the knees and standing back up.',
    steps: [
      'Hold the weight at chest height with both hands.',
      'Feet a little wider than the hips, toes slightly out.',
      'Sit down and back, knees tracking over the toes.',
      'Drive through the whole foot to stand tall.',
    ],
    tips: [
      'Chest tall, elbows inside the knees at the bottom.',
      'Go as deep as you can keep the heels down.',
    ],
    warning: 'If the knees cave inward, lighten the load.',
    alt: 'Bodyweight squat to a chair.',
  },
  {
    id: 'romanian-deadlift',
    muscle: 'legs',
    name: 'Romanian Deadlift',
    equipment: 'Dumbbells · Barbell',
    level: 'Intermediate',
    description:
      'A hinge, not a squat. The hips travel back and the hamstrings stretch long.',
    steps: [
      'Stand with the weight at the thighs, feet hip-width.',
      'Soften the knees and push the hips back.',
      'Slide the weight down the legs until the hamstrings stretch.',
      'Drive the hips forward to stand tall.',
    ],
    tips: [
      'Back flat, chest proud throughout.',
      'Stop lowering when the back wants to round.',
    ],
    warning: 'Never round the lower back to reach the floor.',
    alt: 'Single-leg version for balance work.',
  },
  {
    id: 'walking-lunge',
    muscle: 'legs',
    name: 'Walking Lunge',
    equipment: 'Bodyweight · Dumbbells',
    level: 'Intermediate',
    description:
      'A step forward, a knee to the floor, a step through. Legs and balance together.',
    steps: [
      'Stand tall with the feet under the hips.',
      'Step one foot forward and lower both knees.',
      'Stop with the back knee just above the floor.',
      'Push through the front foot and step through to the other side.',
    ],
    tips: [
      'The front knee tracks over the middle toes.',
      'Keep the torso upright — no falling forward.',
    ],
    warning: 'Hold a wall or rail if balance is uncertain.',
    alt: 'Reverse lunge, or split squat in place.',
  },
  {
    id: 'calf-raise',
    muscle: 'legs',
    name: 'Standing Calf Raise',
    equipment: 'Bodyweight · Step',
    level: 'Beginner',
    description:
      'Rising onto the toes, slowly, over and over. The smallest range with the longest patience.',
    steps: [
      'Stand with the balls of the feet on a step, heels hanging free.',
      'Let the heels sink below the step for a stretch.',
      'Rise onto the toes as high as possible.',
      'Lower over three seconds.',
    ],
    tips: [
      'Pause one second at the very top.',
      'Hold something for balance, not for support.',
    ],
    warning: 'Skip the deep stretch if the Achilles tendon is sore.',
    alt: 'Seated calf raise with a weight on the knee.',
  },
]

/** All exercises that train a given muscle group. */
export const exercisesByMuscle = (muscleId) =>
  EXERCISES.filter((exercise) => exercise.muscle === muscleId)

/** 
 * Kullanıcının seviyesine uygun egzersizleri filtreler.
 * Beginner kullanıcılar sadece Beginner hareketleri görür,
 * Intermediate kullanıcılar Beginner + Intermediate görür,
 * Advanced kullanıcılar ise tüm seviyeleri (Beginner + Intermediate + Advanced) görür.
 */
export const exercisesByMuscleAndLevel = (muscleId, userLevel = 'beginner') => {
  const pool = exercisesByMuscle(muscleId)
  
  const levelHierarchy = {
    beginner: ['beginner'],
    intermediate: ['beginner', 'intermediate'],
    advanced: ['beginner', 'intermediate', 'advanced'],
  }

  const allowedLevels = levelHierarchy[userLevel?.toLowerCase()] || ['beginner']

  return pool.filter((exercise) => 
    allowedLevels.includes(exercise.level.toLowerCase())
  )
}

/**
 * Round-robin across the selected groups so every chosen muscle shows up
 * before any of them repeats. Capped so a session stays a session.
 */
export const buildExerciseList = (muscleIds, limit = 6, userLevel = 'beginner') => {
  const pools = muscleIds
    .map((id) => exercisesByMuscleAndLevel(id, userLevel))
    .filter((pool) => pool.length)
    
  if (!pools.length) return []

  const picked = []
  let round = 0
  while (picked.length < limit) {
    let added = false
    for (const pool of pools) {
      const candidate = pool[round]
      if (candidate && picked.length < limit) {
        picked.push(candidate)
        added = true
      }
    }
    if (!added) break
    round += 1
  }
  return picked
}