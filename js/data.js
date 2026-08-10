/* ============================================================
   PROGRAMME DATA
   8-week strength + spin programme, Mon 17 Aug – Sun 11 Oct 2026.
   Built around a fixed hard constraint: no training during
   27–31 Aug 2026 and 22 Sep–1 Oct 2026. Everything else (session
   placement, volume, progression) flexes around that.
   ============================================================ */

const PROGRAMME_START = "2026-08-17"; // Monday

const HOLIDAYS = [
  { start: "2026-08-27", end: "2026-08-31", label: "Away (Break 1)" },
  { start: "2026-09-22", end: "2026-10-01", label: "Away (Break 2)" },
];

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ---------- shared warm-up / cool-down blocks ---------- */

const WARMUP_STANDARD = [
  "3 min easy bike, rower or treadmill — build a light sweat",
  "10 × bodyweight squats",
  "10 × standing hip hinges (hands on hips, push hips back)",
  "10 × arm circles each direction",
  "6 × walking lunges (3 each leg)",
  "1 light warm-up set of your first exercise before loading up properly",
];

const WARMUP_RETURN = [
  "5 min easy bike or treadmill — slower build than usual, you've had time off",
  "10 × bodyweight squats, controlled",
  "8 × standing hip hinges",
  "10 × arm circles each direction",
  "1–2 deliberately light warm-up sets before your first working set",
];

const COOLDOWN_STANDARD = [
  "Standing quad stretch — 30 sec each side",
  "Standing hamstring stretch — 30 sec each side",
  "Doorway chest stretch — 30 sec",
  "Child's pose — 45 sec",
  "A few slow deep breaths before you head off",
];

/* ============================================================
   STRENGTH SESSIONS
   Each exercise: id, name, muscles, sets, reps, rpe, rest, tempo,
   cues[], alt {name, cues[]}
   ============================================================ */

const STRENGTH_SESSIONS = {
  // ---------------- WEEK 1 — Foundation ----------------
  w1a: {
    label: "Strength A — Foundation",
    phaseNote: "First session of the block. Focus on technique and controlled reps over heavy weight — you're grooving the movement patterns you'll build on for 8 weeks.",
    warmup: WARMUP_STANDARD,
    cooldown: COOLDOWN_STANDARD,
    exercises: [
      { id: "squat", name: "Goblet Squat", muscles: "Quads, Glutes, Core", sets: 3, reps: "10–12", rpe: "6–7", rest: "90 sec", tempo: "2-1-1 (2s down, 1s pause, 1s up)",
        cues: ["Hold a dumbbell vertically at your chest", "Feet just outside shoulder width, toes slightly out", "Sit down between your heels, chest tall", "Drive through the whole foot to stand"],
        alt: { name: "Leg Press", cues: ["Feet mid-platform, shoulder width", "Lower until knees hit ~90°", "Drive through heels, don't lock knees out hard"] } },
      { id: "rdl", name: "Romanian Deadlift (Dumbbell)", muscles: "Hamstrings, Glutes, Lower Back", sets: 3, reps: "10–12", rpe: "6–7", rest: "90 sec", tempo: "3-0-1 (slow lower)",
        cues: ["Dumbbells in front of thighs, soft knee bend", "Push hips back, keep the bar/weights close to your legs", "Flat back throughout — stop when you feel a hamstring stretch", "Drive hips forward to stand"],
        alt: { name: "Cable Pull-Through", cues: ["Cable between your legs, rope attachment", "Hinge forward, let the weight pull your hips back", "Squeeze glutes to stand tall"] } },
      { id: "bench", name: "Dumbbell Bench Press", muscles: "Chest, Triceps, Front Shoulders", sets: 3, reps: "10–12", rpe: "6–7", rest: "90 sec",
        cues: ["Dumbbells over chest, wrists stacked over elbows", "Lower under control to chest level", "Press up without locking elbows aggressively"],
        alt: { name: "Machine Chest Press", cues: ["Seat height so handles sit at chest level", "Press away without shrugging shoulders up"] } },
      { id: "pulldown", name: "Lat Pulldown", muscles: "Back (Lats), Biceps", sets: 3, reps: "10–12", rpe: "6–7", rest: "75 sec",
        cues: ["Slight lean back, chest up", "Pull the bar to your upper chest, elbows down and back", "Control the weight back up — don't let it yank you"],
        alt: { name: "Assisted Pull-Up", cues: ["Set assistance so the last rep is genuinely hard by rep 10–12", "Pull chin over the bar, control the descent"] } },
      { id: "row_seated", name: "Seated Cable Row", muscles: "Mid-Back, Rear Shoulders, Biceps", sets: 2, reps: "12", rpe: "6–7", rest: "75 sec",
        cues: ["Sit tall, slight forward lean at the start", "Pull to your stomach, squeeze shoulder blades together", "Don't lean back excessively to move the weight"],
        alt: { name: "Chest-Supported Row", cues: ["Chest flat on the pad", "Pull elbows back past your torso, squeeze at the top"] } },
      { id: "plank", name: "Plank", muscles: "Core (Abs, Obliques)", sets: 2, reps: "30–40 sec hold", rpe: "6–7", rest: "45 sec",
        cues: ["Forearms down, elbows under shoulders", "Straight line from head to heels", "Squeeze glutes and brace like you're about to be poked in the stomach"],
        alt: { name: "Dead Bug", cues: ["Lie on back, arms up, knees bent 90°", "Lower opposite arm and leg without your back arching off the floor"] } },
    ],
  },
  w1b: {
    label: "Strength B — Foundation",
    phaseNote: "Same intent as Monday: build the pattern, don't chase fatigue. You should finish feeling like you could've done 2–3 more reps on the last set.",
    warmup: WARMUP_STANDARD,
    cooldown: COOLDOWN_STANDARD,
    exercises: [
      { id: "leg_press_main", name: "Leg Press", muscles: "Quads, Glutes", sets: 3, reps: "10–12", rpe: "6–7", rest: "90 sec",
        cues: ["Feet shoulder width on the platform", "Lower to ~90° at the knee", "Press through the whole foot"],
        alt: { name: "Bulgarian Split Squat", cues: ["Rear foot elevated on a bench", "Lower straight down, front knee tracking over foot", "Push through the front heel to rise"] } },
      { id: "lunge", name: "Walking Lunge", muscles: "Quads, Glutes, Balance", sets: 2, reps: "10 each leg", rpe: "6–7", rest: "75 sec",
        cues: ["Step forward, lower until both knees ~90°", "Front knee stays over the front foot", "Push through the front heel to step into the next lunge"],
        alt: { name: "Step-Up", cues: ["Step onto a bench/box, drive through the lead heel", "Control the step back down"] } },
      { id: "row_single", name: "Single-Arm Dumbbell Row", muscles: "Back (Lats), Biceps", sets: 3, reps: "10–12 each side", rpe: "6–7", rest: "75 sec",
        cues: ["Knee and hand supported on a bench", "Flat back, pull elbow up past your torso", "Control the weight down fully each rep"],
        alt: { name: "Seated Cable Row", cues: ["Sit tall, pull to your stomach", "Squeeze shoulder blades at the top"] } },
      { id: "shoulder_press", name: "Dumbbell Shoulder Press", muscles: "Shoulders, Triceps", sets: 2, reps: "10–12", rpe: "6–7", rest: "75 sec",
        cues: ["Dumbbells at shoulder height to start", "Press straight up without flaring ribs out", "Lower under control to shoulder height"],
        alt: { name: "Machine Shoulder Press", cues: ["Seat height so handles start at shoulder level", "Press up without shrugging"] } },
      { id: "hip_thrust", name: "Hip Thrust", muscles: "Glutes, Hamstrings", sets: 2, reps: "12", rpe: "6–7", rest: "75 sec",
        cues: ["Upper back on a bench, feet flat, knees bent", "Drive hips up until body forms a straight line", "Squeeze glutes hard at the top, don't overextend the lower back"],
        alt: { name: "Glute Bridge", cues: ["Same movement, shoulders on the floor instead of a bench", "Squeeze at the top for a beat"] } },
      { id: "deadbug", name: "Dead Bug", muscles: "Core (Deep Abs)", sets: 2, reps: "10 each side", rpe: "6–7", rest: "45 sec",
        cues: ["Lower back pressed into the floor throughout", "Extend opposite arm and leg slowly", "Return to start with control"],
        alt: { name: "Side Plank", cues: ["Forearm down, hips lifted, straight line knee-to-shoulder", "Hold 20–30 sec each side"] } },
    ],
  },

  // ---------------- WEEK 2 — Taper into Break 1 ----------------
  w2a: {
    label: "Strength A — Building",
    phaseNote: "Small step up from week 1 — same reps, aim for a touch more weight or an extra clean rep if last week felt easy.",
    warmup: WARMUP_STANDARD, cooldown: COOLDOWN_STANDARD,
    exercises: [
      { id: "squat", name: "Goblet Squat", muscles: "Quads, Glutes, Core", sets: 3, reps: "10–12", rpe: "7", rest: "90 sec", tempo: "2-1-1",
        cues: ["Same cues as week 1 — chase a small weight increase if week 1 felt controlled at RPE 6"],
        alt: { name: "Leg Press", cues: ["Feet mid-platform, lower to ~90°, drive through heels"] } },
      { id: "rdl", name: "Romanian Deadlift (Dumbbell)", muscles: "Hamstrings, Glutes, Lower Back", sets: 3, reps: "10–12", rpe: "7", rest: "90 sec",
        cues: ["Push hips back, flat back, stop at a hamstring stretch"],
        alt: { name: "Cable Pull-Through", cues: ["Hinge forward, hips drive you back to standing"] } },
      { id: "bench", name: "Dumbbell Bench Press", muscles: "Chest, Triceps, Front Shoulders", sets: 3, reps: "10–12", rpe: "7", rest: "90 sec",
        cues: ["Controlled lower, press without locking out hard"],
        alt: { name: "Machine Chest Press", cues: ["Press away without shrugging shoulders up"] } },
      { id: "pulldown", name: "Lat Pulldown", muscles: "Back (Lats), Biceps", sets: 3, reps: "10–12", rpe: "7", rest: "75 sec",
        cues: ["Pull to upper chest, elbows down and back"],
        alt: { name: "Assisted Pull-Up", cues: ["Chin over the bar, controlled descent"] } },
      { id: "row_seated", name: "Seated Cable Row", muscles: "Mid-Back, Rear Shoulders, Biceps", sets: 2, reps: "12", rpe: "7", rest: "75 sec",
        cues: ["Pull to your stomach, squeeze shoulder blades"],
        alt: { name: "Chest-Supported Row", cues: ["Pull elbows back past your torso"] } },
      { id: "plank", name: "Plank", muscles: "Core (Abs, Obliques)", sets: 2, reps: "35–45 sec hold", rpe: "7", rest: "45 sec",
        cues: ["Straight line head to heels, brace hard"],
        alt: { name: "Dead Bug", cues: ["Lower opposite arm and leg without arching your back"] } },
    ],
  },
  w2b_light: {
    label: "Strength B — Pre-Break, Light",
    phaseNote: "You're away from Thursday, so keep this deliberately light — the goal is staying fresh for your trip, not squeezing in extra work. Fewer sets, easier effort.",
    warmup: WARMUP_STANDARD, cooldown: COOLDOWN_STANDARD,
    exercises: [
      { id: "leg_press_main", name: "Leg Press", muscles: "Quads, Glutes", sets: 2, reps: "10", rpe: "5–6", rest: "75 sec",
        cues: ["Easy, controlled reps — this is maintenance, not a push"],
        alt: { name: "Bulgarian Split Squat", cues: ["Light and controlled, don't chase failure"] } },
      { id: "row_single", name: "Single-Arm Dumbbell Row", muscles: "Back (Lats), Biceps", sets: 2, reps: "10 each side", rpe: "5–6", rest: "60 sec",
        cues: ["Flat back, controlled pull"],
        alt: { name: "Seated Cable Row", cues: ["Pull to stomach, easy tempo"] } },
      { id: "shoulder_press", name: "Dumbbell Shoulder Press", muscles: "Shoulders, Triceps", sets: 2, reps: "10", rpe: "5–6", rest: "60 sec",
        cues: ["Press straight up, nothing heroic today"],
        alt: { name: "Machine Shoulder Press", cues: ["Light, controlled reps"] } },
      { id: "plank", name: "Plank", muscles: "Core", sets: 2, reps: "30 sec hold", rpe: "5–6", rest: "45 sec",
        cues: ["Easy hold, good form"],
        alt: { name: "Dead Bug", cues: ["Slow and controlled"] } },
    ],
  },

  // ---------------- WEEK 3 — Return from Break 1 ----------------
  w3a_return: {
    label: "Strength A — Return",
    phaseNote: "First session back after your break. Same exercises as before, meaningfully lighter load. The aim is to leave feeling good, not wrecked — normal loading resumes next week.",
    warmup: WARMUP_RETURN, cooldown: COOLDOWN_STANDARD,
    exercises: [
      { id: "squat", name: "Goblet Squat", muscles: "Quads, Glutes, Core", sets: 2, reps: "10", rpe: "6", rest: "90 sec",
        cues: ["Drop the weight back a notch from before your break", "Prioritise smooth, controlled reps"],
        alt: { name: "Leg Press", cues: ["Lighter load, full range of motion"] } },
      { id: "rdl", name: "Romanian Deadlift (Dumbbell)", muscles: "Hamstrings, Glutes, Lower Back", sets: 2, reps: "10", rpe: "6", rest: "90 sec",
        cues: ["Light weight, focus on the hip hinge feel again"],
        alt: { name: "Cable Pull-Through", cues: ["Light load, smooth hinge pattern"] } },
      { id: "bench", name: "Dumbbell Bench Press", muscles: "Chest, Triceps, Front Shoulders", sets: 2, reps: "10", rpe: "6", rest: "90 sec",
        cues: ["Lighter dumbbells, controlled path"],
        alt: { name: "Machine Chest Press", cues: ["Light and controlled"] } },
      { id: "pulldown", name: "Lat Pulldown", muscles: "Back (Lats), Biceps", sets: 2, reps: "10", rpe: "6", rest: "75 sec",
        cues: ["Re-find the mind-muscle connection before adding load next week"],
        alt: { name: "Assisted Pull-Up", cues: ["More assistance than usual is fine today"] } },
      { id: "plank", name: "Plank", muscles: "Core", sets: 2, reps: "30 sec hold", rpe: "6", rest: "45 sec",
        cues: ["Good form over duration"],
        alt: { name: "Dead Bug", cues: ["Slow, controlled reps"] } },
    ],
  },
  w3b_return: {
    label: "Strength B — Return, Ramping Up",
    phaseNote: "A few days back in — bring the volume back toward normal. Still not a max effort session; that resumes properly next week.",
    warmup: WARMUP_RETURN, cooldown: COOLDOWN_STANDARD,
    exercises: [
      { id: "leg_press_main", name: "Leg Press", muscles: "Quads, Glutes", sets: 3, reps: "10", rpe: "6–7", rest: "90 sec",
        cues: ["Back closer to your normal working weight if Wednesday felt fine"],
        alt: { name: "Bulgarian Split Squat", cues: ["Controlled tempo, moderate effort"] } },
      { id: "lunge", name: "Walking Lunge", muscles: "Quads, Glutes, Balance", sets: 2, reps: "8 each leg", rpe: "6–7", rest: "75 sec",
        cues: ["Controlled step, knee tracking over the foot"],
        alt: { name: "Step-Up", cues: ["Drive through the lead heel"] } },
      { id: "row_single", name: "Single-Arm Dumbbell Row", muscles: "Back (Lats), Biceps", sets: 3, reps: "10 each side", rpe: "6–7", rest: "75 sec",
        cues: ["Flat back, full stretch at the bottom"],
        alt: { name: "Seated Cable Row", cues: ["Pull to stomach, squeeze at top"] } },
      { id: "shoulder_press", name: "Dumbbell Shoulder Press", muscles: "Shoulders, Triceps", sets: 2, reps: "10", rpe: "6–7", rest: "75 sec",
        cues: ["Press straight up, controlled descent"],
        alt: { name: "Machine Shoulder Press", cues: ["Moderate effort, good form"] } },
      { id: "hip_thrust", name: "Hip Thrust", muscles: "Glutes, Hamstrings", sets: 2, reps: "12", rpe: "6–7", rest: "75 sec",
        cues: ["Squeeze glutes hard at the top"],
        alt: { name: "Glute Bridge", cues: ["Same cue, floor-based version"] } },
      { id: "deadbug", name: "Dead Bug", muscles: "Core (Deep Abs)", sets: 2, reps: "10 each side", rpe: "6–7", rest: "45 sec",
        cues: ["Lower back stays flat on the floor"],
        alt: { name: "Side Plank", cues: ["20–30 sec each side"] } },
    ],
  },

  // ---------------- WEEK 4 — Build ----------------
  w4a: {
    label: "Strength A — Build",
    phaseNote: "Reps drop slightly, effort goes up — this is where real progressive overload kicks in. Add weight if last week's top set felt like RPE 6 or below.",
    warmup: WARMUP_STANDARD, cooldown: COOLDOWN_STANDARD,
    exercises: [
      { id: "squat", name: "Goblet Squat", muscles: "Quads, Glutes, Core", sets: 3, reps: "8–10", rpe: "7–8", rest: "100 sec",
        cues: ["Heavier than week 1–3, same clean technique", "Last rep of your final set should be genuinely challenging"],
        alt: { name: "Leg Press", cues: ["Add a plate if the previous top set had 2+ reps in reserve"] } },
      { id: "rdl", name: "Romanian Deadlift (Dumbbell)", muscles: "Hamstrings, Glutes, Lower Back", sets: 3, reps: "8–10", rpe: "7–8", rest: "100 sec",
        cues: ["Heavier load, same hinge pattern, don't round your back to get the reps"],
        alt: { name: "Cable Pull-Through", cues: ["Increase the stack if form stayed clean last time"] } },
      { id: "bench", name: "Dumbbell Bench Press", muscles: "Chest, Triceps, Front Shoulders", sets: 3, reps: "8–10", rpe: "7–8", rest: "100 sec",
        cues: ["Step up in weight, control the lower still"],
        alt: { name: "Machine Chest Press", cues: ["Add resistance if last set left 2+ reps in the tank"] } },
      { id: "pulldown", name: "Lat Pulldown", muscles: "Back (Lats), Biceps", sets: 3, reps: "8–10", rpe: "7–8", rest: "90 sec",
        cues: ["Heavier pull, same elbow path"],
        alt: { name: "Assisted Pull-Up", cues: ["Reduce assistance slightly if possible"] } },
      { id: "row_seated", name: "Seated Cable Row", muscles: "Mid-Back, Rear Shoulders, Biceps", sets: 3, reps: "10", rpe: "7–8", rest: "75 sec",
        cues: ["Extra set from week 1–3, squeeze hard at the top"],
        alt: { name: "Chest-Supported Row", cues: ["Same load progression logic"] } },
      { id: "plank", name: "Plank", muscles: "Core", sets: 2, reps: "45–60 sec hold", rpe: "7–8", rest: "45 sec",
        cues: ["Longer hold than earlier weeks"],
        alt: { name: "Dead Bug", cues: ["Add a couple more reps each side"] } },
    ],
  },
  w4b: {
    label: "Strength B — Build",
    phaseNote: "Same idea as Monday — heavier weight, slightly fewer reps, and an extra working set on the big movements.",
    warmup: WARMUP_STANDARD, cooldown: COOLDOWN_STANDARD,
    exercises: [
      { id: "leg_press_main", name: "Leg Press", muscles: "Quads, Glutes", sets: 3, reps: "8–10", rpe: "7–8", rest: "100 sec",
        cues: ["Add weight from week 1–3 if form has been solid"],
        alt: { name: "Bulgarian Split Squat", cues: ["Add a light dumbbell in each hand if bodyweight got easy"] } },
      { id: "lunge", name: "Walking Lunge", muscles: "Quads, Glutes, Balance", sets: 3, reps: "10 each leg", rpe: "7–8", rest: "90 sec",
        cues: ["Extra set, hold light dumbbells if bodyweight is comfortable"],
        alt: { name: "Step-Up", cues: ["Increase step height or add dumbbells"] } },
      { id: "row_single", name: "Single-Arm Dumbbell Row", muscles: "Back (Lats), Biceps", sets: 3, reps: "8–10 each side", rpe: "7–8", rest: "90 sec",
        cues: ["Heavier dumbbell, full stretch and squeeze"],
        alt: { name: "Seated Cable Row", cues: ["Increase the stack a notch"] } },
      { id: "shoulder_press", name: "Dumbbell Shoulder Press", muscles: "Shoulders, Triceps", sets: 3, reps: "8–10", rpe: "7–8", rest: "90 sec",
        cues: ["Extra set from earlier weeks"],
        alt: { name: "Machine Shoulder Press", cues: ["Add resistance if last top set was easy"] } },
      { id: "hip_thrust", name: "Hip Thrust", muscles: "Glutes, Hamstrings", sets: 3, reps: "10", rpe: "7–8", rest: "90 sec",
        cues: ["Heavier load, hard squeeze at lockout"],
        alt: { name: "Glute Bridge", cues: ["Add a dumbbell across your hips"] } },
      { id: "deadbug", name: "Dead Bug", muscles: "Core (Deep Abs)", sets: 2, reps: "12 each side", rpe: "7–8", rest: "45 sec",
        cues: ["More reps than earlier weeks, keep it controlled"],
        alt: { name: "Side Plank", cues: ["30–40 sec each side"] } },
    ],
  },

  // ---------------- WEEK 5 — Peak (before Break 2) ----------------
  w5a: {
    label: "Strength A — Peak",
    phaseNote: "Biggest week of this block before your second trip — a 4th set on your main lift, same solid effort elsewhere. Push it a little, then enjoy the break.",
    warmup: WARMUP_STANDARD, cooldown: COOLDOWN_STANDARD,
    exercises: [
      { id: "squat", name: "Goblet Squat", muscles: "Quads, Glutes, Core", sets: 4, reps: "8–10", rpe: "7–8", rest: "100 sec",
        cues: ["Extra set today — pace yourself across all 4"],
        alt: { name: "Leg Press", cues: ["Same 4-set structure"] } },
      { id: "rdl", name: "Romanian Deadlift (Dumbbell)", muscles: "Hamstrings, Glutes, Lower Back", sets: 3, reps: "8–10", rpe: "7–8", rest: "100 sec",
        cues: ["Consistent with week 4, chase a small load increase"],
        alt: { name: "Cable Pull-Through", cues: ["Same load progression"] } },
      { id: "bench", name: "Dumbbell Bench Press", muscles: "Chest, Triceps, Front Shoulders", sets: 3, reps: "8–10", rpe: "7–8", rest: "100 sec",
        cues: ["Push for a small weight increase if last week felt controlled"],
        alt: { name: "Machine Chest Press", cues: ["Same load progression"] } },
      { id: "pulldown", name: "Lat Pulldown", muscles: "Back (Lats), Biceps", sets: 3, reps: "8–10", rpe: "7–8", rest: "90 sec",
        cues: ["Consistent effort with week 4"],
        alt: { name: "Assisted Pull-Up", cues: ["Reduce assistance further if possible"] } },
      { id: "row_seated", name: "Seated Cable Row", muscles: "Mid-Back, Rear Shoulders, Biceps", sets: 3, reps: "10", rpe: "7–8", rest: "75 sec",
        cues: ["Squeeze hard, same weight or a small bump"],
        alt: { name: "Chest-Supported Row", cues: ["Same effort level"] } },
      { id: "plank", name: "Plank", muscles: "Core", sets: 2, reps: "60 sec hold", rpe: "7–8", rest: "45 sec",
        cues: ["Longest hold of the block so far"],
        alt: { name: "Dead Bug", cues: ["Add reps or a light ankle weight"] } },
    ],
  },
  w5b: {
    label: "Strength B — Peak",
    phaseNote: "Same peak-week structure — an extra set on your main leg movement, solid effort everywhere else, then a well-earned break.",
    warmup: WARMUP_STANDARD, cooldown: COOLDOWN_STANDARD,
    exercises: [
      { id: "leg_press_main", name: "Leg Press", muscles: "Quads, Glutes", sets: 4, reps: "8–10", rpe: "7–8", rest: "100 sec",
        cues: ["Extra set, spread your effort evenly across all 4"],
        alt: { name: "Bulgarian Split Squat", cues: ["Same 4-set structure with dumbbells"] } },
      { id: "lunge", name: "Walking Lunge", muscles: "Quads, Glutes, Balance", sets: 3, reps: "10 each leg", rpe: "7–8", rest: "90 sec",
        cues: ["Consistent with week 4, add load if it felt easy"],
        alt: { name: "Step-Up", cues: ["Same load progression"] } },
      { id: "row_single", name: "Single-Arm Dumbbell Row", muscles: "Back (Lats), Biceps", sets: 3, reps: "8–10 each side", rpe: "7–8", rest: "90 sec",
        cues: ["Push for a small weight increase"],
        alt: { name: "Seated Cable Row", cues: ["Same effort level"] } },
      { id: "shoulder_press", name: "Dumbbell Shoulder Press", muscles: "Shoulders, Triceps", sets: 3, reps: "8–10", rpe: "7–8", rest: "90 sec",
        cues: ["Consistent effort with week 4"],
        alt: { name: "Machine Shoulder Press", cues: ["Same load progression"] } },
      { id: "hip_thrust", name: "Hip Thrust", muscles: "Glutes, Hamstrings", sets: 3, reps: "10", rpe: "7–8", rest: "90 sec",
        cues: ["Hard squeeze, same or slightly heavier load"],
        alt: { name: "Glute Bridge", cues: ["Same effort level"] } },
      { id: "deadbug", name: "Dead Bug", muscles: "Core (Deep Abs)", sets: 2, reps: "12 each side", rpe: "7–8", rest: "45 sec",
        cues: ["Controlled through every rep"],
        alt: { name: "Side Plank", cues: ["30–40 sec each side"] } },
    ],
  },

  // ---------------- WEEK 6 — Pre-Holiday Primer (single day) ----------------
  w6_primer: {
    label: "Full-Body Primer — Pre-Break",
    phaseNote: "Only one session fits before your 10 days away, so this is a light, mobility-forward full-body touch rather than a normal Strength A or B. Keep it easy — you want to travel feeling loose, not sore.",
    warmup: WARMUP_STANDARD, cooldown: COOLDOWN_STANDARD,
    exercises: [
      { id: "squat", name: "Goblet Squat", muscles: "Quads, Glutes, Core", sets: 2, reps: "12", rpe: "5", rest: "60 sec",
        cues: ["Light weight, full smooth range of motion"],
        alt: { name: "Bodyweight Squat", cues: ["No load needed today — just move well"] } },
      { id: "row_single", name: "Single-Arm Dumbbell Row", muscles: "Back (Lats), Biceps", sets: 2, reps: "12 each side", rpe: "5", rest: "60 sec",
        cues: ["Light dumbbell, focus on the squeeze"],
        alt: { name: "Resistance Band Row", cues: ["Anchor a band, row to your ribs"] } },
      { id: "chest_fly_pushup", name: "Push-Up", muscles: "Chest, Triceps, Core", sets: 2, reps: "10", rpe: "5", rest: "60 sec",
        cues: ["From knees if needed — this is about movement quality, not difficulty"],
        alt: { name: "Incline Push-Up", cues: ["Hands on a bench for an easier angle"] } },
      { id: "plank", name: "Plank", muscles: "Core", sets: 2, reps: "30 sec hold", rpe: "5", rest: "45 sec",
        cues: ["Easy, comfortable hold"],
        alt: { name: "Dead Bug", cues: ["Slow and controlled"] } },
    ],
  },

  // ---------------- WEEK 7 — Return from Break 2 (single day) ----------------
  w7_return: {
    label: "Full-Body Return — Post-Break",
    phaseNote: "10 days off is enough that you should treat this like week 3 — same principle, condensed into one session since only 3 days are available this week and none of them are spin days. Technique first, load second. Normal Strength A/B resumes next week.",
    warmup: WARMUP_RETURN, cooldown: COOLDOWN_STANDARD,
    exercises: [
      { id: "squat", name: "Goblet Squat", muscles: "Quads, Glutes, Core", sets: 2, reps: "10", rpe: "6", rest: "90 sec",
        cues: ["Drop the weight back a notch from before your break"],
        alt: { name: "Leg Press", cues: ["Lighter load, full range of motion"] } },
      { id: "rdl", name: "Romanian Deadlift (Dumbbell)", muscles: "Hamstrings, Glutes, Lower Back", sets: 2, reps: "10", rpe: "6", rest: "90 sec",
        cues: ["Light weight, re-groove the hinge"],
        alt: { name: "Cable Pull-Through", cues: ["Light load, smooth pattern"] } },
      { id: "bench", name: "Dumbbell Bench Press", muscles: "Chest, Triceps, Front Shoulders", sets: 2, reps: "10", rpe: "6", rest: "90 sec",
        cues: ["Lighter dumbbells, controlled path"],
        alt: { name: "Machine Chest Press", cues: ["Light and controlled"] } },
      { id: "row_seated", name: "Seated Cable Row", muscles: "Mid-Back, Rear Shoulders, Biceps", sets: 2, reps: "10", rpe: "6", rest: "75 sec",
        cues: ["Re-find the squeeze before adding load next week"],
        alt: { name: "Chest-Supported Row", cues: ["Light effort, good form"] } },
      { id: "plank", name: "Plank", muscles: "Core", sets: 2, reps: "30 sec hold", rpe: "6", rest: "45 sec",
        cues: ["Good form over duration"],
        alt: { name: "Dead Bug", cues: ["Slow, controlled reps"] } },
    ],
  },

  // ---------------- WEEK 8 — Final / Consolidation ----------------
  w8a: {
    label: "Strength A — Final Week",
    phaseNote: "Last week of this block. Same working weight as week 5 to start, but push the final set of your first lift as an AMRAP (as many good reps as possible) — a simple way to see how far you've come since week 1.",
    warmup: WARMUP_STANDARD, cooldown: COOLDOWN_STANDARD,
    exercises: [
      { id: "squat", name: "Goblet Squat", muscles: "Quads, Glutes, Core", sets: 3, reps: "8–10, final set AMRAP", rpe: "8, final set 9", rest: "100 sec",
        cues: ["First 2 sets as normal, then push the 3rd set for extra clean reps", "Log exactly how many reps you get — compare it to week 1"],
        alt: { name: "Leg Press", cues: ["Same AMRAP approach on the final set"] } },
      { id: "rdl", name: "Romanian Deadlift (Dumbbell)", muscles: "Hamstrings, Glutes, Lower Back", sets: 3, reps: "8–10", rpe: "8", rest: "100 sec",
        cues: ["Same weight or a small bump from week 5"],
        alt: { name: "Cable Pull-Through", cues: ["Same effort level"] } },
      { id: "bench", name: "Dumbbell Bench Press", muscles: "Chest, Triceps, Front Shoulders", sets: 3, reps: "8–10", rpe: "8", rest: "100 sec",
        cues: ["Push for a genuine top-end effort on the last set"],
        alt: { name: "Machine Chest Press", cues: ["Same effort level"] } },
      { id: "pulldown", name: "Lat Pulldown", muscles: "Back (Lats), Biceps", sets: 3, reps: "8–10", rpe: "8", rest: "90 sec",
        cues: ["Consistent with week 5, small bump if it felt easy"],
        alt: { name: "Assisted Pull-Up", cues: ["Least assistance you've used yet, if possible"] } },
      { id: "row_seated", name: "Seated Cable Row", muscles: "Mid-Back, Rear Shoulders, Biceps", sets: 3, reps: "10", rpe: "8", rest: "75 sec",
        cues: ["Strong squeeze on every rep"],
        alt: { name: "Chest-Supported Row", cues: ["Same effort level"] } },
      { id: "plank", name: "Plank", muscles: "Core", sets: 2, reps: "60+ sec hold", rpe: "8", rest: "45 sec",
        cues: ["Try to beat your week 5 hold time"],
        alt: { name: "Dead Bug", cues: ["Add reps vs. week 5"] } },
    ],
  },
  w8b: {
    label: "Strength B — Final Week",
    phaseNote: "Same idea as Monday — push the final set of Leg Press as an AMRAP and note the number. That's your marker for the next block.",
    warmup: WARMUP_STANDARD, cooldown: COOLDOWN_STANDARD,
    exercises: [
      { id: "leg_press_main", name: "Leg Press", muscles: "Quads, Glutes", sets: 3, reps: "8–10, final set AMRAP", rpe: "8, final set 9", rest: "100 sec",
        cues: ["First 2 sets normal, 3rd set push for extra clean reps", "Log the number — this is your progress marker"],
        alt: { name: "Bulgarian Split Squat", cues: ["Same AMRAP approach on the final set"] } },
      { id: "lunge", name: "Walking Lunge", muscles: "Quads, Glutes, Balance", sets: 3, reps: "10 each leg", rpe: "8", rest: "90 sec",
        cues: ["Same or slightly heavier than week 5"],
        alt: { name: "Step-Up", cues: ["Same effort level"] } },
      { id: "row_single", name: "Single-Arm Dumbbell Row", muscles: "Back (Lats), Biceps", sets: 3, reps: "8–10 each side", rpe: "8", rest: "90 sec",
        cues: ["Push for a genuine top-end effort"],
        alt: { name: "Seated Cable Row", cues: ["Same effort level"] } },
      { id: "shoulder_press", name: "Dumbbell Shoulder Press", muscles: "Shoulders, Triceps", sets: 3, reps: "8–10", rpe: "8", rest: "90 sec",
        cues: ["Same or slightly heavier than week 5"],
        alt: { name: "Machine Shoulder Press", cues: ["Same effort level"] } },
      { id: "hip_thrust", name: "Hip Thrust", muscles: "Glutes, Hamstrings", sets: 3, reps: "10", rpe: "8", rest: "90 sec",
        cues: ["Hard squeeze at lockout, strongest effort of the block"],
        alt: { name: "Glute Bridge", cues: ["Same effort level"] } },
      { id: "deadbug", name: "Dead Bug", muscles: "Core (Deep Abs)", sets: 2, reps: "12 each side", rpe: "8", rest: "45 sec",
        cues: ["Controlled through every rep, try to beat week 5"],
        alt: { name: "Side Plank", cues: ["Beat your week 5 hold time"] } },
    ],
  },
};

/* ============================================================
   SPIN SESSIONS
   ============================================================ */
const SPIN_SESSIONS = {
  normal: { label: "Spin Class", duration: "45–60 min", guidance: "Moderate–hard resistance, RPE 6–8. If you can't get a spin slot, sub a 40–45 min brisk walk or outdoor cycle at a pace where talking is possible but not easy." },
  easy: { label: "Spin Class (easy)", duration: "40–50 min", guidance: "Easy spin, RPE 5–6 — this is about opening the legs up again, not chasing last month's numbers." },
};

/* ============================================================
   WEEK TEMPLATES
   type: 'strength' | 'spin' | 'walk' | 'optional_cardio' | 'rest'
   ============================================================ */
const WEEK_TEMPLATES = [
  { // Week 1
    phase: "Foundation",
    coachNote: "Programme starts here. Two full-body strength sessions and a spin class — the same 3 sessions that carry the whole block, so nail the technique now.",
    days: {
      Mon: { type: "strength", sessionId: "w1a" },
      Tue: { type: "spin", spinId: "normal" },
      Wed: { type: "rest", note: "Optional 20–30 min easy walk." },
      Thu: { type: "strength", sessionId: "w1b" },
      Fri: { type: "optional_cardio", note: "Optional 20–30 min walk." },
      Sat: { type: "optional_cardio", note: "Optional 30–45 min easy cardio or walk." },
      Sun: { type: "walk", note: "45–75 min relaxed walk — a park, a podcast, whatever makes it enjoyable." },
    },
  },
  { // Week 2 — partial, tapers into Break 1
    phase: "Building → Pre-Break Taper",
    coachNote: "Break 1 starts Thursday, so this week is short. Monday and Tuesday run as normal, then Wednesday is a deliberately light session to stay fresh for your trip rather than a full Strength B.",
    days: {
      Mon: { type: "strength", sessionId: "w2a" },
      Tue: { type: "spin", spinId: "normal" },
      Wed: { type: "strength", sessionId: "w2b_light" },
      Thu: { type: "rest" }, Fri: { type: "rest" }, Sat: { type: "rest" }, Sun: { type: "rest" },
    },
  },
  { // Week 3 — partial, returns from Break 1
    phase: "Return from Break 1",
    coachNote: "Back from your trip on Monday, but easing in — Tuesday's spin is deliberately easy, Wednesday's strength session is lighter, and things ramp back to normal by Saturday.",
    days: {
      Mon: { type: "rest" },
      Tue: { type: "spin", spinId: "easy" },
      Wed: { type: "strength", sessionId: "w3a_return" },
      Thu: { type: "spin", spinId: "normal" },
      Fri: { type: "rest", note: "Optional easy walk." },
      Sat: { type: "strength", sessionId: "w3b_return" },
      Sun: { type: "walk", note: "45–60 min relaxed walk." },
    },
  },
  { // Week 4
    phase: "Build",
    coachNote: "Fully back to normal — this is where the real progressive overload starts. Fewer reps, more weight, an extra set here and there.",
    days: {
      Mon: { type: "strength", sessionId: "w4a" },
      Tue: { type: "spin", spinId: "normal" },
      Wed: { type: "rest", note: "Optional 20–30 min easy walk." },
      Thu: { type: "strength", sessionId: "w4b" },
      Fri: { type: "optional_cardio", note: "Optional 20–30 min walk." },
      Sat: { type: "optional_cardio", note: "Optional 30–45 min easy cardio or walk." },
      Sun: { type: "walk", note: "45–75 min relaxed walk." },
    },
  },
  { // Week 5
    phase: "Peak",
    coachNote: "Biggest week of the block before your second trip — an extra set on the main lifts. Push it a bit, then enjoy the break guilt-free.",
    days: {
      Mon: { type: "strength", sessionId: "w5a" },
      Tue: { type: "spin", spinId: "normal" },
      Wed: { type: "rest", note: "Optional 20–30 min easy walk." },
      Thu: { type: "strength", sessionId: "w5b" },
      Fri: { type: "optional_cardio", note: "Optional 20–30 min walk." },
      Sat: { type: "optional_cardio", note: "Optional 30–45 min easy cardio or walk." },
      Sun: { type: "walk", note: "45–75 min relaxed walk." },
    },
  },
  { // Week 6 — partial, tapers into Break 2 (only Monday available)
    phase: "Pre-Break 2 Primer",
    coachNote: "Break 2 starts Tuesday, so only Monday is trainable this week. One light full-body primer rather than a full session — the rest of the week is your holiday.",
    days: {
      Mon: { type: "strength", sessionId: "w6_primer" },
      Tue: { type: "rest" }, Wed: { type: "rest" }, Thu: { type: "rest" }, Fri: { type: "rest" }, Sat: { type: "rest" }, Sun: { type: "rest" },
    },
  },
  { // Week 7 — partial, returns from Break 2 (only Fri–Sun available)
    phase: "Return from Break 2",
    coachNote: "10 days away, and only Friday–Sunday are trainable this week with no spin day in that window. One condensed, lighter full-body session on Friday, then an optional easy walk — normal training resumes Monday.",
    days: {
      Mon: { type: "rest" }, Tue: { type: "rest" }, Wed: { type: "rest" }, Thu: { type: "rest" },
      Fri: { type: "strength", sessionId: "w7_return" },
      Sat: { type: "optional_cardio", note: "Optional 30–40 min easy walk or bike — no spin class falls in this window." },
      Sun: { type: "walk", note: "45–60 min relaxed walk." },
    },
  },
  { // Week 8
    phase: "Final / Consolidation",
    coachNote: "Final week of this 8-week block. Push the last set of your main lift each session as an AMRAP and compare it to week 1 — that's your real measure of progress.",
    days: {
      Mon: { type: "strength", sessionId: "w8a" },
      Tue: { type: "spin", spinId: "normal" },
      Wed: { type: "rest", note: "Optional 20–30 min easy walk." },
      Thu: { type: "strength", sessionId: "w8b" },
      Fri: { type: "optional_cardio", note: "Optional 20–30 min walk." },
      Sat: { type: "optional_cardio", note: "Optional 30–45 min easy cardio or walk." },
      Sun: { type: "walk", note: "Programme complete — 45–75 min relaxed walk. Check your Progress tab and decide your next block." },
    },
  },
];

/* ============================================================
   DATE / CALENDAR GENERATION
   ============================================================ */

function parseISODate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isWithinHoliday(iso) {
  return HOLIDAYS.find((h) => iso >= h.start && iso <= h.end) || null;
}

/**
 * Builds the full 56-day programme calendar from the static templates.
 * Returns an array of day objects in chronological order.
 */
function buildProgramme() {
  const start = parseISODate(PROGRAMME_START);
  const days = [];

  for (let weekIdx = 0; weekIdx < WEEK_TEMPLATES.length; weekIdx++) {
    const template = WEEK_TEMPLATES[weekIdx];
    const weekNumber = weekIdx + 1;

    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const date = addDays(start, weekIdx * 7 + dayIdx);
      const iso = toISODate(date);
      const dayName = DAY_NAMES[dayIdx];
      const holiday = isWithinHoliday(iso);

      let dayDef = template.days[dayName] || { type: "rest" };

      if (holiday) {
        dayDef = { type: "holiday", note: holiday.label };
      }

      days.push({
        id: iso,
        date: iso,
        weekNumber,
        dayName,
        dayNum: date.getDate(),
        monthShort: date.toLocaleString("en-GB", { month: "short" }),
        phase: template.phase,
        coachNote: template.coachNote,
        ...dayDef,
      });
    }
  }

  return days;
}

const PROGRAMME_DAYS = buildProgramme();

const PROGRAMME_META = {
  title: "8-Week Strength & Spin Programme",
  start: PROGRAMME_START,
  end: PROGRAMME_DAYS[PROGRAMME_DAYS.length - 1].date,
  weeks: 8,
  minimums: "2 strength sessions + 1 spin/cardio session per available week",
  rpeExplainer: "RPE = Rate of Perceived Exertion, out of 10. RPE 7 means you could do about 3 more good reps if you had to. RPE 8 means about 2 more. If your final set feels easier than the target RPE, add a little weight next time.",
};

function getWeekDays(weekNumber) {
  return PROGRAMME_DAYS.filter((d) => d.weekNumber === weekNumber);
}

function getDayByDate(iso) {
  return PROGRAMME_DAYS.find((d) => d.date === iso);
}

function getTodayISO() {
  return toISODate(new Date());
}
